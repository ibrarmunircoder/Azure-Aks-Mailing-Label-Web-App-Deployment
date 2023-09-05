import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { applicationConfig } from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AddressCreateDto } from 'src/addresses/dtos';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XMLParser } = require('fast-xml-parser');

@Injectable()
export class MailingLabelService {
  private http: AxiosInstance;

  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {
    this.http = axios.create({
      baseURL: this.appConfig.usps.mailingLabel,
    });
  }

  private extractTrackingNumber(xml: string) {
    const match = xml.match(/<TrackingNumber>[0-9a-zA-Z]+<\/TrackingNumber>/g);
    return match && match.length > 0
      ? match[0].replace(/(<TrackingNumber>|<\/TrackingNumber>)/g, '')
      : null;
  }

  /**
   *
   * @param xml - The xml document
   * @returns Return the JS Object from XML Document
   * @description Convert XML document to JS Object
   */
  private parseXmlDocument(xml: string) {
    const parser = new XMLParser();
    return parser.parse(xml);
  }

  private parseMailingLabelXmlDocument(xml: string) {
    const parsedXml = this.parseXmlDocument(xml);
    const trackingNumber = this.extractTrackingNumber(xml);
    parsedXml.ExternalReturnLabelResponse.TrackingNumber =
      trackingNumber || parsedXml.ExternalReturnLabelResponse.TrackingNumber;
    return parsedXml;
  }

  private getXmlDocument(variables: AddressCreateDto) {
    let customerName = `${variables.firstName} ${variables.lastName}`;
    if (customerName.length > 32) {
      customerName = customerName.substring(0, 32);
    }
    return `<ExternalReturnLabelRequest>
    <CustomerName>${customerName}</CustomerName>
    <CustomerAddress1>${variables.addressLine1}</CustomerAddress1>
    <CustomerAddress2>${variables.addressLine2}</CustomerAddress2>
    <CustomerCity>${variables.city}</CustomerCity>
    <CustomerState>${variables.state}</CustomerState>
    <CustomerZipCode>${variables.zipcode}</CustomerZipCode>
    <MerchantAccountCode>AA1DCCFACB624A62ACCD1444934E5D02</MerchantAccountCode>
    <MID>902929523</MID>
    <LabelDefinition>4X6</LabelDefinition>
    <ServiceTypeCode>020</ServiceTypeCode>
    <MerchandiseDescription></MerchandiseDescription>
    <InsuranceAmount></InsuranceAmount>
    <AddressOverrideNotification>true</AddressOverrideNotification>
    <PackageInformation></PackageInformation>
    <PackageInformation2></PackageInformation2>
    <CallCenterOrSelfService>Customer</CallCenterOrSelfService>
    <CompanyName>Pact Collective</CompanyName>
    <Attention></Attention>
    <SenderName></SenderName>
    <SenderEmail></SenderEmail>
    <RecipientName></RecipientName>
    <RecipientEmail></RecipientEmail>
    <RecipientBCC></RecipientBCC>
    </ExternalReturnLabelRequest> 
    `;
  }

  public async getMailingLabel(payload: AddressCreateDto) {
    const xmlDocument = this.getXmlDocument(payload);
    const result = await this.http.get('GetLabel', {
      params: {
        externalReturnLabelRequest: xmlDocument,
      },
      headers: {
        'Content-Type': 'text/xml',
      },
    });
    const mailingLabel = this.parseMailingLabelXmlDocument(result.data);

    if ('ExternalReturnLabelErrorResponse' in mailingLabel) {
      throw new BadRequestException(
        mailingLabel?.ExternalReturnLabelErrorResponse?.errors?.ExternalReturnLabelError?.InternalErrorDescription,
      );
    }
    return mailingLabel;
  }

  public async getLabelTrackingDetails(trackingNumber: string) {
    const result = await this.http.get(
      this.appConfig.usps.trackingLabelEndpoint,
      {
        params: {
          API: 'TrackV2',
          XML: `<TrackRequest USERID="${this.appConfig.usps.username}" PASSWORD="${this.appConfig.usps.password}">
            <TrackID ID="${trackingNumber}"></TrackID>
        </TrackRequest>`,
        },
        headers: {
          'Content-Type': 'text/xml',
        },
      },
    );

    const trackingDetail = this.parseXmlDocument(result.data);

    const trackInfo = trackingDetail?.TrackResponse?.TrackInfo;

    if (trackInfo && 'Error' in trackInfo) {
      return {
        status: 'pending',
        deliveryDate: null,
      };
    }

    const trackingSummary = trackInfo?.TrackSummary || '';

    if (trackingSummary && trackingSummary.includes('delivered')) {
      const match = trackingSummary.match(
        /(Jan|Feb|Mar|Apr|May|June|July|Aug|Sept|Sep|Oct|Nov|Dec|[a-zA-Z]{3}|[a-zA-Z]{4}|[a-zA-Z]{5}|[a-zA-Z]{6}|[a-zA-Z]{7}|[a-zA-Z]{8}|[a-zA-Z]{9})\s([0-9]{2}|[0-9]{1}),\s[0-9]{4}/g,
      );
      return {
        status: 'delivered',
        deliveryDate: match && match.length > 0 ? match[0] : null,
      };
    }

    if (
      !trackingSummary.includes('shipper') &&
      !trackingSummary.includes('delivered') &&
      trackInfo &&
      'TrackDetail' in trackInfo
    ) {
      const trackDetailsHistory = Array.isArray(trackInfo.TrackDetail)
        ? trackInfo.TrackDetail
        : [trackInfo.TrackDetail];

      const latestTrackingDetail = trackDetailsHistory[0];

      return {
        status: latestTrackingDetail.includes('Out for Delivery')
          ? 'Out for Delivery'
          : latestTrackingDetail.includes('Arrived at Post Office')
          ? 'Arrived at Post Office'
          : latestTrackingDetail.includes('Arrived at USPS Facility')
          ? 'Arrived at USPS Facility'
          : latestTrackingDetail.includes('Departed')
          ? 'Departed'
          : latestTrackingDetail.includes('In Transit')
          ? 'In Transit'
          : latestTrackingDetail.includes('Pre-Shipment')
          ? 'Pre-Shipment'
          : 'pending',
        deliveryDate: null,
      };
    }

    if (trackingSummary.includes('shipper')) {
      return {
        status: 'pending',
        deliveryDate: null,
      };
    }

    return {
      status: 'pending',
      deliveryDate: null,
    };
  }
}

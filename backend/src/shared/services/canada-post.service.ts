import {
  Inject,
  Injectable,
  BadRequestException,
  StreamableFile,
  HttpException,
} from '@nestjs/common';
import { applicationConfig } from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AddressCreateDto } from 'src/addresses/dtos';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XMLParser } = require('fast-xml-parser');

@Injectable()
export class CanadaPostService {
  private http: AxiosInstance;

  constructor(
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
  ) {
    const cred = Buffer.from(
      `${this.appConfig.canadaPost.username}:${this.appConfig.canadaPost.password}`,
    ).toString('base64');
    this.http = axios.create({
      baseURL: this.appConfig.canadaPost.baseurl,
      headers: {
        Authorization: 'Basic ' + cred,
      },
    });
  }

  /**
   *
   * @param xml - The xml document
   * @returns Return the JS Object from XML Document
   * @description Convert XML document to JS Object
   */
  private parseXmlDocument(xml: string) {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    return parser.parse(xml);
  }

  private getXmlBody(payload: AddressCreateDto) {
    let nameValue = `${payload.firstName} ${payload.lastName}`;
    if (nameValue.length > 44) {
      nameValue = nameValue.substring(0, 44);
    }
    return `<shipment xmlns="http://www.canadapost.ca/ws/shipment-v8">
        <group-id>grp1</group-id>
        <requested-shipping-point>K2B8J6</requested-shipping-point>
        <delivery-spec>
        <service-code>DOM.EP</service-code>
        <sender>
        <name>${nameValue}</name>
        <company>${nameValue}</company>
        <contact-phone>${payload.phone}</contact-phone>
        <address-details>
        <address-line-1>${payload.addressLine1}</address-line-1>
        <city>${payload.city}</city>
        <prov-state>${payload.state}</prov-state>
        <country-code>CA</country-code>
        <postal-zip-code>${payload.zipcode}</postal-zip-code>
        </address-details>
        </sender>
        <destination>
        <name>PACT RECYCLING CANADA</name>
        <company>PACT RECYCLING CANADA</company>
        <address-details>
        <address-line-1>2-8677 WESTON RD</address-line-1>
        <city>WOODBRIDGE</city>
        <prov-state>ON</prov-state>
        <country-code>CA</country-code>
        <postal-zip-code>L4L 9R6</postal-zip-code>
        </address-details>
        </destination>
        <options>
        <option>
        <option-code>DC</option-code>
        </option>
        </options>
        <parcel-characteristics>
        <weight>20</weight>
        <dimensions>
        <length>6</length>
        <width>12</width>
        <height>9</height>
        </dimensions>
        <mailing-tube>false</mailing-tube>
        </parcel-characteristics>
        <notification>
        <email>john.doe@yahoo.com</email>
        <on-shipment>true</on-shipment>
        <on-exception>false</on-exception>
        <on-delivery>true</on-delivery>
        </notification>
        <print-preferences>
        <output-format>8.5x11</output-format>
        </print-preferences>
        <preferences>
        <show-packing-instructions>true</show-packing-instructions>
        <show-postage-rate>false</show-postage-rate>
        <show-insured-value>true</show-insured-value>
        </preferences>
        <settlement-info>
        <contract-id>0043858026</contract-id>
        <intended-method-of-payment>Account</intended-method-of-payment>
        </settlement-info>
        </delivery-spec>
        </shipment> 
    `;
  }

  public async createShipmentLabel(payload: AddressCreateDto) {
    try {
      const body = this.getXmlBody(payload);
      const result = await this.http.post(
        `/rs/${this.appConfig.canadaPost.customerNumber}/${this.appConfig.canadaPost.customerNumber}/shipment`,
        body,
        {
          headers: {
            'Content-Type': 'application/vnd.cpc.shipment-v8+xml',
            Accept: 'application/vnd.cpc.shipment-v8+xml',
          },
        },
      );
      const shipmentLabel = this.parseXmlDocument(result.data);
      const shipmentInfo = shipmentLabel['shipment-info'];
      const links = shipmentInfo.links.link;
      const pdfLink = links.find(
        (link) => link['media-type'] === 'application/pdf',
      );
      const pathname = new URL(pdfLink.href).pathname;
      const pdf = (
        await this.http.get(pathname, {
          responseType: 'arraybuffer',
        })
      ).data;
      delete shipmentInfo['links'];
      return {
        ...shipmentInfo,
        pdf,
      };
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  public async getPackageTrackingDetails(trackingNumber: string) {
    try {
      const response = await this.http.get(
        `vis/track/pin/${trackingNumber}/summary`,
      );
      const trackingParsedResponse = this.parseXmlDocument(response.data);
      if (trackingParsedResponse.messages) {
        const message = trackingParsedResponse.messages.message;
        if (message?.code === 4) {
          return {
            status: 'pending',
            deliveryDate: null,
          };
        }
      }
      const trackingSummary = trackingParsedResponse['tracking-summary'] || {};
      const pinSummary = trackingSummary['pin-summary'] || {};
      if (Object.keys(pinSummary).length) {
        return {
          status: 'delivered',
          deliveryDate: pinSummary['actual-delivery-date']
            ? pinSummary['actual-delivery-date']
            : pinSummary['expected-delivery-date'],
        };
      }

      return {
        status: 'pending',
        deliveryDate: null,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error?.message ?? 'Something went wrong', 500);
    }
  }
}

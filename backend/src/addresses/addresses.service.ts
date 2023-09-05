/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/addresses/entities';
import { Brackets, IsNull, Repository } from 'typeorm';
import {
  AddressCreateDto,
  AddressQueryDto,
  AddressUpdateDto,
  ShopifyShippingAddressDto,
} from 'src/addresses/dtos';
import { MailgunService, MailingLabelService } from 'src/shared/services';
import { APIFeatures } from 'src/shared/utils';
import { applicationConfig } from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { BrandsService } from 'src/brands/brands.service';
import { RecycleDonateEnum } from 'src/addresses/enums';
import * as XLSX from 'xlsx';
import { BrandsEntity } from 'src/brands/entities';
import { plainToClass } from 'class-transformer';
import { CanadaPostService } from 'src/shared/services/canada-post.service';
import {
  carrierData,
  countryTemplates,
  definedEmailTemplateProducts,
} from '../constants';
const dayjs = require('dayjs');

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    private mailingLabelService: MailingLabelService,
    @Inject(applicationConfig.KEY)
    private appConfig: ConfigType<typeof applicationConfig>,
    private mailgunService: MailgunService,
    private brandService: BrandsService,
    private canadaPostService: CanadaPostService,
  ) {}

  private sendEmail(
    data: AddressCreateDto,
    templateName: string,
    attachmentBase64?: string,
    subject?: string,
  ) {
    const { email, firstName, lastName } = data;
    const attachment = [];

    if (attachmentBase64) {
      attachment.push({
        data: Buffer.from(attachmentBase64, 'base64'),
        filename: `${firstName}-${lastName}-shipping-label.pdf`,
      });
    }

    const mailInput = {
      to: [email],
      from: this.appConfig.senderEmail,
      subject: subject || 'Your Shipping Label',
      template: templateName || 'pact',
      cc: this.appConfig.ccEmail ? this.appConfig.ccEmail : '',
      ...(attachment.length ? { attachment } : {}),
    };

    return this.mailgunService.send(mailInput);
  }

  public async create(payload: AddressCreateDto) {
    const { lastName } = payload;
    let brandName = lastName.split('-')[1];
    if (brandName.includes('R') || brandName.includes('D')) {
      brandName = brandName.split(' ')[0];
    }
    const brand = await this.brandService.findByName(brandName);
    if (!brand) {
      throw new NotFoundException(
        `Brand not found with this brand name ${brandName}`,
      );
    }
    const xmlLabel = await this.mailingLabelService.getMailingLabel(payload);
    const base64PDF = xmlLabel.ExternalReturnLabelResponse.ReturnLabel;
    const trackingNumber = xmlLabel.ExternalReturnLabelResponse.TrackingNumber;
    const address = this.addressRepository.create({
      ...payload,
      base64PDF,
      trackingNumber,
      brandId: brand.id,
    });
    const response = await Promise.all([
      this.addressRepository.save(address),
      this.sendEmail(payload, brand.templateName, base64PDF),
    ]);
    await this.addressRepository.update(response[0]?.id, {
      emailId: response[1].id?.replace(/<|>/g, '').trim(),
    });
    return {
      message: 'Please check your email to download your shipping label.',
    };
  }

  public async webhookCreate(payload) {
    const country = payload?.shipping_address?.country ?? '';
    const lineItems = payload?.line_items ?? [];
    let brandName = '';
    let brand = null;
    let isEmailSentDisabled = false;
    let templateName = null;
    for (let i = 0; i < lineItems.length; i++) {
      if (!isEmailSentDisabled) {
        const isItemMatched = this.appConfig.emailDisabledProducts.some(
          (item) => item === lineItems[i].title.toLowerCase(),
        );
        if (isItemMatched) {
          isEmailSentDisabled = true;
        }
      }
      const product = definedEmailTemplateProducts.find(
        (e) =>
          e?.name?.toLowerCase()?.trim() ===
          lineItems[i]?.title?.toLowerCase()?.trim(),
      );
      templateName = product?.templateName;
      templateName = templateName
        ? templateName
        : countryTemplates[country.toLowerCase()];
      if (
        lineItems[i].title.startsWith('Pact') ||
        lineItems[i].title.includes("Pact's Mail-Back Collection Program")
      ) {
        brandName = 'Pact';
      } else {
        brandName = payload.line_items[i].title.split(' x ')[0];
      }
      brand = await this.brandService.findByName(brandName);
      if (!brand && brandName) {
        brand = await this.brandService.create({
          name: brandName,
          hostname: '',
          templateName,
        });
      }
    }
    const shopifyShippingAddress = plainToClass(
      ShopifyShippingAddressDto,
      payload,
      {
        excludeExtraneousValues: true,
      },
    );
    const inputToCreateShippingLabel: AddressCreateDto = {
      ...shopifyShippingAddress,
      lastName: shopifyShippingAddress.lastName + '-' + brandName,
      program: 'Mail Back-Customer Supported',
      carrier: carrierData[country.toLowerCase()],
      recycleDonate: null,
    };
    return this.sendWebhookShippingLabel(
      inputToCreateShippingLabel,
      brand,
      country.toLowerCase(),
      isEmailSentDisabled,
      templateName,
    );
  }

  public async sendWebhookShippingLabel(
    payload: AddressCreateDto,
    brand: BrandsEntity,
    country: string = 'canada',
    isEmailSentDisabled: boolean = false,
    templateName: string = brand.templateName,
  ) {
    let base64PDF, trackingNumber;
    if (country === 'canada') {
      const labelResponse = await this.canadaPostService.createShipmentLabel(
        payload,
      );
      base64PDF = Buffer.from(labelResponse.pdf, 'base64').toString('base64');
      trackingNumber = labelResponse['tracking-pin'];
    }
    if (country === 'united states') {
      const xmlLabel = await this.mailingLabelService.getMailingLabel(payload);
      base64PDF = xmlLabel.ExternalReturnLabelResponse.ReturnLabel;
      trackingNumber = xmlLabel.ExternalReturnLabelResponse.TrackingNumber;
    }
    const address = this.addressRepository.create({
      ...payload,
      base64PDF: base64PDF || '',
      trackingNumber: trackingNumber || '',
      brandId: brand.id,
    });
    const response = await Promise.all([
      this.addressRepository.save(address),
      isEmailSentDisabled
        ? null
        : this.sendEmail(
            payload,
            templateName,
            base64PDF,
            "Thank you from Pact's mailback collection program",
          ),
    ]);

    await this.addressRepository.update(response[0]?.id, {
      emailId: response[1] ? response[1].id.replace(/<|>/g, '').trim() : null,
    });
    return null;
  }

  public async update(id: number, payload: Partial<AddressUpdateDto>) {
    const addressEntity = await this.addressRepository.preload({
      id,
      ...payload,
    });

    if (!addressEntity) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return this.addressRepository.save(addressEntity);
  }

  public async getAll(query: AddressQueryDto) {
    const searchableFields = [
      'firstName',
      'lastName',
      'city',
      'zipcode',
      'state',
      'addressLine1',
      'addressLine2',
      'trackingNumber',
      'emailStatus',
      'status',
      'program',
      'carrier',
      'brand.name',
    ];

    if (!query.search) {
      const apiFeatures = new APIFeatures<AddressEntity, AddressQueryDto>(
        this.addressRepository,
        query,
      )
        .paginate()
        .sort()
        .filter()
        .search(searchableFields);

      return apiFeatures.findAllAndCount({
        relations: ['brand'],
      });
    }
    return this.search(query, searchableFields);
  }

  public async search(query: AddressQueryDto, searchableFields: string[]) {
    const queryBuilder = this.addressRepository.createQueryBuilder('address');

    if (query.filter?.brandId) {
      queryBuilder.where('address.brandId IN (:...ids)', {
        ids: query.filter?.brandId?.valueIn || [],
      });
    }

    if (query.filter?.program) {
      queryBuilder.where('address.program = :program', {
        program: query.filter?.program?.equalTo || '',
      });
    }

    if (query.search && searchableFields?.length) {
      const searchTerm = query.search.trim();
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const field of searchableFields) {
            if (field === 'brand.name') {
              qb.orWhere(`${field} ILIKE :value `, {
                value: `%${searchTerm}%`,
              });
            } else {
              qb.orWhere(`address.${field} ILIKE :value `, {
                value: `%${searchTerm}%`,
              });
            }
          }
          if (
            [RecycleDonateEnum.donate].includes(searchTerm as RecycleDonateEnum)
          ) {
            qb.orWhere('address.recycleDonate IN (:...attentions)', {
              attentions: [RecycleDonateEnum.donate],
            });
          }
          if (
            [RecycleDonateEnum.recycle].includes(
              searchTerm as RecycleDonateEnum,
            )
          ) {
            qb.orWhere('address.recycleDonate IN (:...attentions)', {
              attentions: [RecycleDonateEnum.recycle],
            });
          }
        }),
      );
    }

    return queryBuilder
      .leftJoinAndSelect('address.brand', 'brand')
      .getManyAndCount();
  }

  public findById(id: number) {
    return this.addressRepository.findOne({
      where: { id },
    });
  }

  public async deleteById(id: number): Promise<number> {
    const addressEntity = await this.findById(id);

    if (!addressEntity) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    const addressEntityId = addressEntity.id;
    await this.addressRepository.remove(addressEntity);

    return addressEntityId;
  }

  public async updateAddressDeliveryDetails() {
    const addresses = await this.addressRepository.find({
      where: [
        {
          status: 'pending',
        },
        {
          status: IsNull(),
        },
      ],
    });
    if (addresses.length) {
      const addressTrackingDetailsPromises = addresses.map(async (address) => {
        let trackingDetail;
        if (address.carrier.toLowerCase() === 'canada post') {
          trackingDetail =
            await this.canadaPostService.getPackageTrackingDetails(
              address.trackingNumber,
            );
        } else {
          trackingDetail =
            await this.mailingLabelService.getLabelTrackingDetails(
              address.trackingNumber,
            );
        }

        return {
          ...trackingDetail,
          addressId: address.id,
        };
      });

      const addressTrackingDetails = await Promise.all(
        addressTrackingDetailsPromises,
      );

      if (addressTrackingDetails.length) {
        const updatedAddressesPromises = addressTrackingDetails.map(
          (trackingDetail) => {
            const date = trackingDetail.deliveryDate
              ? dayjs(trackingDetail.deliveryDate, 'MMM DD, YYYY').format(
                  'YYYY-MM-DD',
                )
              : trackingDetail.deliveryDate;
            return this.addressRepository.preload({
              id: trackingDetail.addressId,
              status: trackingDetail.status,
              deliveryDate: date || null,
            });
          },
        );
        const updatedAddresses = await Promise.all(updatedAddressesPromises);
        await Promise.all(
          updatedAddresses.map(async (address) =>
            this.addressRepository.save(address),
          ),
        );
      }
    }
  }

  public async importLabels(file: Express.Multer.File) {
    const customHeaders = [
      'createdAt',
      'name',
      'carrier',
      'member',
      'program',
      'email',
      'emailStatus',
      'brand',
      'recycleDonate',
      'trackingNumber',
      'status',
      'deliveryDate',
      'addressLine1',
      'addressLine2',
      'city',
      'zipcode',
      'state',
    ];

    const workbook = XLSX.read(file.buffer, {
      type: 'array',
    });

    const orderSheet = workbook.Sheets['Admin Panel Order to add'];

    const rows: any[] = XLSX.utils.sheet_to_json(orderSheet, {
      raw: false,
      defval: null,
      header: customHeaders,
      range: 2,
    });

    for (let row of rows) {
      let brand = await this.brandService.findByName(row.brand.trim());
      if (!brand) {
        brand = await this.brandService.create({
          name: row.brand.trim(),
          hostname: '',
          templateName: 'pact',
        });
      }
      const address = this.addressRepository.create({
        createdAt: new Date(row.createdAt),
        email: row.email,
        emailStatus: row.emailStatus,
        lastName: row.name?.split(' ')[1] || '',
        firstName: row.name?.split(' ')[0] || '',
        program: row.program,
        carrier: row.carrier,
        deliveryDate: row.deliveryDate,
        base64PDF: '',
        trackingNumber: row.trackingNumber,
        state: row.state,
        city: row.city,
        addressLine1: row.addressLine1,
        addressLine2: row.addressLine2,
        zipcode: row.zipcode,
        status: row.status,
        recycleDonate: row.recycleDonate,
        brandId: brand.id,
      });
      this.addressRepository.save(address);
    }

    return null;
  }
  public async importShopifyLabels(file: Express.Multer.File) {
    const customHeaders = [
      'createdAt',
      'firstName',
      'carrier',
      'program',
      'email',
      'emailStatus',
      'brand',
      'recycleDonate',
      'trackingNumber',
      'status',
      'deliveryDate',
      'addressLine1',
      'addressLine2',
      'city',
      'zipcode',
      'state',
    ];

    const workbook = XLSX.read(file.buffer, {
      type: 'array',
    });

    const mailbackSheet = workbook.Sheets['Sheet 1 - shipmentHistory_2023-'];

    const rows: any[] = XLSX.utils.sheet_to_json(mailbackSheet, {
      raw: false,
      defval: null,
      header: customHeaders,
      range: 2,
    });

    const addresses = [];

    for (let row of rows) {
      const brandName = row.brand.split(' x ')[0].trim();
      let brand = await this.brandService.findByName(brandName);
      if (!brand) {
        brand = await this.brandService.create({
          name: brandName,
          hostname: '',
          templateName: 'pact',
        });
      }

      const address = this.addressRepository.create({
        createdAt: new Date(row.createdAt),
        email: row.email || '',
        lastName: '',
        firstName: row.firstName,
        program: row.program,
        carrier: row.carrier,
        base64PDF: '',
        trackingNumber: row.trackingNumber,
        state: row.state,
        city: row.city,
        addressLine1: row.addressLine1,
        addressLine2: row.addressLine2,
        zipcode: row.zipcode,
        status: row.status,
        recycleDonate: row.recycleDonate,
        brandId: brand.id,
      });
      const record = await this.addressRepository.save(address);
      addresses.push(record);
    }

    return addresses;
  }

  public async deleteByBrandId(brandId: number) {
    const addresses = await this.addressRepository.find({
      where: {
        brandId,
      },
    });

    if (addresses?.length) {
      const promises = addresses.map((address) =>
        this.addressRepository.remove(address),
      );
      await Promise.all(promises);
      return 'Deleted all records';
    }

    return 'Not addresses found';
  }

  public async createCanadaShipmentLabel(payload: AddressCreateDto) {
    const { lastName } = payload;
    let brandName = lastName.split('-')[1];
    if (brandName.includes('R') || brandName.includes('D')) {
      brandName = brandName.split(' ')[0];
    }
    const brand = await this.brandService.findByName(brandName);
    if (!brand) {
      throw new NotFoundException(
        `Brand not found with this brand name ${brandName}`,
      );
    }
    const labelResponse = await this.canadaPostService.createShipmentLabel(
      payload,
    );
    const base64PDF = Buffer.from(labelResponse.pdf, 'base64').toString(
      'base64',
    );
    const address = this.addressRepository.create({
      ...payload,
      base64PDF,
      trackingNumber: labelResponse['tracking-pin'],
      brandId: brand.id,
    });
    const response = await Promise.all([
      this.addressRepository.save(address),
      this.sendEmail(payload, brand.templateName, base64PDF),
    ]);
    await this.addressRepository.update(response[0]?.id, {
      emailId: response[1].id?.replace(/<|>/g, '').trim(),
    });
    return {
      message: 'Please check your email to download your shipping label.',
    };
  }
}

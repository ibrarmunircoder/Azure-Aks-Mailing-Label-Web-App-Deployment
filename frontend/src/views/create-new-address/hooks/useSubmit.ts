import { useState } from 'react';
import { FormikHelpers } from 'formik';
import { ADDRESS_CREATE_ENDPOINT } from 'shared/constants';
import { useToast } from 'shared/hooks';
import { AxiosClient } from 'shared/services';
import { transformError, updateLastName } from 'shared/utils';
import { ICreateAddressInitalValue } from 'views/create-new-address/interfaces';
const Buffer = require('buffer/').Buffer;

const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

const initialValues: ICreateAddressInitalValue = {
  firstName: '',
  lastName: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  city: '',
  zipcode: '',
};

interface IUseSubmit {
  initialValues: ICreateAddressInitalValue;
  onSubmit: (
    values: ICreateAddressInitalValue,
    actions: FormikHelpers<ICreateAddressInitalValue>
  ) => Promise<void>;
  isShippingLabelSent: boolean;
}

export const useSubmit = (): IUseSubmit => {
  const toast = useToast();
  const [isShippingLabelSent, setIsShippingLabelSent] = useState(false);

  const onSubmit = async (
    values: ICreateAddressInitalValue,
    actions: FormikHelpers<ICreateAddressInitalValue>
  ) => {
    try {
      const lastName = updateLastName(values.firstName, values.lastName);
      const base64encodedData = Buffer.from(`${password}`).toString('base64');
      const result = await AxiosClient.post<{ message: string }>(
        ADDRESS_CREATE_ENDPOINT,
        {
          ...values,
          lastName,
        },
        {
          headers: {
            Authorization: `Basic ${base64encodedData}`,
          },
        }
      );
      if (result.status === 201) {
        setIsShippingLabelSent(true);
        actions.resetForm({
          values: initialValues,
        });
      }
    } catch (err) {
      actions.setSubmitting(false);
      toast.error(transformError(err).message);
    }
  };

  return {
    initialValues,
    onSubmit,
    isShippingLabelSent,
  };
};

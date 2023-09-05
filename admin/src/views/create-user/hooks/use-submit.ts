import { UserRoleEnum } from "enums";
import { FormikHelpers } from "formik";
import { transformError } from "helpers";
import { useAxios, useToast } from "hooks";
import { Brand } from "interfaces";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface InitialValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  assignedBrands: number[];
  role: UserRoleEnum;
  active: boolean;
}

const initialValues: InitialValues = {
  firstName: "",
  lastName: "",
  assignedBrands: [],
  password: "",
  email: "",
  role: UserRoleEnum.ADMIN,
  active: true,
};

export const useSubmit = () => {
  const AxiosClient = useAxios();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await AxiosClient.get("brands");
      const brands = data[0];
      setBrands(brands);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [AxiosClient]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const onSubmit = async (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>
  ) => {
    try {
      await AxiosClient.post("user", values);
      toast.success("User is created successfully!");
      setTimeout(() => {
        navigate("/users");
      }, 800);
    } catch (e) {
      actions.setSubmitting(false);
      toast.error(transformError(e).message);
    }
  };

  return {
    isLoading,
    brands,
    initialValues,
    onSubmit,
  };
};

import { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { User, UserBrandsAssigned } from "interfaces";
import { useCallback, useMemo } from "react";
import { useEffect, useState } from "react";
import { Switch as SwitchToggle } from "components";
import { useAxios, useToast } from "hooks";
import { transformError } from "helpers";
import { useAuthContext } from "context";
import { OrderEnum, UserRoleEnum } from "enums";
import { UsersQuery } from "../interfaces";

interface IPageInfo {
  rows: User[];
  rowCount: number;
}

export const useUsersPagination = () => {
  const { getUser } = useAuthContext();
  const AxiosClient = useAxios();
  const toast = useToast();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [pageInfo, setPageInfo] = useState<IPageInfo>({
    rows: [],
    rowCount: 0,
  });

  const fetchUsers = useCallback(
    async (query: UsersQuery) => {
      try {
        const result = await AxiosClient.get<[User[], number]>("user", {
          params: query,
        });
        setPageInfo({
          rows: result.data[0],
          rowCount: result.data[1],
        });
      } catch (err) {
        console.error(err);
      }
    },
    [AxiosClient]
  );

  useEffect(() => {
    fetchUsers({
      // @ts-expect-error
      ...(paginationModel.pageSize === "ALL"
        ? {}
        : {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize,
            order: { order: OrderEnum.DESC, sort: "createdAt" },
          }),
    });
  }, [paginationModel, fetchUsers]);

  const onSortChange = useCallback(
    async (sortModel: GridSortModel) => {
      if (sortModel.length === 0) return;
      const fieldItem = sortModel[0];
      await fetchUsers({
        // @ts-expect-error
        ...(paginationModel.pageSize === "ALL"
          ? {}
          : {
              limit: paginationModel.pageSize,
              offset: paginationModel.page * paginationModel.pageSize,
            }),
        order: {
          order: fieldItem.sort === "asc" ? OrderEnum.ASC : OrderEnum.DESC,
          sort: fieldItem.field,
        },
      });
    },
    [fetchUsers, paginationModel]
  );

  const switchUserStatus = useCallback(
    (userId: number, active: boolean) => async () => {
      try {
        const { rows } = pageInfo;
        const result = await AxiosClient.patch(`user/active`, {
          id: userId,
          active: !active,
        });
        setPageInfo((prev) => ({
          ...prev,
          rows: rows.map((user) => {
            if (user.id === result.data?.id) {
              return {
                ...user,
                active: result.data.active,
              };
            }
            return user;
          }),
        }));
      } catch (error) {
        toast.error(transformError(error).message);
      }
    },
    [AxiosClient, pageInfo, toast]
  );
  const columns: GridColDef[] = useMemo(() => {
    const user = getUser();
    return [
      {
        headerName: "First Name",
        field: "firstName",
        disableColumnMenu: true,
        flex: 1,
        filterable: false,
      },
      {
        headerName: "Last Name",
        field: "lastName",
        disableColumnMenu: true,
        flex: 1,
        filterable: false,
      },
      {
        headerName: "Email",
        field: "email",
        disableColumnMenu: true,
        flex: 1,
        filterable: false,
      },
      {
        headerName: "View",
        field: "userBrandsAssignment",
        disableColumnMenu: true,
        flex: 1,
        filterable: false,
        sortable: false,
        renderCell: (param) => {
          if (
            param.row?.role === UserRoleEnum.SUPER_ADMIN ||
            param.row?.role === UserRoleEnum.ADMIN
          )
            return "All brands";
          const userBrandsAssigned = param.row?.userBrandsAssigned || [];
          return userBrandsAssigned
            .map((obj: UserBrandsAssigned) => obj.brand?.name)
            .join(",");
        },
      },
      {
        headerName: "Role",
        field: "role",
        disableColumnMenu: true,
        flex: 1,
        sortable: false,
        filterable: false,
      },
      {
        headerName: "Status",
        field: "isActive",
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        filterable: false,
        renderCell: (params) => {
          return (
            <SwitchToggle
              disabled={params.row?.id === user?.id}
              checked={params.row?.active}
              onClick={switchUserStatus(params.row?.id, params.row?.active)}
            />
          );
        },
      },
    ];
  }, [switchUserStatus, getUser]);

  return {
    columns,
    ...pageInfo,
    paginationModel,
    setPaginationModel,
    onSortChange,
  };
};

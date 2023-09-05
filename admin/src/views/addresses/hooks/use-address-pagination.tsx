import { Address, Brand, Sort } from 'interfaces';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  GridColDef,
  GridSortModel,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useAxios, useDebouncedCallback, useToast } from 'hooks';
import { downloadExcel, getSortOrder, transformError } from 'helpers';
import { AddressFilter, AddressQuery } from 'views/addresses/interfaces';
import { OrderEnum, UserRoleEnum } from 'enums';
import { SelectChangeEvent } from '@mui/material/Select';
import { changeAddressFieldsName } from '../utils';
import { useAuthContext } from 'context';
import qs from 'qs';
const dayjs = require('dayjs');

interface IPageInfo {
  rows: Address[];
  rowCount: number;
}

interface TableStateInterface {
  filter?: AddressFilter;
  order?: Sort;
  search?: string;
}

export const useAddressPagination = () => {
  const toast = useToast();
  const { getUser } = useAuthContext();
  const AxiosClient = useAxios();
  const [selectedBrands, setSelectedBrands] = useState<any[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [pageInfo, setPageInfo] = useState<IPageInfo>({
    rows: [],
    rowCount: 0,
  });
  const [tableState, setTableState] = useState<TableStateInterface>({
    filter: {},
    order: {
      order: OrderEnum.DESC,
      sort: 'createdAt',
    },
    search: '',
  });
  const debounced = useDebouncedCallback((value: string) => {
    setTableState((prev) => ({
      ...prev,
      search: value,
    }));
  }, 400);

  const [selectedRowData, setSelectedRowData] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const [selectedTrackId, setSelectedTrackId] = useState('');

  const [sort, setSort] = useState('');
  const [state, setState] = useState('');
  const [programType, setProgramType] = useState('');
  const [dateRange, setDateRange] = useState<Array<Date | null>>([null, null]);
  const selectAllBrandOptionRef = useRef(false);
  const [startDate, endDate] = dateRange;

  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await AxiosClient.get('brands');
      const brands = data[0];
      setBrands(brands);
      setSelectedBrands(brands.map((brand: Brand) => brand.id));
    } catch (error) {
      toast.error(transformError(error).message);
    } finally {
      setIsLoading(false);
    }
  }, [AxiosClient, toast]);

  const fetchAddresses = useCallback(
    async (query: AddressQuery) => {
      try {
        setIsLoading(true);
        const result = await AxiosClient.get<[Address[], number]>('addresses', {
          params: query,
          paramsSerializer: {
            serialize: (params) => {
              return qs.stringify(params, {
                encode: false,
                arrayFormat: 'repeat',
              });
            },
          },
        });
        setPageInfo({
          rows: result.data[0],
          rowCount: result.data[1],
        });
      } catch (err) {
        toast.dismiss();
        toast.error(transformError(err).message);
      } finally {
        setIsLoading(false);
      }
    },
    [toast, AxiosClient]
  );

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    fetchAddresses({
      // @ts-expect-error
      ...(paginationModel.pageSize === 'ALL'
        ? {}
        : {
            limit: paginationModel.pageSize,
            offset: paginationModel.page * paginationModel.pageSize,
          }),
      ...tableState,
    });
  }, [fetchAddresses, paginationModel, toast, tableState]);

  const columns: GridColDef[] = useMemo(() => {
    const allColumns = [
      {
        headerName: 'Date Generated',
        field: 'createdAt',
        disableColumnMenu: true,
        width: 145,
        filterable: false,
        renderCell(params) {
          return dayjs(params.row.createdAt).format('MMM DD, YYYY');
        },
      },
      {
        headerName: 'Name',
        field: 'firstName',
        disableColumnMenu: true,
        width: 150,
        filterable: false,
        renderCell(params) {
          return `${params.row.firstName} ${params.row.lastName.split('-')[0]}`;
        },
      },
      {
        headerName: 'Carrier',
        field: 'carrier',
        disableColumnMenu: true,
        width: 220,
        filterable: false,
      },
      {
        headerName: 'Member',
        field: 'brand',
        disableColumnMenu: true,
        width: 130,
        filterable: false,
        renderCell(params) {
          return `${params?.row?.brand?.name}`;
        },
      },
      {
        headerName: 'Email',
        field: 'email',
        disableColumnMenu: true,
        width: 220,
        filterable: false,
      },
      {
        headerName: 'Email Status',
        field: 'emailStatus',
        disableColumnMenu: true,
        width: 130,
        filterable: false,
        renderCell(params) {
          return params.row?.emailStatus ?? 'delivered';
        },
      },

      {
        headerName: 'Attention',
        field: 'attention',
        disableColumnMenu: true,
        width: 130,
        filterable: false,
        renderCell(params) {
          return params?.row?.recycleDonate ?? '-';
        },
      },
      {
        field: 'trackingNumber',
        headerName: 'Tracking #',
        sortable: false,
        disableColumnMenu: true,
        width: 200,
        filterable: false,
      },
      {
        field: 'status',
        headerName: 'Delivery Status',
        sortable: true,
        disableColumnMenu: true,
        width: 150,
        filterable: false,
        renderCell: (params) => {
          return params.row.status || 'pending';
        },
      },
      {
        field: 'deliveryDate',
        headerName: 'Date Of Delivery',
        sortable: true,
        disableColumnMenu: true,
        width: 160,
        filterable: false,
        renderCell: (params) => {
          return params.row.deliveryDate || '-';
        },
      },
      {
        headerName: 'Address Line 1',
        disableColumnMenu: true,
        field: 'addressLine1',
        width: 200,
        filterable: false,
        sortable: false,
      },
      {
        headerName: 'Address Line 2',
        disableColumnMenu: true,
        field: 'addressLine2',
        width: 180,
        filterable: false,
        sortable: false,
      },
      {
        headerName: 'City',
        disableColumnMenu: true,
        field: 'city',
        width: 80,
        filterable: false,
        sortable: false,
      },
      {
        headerName: 'ZIP',
        disableColumnMenu: true,
        field: 'zipcode',
        width: 80,
        filterable: false,
        sortable: false,
      },
      {
        headerName: 'State',
        disableColumnMenu: true,
        field: 'state',
        width: 80,
        filterable: false,
        sortable: false,
      },
    ];
    const user = getUser();
    if (
      user &&
      [UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN].includes(user.role)
    ) {
      allColumns.splice(4, 0, {
        headerName: 'Program Type',
        field: 'program',
        disableColumnMenu: true,
        width: 220,
        filterable: false,
      });
    }

    return allColumns;
  }, [getUser]);

  const handleClose = () => setIsOpen(false);

  const handleSearchTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event.stopPropagation();
      debounced(event.target.value);
    },
    [debounced]
  );

  const onSortChange = useCallback(
    async (sortModel: GridSortModel) => {
      if (sortModel.length === 0) return;
      const fieldItem = sortModel[0];
      await fetchAddresses({
        // @ts-expect-error
        ...(paginationModel.pageSize === 'ALL'
          ? {}
          : {
              limit: paginationModel.pageSize,
              offset: paginationModel.page * paginationModel.pageSize,
            }),
        order: {
          order: fieldItem.sort === 'asc' ? OrderEnum.ASC : OrderEnum.DESC,
          sort: fieldItem.field,
        },
      });
    },
    [fetchAddresses, paginationModel]
  );

  const onRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = pageInfo.rows.filter((row) =>
      selectedIDs.has(row.id)
    );
    setSelectedRowData(selectedRowData);
  };

  const handleBulkDownload = (event: React.FormEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (selectedRowData.length) {
      setIsLoading(true);
      const transformData = selectedRowData.map((row) =>
        changeAddressFieldsName(row)
      );
      downloadExcel(transformData, `addresses.xlsx`);
      setIsLoading(false);
    }
  };

  const handleBrandSelections = (
    event: SelectChangeEvent<typeof selectedBrands>
  ) => {
    const {
      target: { value },
    } = event;
    let brandIds = value as any[];
    if (value.includes('select-all')) {
      brandIds = brands.map((brand) => brand.id);
      selectAllBrandOptionRef.current = true;
    }
    if (!value.includes('select-all') && selectAllBrandOptionRef.current) {
      brandIds = [];
      selectAllBrandOptionRef.current = false;
    }
    setSelectedBrands(brandIds);
    setTableState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        brandId: { valueIn: brandIds },
      },
    }));
  };

  const formatDate = (value: Date) => {
    return dayjs(value)
      .set('hour', 23)
      .set('minute', 0)
      .set('second', 0)
      .format('YYYY-MM-DD HH:mm:ss');
  };

  const handleDateChange = (dateRange: Array<Date | null>) => {
    const [startDate, endDate] = dateRange;
    if (startDate && endDate) {
      setTableState((prev) => ({
        ...prev,
        filter: {
          ...prev.filter,
          createdAt: {
            between: {
              from: formatDate(startDate),
              to: formatDate(endDate),
            },
          },
        },
      }));
    }
    if (!startDate && !endDate) {
      setTableState((prev) => ({
        ...prev,
        filter: {
          ...prev.filter,
          createdAt: undefined,
        },
      }));
    }
    setDateRange(dateRange);
  };

  const handleSortChange = async (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    const value = event.target.value as string;
    const [sort, order] = value.split('-');
    setSort(value);
    setTableState((prev) => ({
      ...prev,
      order: {
        sort,
        order: getSortOrder(order),
      },
    }));
  };
  const handleStateChange = async (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    const stateCode = event.target.value as string;
    setState(stateCode);
    setTableState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        state: stateCode ? { equalTo: stateCode } : undefined,
      },
    }));
  };
  const handleProgramTypeChange = async (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    const program = event.target.value as string;
    setProgramType(program);
    setTableState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        program: program ? { equalTo: program } : undefined,
      },
    }));
  };

  return {
    isLoading,
    setPaginationModel,
    paginationModel,
    ...pageInfo,
    columns,
    handleStateChange,
    handleProgramTypeChange,
    state,
    programType,
    onSortChange,
    handleSearchTerm,
    onRowSelectionModelChange,
    handleBulkDownload,
    handleSortChange,
    sort,
    handleBrandSelections,
    selectedBrands,
    handleDateChange,
    startDate,
    endDate,
    brands,
    isOpen,
    handleClose,
    selectAllBrandOption: selectAllBrandOptionRef.current,
    // selectedTrackId,
  };
};

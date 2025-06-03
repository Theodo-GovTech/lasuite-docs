import { APIError, errorCauses, gristFetchApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

export type UseGristTableDataArguments = {
  documentId: string;
  tableId: string;
};

const getTableData = async (documentId: string, tableId: string) => {
  const url = `docs/${documentId}/tables/${tableId}/data`;
  const response = await gristFetchApi(url);
  if (!response.ok) {
    throw new APIError(
      'Failed to fetch Grist table data',
      await errorCauses(response),
    );
  }
  return (await response.json()) as Promise<
    Record<string, (string | number | boolean)[]>
  >;
};

export const useGristTableData = ({
  documentId,
  tableId,
}: UseGristTableDataArguments) => {
  const { data: tableData, isLoading } = useQuery({
    queryKey: ['getTableData', documentId, tableId],
    queryFn: () => getTableData(documentId, tableId),
  });

  return {
    tableData,
    isLoading,
  };
};

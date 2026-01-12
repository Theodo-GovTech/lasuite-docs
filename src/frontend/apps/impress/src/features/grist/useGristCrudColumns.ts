import { gristFetchApi } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export enum ColumnType {
  TEXT = 'Text',
  NUMBER = 'Numeric',
  BOOLEAN = 'Bool',
}

type ColumnInput = {
  type: ColumnType;
  label: string;
};

const _createColumns = async ({
  documentId,
  tableId,
  columns,
}: {
  documentId: string;
  tableId: string;
  columns: { id: string; fields: ColumnInput }[];
}) => {
  const url = `docs/${documentId}/tables/${tableId}/columns`;
  const response = await gristFetchApi(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ columns }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to create columns: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  return (await response.json()) as Promise<{ records: { id: string }[] }>;
};

export const useGristCrudColumns = () => {
  const queryClient = useQueryClient();
  const { mutate: createColumns } = useMutation({
    mutationFn: _createColumns,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getTableData', variables.documentId, variables.tableId],
      });
    },
  });

  const deleteColumns = async (
    documentId: string,
    tableId: string,
    columnId: string,
  ) => {
    const url = `docs/${documentId}/tables/${tableId}/columns/${columnId}`;
    try {
      const response = await gristFetchApi(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to delete column: ${response.status} ${response.statusText} - ${errorBody}`,
        );
      }
    } catch (error) {
      console.error('Error deleting Grist column:', error);
      throw error;
    }
  };

  return { createColumns, deleteColumns };
};

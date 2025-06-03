import { APIError, errorCauses, gristFetchApi } from '@/api';
import { TableDescription } from './useListGristTables';

export enum ColumnType {
  TEXT = 'Text',
  NUMBER = 'Numeric',
  BOOLEAN = 'Bool',
}

export const useGristCrudColumns = () => {
  const createTable = async (
    name: string,
  ): Promise<{
    documentId: string;
    tableId: string;
  }> => {
    const DEFAULT_WORKSPACE_ID = 2;
    const docUrl = `workspaces/${DEFAULT_WORKSPACE_ID}/docs`;
    try {
      const docResponse = await gristFetchApi(docUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      if (!docResponse.ok) {
        throw new APIError(
          'Failed to fetch Grist tables',
          await errorCauses(docResponse),
        );
      }
  
      const documentId = (await docResponse.json()) as string;
  
      const tableUrl = `docs/${documentId}/tables`;
      const tableResponse = await gristFetchApi(tableUrl);
      if (!tableResponse.ok) {
        throw new APIError(
          'Failed to fetch Grist tables',
          await errorCauses(tableResponse),
        );
      }
  
      const tableDescription = (await tableResponse.json()) as TableDescription;
  
      if (tableDescription.tables.length === 0) {
        throw new Error('No tables found in the created document');
      }
  
      if (tableDescription.tables.length > 1) {
        throw new Error(
          'More than one table has been found in the created document, this should not happen.',
        );
      }
  
      return {
        documentId,
        tableId: tableDescription.tables[0].id,
      };
    } catch (error) {
      console.error('Error creating Grist table:', error);
      throw error;
    }
  }
  
    const updateTable = async (
      {documentId, tableId}: {
      documentId: string;
      tableId: string;
    }
    ): Promise<void> => {
      const table = { id: tableId, fields: [] };
       const tableUrl = `docs/${documentId}/tables`;
      try {
        const response = await gristFetchApi(tableUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tables: [table] }),
        });

        if (!response.ok) {
          throw new APIError(
            'Failed to update Grist table',
            await errorCauses(response),
          );
        }
     

      } catch (error) {
        console.error('Error updating Grist table:', error);
        throw error;
      }
    };
  

  return { createTable };
};

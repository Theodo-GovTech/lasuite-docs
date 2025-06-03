import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { ChartOptionsForm } from './ChartOptionsForm';
import { ChartTypeSelector } from './ChartTypeSelector';
import { LiveChartPreview } from './LiveChartPreview';
import { ChartConfig, ChartData, ChartOptions, ChartType } from './types';
import { useGristTableData } from '@/features/grist';

import { Utils } from './utils';
import { DropButton, Icon } from '@/components';

const initialData: ChartData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      id: 'dataset-1',
      label: 'Sales',
      data: [65, 59, 80, 81, 56],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgba(53, 162, 235, 1)',
    },
  ],
};

const ChartEditorContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartEditorHeader = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 2rem;
`;

export interface ChartEditorProps {
  documentId: string;
  tableId: string;
  chartType: ChartType;
  chartOptions: ChartOptions;
  onChartConfigChange: (config: {
    chartType: ChartType;
    chartOptions: ChartOptions;
  }) => void;
}

export const ChartEditor: React.FC<ChartEditorProps> = ({
  documentId,
  tableId,
  chartType: initialChartType,
  chartOptions: initialChartOptions,
  onChartConfigChange,
}) => {
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [rawDatasets, setRawDatasets] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartData>(initialData);
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    ...initialChartOptions,
  });

  // Récupération des données Grist
  const { tableData } = useGristTableData({
    documentId,
    tableId,
  });

  // Transformation des données Grist en datasets bruts
  useEffect(() => {
    console.log('Table data:', tableData);
    const transformTableDataToChartData = (tableData: Record<string, any>) => {
      const datasets = [];

      for (const key in tableData) {
        if (key === 'id' || key === 'manualSort') continue;

        const color = Utils.namedColor(1);
        datasets.push({
          id: key,
          label: key,
          data: tableData[key],
          borderColor: color,
          backgroundColor: Utils.transparentize(color, 0.5),
        });
      }

      return datasets;
    };

    const pulledDatasets = transformTableDataToChartData(tableData);
    setRawDatasets(pulledDatasets);

    // Set initial chart options if not already set
    if (pulledDatasets.length > 0 && !chartOptions.xAxisKey) {
      // setConfig((prev) => ({
      //   ...prev,
      //   labels: pulledDatasets[0] || [],
      //   yAxisKeys: pulledDatasets.slice(1).map((d) => d.id) || [],
      // });
    }
  }, [tableData]);

  const [config, setConfig] = useState<ChartConfig>({
    type: chartType,
    data: chartData,
    options: chartOptions,
  });

  // Update config when dependencies change
  useEffect(() => {
    // console.log('Updating chart config:');
    setConfig({
      type: chartType,
      data: chartData,
      options: chartOptions,
    });
    onChartConfigChange({ chartType, chartOptions });
  }, [chartType, chartData, chartOptions, onChartConfigChange]);

  return (
    <ChartEditorContainer>
      <ChartEditorHeader>
        <DropButton button={<Icon iconName="settings"></Icon>}>
          <ChartTypeSelector value={chartType} onChange={setChartType} />
          <ChartOptionsForm
            rawDatasets={rawDatasets}
            data={chartData}
            options={chartOptions}
            onChange={setChartOptions}
            updateDisplayedData={(newData: ChartData) => {
              setChartData(newData);
            }}
          />
        </DropButton>
      </ChartEditorHeader>

      <LiveChartPreview config={config} />
    </ChartEditorContainer>
  );
};

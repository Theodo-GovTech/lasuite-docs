import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { ChartOptionsForm } from './ChartOptionsForm';
import { ChartTypeSelector } from './ChartTypeSelector';
import { LiveChartPreview } from './LiveChartPreview';
import { ChartConfig, ChartData, ChartOptions, ChartType } from './types';
import { useGristTableData } from '@/features/grist';

import { Utils } from './utils';

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

const initialOptions: ChartOptions = {
  title: 'My Chart',
  showLegend: true,
  xAxisLabel: 'Months',
  yAxisLabel: 'Values',
  xAxisKey: '',
  yAxisKeys: [],
};

const ChartEditorContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const ChartEditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ChartEditorTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ChartEditorSubtitle = styled.p`
  color: #4b5563;
`;

const ChartEditorGrid = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'showEditor',
})<{ showEditor: boolean }>`
  display: grid;
  grid-template-columns: ${({ showEditor }: { showEditor: boolean }) =>
    showEditor ? '2fr 1fr' : '1fr'};
  gap: 2rem;
  transition: grid-template-columns 0.3s ease-in-out;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ToggleButton = styled.button`
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  &:hover {
    color: #111827;
  }
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
    ...initialOptions,
    ...initialChartOptions,
  });
  const [showEditor, setShowEditor] = useState(true);

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
      setChartOptions((prev) => ({
        ...prev,
        xAxisKey: pulledDatasets[0]?.id || '',
        yAxisKeys: pulledDatasets.slice(1).map((d) => d.id) || [],
      }));
    }
  }, [tableData]);

  // Transform raw datasets based on chart options
  useEffect(() => {
    if (rawDatasets.length === 0) return;

    const xAxisDataset = rawDatasets.find(
      (d) => d.id === chartOptions.xAxisKey,
    );
    const yAxisDatasets = rawDatasets.filter((d) =>
      chartOptions.yAxisKeys.includes(d.id),
    );

    if (xAxisDataset && yAxisDatasets.length > 0) {
      setChartData({
        labels: xAxisDataset.data,
        datasets: yAxisDatasets,
      });
    } else {
      // Fallback to original data structure
      setChartData({
        labels: rawDatasets[0]?.data || [],
        datasets: rawDatasets,
      });
    }
  }, [rawDatasets, chartOptions.xAxisKey, chartOptions.yAxisKeys]);

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
        <div>
          <ChartEditorTitle>Chart Editor</ChartEditorTitle>
          <ChartEditorSubtitle>
            Create and customize your charts with live preview
          </ChartEditorSubtitle>
        </div>
        <ToggleButton onClick={() => setShowEditor((prev) => !prev)}>
          &#x2026;
        </ToggleButton>
      </ChartEditorHeader>

      <ChartEditorGrid showEditor={showEditor}>
        <PreviewContainer>
          <LiveChartPreview config={config} />
        </PreviewContainer>

        {showEditor && (
          <ControlPanel>
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
          </ControlPanel>
        )}
      </ChartEditorGrid>
    </ChartEditorContainer>
  );
};

import React, { useEffect } from 'react';
import styled from 'styled-components';

import { ChartData, ChartOptions } from './types';
import { CollapsibleCard } from './CollapsibleCard';
import { Input, Checkbox, Select } from '@openfun/cunningham-react';
import { update } from 'lodash';

interface ChartOptionsFormProps {
  data: ChartData;
  options: ChartOptions;
  rawDatasets: ChartData['datasets'];
  onChange: (options: ChartOptions) => void;
  updateDisplayedData: (newData: ChartData) => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChartOptionsForm: React.FC<ChartOptionsFormProps> = ({
  rawDatasets,
  data,
  options,
  onChange,
  updateDisplayedData,
}) => {
  const updateOption = (
    key: keyof ChartOptions,
    value: string | boolean | string[],
  ) => {
    onChange({ ...options, [key]: value });
  };

  function updateY(values: string[]) {
    const filteredDatasets = rawDatasets.filter((ds) => values.includes(ds.id));
    console.log('Filtered datasets:', filteredDatasets);
    updateDisplayedData({ ...data, datasets: filteredDatasets });
  }

  const dataSetOptions =
    rawDatasets.map((dataset, index) => ({
      value: dataset.id,
      label: dataset.label || `Dataset ${index + 1}`,
    })) || [];

  const handleXAxisChange = (e) => {
    const selected = e.target.value;
    console.log('Selected X Axis:', selected);
    updateOption('xAxisKey', selected);
    updateDisplayedData({
      ...data,
      labels: rawDatasets.find((ds) => ds.id === selected)?.data || [],
    });
  };

  const handleYAxisChange = (event) => {
    const selected = event.target.value;

    updateOption('yAxisKeys', selected);
    updateY(selected);
  };

  const handleLegendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateOption('showLegend', event.target.checked);
  };

  return (
    <CollapsibleCard title="Chart Options" defaultOpen={true}>
      <FormContainer>
        <Input
          label="Chart Title"
          type="text"
          value={options.title || ''}
          onChange={(e) => updateOption('title', e.target.value)}
        />

        <Checkbox
          label="Show Legend"
          checked={options.showLegend || false}
          onChange={handleLegendChange}
        />

        <Input
          label="X-Axis Label"
          type="text"
          value={options.xAxisLabel || ''}
          onChange={(e) => updateOption('xAxisLabel', e.target.value)}
        />

        <Select
          label="X Axis Data"
          value={options.xAxisKey || ''}
          options={dataSetOptions}
          onChange={handleXAxisChange}
          clearable
        />

        <Input
          type="text"
          label="Y-Axis Label"
          value={options.yAxisLabel || ''}
          onChange={(e) => updateOption('yAxisLabel', e.target.value)}
        />

        <Select
          label="Y Axis Data"
          options={dataSetOptions}
          value={options.yAxisKeys || []}
          onChange={handleYAxisChange}
          multi
          clearable
        />
      </FormContainer>
    </CollapsibleCard>
  );
};

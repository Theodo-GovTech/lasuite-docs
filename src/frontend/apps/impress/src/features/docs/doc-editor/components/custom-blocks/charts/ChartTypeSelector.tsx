import React from 'react';

import { ChartType } from './types';
import { CollapsibleCard } from './CollapsibleCard';
import { Select } from '@openfun/cunningham-react';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
  ];

  return (
    <CollapsibleCard title="Chart Type" defaultOpen={true}>
      <Select
        label="Select Chart Type"
        options={chartTypes}
        clearable={false}
        value={value}
        onChange={(e) => onChange(e.target.value as ChartType)}
      />
    </CollapsibleCard>
  );
};

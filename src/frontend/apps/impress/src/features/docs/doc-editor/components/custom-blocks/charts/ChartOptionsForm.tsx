import React from 'react';
import styled from 'styled-components';

import { ChartOptions } from './types';
import { CollapsibleCard } from './CollapsibleCard';
import { Input, Checkbox } from '@openfun/cunningham-react';

interface ChartOptionsFormProps {
  options: ChartOptions;
  onChange: (options: ChartOptions) => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChartOptionsForm: React.FC<ChartOptionsFormProps> = ({
  options,
  onChange,
}) => {
  const updateOption = (key: keyof ChartOptions, value: string | boolean) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <CollapsibleCard title="Chart Options" defaultOpen={true}>
      <FormContainer>
        <div>
          <Input
            label="Chart Title"
            type="text"
            value={options.title}
            onChange={(e) => updateOption('title', e.target.value)}
            placeholder="Enter chart title"
          />
        </div>
        <div>
          <Checkbox
            type="checkbox"
            label="Show Legend"
            // onChange={(e) => updateOption('showLegend', e.target.checked)}
          />
        </div>
        <div>
          <Input
            label="X-Axis Label"
            type="text"
            value={options.xAxisLabel}
            onChange={(e) => updateOption('xAxisLabel', e.target.value)}
            placeholder="Enter X-axis label"
          />
        </div>
        <div>
          <Input
            type="text"
            label="Y-Axis Label"
            value={options.yAxisLabel}
            onChange={(e) => updateOption('yAxisLabel', e.target.value)}
            placeholder="Enter Y-axis label"
          />
        </div>
      </FormContainer>
    </CollapsibleCard>
  );
};

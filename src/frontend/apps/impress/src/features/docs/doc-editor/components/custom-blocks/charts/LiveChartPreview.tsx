import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import styled from 'styled-components';

import { ChartConfig } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface LiveChartPreviewProps {
  config: ChartConfig;
}

const PreviewContainer = styled.div`
  background: #fff;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;

const PreviewChartWrapper = styled.div`
  height: 24rem;
`;

export const LiveChartPreview: React.FC<LiveChartPreviewProps> = ({
  config,
}) => {
  const { type, data, options } = config;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: options.showLegend,
        position: 'top' as const,
        onClick: (e, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          const meta = ci.getDatasetMeta(index);
          meta.hidden =
            meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          ci.update();
        },
      },
      title: {
        display: !!options.title,
        text: options.title,
      },
    },
    scales:
      type !== 'pie'
        ? {
            x: {
              display: true,
              title: {
                display: !!options.xAxisLabel,
                text: options.xAxisLabel,
              },
            },
            y: {
              display: true,
              title: {
                display: !!options.yAxisLabel,
                text: options.yAxisLabel,
              },
            },
          }
        : undefined,
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      default:
        return <div>Invalid chart type</div>;
    }
  };

  return (
    <PreviewContainer>
      <PreviewChartWrapper>{renderChart()}</PreviewChartWrapper>
    </PreviewContainer>
  );
};

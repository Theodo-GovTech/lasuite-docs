export interface ChartData {
  labels: string[] | number[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  id: string;
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  hidden?: boolean;
}

export interface ChartOptions {
  title?: string;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xAxisKey?: string;
  yAxisKeys?: string[];
}

export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
}

export type ChartType = 'bar' | 'line' | 'pie';

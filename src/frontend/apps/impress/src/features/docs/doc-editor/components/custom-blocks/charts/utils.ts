const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba',
];

export function color(index) {
  return COLORS[index % COLORS.length];
}

export function transparentize(color: string, opacity = 0.5): string {
  let r: number, g: number, b: number;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;

    r = parseInt(fullHex.slice(0, 2), 16);
    g = parseInt(fullHex.slice(2, 4), 16);
    b = parseInt(fullHex.slice(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (!values || values.length < 3) throw new Error('Invalid RGB color');
    r = parseInt(values[0]);
    g = parseInt(values[1]);
    b = parseInt(values[2]);
  } else {
    throw new Error('Unsupported color format');
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const CHART_COLORS = {
  red: '#FF6384',
  orange: '#FF9F40',
  yellow: '#FFCD56',
  green: '#4BC0C0',
  blue: '#36A2EB',
  purple: '#9966FF',
  grey: '#C9CBCF',
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];

export function namedColor(index) {
  return NAMED_COLORS[index % NAMED_COLORS.length];
}

export const Utils = {
  transparentize,
  color,
  namedColor,
};

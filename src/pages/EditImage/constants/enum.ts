export enum OperateType {
  DRAG = 'D',
  RECT = 'R',
  CIRCLE = 'C',
  ARROW = 'A',
  PENCIL = 'P',
  MOSAIC = 'M',
  TEXT = 'T',
}

export enum OperateSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const OperateSizeText: Record<OperateSize, string> = {
  [OperateSize.SMALL]: '小号',
  [OperateSize.MEDIUM]: '中号',
  [OperateSize.LARGE]: '大号',
}

export enum OperateColor {
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  GRAY = 'gray',
  WHITE = 'white',
  RED = 'red',
}

export const mosaicSizeMap: Record<OperateSize, number> = {
  [OperateSize.SMALL]: 6,
  [OperateSize.MEDIUM]: 12,
  [OperateSize.LARGE]: 24,
}

export const arrowSizeMap: Record<OperateSize, number[]> = {
  [OperateSize.SMALL]: [30,5,10],
  [OperateSize.MEDIUM]: [40,7,14],
  [OperateSize.LARGE]: [50,9,18],
}

export const sizeMap: Record<OperateSize, number> = {
  [OperateSize.SMALL]: 2,
  [OperateSize.MEDIUM]: 4,
  [OperateSize.LARGE]: 6,
}

export const fontSizeMap: Record<OperateSize, number> = {
  [OperateSize.SMALL]: 12,
  [OperateSize.MEDIUM]: 18,
  [OperateSize.LARGE]: 24,
}

export const colorMap: Record<OperateColor, string> = {
  [OperateColor.BLUE]: '#0000ff',
  [OperateColor.GREEN]: '#00ff00',
  [OperateColor.YELLOW]: '#ffff00',
  [OperateColor.GRAY]: '#808080',
  [OperateColor.WHITE]: '#ffffff',
  [OperateColor.RED]: '#ff0000',
}

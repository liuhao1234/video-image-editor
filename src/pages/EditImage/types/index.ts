import { Point, Graphics, Text } from 'pixi.js';
import type { FederatedPointerEvent } from 'pixi.js';
import RectGraphics from '../classes/RectGraphics';
import EllipseGraphics from '../classes/EllipseGraphics';
import ArrowGraphics from '../classes/ArrowGraphics';
import PencilGraphics from '../classes/PencilGraphics';
import MosaicGraphics from '../classes/MosaicGraphics';
import TextGraphics from '../classes/TextGraphics';
import { OperateSize, OperateColor, OperateType } from '../constants/enum';

export interface ImageDataType {
  id: number;
  src: string;
}

export type PositionType = {
  x: number;
  y: number;
}
export type GraphicsElementType = RectGraphics | EllipseGraphics | ArrowGraphics | PencilGraphics;
export type ElementType = GraphicsElementType | TextGraphics | MosaicGraphics;
export type EditableElementType = GraphicsElementType | TextGraphics;
export type MoveEventTargetType = Graphics | Text;
export type EventCallbackType = (e: FederatedPointerEvent) => void;

export type SizeColorType = { size: OperateSize, color: OperateColor };

export type RectAnnotationType = {
  type: OperateType;
  sizeColor: SizeColorType;
  position: PositionType;
  width: number;
  height: number;
  x: number; // 矩形左上角坐标x
  y: number; // 矩形左上角坐标y
}

export type CircleAnnotationType = {
  type: OperateType;
  sizeColor: SizeColorType;
  position: PositionType;
  radiusX: number;
  radiusY: number;
  x: number; // 圆心坐标x
  y: number; // 圆心坐标y
}

export type ArrowAnnotationType = {
  type: OperateType;
  sizeColor: SizeColorType;
  startPoint: PositionType;
  endPoint: PositionType;
}

export type PencilAnnotationType = {
  type: OperateType;
  position: PositionType;
  sizeColor: SizeColorType;
  path: Point[];
}

export type TextAnnotationType = {
  type: OperateType;
  sizeColor: SizeColorType;
  position: PositionType;
  text: string;
}


export type AnnotationType = RectAnnotationType | CircleAnnotationType | ArrowAnnotationType | PencilAnnotationType | TextAnnotationType
export type doType = 'undo' | 'redo';
export type historyOperateType = 'add' | 'delete' | 'update' | 'move';
export type HistoryItemType = {
  type: historyOperateType;
  item: ElementType;
  newPosition?: PositionType;
  oldPosition?: PositionType;
  oldText?: string; // 修改之前的文本内容
  newText?: string; // 新的文本内容
}
// 事件类型
export type EditorEventType = 'change'
// 事件回调函数类型
export type HistoryChangeFuncType = (params: emitChangeParamsType) => void;
// 事件列表类型
export type EditorEventFuncType = HistoryChangeFuncType
// 事件列表类型
export type EditorEventListType = {[key in EditorEventType]: EditorEventFuncType[]}
// change事件参数类型
export type emitChangeParamsType = {
  canUndo: boolean;
  canRedo: boolean;
}

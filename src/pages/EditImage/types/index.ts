import { Point } from 'pixi.js';
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
// 图形标注类型
export type GraphicsElementType = RectGraphics | EllipseGraphics | ArrowGraphics | PencilGraphics;
// 所有标注的类型
export type ElementType = GraphicsElementType | TextGraphics | MosaicGraphics;
// 可编辑的标注类型
export type EditableElementType = GraphicsElementType | TextGraphics;
// 元素pointer事件回调函数类型
export type EventCallbackType = (e: FederatedPointerEvent) => void;
// 标注的边框颜色和大小类型
export type SizeColorType = { size: OperateSize, color: OperateColor };
/**
 * 以下是保存标注是各标注保存的类型
 */
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

/**
 * 以下是历史记录相关操作类型
 * undo: 撤销操作
 * redo: 重做操作
 */
export type doType = 'undo' | 'redo';
export type historyOperateType = 'add' | 'delete' | 'update' | 'move' | 'resize' | 'sizeColor';
export type HistoryItemType = {
  type: historyOperateType;
  item: ElementType;
  newPosition?: PositionType;
  oldPosition?: PositionType;
  oldSizeColor?: SizeColorType; // 修改之前的边框颜色和大小
  newSizeColor?: SizeColorType; // 新的边框颜色和大小
  oldText?: string; // 修改之前的文本内容
  newText?: string; // 新的文本内容
  newPoints?: Point[]; // 新的路径点 [startPoint, endPoint]
  oldPoints?: Point[]; // 旧的路径点 [startPoint, endPoint]
}
/**
 * 以下是注册自定义事件相关类型
 */
// 事件类型
export type EditorEventType = 'historyChange' | 'selectedChange'
// 历史事件回调函数类型
export type HistoryChangeFuncType = (params: EmitChangeParamsType) => void;
// 选中事件回调函数类型
export type SelectedChangeFuncType = (item: EditableElementType | null) => void;
// 事件联合类型
export type EditorEventFuncType = HistoryChangeFuncType | SelectedChangeFuncType
// 事件map类型
export type EditorEventListType = {[key in EditorEventType]: EditorEventFuncType[]}
// change事件参数类型
export type EmitChangeParamsType = {
  canUndo: boolean;
  canRedo: boolean;
}

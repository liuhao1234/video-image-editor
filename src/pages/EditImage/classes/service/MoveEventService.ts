import { Point, Container } from 'pixi.js';
import EditorApp from '../EditorApp';
import type { FederatedPointerEvent } from 'pixi.js';
import type { EditableElementType, EventCallbackType } from '../../types/index';

class MoveEventService {
  private stage: Container;
  private element!: EditableElementType;
  private isDragging: boolean = false;
  private moveStartPoint: Point | null = null; // 移动开始时的点
  private startPosition: Point = new Point(0, 0); // 移动开始时的位置
  private endPosition: Point = new Point(0, 0); // 移动结束时的位置
  private pointerDownCallback: EventCallbackType | undefined;
  private pointerMoveCallback: ((endPosition: Point) => void) | undefined;
  private pointerUpCallback: EventCallbackType | undefined;
  private onDraggingEnd: ((startPosition: Point, endPosition: Point) => void) | undefined;
  private handleMovePointerMoveFunc: (e: FederatedPointerEvent) => void;
  private handleMovePointerUpFunc: (e: FederatedPointerEvent) => void;
  constructor(
    params: {
      editor: EditorApp,
      pointerDownCallback?: EventCallbackType, 
      pointerMoveCallback?: ((endPosition: Point) => void) | undefined, 
      pointerUpCallback?: EventCallbackType
      onDraggingEnd?: (startPosition: Point, endPosition: Point) => void
    }
  ) {
    this.stage = params.editor.app.stage;
    this.pointerDownCallback = params.pointerDownCallback;
    this.pointerMoveCallback = params.pointerMoveCallback;
    this.pointerUpCallback = params.pointerUpCallback;
    this.onDraggingEnd = params.onDraggingEnd;
    this.handleMovePointerMoveFunc = this.movePointerMove.bind(this);
    this.handleMovePointerUpFunc = this.movePointerUp.bind(this);
  }

  public setElement(element: EditableElementType){
    this.element = element;
    this.element.getTarget().cursor = 'move';
  }
  
  private movePointerDown(e: FederatedPointerEvent){
    e.stopPropagation();
    this.isDragging = true;
    this.moveStartPoint = new Point(e.global.x, e.global.y);
    const elementPosition = this.element.getPosition();
    this.startPosition = new Point(elementPosition.x, elementPosition.y);
    this.endPosition = new Point(elementPosition.x, elementPosition.y);
    this.pointerDownCallback?.(e);
  }
  private movePointerMove(e: FederatedPointerEvent){
    e.stopPropagation();
    if(!this.isDragging) return;
    if(!this.moveStartPoint) return;
    const {x, y} = e.global;
    const {x: positionX, y: positionY} = this.startPosition;
    const offsetX = x - this.moveStartPoint.x;
    const offsetY = y - this.moveStartPoint.y;
    this.endPosition = new Point(positionX + offsetX, positionY + offsetY);
    this.element.setPosition(this.endPosition.x, this.endPosition.y);
    this.pointerMoveCallback?.(this.endPosition);
  }
  private movePointerUp(e: FederatedPointerEvent){
    e.stopPropagation();
    this.isDragging = false
    this.moveStartPoint = null;
    this.pointerUpCallback?.(e);
    if(!this.startPosition.equals(this.endPosition)){
      this.onDraggingEnd?.(this.startPosition, this.endPosition);
    }
    // 移除移动事件
    this.stage.off('pointermove', this.handleMovePointerMoveFunc);
    this.stage.off('pointerup', this.handleMovePointerUpFunc);
    this.stage.off('pointerupoutside', this.handleMovePointerUpFunc);
  }
  public bindMoveEvent(){
    // 移动事件
    this.element.getTarget().on('pointerdown', (e: FederatedPointerEvent) => {
      e.stopPropagation();
      // this.editor.selectElement(this.element);
      this.movePointerDown(e);
      this.stage.on('pointermove', this.handleMovePointerMoveFunc);
      this.stage.on('pointerup', this.handleMovePointerUpFunc);
      this.stage.on('pointerupoutside', this.handleMovePointerUpFunc);
    });
  }
}

export default MoveEventService
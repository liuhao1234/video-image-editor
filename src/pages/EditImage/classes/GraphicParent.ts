import { Graphics, Point } from 'pixi.js';
import type { PositionType, GraphicsElementType } from '../types/index';
import type EditorApp from './EditorApp';
import MoveEventService from './service/MoveEventService';
import HandlerService from './service/HandlerService';
import {v4 as uuidv4} from 'uuid';
abstract class GraphicParent {
  public id: string;
  public editor: EditorApp;
  public graphic: Graphics;
  public startPosition: PositionType = {x: 0, y: 0};
  public endPosition: PositionType = {x: 0, y: 0};
  public isDragging: boolean = false;
  public handlerService: HandlerService;
  public moveEventService: MoveEventService;

  constructor(editor: EditorApp) {
    this.editor = editor;
    this.id = uuidv4();
    this.graphic = new Graphics({
      label: this.id,
      eventMode: 'static',
    })
    this.handlerService = new HandlerService(this.editor);
    this.handlerService.setId(this.id);
    this.moveEventService = new MoveEventService({
      editor,
      pointerDownCallback: () => {
        this.editor.selectElement(this.getThis());
      },
      pointerMoveCallback: (endPosition: Point) => {
        this.handlerService.setHandlerPosition(endPosition);
      },
      onDraggingEnd: (startPosition: Point, endPosition: Point) => {
        this.editor.historyService.onDo({
          type: 'move',
          item: this.getThis(),
          oldPosition: startPosition,
          newPosition: endPosition,
        })
      }
    });
    this.bindEvent();
  }

  abstract drawHandler(): void;

  visibleHandler(visible: boolean) {
    this.handlerService.visibleHandler(visible);
  }

  removeHandler(){
    this.handlerService.removeHandler();
  }

  abstract setPosition(x: number, y: number): void;

  abstract getPosition(): Point;

  abstract getTarget(): Graphics;

  abstract getThis(): GraphicsElementType;

  bindEvent(){
    this.graphic.on('click', () => {
      this.editor.selectElement(this.getThis());
    })
  }
}
export default GraphicParent;
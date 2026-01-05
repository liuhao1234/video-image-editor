import { OperateType } from '../../constants/enum';
import type { GraphicsElementType } from '../../types/index';
import { Container, Graphics, Point } from 'pixi.js';
import { FederatedPointerEvent } from 'pixi.js';
import EditorApp from '../EditorApp';
import TextGraphics from '../TextGraphics';
class HandlerService {
  private id: string;
  private editor: EditorApp;
  private isDragging: boolean = false;
  private handlerContainer: Container | null = null;
  private element: GraphicsElementType | null = null;
  private currentStartPoint: Point | null = null;
  private currentEndPoint: Point | null = null;
  private currentHandle: { name: string } | null = null;
  private handlePointerMoveCallback : (e: FederatedPointerEvent) => void;
  private handlerPointUpCallback : (e: FederatedPointerEvent) => void;
  constructor(editor: EditorApp) {
    this.id = 'handler';
    this.editor = editor;
    this.handlePointerMoveCallback = this.handlerPointMove.bind(this);
    this.handlerPointUpCallback = this.handlerPointUp.bind(this);
  }

  setId(id: string){
    this.id = `handler-${id}`;
  }

  setElement(element: GraphicsElementType){
    this.element = element;
  }

  setPosition(x: number, y: number){
    if (!this.handlerContainer) return;
    this.handlerContainer.position.set(x, y);
  }

  // 绘制矩形和椭圆的处理框
  drawHandler(element: GraphicsElementType){
    if (!this.handlerContainer) {
      this.handlerContainer = new Container({
        label: this.id,
      });
      this.editor.annotationContainer.addChild(this.handlerContainer);
    }
    this.handlerContainer.removeChildren();
    this.drawHandlerBounds(element);
    this.drawHandlerPoints(element);
  }
  // 绘制对象的边框
  drawHandlerBounds(element: GraphicsElementType | TextGraphics, padding: number = 0){
    if (!this.handlerContainer) {
      this.handlerContainer = new Container({
        label: this.id,
        eventMode: 'none',
      });
      this.editor.annotationContainer.addChild(this.handlerContainer);
    }
    const bounds = element instanceof TextGraphics ? element.text.bounds : element.graphic.bounds;
    const {x, y, width, height} = bounds;
    const graphic = new Graphics();
    graphic.rect(x - padding, y - padding, width + padding * 2, height + padding * 2).stroke({ width: 2, color: 0X888888, alpha: 1, alignment: 0.5 });
    this.handlerContainer.removeChildren();
    this.handlerContainer.addChild(graphic);
  }

  getStartEndPoint (startPoint: Point, endPoint: Point){
    return {startPoint, endPoint};
  }

  handleDragDown(e: FederatedPointerEvent, handleName: string){
    e.stopPropagation();
    this.currentHandle = { name: handleName };
    this.isDragging = true
    this.currentStartPoint = new Point(this.element?.startPoint.x, this.element?.startPoint.y)
    this.currentEndPoint = new Point(this.element?.endPoint.x, this.element?.endPoint.y)
    this.editor.app.stage.on('pointermove', this.handlePointerMoveCallback);
    this.editor.app.stage.on('pointerup', this.handlerPointUpCallback);
    this.editor.app.stage.on('pointerupoutside', this.handlerPointUpCallback);
  }
  handlerPointMove(e: FederatedPointerEvent){
    if(!this.isDragging) return
    e.stopPropagation();
    if(this.element!.type === OperateType.ARROW){
      if(this.currentHandle?.name === 'start'){
        this.element?.draw(new Point(e.global.x, e.global.y),(this.element).endPoint);
      }
      if(this.currentHandle?.name === 'end'){
        this.element?.draw((this.element).startPoint, new Point(e.global.x, e.global.y));
      }
    }
    if(this.element!.type === OperateType.RECT || this.element!.type === OperateType.CIRCLE){
      const {x: positionX, y: positionY} = this.element!.getPosition();
      const eX = e.global.x - positionX;
      const eY = e.global.y - positionY;
      if(this.currentHandle?.name === 'tl'){
        const {startPoint, endPoint} = this.getStartEndPoint(new Point(eX, eY), this.currentEndPoint!);
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'tc'){
        const {startPoint, endPoint} = this.getStartEndPoint(new Point(this.currentStartPoint!.x, eY), this.currentEndPoint!);
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'tr'){
        const {startPoint, endPoint} = this.getStartEndPoint(new Point(this.currentStartPoint!.x, eY), new Point(eX, this.currentEndPoint!.y));
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'rc'){
        const {startPoint, endPoint} = this.getStartEndPoint(this.currentStartPoint!, new Point(eX, this.currentEndPoint!.y));
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'br'){
        const {startPoint, endPoint} = this.getStartEndPoint(this.currentStartPoint!, new Point(eX, eY));
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'bc'){
        const {startPoint, endPoint} = this.getStartEndPoint(this.currentStartPoint!, new Point( this.currentEndPoint!.x, eY));
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'bl'){
        const {startPoint, endPoint} = this.getStartEndPoint(new Point(eX, this.currentStartPoint!.y), new Point(this.currentEndPoint!.x, eY));
        this.element?.draw(startPoint, endPoint);
      }
      if(this.currentHandle?.name === 'lc'){
        const {startPoint, endPoint} = this.getStartEndPoint(new Point(eX, this.currentStartPoint!.y), this.currentEndPoint!);
        this.element?.draw(startPoint, endPoint);
      }
    }
  }
  // 处理框的点的移动
  handlerPointUp(){
    if(!this.isDragging) return
    this.isDragging = false
    this.currentHandle = null;
    this.editor.historyService.onDo({
      type: 'resize',
      item: this.element!,
      oldPoints: [this.currentStartPoint!, this.currentEndPoint!],
      newPoints: [new Point(this.element!.startPoint.x, this.element!.startPoint.y), new Point(this.element!.endPoint.x, this.element!.endPoint.y)],
    })
    this.editor.app.stage.off('pointermove', this.handlePointerMoveCallback);
    this.editor.app.stage.off('pointerup', this.handlerPointUpCallback);
    this.editor.app.stage.off('pointerupoutside', this.handlerPointUpCallback);
  }

  // 绘制处理框的点
  drawHandlerPoints(element: GraphicsElementType){
    const bounds = element.graphic.bounds;
    const {x, y, width, height} = bounds;
    const pointTL = new Point(x, y);
    const pointTC = new Point(x + width / 2, y);
    const pointTR = new Point(x + width, y);
    const pointRC = new Point(x + width, y + height / 2);
    const pointBR = new Point(x + width, y + height);
    const pointBC = new Point(x + width / 2, y + height);
    const pointBL = new Point(x, y + height);
    const pointLC = new Point(x, y + height / 2);
    const points = [{
      id: 'tl',
      point: pointTL,
      cursor: 'nw-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'tl'),
    },
    {
      id: 'tc',
      point: pointTC,
      cursor: 'n-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'tc'),
    },{
      id: 'tr',
      point: pointTR,
      cursor: 'ne-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'tr'),
    },{
      id: 'rc',
      point: pointRC,
      cursor: 'e-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'rc'),
    },{
      id: 'br',
      point: pointBR,
      cursor: 'se-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'br'),
    },
    {
      id: 'bc',
      point: pointBC,
      cursor: 's-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'bc'),
    },{
      id: 'bl',
      point: pointBL,
      cursor: 'sw-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'bl'),
    },{
      id: 'lc',
      point: pointLC,
      cursor: 'w-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'lc'),
    }]
    points.forEach((item) => {
      const {id, point, cursor, pointerDown} = item;
      const graphic = new Graphics({
        label: id,
      });
      graphic.circle(point.x, point.y, 4).fill(0XFFFFFF).stroke({ width: 1, color: 0X5b5b5b, alpha: 1 });
      graphic.cursor = cursor;
      graphic.on('pointerdown', pointerDown);
      this.handlerContainer!.addChild(graphic);
    })
  }
  // 绘制箭头处理框
  drawArrowHandler(startPoint: Point, endPoint: Point){
    if (!this.handlerContainer) {
      this.handlerContainer = new Container({
        label: this.id,
      });
      this.editor.annotationContainer.addChild(this.handlerContainer);
    }
    this.handlerContainer.removeChildren();
    this.handlerContainer.position.set(startPoint.x, startPoint.y);
    this.drawArrowHandlerLine(startPoint, endPoint, this.handlerContainer);
    this.drawArrowHandlerPoints(startPoint, endPoint, this.handlerContainer);
  }
  // 绘制箭头处理框的线
  drawArrowHandlerLine(startPoint: Point, endPoint: Point, handlerContainer: Container){
    const graphic = new Graphics();
    const {startPointMe, endPointMe} = this._transformArrowPoints(startPoint, endPoint);
    graphic.moveTo(startPointMe.x, startPointMe.y)
    .lineTo(endPointMe.x, endPointMe.y)
    .stroke({ width: 2, color: 0X888888, alpha: 1 }); // alignment default 0.5
    handlerContainer.addChild(graphic);
  }

  drawArrowHandlerPoints(startPoint: Point, endPoint: Point, handlerContainer: Container){
    const {startPointMe, endPointMe} = this._transformArrowPoints(startPoint, endPoint);
    const points = [{
      id: 'start',
      point: startPointMe,
      cursor: 'nw-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'start'),
    },{
      id: 'end',
      point: endPointMe,
      cursor: 'nw-resize',
      pointerDown: (e: FederatedPointerEvent) => this.handleDragDown(e, 'end'),
    }]
    points.forEach((item) => {
      const {id, point, cursor, pointerDown} = item;
      const graphic = new Graphics({
        label: id,
        eventMode: 'static',
      });
      graphic.circle(point.x, point.y, 4).fill(0XFFFFFF).stroke({ width: 1, color: 0X5b5b5b, alpha: 1 });
      graphic.cursor = cursor;
      graphic.on('pointerdown', pointerDown);
      // graphic.on('pointerup', this.handlerPointUpCallback);
      
      handlerContainer.addChild(graphic);
    })
  }

  private _transformArrowPoints(startPoint: Point, endPoint: Point){
    const {x: startX, y: startY} = startPoint;
    const {x: endX, y: endY} = endPoint;
    const dx = endX - startX;
    const dy = endY - startY;
    const startPointMe = new Point(
      0,
      0,
    )
    const endPointMe = new Point(
      dx,
      dy,
    )
    return {
      startPointMe,
      endPointMe,
    }
  }
  // 显示/隐藏处理框
  visibleHandler(visible: boolean){
    if (this.handlerContainer) {
      this.handlerContainer.visible = visible;
    }
  }
  // 移除处理框
  removeHandler(){
    if (this.handlerContainer) {
      this.editor.annotationContainer.removeChild(this.handlerContainer);
      this.handlerContainer = null;
    }
  }
  // 设置处理框的位置
  setHandlerPosition(position: Point){
    if (this.handlerContainer) {
      this.handlerContainer.position.set(position.x, position.y);
    }
  }
}

export default HandlerService;
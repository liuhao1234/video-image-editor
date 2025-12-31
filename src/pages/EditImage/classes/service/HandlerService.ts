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
  private handlePointerMoveCallback : (e: FederatedPointerEvent) => void;
  private handlerPointUpCallback : (e: FederatedPointerEvent) => void;
  constructor(id: string, editor: EditorApp) {
    this.id = `handler-${id}`;
    this.editor = editor;
    this.handlePointerMoveCallback = this.handlerPointMove.bind(this);
    this.handlerPointUpCallback = this.handlerPointUp.bind(this);
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
        eventMode: 'none',
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
    this.handlerContainer.addChild(graphic);
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
    },
    {
      id: 'tc',
      point: pointTC,
      cursor: 'n-resize',
    },{
      id: 'tr',
      point: pointTR,
      cursor: 'ne-resize',
    },{
      id: 'rc',
      point: pointRC,
      cursor: 'e-resize',
    },{
      id: 'br',
      point: pointBR,
      cursor: 'se-resize',
    },
    {
      id: 'bc',
      point: pointBC,
      cursor: 's-resize',
    },{
      id: 'bl',
      point: pointBL,
      cursor: 'sw-resize',
    },{
      id: 'lc',
      point: pointLC,
      cursor: 'w-resize',
    }]
    points.forEach((item) => {
      const {id, point, cursor} = item;
      const graphic = new Graphics({
        label: id,
      });
      graphic.circle(point.x, point.y, 4).fill(0XFFFFFF).stroke({ width: 1, color: 0X5b5b5b, alpha: 1 });
      graphic.cursor = cursor;
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

  handlerPointMove(e: FederatedPointerEvent){
    if(!this.isDragging) return
    e.stopPropagation();
    console.log('handlerPointMove', e.global.x, e.global.y);
  }
  // 处理框的点的移动
  handlerPointUp(){
    if(!this.isDragging) return
    console.log('handlerPointUp');
    this.editor.app.stage.off('pointermove', this.handlePointerMoveCallback);
    this.editor.app.stage.off('pointerup', this.handlerPointUpCallback);
    this.editor.app.stage.off('pointerupoutside', this.handlerPointUpCallback);
  }

  drawArrowHandlerPoints(startPoint: Point, endPoint: Point, handlerContainer: Container){
    const {startPointMe, endPointMe} = this._transformArrowPoints(startPoint, endPoint);
    const points = [{
      id: 'start',
      point: startPointMe,
      cursor: 'nw-resize',
      pointerDown: (e: FederatedPointerEvent) => {
        e.stopPropagation();
        this.isDragging = true
        console.log('start pointerDown');
        this.editor.app.stage.on('pointermove', this.handlePointerMoveCallback);
        this.editor.app.stage.on('pointerup', this.handlerPointUpCallback);
        this.editor.app.stage.on('pointerupoutside', this.handlerPointUpCallback);
        this.element?.draw(new Point(e.global.x, e.global.y),this.element.endPoint);
      },
    },{
      id: 'end',
      point: endPointMe,
      cursor: 'nw-resize',
      pointerDown: (e: FederatedPointerEvent) => {
        e.stopPropagation();
        this.isDragging = true
        console.log('end pointerDown');
        this.editor.app.stage.on('pointermove', this.handlePointerMoveCallback);
        this.editor.app.stage.on('pointerup', this.handlerPointUpCallback);
        this.editor.app.stage.on('pointerupoutside', this.handlerPointUpCallback);
      },
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
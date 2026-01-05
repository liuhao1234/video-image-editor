import { Point } from 'pixi.js';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import type { SizeColorType } from '../types/index';
import { OperateType, sizeMap, colorMap } from '../constants/enum';
class EllipseGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  public startPoint: Point;
  public endPoint: Point;
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.moveEventService.setElement(this);
    this.moveEventService.bindMoveEvent();
    this.type = OperateType.CIRCLE;
    this.sizeColor = sizeColor;
    this.startPoint = new Point();
    this.endPoint = new Point();
  }

  draw(startPoint: Point, endPoint: Point){
    const sPoint = new Point(Math.min(startPoint.x, endPoint.x), Math.min(startPoint.y, endPoint.y));
    const ePoint = new Point(Math.max(startPoint.x, endPoint.x), Math.max(startPoint.y, endPoint.y));
    this.startPoint = sPoint;
    this.endPoint = ePoint;
    const {x: startX, y: startY} = sPoint;
    const {x: endX, y: endY} = ePoint;
    const x = (startX + endX) / 2;
    const y = (startY + endY) / 2;
    const radiusX = Math.abs(endX - startX)/2;
    const radiusY = Math.abs(endY - startY)/2;
    this.drawEllipse(x, y, radiusX, radiusY);
  }

  drawEllipse(x: number, y: number, radiusX: number, radiusY: number){
    this.graphic.clear().ellipse(x, y, radiusX, radiusY).stroke({ width: sizeMap[this.sizeColor.size], color: colorMap[this.sizeColor.color] });
    this.drawHandler();
  }
  
  changeSizeColor(sizeColor: SizeColorType){
    this.sizeColor = sizeColor;
    this.draw(this.startPoint, this.endPoint);
  }
  
  setPosition(x: number, y: number){
    this.graphic.position.set(x, y);
  }

  getPosition(){
    return this.graphic.position;
  }
  
  getTarget(){
    return this.graphic;
  }
  
  getThis(){
    return this;
  }
  
  drawHandler(){
    this.handlerService.drawHandler(this);
  }
}

export default EllipseGraphics;
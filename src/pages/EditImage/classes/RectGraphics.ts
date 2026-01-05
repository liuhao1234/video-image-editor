import { Point } from 'pixi.js';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import type { SizeColorType } from '../types/index';
import { OperateType, sizeMap, colorMap } from '../constants/enum';

class RectGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  public startPoint: Point;
  public endPoint: Point;
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.moveEventService.setElement(this);
    this.moveEventService.bindMoveEvent();
    this.type = OperateType.RECT;
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
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    this.drawRect(x, y, width, height);
  }

  drawRect(x: number, y: number, width: number, height: number){
    this.graphic.clear().rect(x, y, width, height).stroke({ width: sizeMap[this.sizeColor.size], color: colorMap[this.sizeColor.color] });
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

export default RectGraphics;
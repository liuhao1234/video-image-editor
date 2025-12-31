import { Point } from 'pixi.js';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import type { SizeColorType } from '../types/index';
import { OperateType, sizeMap, colorMap } from '../constants/enum';
class EllipseGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.element = this;
    this.type = OperateType.CIRCLE;
    this.sizeColor = sizeColor;
  }

  draw(startPoint: Point, endPoint: Point){
    const {x: startX, y: startY} = startPoint;
    const {x: endX, y: endY} = endPoint;
    const x = (startPoint.x + endPoint.x) / 2;
    const y = (startPoint.y + endPoint.y) / 2;
    const radiusX = Math.abs(endX - startX)/2;
    const radiusY = Math.abs(endY - startY)/2;
    this.drawEllipse(x, y, radiusX, radiusY);
  }

  drawEllipse(x: number, y: number, radiusX: number, radiusY: number){
    this.graphic.clear().ellipse(x, y, radiusX, radiusY).stroke({ width: sizeMap[this.sizeColor.size], color: colorMap[this.sizeColor.color] });
    this.drawHandler();
  }
  
  drawHandler(){
    this.handlerService.drawHandler(this);
  }
}

export default EllipseGraphics;
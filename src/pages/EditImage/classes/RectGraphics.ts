import { Point } from 'pixi.js';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import type { SizeColorType } from '../types/index';
import { OperateType, sizeMap, colorMap } from '../constants/enum';

class RectGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.element = this;
    this.type = OperateType.RECT;
    this.sizeColor = sizeColor;
  }

  draw(startPoint: Point, endPoint: Point){
    const {x: startX, y: startY} = startPoint;
    const {x: endX, y: endY} = endPoint;
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

  drawHandler(){
    this.handlerService.drawHandler(this);
  }
}

export default RectGraphics;
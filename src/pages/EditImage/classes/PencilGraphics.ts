import { Point } from 'pixi.js';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import type { SizeColorType } from '../types/index';
import { sizeMap, colorMap, OperateType } from '../constants/enum';

class PencilGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  public path: Point[] = [];
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.element = this;
    this.type = OperateType.PENCIL;
    this.sizeColor = sizeColor;
  }
  startDraw(startPoint: Point){
    this.graphic.moveTo(startPoint.x, startPoint.y);
    this.path.push(startPoint);
  }
  draw(point: Point){
    this.graphic.lineTo(point.x, point.y).stroke({ width: sizeMap[this.sizeColor.size], color: colorMap[this.sizeColor.color] });
    this.path.push(point);
  }
  drawPath(path: Point[]){
    this.path = path;
    this.path.forEach((point, index) => {
      if(index === 0){
        this.graphic.moveTo(point.x, point.y);
      }else{
        this.graphic.lineTo(point.x, point.y).stroke({ width: sizeMap[this.sizeColor.size], color: colorMap[this.sizeColor.color] });
      }
    })
  }
  drawHandler(){}
}

export default PencilGraphics;

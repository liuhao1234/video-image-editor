import { Point } from 'pixi.js';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import type { SizeColorType } from '../types/index';
import { sizeMap, colorMap, OperateType } from '../constants/enum';

class PencilGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  public path: Point[] = [];
  public startPoint: Point;
  public endPoint: Point;
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.moveEventService.setElement(this); 
    this.moveEventService.bindMoveEvent();
    this.type = OperateType.PENCIL;
    this.sizeColor = sizeColor;
    this.startPoint = new Point();
    this.endPoint = new Point();
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
        this.graphic.clear().moveTo(point.x, point.y);
      }else{
        this.graphic.lineTo(point.x, point.y).stroke({ width: sizeMap[this.sizeColor.size], color: colorMap[this.sizeColor.color] });
      }
    })
  }
  
  changeSizeColor(sizeColor: SizeColorType){
    this.sizeColor = sizeColor;
    this.drawPath(this.path);
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

  drawHandler(){}
}

export default PencilGraphics;

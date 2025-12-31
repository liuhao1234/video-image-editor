import { Point } from 'pixi.js';
import type { SizeColorType } from '../types/index';
import { arrowSizeMap, colorMap } from '../constants/enum';
import type EditorApp from './EditorApp';
import GraphicParent from './GraphicParent';
import { OperateType } from '../constants/enum';
class ArrowGraphics extends GraphicParent {
  public type: OperateType;
  public sizeColor: SizeColorType;
  public startPoint: Point;
  public endPoint: Point;
  constructor(editor: EditorApp, sizeColor: SizeColorType) {
    super(editor);
    this.handlerService.setElement(this);
    this.element = this;
    this.type = OperateType.ARROW;
    this.sizeColor = sizeColor;
    this.startPoint = new Point();
    this.endPoint = new Point();
  }

  draw(startPoint: Point, endPoint: Point){
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.graphic.position.set(startPoint.x, startPoint.y);
    const {x: startX, y: startY} = startPoint;
    const {x: endX, y: endY} = endPoint;
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.hypot(dx, dy);
    const endPointMe = new Point(
      0 + distance,
      0,
    )
    if (distance < 30) return; // 避免重合
    const [length, height1, height2] = arrowSizeMap[this.sizeColor.size];
    this.graphic.clear()
    .moveTo(0, 0)
    .lineTo(endPointMe.x - length, endPointMe.y + height1)
    .lineTo(endPointMe.x - length, endPointMe.y + height2)
    .lineTo(endPointMe.x, endPointMe.y)
    .lineTo(endPointMe.x - length, endPointMe.y - height2)
    .lineTo(endPointMe.x - length, endPointMe.y - height1)
    .lineTo(0, 0)
    .fill(colorMap[this.sizeColor.color])
    const angle = Math.atan2(dy, dx);
    this.graphic.rotation = angle;
    this.drawHandler();
  }
  drawHandler(){
    this.handlerService.drawArrowHandler(this.startPoint, this.endPoint);
  }
}

export default ArrowGraphics;
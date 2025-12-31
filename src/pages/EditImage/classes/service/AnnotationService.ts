import { Point } from 'pixi.js';
import EditorApp from '../EditorApp';
import { OperateType } from '../../constants/enum';
import type {
  AnnotationType,
  RectAnnotationType,
  CircleAnnotationType,
  ArrowAnnotationType,
  PencilAnnotationType,
  TextAnnotationType
} from '../../types/index';
import RectGraphics from '../RectGraphics';
import EllipseGraphics from '../EllipseGraphics';
import ArrowGraphics from '../ArrowGraphics';
import PencilGraphics from '../PencilGraphics';
import TextGraphics from '../TextGraphics';
import MosaicGraphics from '../MosaicGraphics';

class AnnotationService {
  private editor: EditorApp;
  constructor(editor: EditorApp) {
    this.editor = editor;
  }
  // 获取标注数据
  getAnnotation(){
    return this.editor.elementList.map(item => {
      if(item.type === OperateType.RECT){
        const currentItem = item as RectGraphics;
        const { sizeColor, graphic } = currentItem;
        const { bounds, position, width, height } = graphic;
        const { x, y } = position;
        return {
          type: OperateType.RECT,
          sizeColor: sizeColor,
          position: { x, y },
          x: bounds.x,
          y: bounds.y,
          width,
          height,
        }
      }
      if(item.type === OperateType.CIRCLE){
        const currentItem = item as EllipseGraphics;
        const { sizeColor, graphic } = currentItem;
        const { bounds, position, width, height } = graphic;
        const { x, y } = position;
        return {
          type: OperateType.CIRCLE,
          sizeColor: sizeColor,
          position: { x, y },
          x: bounds.x + width/2,
          y: bounds.y + height/2,
          radiusX: width/2,
          radiusY: height/2,
        }
      }
      if(item.type === OperateType.ARROW){
        const currentItem = item as ArrowGraphics;
        const { sizeColor, startPoint, endPoint } = currentItem;
        return {
          type: OperateType.ARROW,
          sizeColor: sizeColor,
          startPoint: {x: startPoint.x, y: startPoint.y},
          endPoint: {x: endPoint.x, y: endPoint.y},
        }
      }
      if(item.type === OperateType.PENCIL){
        const currentItem = item as PencilGraphics;
        const { graphic, sizeColor, path } = currentItem;
        const { position } = graphic;
        const { x, y } = position;
        return {
          type: OperateType.PENCIL,
          position: { x, y },
          sizeColor,
          path,
        }
      }
      if(item.type === OperateType.TEXT){
        const currentItem = item as TextGraphics;
        const { sizeColor, text } = currentItem;
        const { position } = text;
        const { x, y } = position;
        return {
          type: OperateType.TEXT,
          sizeColor: sizeColor,
          position: { x, y },
          text: text.text,
        }
      }
      if(item.type === OperateType.MOSAIC){
        const currentItem = item as MosaicGraphics;
        const { size, path } = currentItem;
        return {
          type: OperateType.MOSAIC,
          size: size,
          path,
        }
      }
    })
  }

  // 根据标注数据初始化标注
  renderAnnotation(annotation: (AnnotationType|MosaicGraphics)[]){
    console.log(annotation)
    annotation.forEach(async (item) => {
      if(item.type === OperateType.RECT){
        const currentItem = item as RectAnnotationType;
        const rectGraphics = new RectGraphics(this.editor, currentItem.sizeColor);
        this.editor.annotationContainer.addChild(rectGraphics.graphic);
        rectGraphics.setPosition(currentItem.position.x, currentItem.position.y);
        rectGraphics.drawRect(currentItem.x, currentItem.y, currentItem.width, currentItem.height);
        rectGraphics.visibleHandler(false);
        this.editor.elementList.push(rectGraphics);
      }
      if(item.type === OperateType.CIRCLE){
        const currentItem = item as CircleAnnotationType;
        const ellipseGraphics = new EllipseGraphics(this.editor, currentItem.sizeColor);
        this.editor.annotationContainer.addChild(ellipseGraphics.graphic);
        ellipseGraphics.setPosition(currentItem.position.x, currentItem.position.y);
        ellipseGraphics.drawEllipse(currentItem.x, currentItem.y, currentItem.radiusX, currentItem.radiusY);
        ellipseGraphics.visibleHandler(false);
        this.editor.elementList.push(ellipseGraphics);
      }
      if(item.type === OperateType.ARROW){
        const currentItem = item as ArrowAnnotationType;
        const arrowGraphics = new ArrowGraphics(this.editor, currentItem.sizeColor);
        this.editor.annotationContainer.addChild(arrowGraphics.graphic);
        arrowGraphics.draw(new Point(currentItem.startPoint.x, currentItem.startPoint.y), new Point(currentItem.endPoint.x, currentItem.endPoint.y));
        arrowGraphics.visibleHandler(false);
        this.editor.elementList.push(arrowGraphics);
      }
      if(item.type === OperateType.PENCIL){
        const currentItem = item as PencilAnnotationType;
        const pencilGraphics = new PencilGraphics(this.editor, currentItem.sizeColor);
        this.editor.annotationContainer.addChild(pencilGraphics.graphic);
        pencilGraphics.setPosition(currentItem.position.x, currentItem.position.y);
        pencilGraphics.drawPath(currentItem.path);
        this.editor.elementList.push(pencilGraphics);
      }
      if(item.type === OperateType.TEXT){
        const currentItem = item as TextAnnotationType;
        const textGraphics = new TextGraphics(this.editor, 1, currentItem.sizeColor );
        this.editor.annotationContainer.addChild(textGraphics.text);
        textGraphics.text.position.set(currentItem.position.x, currentItem.position.y);
        textGraphics.text.text = currentItem.text;
        this.editor.elementList.push(textGraphics);
      }
      if(item.type === OperateType.MOSAIC){
        const currentItem = item as MosaicGraphics;
        const mosaicGraphics = new MosaicGraphics(this.editor, this.editor.mosaicContainer, currentItem.size, 1);
        await mosaicGraphics.loadMosaic(this.editor.imageSrc);
        mosaicGraphics.drawMosaic(currentItem.path);
        this.editor.elementList.push(mosaicGraphics);
      }
    })
  }
}
export default AnnotationService;
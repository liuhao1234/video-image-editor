import { Point, Text } from 'pixi.js';
import {v4 as uuidv4} from 'uuid';
import type EditorApp from './EditorApp';
import { fontSizeMap, colorMap, OperateType } from '../constants/enum';
import type { SizeColorType } from '../types/index';
import HandlerService from './service/HandlerService';
import MoveEventService from './service/MoveEventService';
class TextGraphics {
  private editor: EditorApp;
  public id: string;
  public type: OperateType;
  public text: Text;
  public sizeColor: SizeColorType;
  private clickTimer: NodeJS.Timeout | null = null;
  private clickCount: number = 0;
  private imageScale: number;
  public handlerService: HandlerService;
  private moveEventService: MoveEventService;
  private finishTextingFunc: () => void;
  constructor(editor: EditorApp, imageScale: number, sizeColor: SizeColorType) {
    this.editor = editor;
    this.type = OperateType.TEXT;
    this.imageScale = imageScale;
    this.sizeColor = sizeColor;
    this.finishTextingFunc = this.finishTexting.bind(this);
    this.id = uuidv4();
    this.text = new Text({
      eventMode: 'static',
      interactive: true,
      label: this.id,
      text: '',
      roundPixels: true,
      style: {
        fontSize: fontSizeMap[this.sizeColor.size] / this.imageScale,
        fill: colorMap[this.sizeColor.color],
      }
    })
    this.handlerService = new HandlerService(this.id, this.editor);
    this.moveEventService = new MoveEventService({
      stage: this.editor.app.stage,
      target: this.text,
      pointerDownCallback: () => {
        this.editor.selectElement(this);
      },
      pointerMoveCallback: (endPosition: Point) => {
        this.handlerService.setHandlerPosition(endPosition);
      },
      onDraggingEnd: (startPosition: Point, endPosition: Point) => {
        this.editor.historyService.onDo({
          type: 'move',
          item: this,
          oldPosition: startPosition,
          newPosition: endPosition,
        })
      }
    });
    this.moveEventService.bindMoveEvent();
    this.bindEvent();
  }

  setPosition(x: number, y: number){
    this.text.position.set(x, y);
  }

  textUpdate(text: string){
    this.text.text = text;
    this.drawHandler();
  }
  
  // 编辑文案，完成文案编辑
  finishTexting(){
    const textInputDom = document.getElementById('textInput') as HTMLDivElement;
    this.editor.historyService.onDo({
      type: 'update',
      item: this,
      oldText: this.text.text,
      newText: textInputDom.innerText,
    })
    this.textUpdate(textInputDom.innerText);
    textInputDom.style.display = 'none';
    this.text.visible = true;
    this.editor.setTextEditStatus(false);
    textInputDom.removeEventListener('blur', this.finishTextingFunc);
  }

  drawHandler(){
    this.handlerService.drawHandlerBounds(this, 5);
    this.handlerService.setHandlerPosition(this.text.position);
  }

  visibleHandler(visible: boolean) {
    console.log('visibleHandler', visible);
    this.handlerService.visibleHandler(visible);
  }

  // 双击编辑文案
  bindEvent(){
    this.text.on('pointerup', () => {
      this.clickCount++;
      if(this.clickTimer){
        clearTimeout(this.clickTimer);
      }
      this.clickTimer = setTimeout(() => {
        this.clickCount = 0;
      }, 300);
      if(this.clickCount === 1){
        this.editor.selectElement(this);
        return;
      }
      if(this.clickCount === 2){
        this.editor.setTextEditStatus(true);
        this.text.visible = false;
        this.visibleHandler(false);
        this.editor.selectElement(null);
        const textInputDom = document.getElementById('textInput') as HTMLDivElement;
        const canvasContainer = document.getElementById('canvasContainer') as HTMLDivElement;
        const canvasContainerRect = canvasContainer.getBoundingClientRect();
        const {left, top} = canvasContainerRect;
        const { x, y } = this.text.position;
        textInputDom.style.display = 'block';
        textInputDom.style.left = `${left + x * this.editor.imageScale}px`;
        textInputDom.style.top = `${top + y * this.editor.imageScale}px`;
        textInputDom.style.fontSize = `${fontSizeMap[this.sizeColor.size] * this.editor.imageScale}px`;
        textInputDom.style.color = colorMap[this.sizeColor.color];
        textInputDom.focus();
        textInputDom.innerText = this.text.text;
        textInputDom.addEventListener('blur', this.finishTextingFunc);
      }
    });
  }
}

export default TextGraphics;
import { Application, Assets, Sprite, Container, Point } from 'pixi.js';
import type { FederatedPointerEvent } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';
import { OperateType, OperateSize, OperateColor } from '../constants/enum';
import type { 
  ElementType,
  SizeColorType,
  EditorEventType,
  EditorEventFuncType,
  EditorEventListType,
  EmitChangeParamsType,
  HistoryChangeFuncType,
  SelectedChangeFuncType,
  EditableElementType,
} from '../types/index';
import RectGraphics from './RectGraphics';
import EllipseGraphics from './EllipseGraphics';
import ArrowGraphics from './ArrowGraphics';
import PencilGraphics from './PencilGraphics';
import TextGraphics from './TextGraphics';
import MosaicGraphics from './MosaicGraphics';
import HistoryService from './service/HistoryService';
import AnnotationService from './service/AnnotationService';

class EditorApp {
  public app: Application;
  public sprite: Sprite | null;
  public elementList: ElementType[] = [];
  public imageScale: number; // 当前图片缩放比例
  public mosaicContainer: Container; // 马赛克容器（统一管理所有马赛克）
  public annotationContainer: Container; // 标注容器（统一管理所有绘制的图形）
  public annotationService: AnnotationService;
  public historyService: HistoryService;
  public imageSrc: string | null = null; // 当前图片的 src
  private operateType: OperateType | null;
  private isDrawing: boolean; // 是否正在绘制矩形
  private isTexting: boolean; // 是否正在输入文本
  private isTextEditing: boolean; // 是否正在编辑文本
  public startPoint: Point | null; // 绘制矩形时的起始点
  private tempGraphics: ElementType | null; // 临时矩形图形（绘制中）
  private selectItem: EditableElementType | null; // 当前选中的元素
  private rectSizeColor: SizeColorType; // 当前矩形的边框颜色
  private ellipseSizeColor: SizeColorType; // 当前椭圆的边框颜色
  private arrowSizeColor: SizeColorType; // 当前箭头的边框颜色
  private pencilSizeColor: SizeColorType; // 当前铅笔的边框颜色
  private mosaicSize: OperateSize; // 当前马赛克的边框颜色
  private textSizeColor: SizeColorType; // 当前文本的边框颜色
  private eventList: EditorEventListType = {} as EditorEventListType;
  private finishTextingFunc: () => void; // 完成文本输入的回调函数
  private handleStagePointerMoveFunc: (e: FederatedPointerEvent) => void; // 处理鼠标移动事件的回调函数

  constructor(canvasContainer: HTMLElement | null) {
    this.app = new Application();
    this.imageScale = 1;
    this.operateType = null
    this.sprite = null;
    this.annotationContainer = new Container({
      label: 'annotationContainer',
    });
    this.mosaicContainer = new Container({
      label: 'mosaicContainer',
    });
    this.annotationService = new AnnotationService(this);
    this.historyService = new HistoryService(this);
    this.isDrawing = false;
    this.isTexting = false;
    this.isTextEditing = false;
    this.startPoint = null;
    this.tempGraphics = null;
    this.selectItem = null;
    this.rectSizeColor = {size: OperateSize.MEDIUM, color: OperateColor.RED};
    this.ellipseSizeColor = {size: OperateSize.MEDIUM, color: OperateColor.RED};
    this.arrowSizeColor = {size: OperateSize.MEDIUM, color: OperateColor.RED};
    this.pencilSizeColor = {size: OperateSize.MEDIUM, color: OperateColor.RED};
    this.mosaicSize = OperateSize.MEDIUM;
    this.textSizeColor = {size: OperateSize.MEDIUM, color: OperateColor.RED};
    this.finishTextingFunc = this.finishTexting.bind(this);
    this.handleStagePointerMoveFunc = this.handleStagePointerMove.bind(this);

    this.initApp(canvasContainer);
    this.bindEvent();
  }

  async initApp(canvasContainer: HTMLElement | null) {
    if(!canvasContainer) return;
    await this.app.init({
      width: 0,
      height: 0,
      background: '#000000',
      antialias: true,
      eventMode: 'static',
    })
    initDevtools({ app: this.app });
    // canvasContainer.innerHTML = ''; // 清空容器内的元素, 避免重复添加 canvas 导致错误, 但是该操作导致 canvas 元素丢失, 导致后续操作错误，点击图片加载不进去
    canvasContainer.appendChild(this.app.canvas);
    // 将马赛克容器添加到舞台（层级在图片之上）
    this.app.stage.addChild(this.mosaicContainer);
    // 将标注容器添加到舞台（层级在图片之上）
    this.app.stage.addChild(this.annotationContainer);
  }

  async loadImg(imgSrc: string){
    this.imageSrc = imgSrc;
    const texture = await Assets.load(imgSrc);
    const sprite = new Sprite(texture);
    // 调整渲染器大小
    this.app.renderer.resize(sprite.width, sprite.height);
    // 清空舞台
    if(this.sprite) this.app.stage.removeChild(this.sprite);
    // 加入新的 sprite
    this.app.stage.addChildAt(sprite, 0);
    this.sprite = sprite;
    this.sprite.eventMode = 'static';
    this.sprite.on('click', () => {
      this.selectElement(null);
    });
  }

  clearAnnotation(){
    this.annotationContainer.removeChildren();
  }

  setCurrentImageScale(scale: number){
    this.imageScale = scale;
  }

  saveImg(){
    if(!this.app) return;
    this.app.renderer.extract.download({
      target: this.app.stage,
      filename: 'my-image.png'
    });
  }

  setTextEditStatus(status: boolean){
    this.isTextEditing = status;
  }

  setOperateType(operateType: OperateType | null){
    this.operateType = operateType;
  }

  selectElement(item: EditableElementType | null){
    if(this.selectItem && 'visibleHandler' in this.selectItem) {
      this.selectItem.visibleHandler(false)
    }
    if(item && 'visibleHandler' in item) {
      item.visibleHandler(true)
    }
    this.selectItem = item;
    // 触发选中元素变化事件
    this.emit('selectedChange', item);
  }

  setRectSizeColor(sizeColor: SizeColorType){
    this.rectSizeColor = sizeColor;
    if(this.selectItem){
      this.changeItemSizeColor(this.selectItem, sizeColor);
    }
  }

  setEllipseSizeColor(sizeColor: SizeColorType){
    this.ellipseSizeColor = sizeColor;
    if(this.selectItem){
      this.changeItemSizeColor(this.selectItem, sizeColor);
    }
  }

  setArrowSizeColor(sizeColor: SizeColorType){
    this.arrowSizeColor = sizeColor;
    if(this.selectItem){
      this.changeItemSizeColor(this.selectItem, sizeColor);
    }
  }

  setPencilSizeColor(sizeColor: SizeColorType){
    this.pencilSizeColor = sizeColor;
    if(this.selectItem){
      this.changeItemSizeColor(this.selectItem, sizeColor);
    }
  }

  setMosaicSize(size: OperateSize){
    this.mosaicSize = size;
  }

  setTextSizeColor(sizeColor: SizeColorType){
    this.textSizeColor = sizeColor;
    if(this.selectItem){
      this.changeItemSizeColor(this.selectItem, sizeColor);
    }
  }

  changeItemSizeColor(item: EditableElementType, sizeColor: SizeColorType){
    this.historyService.onDo({
      type: 'sizeColor',
      item,
      oldSizeColor: {...item.sizeColor},
      newSizeColor: sizeColor,
    });
    item.changeSizeColor(sizeColor);
  }

  // 完成文本输入
  finishTexting(){
    this.isTexting = false;
    const textInputDom = document.getElementById('textInput') as HTMLElement;
    const value = textInputDom!.innerText;
    textInputDom!.style.display = 'none';
    textInputDom!.innerText = '';
    textInputDom!.style.left = `0px`;
    textInputDom!.style.top = `0px`;
    if(value && this.tempGraphics){
      (this.tempGraphics as TextGraphics).text.text = value;
      // 加入标注容器
      this.annotationContainer.addChild((this.tempGraphics as TextGraphics).text);
      (this.tempGraphics as TextGraphics).drawHandler();
      (this.tempGraphics as TextGraphics).visibleHandler(false);
      this.elementList.push(this.tempGraphics);
      textInputDom!.innerText = '';
      this.historyService.onDo({
        type: 'add',
        item: this.tempGraphics,
      })
    }
    textInputDom!.removeEventListener('blur', this.finishTextingFunc);
  }
  finishDrawing(){
    if(!this.isDrawing) return;
    if(this.operateType === OperateType.RECT){
      // 确保矩形有最小尺寸（避免绘制空矩形）
      const width = Math.abs((this.tempGraphics as RectGraphics)!.graphic.width);
      const height = Math.abs((this.tempGraphics as RectGraphics)!.graphic.height);
      if (width < 5 || height < 5) {
        // 移除临时矩形及handler，不保存
        (this.tempGraphics as RectGraphics)!.removeHandler();
        this.annotationContainer.removeChild((this.tempGraphics as RectGraphics)!.graphic);
      } else {
        // 保留绘制完成的矩形（临时矩形转为永久矩形）
        // 可在这里给矩形添加交互（如拖拽、调整大小）
        if(this.tempGraphics){
          (this.tempGraphics as RectGraphics)!.visibleHandler(false);
          this.elementList.push(this.tempGraphics);
          this.historyService.onDo({
            type: 'add',
            item: this.tempGraphics,
          })
        }
      }
    }

    if(this.operateType === OperateType.CIRCLE){
      // 确保椭圆有最小尺寸（避免绘制空椭圆）
      const radiusX = Math.abs((this.tempGraphics as EllipseGraphics)!.graphic.width)/2;
      const radiusY = Math.abs((this.tempGraphics as EllipseGraphics)!.graphic.height)/2;
      if (radiusX < 5 || radiusY < 5) {
        // 移除临时椭圆，不保存
        (this.tempGraphics as EllipseGraphics)!.removeHandler();
        this.annotationContainer.removeChild((this.tempGraphics as EllipseGraphics)!.graphic);
      } else {
        // 保留绘制完成的椭圆（临时椭圆转为永久椭圆）
        // 可在这里给椭圆添加交互（如拖拽、调整大小）
        if(this.tempGraphics){
          (this.tempGraphics as EllipseGraphics)!.visibleHandler(false);
          this.elementList.push(this.tempGraphics);
          this.historyService.onDo({
            type: 'add',
            item: this.tempGraphics,
          })
        }
      }
    }

    if(this.operateType === OperateType.ARROW){
      // 确保箭头有最小尺寸（避免绘制空箭头）
      const width = Math.abs((this.tempGraphics as ArrowGraphics)!.graphic.width);
      const height = Math.abs((this.tempGraphics as ArrowGraphics)!.graphic.height);
      if (width < 5 || height < 5) {
        // 移除临时箭头，不保存
        (this.tempGraphics as ArrowGraphics)!.removeHandler();
        this.annotationContainer.removeChild((this.tempGraphics as ArrowGraphics)!.graphic);
      } else {
        // 保留绘制完成的箭头（临时箭头转为永久箭头）
        // 可在这里给箭头添加交互（如拖拽、调整大小）
        if(this.tempGraphics){
          (this.tempGraphics as ArrowGraphics)!.visibleHandler(false);
          this.elementList.push(this.tempGraphics);
          this.historyService.onDo({
            type: 'add',
            item: this.tempGraphics,
          })
        }
      }
    }
    
    if(this.operateType === OperateType.PENCIL){
      // 确保铅笔有最小尺寸（避免绘制空铅笔）
      if ((this.tempGraphics as PencilGraphics)!.path.length < 2) {
        // 移除临时铅笔，不保存
        this.annotationContainer.removeChild((this.tempGraphics as PencilGraphics)!.graphic);
      } else {
        // 保留绘制完成的铅笔（临时铅笔转为永久铅笔）
        // 可在这里给铅笔添加交互（如拖拽、调整大小）
        // 将临时图形加入元素列表
        if(this.tempGraphics){
          this.elementList.push(this.tempGraphics);
          this.historyService.onDo({
            type: 'add',
            item: this.tempGraphics,
          })
        }
      }
    }

    if(this.operateType === OperateType.MOSAIC){
      // 确保马赛克有最小尺寸（避免绘制空马赛克）
      if ((this.tempGraphics as MosaicGraphics)!.path.length === 0) {
        // 移除临时马赛克，不保存
        this.mosaicContainer.removeChild((this.tempGraphics as MosaicGraphics)!.sprite!);
      } else {
        // 保留绘制完成的马赛克（临时马赛克转为永久马赛克）
        // 可在这里给马赛克添加交互（如拖拽、调整大小）
        // 将临时图形加入元素列表
        if(this.tempGraphics){
          this.elementList.push(this.tempGraphics);
          this.historyService.onDo({
            type: 'add',
            item: this.tempGraphics,
          })
        }
      }
    }

    // 重置绘制状态
    this.isDrawing = false
    this.startPoint = null;
    this.tempGraphics = null;
    // 移除鼠标移动事件监听
    this.app.stage.off('pointermove', this.handleStagePointerMoveFunc);
  }
  on(event: EditorEventType, callback: EditorEventFuncType){
    if(!this.eventList[event]){
      this.eventList[event] = [];
    }
    this.eventList[event].push(callback);
  }
  emit(event: EditorEventType, params: EmitChangeParamsType | EditableElementType | null){
    if(this.eventList[event]){
      if(event === 'historyChange'){
        (this.eventList[event] as HistoryChangeFuncType[]).forEach(callback => callback(params as EmitChangeParamsType));
      }
      if(event === 'selectedChange'){
        (this.eventList[event] as SelectedChangeFuncType[]).forEach(callback => callback(params as EditableElementType | null));
      }
    }
  }
  handleStagePointerMove(e: FederatedPointerEvent){
    if(this.operateType === OperateType.RECT && this.isDrawing) {
      (this.tempGraphics as RectGraphics).draw(this.startPoint!,new Point(e.global.x, e.global.y))
    }
    if(this.operateType === OperateType.CIRCLE && this.isDrawing) {
      (this.tempGraphics as EllipseGraphics).draw(this.startPoint!,new Point(e.global.x, e.global.y))
    }
    if(this.operateType === OperateType.ARROW && this.isDrawing) {
      (this.tempGraphics as ArrowGraphics).draw(this.startPoint!,new Point(e.global.x, e.global.y))
    }
    if(this.operateType === OperateType.PENCIL && this.isDrawing) {
      (this.tempGraphics as PencilGraphics).draw(new Point(e.global.x, e.global.y))
    }
    if(this.operateType === OperateType.MOSAIC && this.isDrawing) {
      (this.tempGraphics as MosaicGraphics).draw(e.global);
    }
  }
  bindEvent(){
    if(!this.app) return;
    // 鼠标点击（开始绘制）
    this.app.stage.on('pointerdown', async (e) => {
      this.startPoint = new Point(e.global.x, e.global.y);
      // 开始绘制矩形
      if(this.operateType === OperateType.RECT){
        this.isDrawing = true
        this.tempGraphics = new RectGraphics(this, this.rectSizeColor);
        this.annotationContainer.addChild(this.tempGraphics.graphic);
      }
      // 开始绘制椭圆
      if(this.operateType === OperateType.CIRCLE){
        this.isDrawing = true
        this.tempGraphics = new EllipseGraphics(this,this.ellipseSizeColor);
        this.annotationContainer.addChild(this.tempGraphics.graphic);
      }
      // 开始绘制箭头
      if(this.operateType === OperateType.ARROW){
        this.isDrawing = true
        this.tempGraphics = new ArrowGraphics(this, this.arrowSizeColor);
        this.annotationContainer.addChild(this.tempGraphics.graphic);
      }
      // 开始绘制铅笔
      if(this.operateType === OperateType.PENCIL){
        this.isDrawing = true
        this.tempGraphics = new PencilGraphics(this, this.pencilSizeColor);
        this.annotationContainer.addChild(this.tempGraphics.graphic);
        (this.tempGraphics as PencilGraphics).startDraw(this.startPoint);
      }
      // 开始绘制马赛克
      if(this.operateType === OperateType.MOSAIC){
        this.isDrawing = true
        this.tempGraphics = new MosaicGraphics(this, this.mosaicContainer, this.mosaicSize, this.imageScale)
        await this.tempGraphics.loadMosaic(this.imageSrc);
        this.tempGraphics.draw(e.global)
      }
      // 开始绘制文本
      if(this.operateType === OperateType.TEXT && !this.isTexting && !this.isTextEditing){
        this.isTexting = true
        this.tempGraphics = new TextGraphics(this, this.imageScale, this.textSizeColor);
        this.tempGraphics.setPosition(this.startPoint.x, this.startPoint.y);
        
        const textInputDom = document.getElementById('textInput') as HTMLElement;
        textInputDom!.style.display = 'block';
        textInputDom!.style.left = `${e.clientX}px`;
        textInputDom!.style.top = `${e.clientY}px`;
        setTimeout(() => {
          textInputDom!.focus();
        }, 0);
        textInputDom!.addEventListener('blur', this.finishTextingFunc)
      }
      // 鼠标移动（绘制矩形时）
      this.app.stage.on('pointermove', this.handleStagePointerMoveFunc)
    })
    // 鼠标松开（舞台内）
    this.app.stage.on('pointerup', this.finishDrawing.bind(this));
    // 鼠标松开（舞台外，如浏览器边缘）
    this.app.stage.on('pointerupoutside', this.finishDrawing.bind(this));

    // 键盘按键（如删除选中元素）
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if(!this.selectItem) return;
        if(this.selectItem instanceof TextGraphics){
          this.selectItem.text.visible = false;
          this.selectItem.handlerService.visibleHandler(false);
        }else{
          this.selectItem.visibleHandler(false);
          this.selectItem.graphic.visible = false;
        }
        this.elementList = this.elementList.filter(item => item.id !== this.selectItem!.id);
        this.historyService.onDo({
          type: 'delete',
          item: this.selectItem,
        })
        this.selectItem = null;
      }
    });
  }
}

export default EditorApp;

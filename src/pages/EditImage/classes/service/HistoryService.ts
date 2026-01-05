import EditorApp from '../EditorApp';
import type { 
  HistoryItemType,
  doType,
  GraphicsElementType
} from '../../types/index';
import MosaicGraphics from '../MosaicGraphics';
import TextGraphics from '../TextGraphics';
import RectGraphics from '../RectGraphics';
import EllipseGraphics from '../EllipseGraphics';
import ArrowGraphics from '../ArrowGraphics';
class HistoryService {
  private editor: EditorApp;
  private undoStack: HistoryItemType[] = []; // 历史记录列表
  private redoStack: HistoryItemType[] = []; // 重做记录列表
  constructor(editor: EditorApp) {
    this.editor = editor;
  }
  // undo redo操作
  doOperation(historyItem: HistoryItemType,action: doType){
    if(action === 'undo'){
      if(historyItem.type === 'add'){
        if(historyItem.item instanceof MosaicGraphics){
          historyItem.item.sprite!.visible = false;
        }else if(historyItem.item instanceof TextGraphics){
          historyItem.item.text.visible = false;
          historyItem.item.handlerService.visibleHandler(false);
        }else{
          (historyItem.item as GraphicsElementType).graphic.visible = false;
          historyItem.item.handlerService.visibleHandler(false);
        }
        this.editor.elementList = this.editor.elementList.filter((item) => item.id !== historyItem.item.id);
      }
      if(historyItem.type === 'delete'){
        if(historyItem.item instanceof TextGraphics){
          historyItem.item.text.visible = true;
        }else{
          (historyItem.item as GraphicsElementType).graphic.visible = true;
        }
      }
      if(historyItem.type === 'update'){
        if(historyItem.item instanceof TextGraphics){
          historyItem.item.textUpdate(historyItem.oldText!);
        }
      }
      if(historyItem.type === 'move'){
        if(historyItem.item instanceof TextGraphics){
          historyItem.item.setPosition(historyItem.oldPosition!.x, historyItem.oldPosition!.y);
          historyItem.item.handlerService.setPosition(historyItem.oldPosition!.x, historyItem.oldPosition!.y);
        }else{
          (historyItem.item as GraphicsElementType).setPosition(historyItem.oldPosition!.x, historyItem.oldPosition!.y);
          (historyItem.item as GraphicsElementType).handlerService.setPosition(historyItem.oldPosition!.x, historyItem.oldPosition!.y);
        }
      }
      if(historyItem.type === 'resize'){
        if(historyItem.item instanceof RectGraphics || historyItem.item instanceof EllipseGraphics || historyItem.item instanceof ArrowGraphics){
          historyItem.item.draw(historyItem.oldPoints![0], historyItem.oldPoints![1]);
        }
      }
      if(historyItem.type === 'sizeColor'){
        if('changeSizeColor' in historyItem.item){
          historyItem.item.changeSizeColor(historyItem.oldSizeColor!);
        }
      }
    }
    if(action === 'redo'){
      if(historyItem.type === 'add'){
        if(historyItem.item instanceof MosaicGraphics){
          historyItem.item.sprite!.visible = true;
        }else if(historyItem.item instanceof TextGraphics){
          historyItem.item.text.visible = true;
        }else{
          (historyItem.item as GraphicsElementType).graphic.visible = true;
        }
        this.editor.elementList.push(historyItem.item);
      }
      if(historyItem.type === 'delete'){
        if(historyItem.item instanceof TextGraphics){
          historyItem.item.text.visible = false;
        }else{
          (historyItem.item as GraphicsElementType).graphic.visible = false;
        }
      }
      if(historyItem.type === 'update'){
        if(historyItem.item instanceof TextGraphics){
          historyItem.item.text.text = historyItem.newText!;
        }
      }
      if(historyItem.type === 'move'){
        if(historyItem.item instanceof TextGraphics){
          historyItem.item.setPosition(historyItem.newPosition!.x, historyItem.newPosition!.y);
          historyItem.item.handlerService.setPosition(historyItem.newPosition!.x, historyItem.newPosition!.y);
        }else{
          (historyItem.item as GraphicsElementType).setPosition(historyItem.newPosition!.x, historyItem.newPosition!.y);
          (historyItem.item as GraphicsElementType).handlerService.setPosition(historyItem.newPosition!.x, historyItem.newPosition!.y);
        }
      }
      if(historyItem.type === 'resize'){
        if(historyItem.item instanceof RectGraphics || historyItem.item instanceof EllipseGraphics || historyItem.item instanceof ArrowGraphics){
          historyItem.item.draw(historyItem.newPoints![0], historyItem.newPoints![1]);
        }
      }
      if(historyItem.type === 'sizeColor'){
        if('changeSizeColor' in historyItem.item){
          historyItem.item.changeSizeColor(historyItem.newSizeColor!);
        }
      }
    }
  }
  // 撤销操作点击时
  undo(){
    if(!this.canUndo()) return;
    const item = this.undoStack.pop();
    this.doOperation(item!, 'undo');
    this.redoStack.push(item!);
    this.editor.emit('historyChange', {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    });
  }
  // 重做操作点击时
  redo(){
    if(!this.canRedo()) return;
    const item = this.redoStack.pop();
    this.doOperation(item!, 'redo');
    this.undoStack.push(item!);
    this.editor.emit('historyChange', {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    });
  }
  // 检查是否可以撤销
  canUndo(){
    return this.undoStack.length > 0;
  }
  // 检查是否可以重做
  canRedo(){
    return this.redoStack.length > 0;
  }
  // 当执行某个操作时 并添加到历史记录列表
  onDo(params: HistoryItemType){
    this.redoStack = [];
    this.undoStack.push(params);
    this.editor.emit('historyChange', {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    });
  }
}
export default HistoryService;
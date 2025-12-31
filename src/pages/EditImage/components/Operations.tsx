import { useCallback } from 'react';
import { Space, Tooltip } from 'antd';
import { 
  UpSquareOutlined,
  UpCircleOutlined,
  ArrowRightOutlined,
  BorderRightOutlined,
  DragOutlined,
  FontSizeOutlined, 
  EditOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons';
import { useStyles } from '../styles/index.style';
import { OperateType, fontSizeMap, colorMap } from '../constants/enum';
import type { SizeColorType } from '../types/index';
import { useImageEditorStore } from '../store/index';
import OperatePopover from './OperatePopover';
export default function Operations() {
  const {styles} = useStyles();
  const {currentEditor, currentOperate, setCurrentOperate, undoDisable, redoDisable} = useImageEditorStore();
  const handleOperateClick = useCallback((type: OperateType) => {
    if (currentOperate === type) {
      setCurrentOperate(null);
      return;
    }
    setCurrentOperate(type);
  }, [currentOperate, setCurrentOperate]);

  const handleRectChange = useCallback((value:SizeColorType) => {
    currentEditor?.setRectSizeColor(value);
  }, [currentEditor]);

  const handleCircleChange = useCallback((value:SizeColorType) => {
    currentEditor?.setEllipseSizeColor(value);
  }, [currentEditor]);

  const handleArrowChange = useCallback((value:SizeColorType) => {
    currentEditor?.setArrowSizeColor(value);
  }, [currentEditor]);

  const handlePencilChange = useCallback((value:SizeColorType) => {
    currentEditor?.setPencilSizeColor(value);
  }, [currentEditor]);

  const handleMosaicChange = useCallback((value:SizeColorType) => {
    currentEditor?.setMosaicSize(value.size);
  }, [currentEditor]);

  const handleTextChange = useCallback((value:SizeColorType) => {
    currentEditor?.setTextSizeColor(value);
    const textInput = document.getElementById('textInput') as HTMLDivElement;
    textInput.style.fontSize = `${fontSizeMap[value.size]}px`;
    textInput.style.color = colorMap[value.color];
  }, [currentEditor]);

  const handleUndo = useCallback(() => {
    if(undoDisable) return;
    currentEditor?.historyService.undo();
  }, [undoDisable, currentEditor]);

  const handleRedo = useCallback(() => {
    if(redoDisable) return;
    currentEditor?.historyService.redo();
  }, [redoDisable, currentEditor]);
  return (
    <div className={styles.OperationsContainer}>
      <Space size={50}>
        <div 
          className={`operate-item ${currentOperate === OperateType.DRAG ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.DRAG)}
        >
          <Tooltip placement="bottom" title="拖动">
            <DragOutlined />
          </Tooltip>
        </div>
        <div 
          className={`operate-item ${currentOperate === OperateType.RECT ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.RECT)}
        >
          <OperatePopover open={currentOperate === OperateType.RECT} type={OperateType.RECT} onChange={handleRectChange}>
            <Tooltip placement="bottom" title="矩形">
              <UpSquareOutlined />
            </Tooltip>
          </OperatePopover>
        </div>
        <div 
          className={`operate-item ${currentOperate === OperateType.CIRCLE ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.CIRCLE)}
        >
          <OperatePopover open={currentOperate === OperateType.CIRCLE} type={OperateType.CIRCLE} onChange={handleCircleChange}>
            <Tooltip placement="bottom" title="圆形">
              <UpCircleOutlined />
            </Tooltip>
          </OperatePopover>
        </div>
        <div 
          className={`operate-item ${currentOperate === OperateType.ARROW ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.ARROW)}
        >
          <OperatePopover open={currentOperate === OperateType.ARROW} type={OperateType.ARROW} onChange={handleArrowChange}>
            <Tooltip placement="bottom" title="箭头">
              <ArrowRightOutlined />
            </Tooltip>
          </OperatePopover>
        </div>
        <div 
          className={`operate-item ${currentOperate === OperateType.PENCIL ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.PENCIL)}
        >
          <OperatePopover open={currentOperate === OperateType.PENCIL} type={OperateType.PENCIL} onChange={handlePencilChange}>
            <Tooltip placement="bottom" title="绘制">
              <EditOutlined />
            </Tooltip>
          </OperatePopover>
        </div>
        <div 
          className={`operate-item ${currentOperate === OperateType.MOSAIC ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.MOSAIC)}
        >
          <OperatePopover open={currentOperate === OperateType.MOSAIC} type={OperateType.MOSAIC} onChange={handleMosaicChange}>
            <Tooltip placement="bottom" title="马赛克">
              <BorderRightOutlined />
            </Tooltip>
          </OperatePopover>
        </div>
        <div 
          className={`operate-item ${currentOperate === OperateType.TEXT ? 'active' : ''}`}
          onClick={() => handleOperateClick(OperateType.TEXT)}
        >
          <OperatePopover open={currentOperate === OperateType.TEXT} type={OperateType.TEXT} onChange={handleTextChange}>
            <Tooltip placement="bottom" title="文字">
              <FontSizeOutlined />
            </Tooltip>
          </OperatePopover>
        </div>
        <div 
          className={`operate-item do-item ${undoDisable ? 'disabled' : ''}`}
          onClick={() => handleUndo()}
        >
          <Tooltip placement="bottom" title="撤销">
            <UndoOutlined />
          </Tooltip>
        </div>
        <div 
          className={`operate-item do-item ${redoDisable ? 'disabled' : ''}`}
          onClick={() => handleRedo()}
        >
          <Tooltip placement="bottom" title="重做">
            <RedoOutlined />
          </Tooltip>
        </div>
      </Space>
    </div>
  );
}
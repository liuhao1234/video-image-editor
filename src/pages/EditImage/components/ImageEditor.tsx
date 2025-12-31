import { useRef, useEffect, useCallback } from 'react';
import EditorApp from '../classes/EditorApp.ts';
import { Button, Space } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import { useImageEditorStore } from '../store';
import { useStyles } from '../styles/index.style';
import { OperateType } from '../constants/enum';
import { calculateImageScale } from '../utils/index';
import type { PositionType, emitChangeParamsType } from '../types/index';

export default function ImageEditor() {
  const {
    currentEditor,
    setCurrentEditor,
    currentOperate,
    currentImage,
    currentImageScale, 
    currentImagePosition,
    setCurrentImagePosition,
    setCurrentImageScale, 
    currentImageSprite, 
    setCurrentImageSprite, 
    editorSize, 
    setEditorSize,
    setUndoDisable,
    setRedoDisable,
  } = useImageEditorStore();
  const imageEditorContainer = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const deltaXRef = useRef<number>(0);
  const deltaYRef = useRef<number>(0);
  const canvasPositionRef = useRef<PositionType>({x: 0, y: 0});
  const isDraggingRef = useRef<boolean>(false);
  const {styles} = useStyles();

  // 加载图片
  const loadImg = useCallback(async () => {
    if(!currentImage || !currentEditor) return;
    console.log('loadImg start')
    // 清除之前的注释
    currentEditor.clearAnnotation();
    console.log('loadImg', currentImage)
    // 加载图片
    await currentEditor.loadImg(currentImage.src);
    // 初始化图片位置
    setCurrentImagePosition({
      x: 0,
      y: 0,
    })
    // 初始化图片对象
    setCurrentImageSprite(currentEditor.sprite);
    console.log('loadImg end')
  }, [currentEditor, currentImage, setCurrentImagePosition, setCurrentImageSprite]);

  // 图片自适应
  const fitImage = useCallback(() => {
    if(!currentImageSprite) return;
    console.log('fitImage start')
    const scale = calculateImageScale(currentImageSprite, editorSize);
    console.log('scale', scale)
    // 如果容器能放下图片，则原始大小展示
    if(scale > 1){
      setCurrentImageScale(1);
      currentEditor?.setCurrentImageScale(1);
      console.log('fitImage end')
      return;
    }
    // 如果计算得出的缩放比例大于当前缩放比例，则使用当前缩放比例
    // if(scale > currentImageScale) return;
    setCurrentImageScale(scale);
    currentEditor?.setCurrentImageScale(scale);
    console.log('fitImage end')
  }, [currentEditor, currentImageSprite, editorSize, setCurrentImageScale]);

  // 图片缩放
  const handleImageZoom = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY;
    const scale = currentImageScale * (delta > 0 ? 0.9 : 1.1);
    if(scale < 0.1 || scale > 10) return;
    setCurrentImageScale(scale);
    currentEditor?.setCurrentImageScale(scale);
    textInputRef.current!.style.display = 'none'
  }, [currentEditor, currentImageScale, setCurrentImageScale]);

  // 重置图片
  const resetImage = useCallback((type: 'scale' | 'position') => {
    if(type === 'scale') {
      fitImage();
    }
    if(type === 'position') {
      setCurrentImagePosition({
        x: 0,
        y: 0,
      })
    }
  }, [fitImage, setCurrentImagePosition]);

  // 拖动图片
  const handleDragImage = useCallback((x: number, y: number) => {
    setCurrentImagePosition({
      x: canvasPositionRef.current.x + x,
      y: canvasPositionRef.current.y + y,
    })
  },[setCurrentImagePosition]);

  // resize 容器
  const resizeContainer = useCallback(() => {
    if(!imageEditorContainer.current) return;
    setEditorSize({
      width: imageEditorContainer.current.clientWidth,
      height: imageEditorContainer.current.clientHeight,
    })
  }, [setEditorSize]);

  // 保存图片
  const handleDownload = useCallback(() => {
    if(!currentEditor) return;
    currentEditor.saveImg();
  },[currentEditor]);

  // 查看数据
  const handlePrint = useCallback(() => {
    console.log(currentEditor)
  },[currentEditor]);

  // 保存标注
  const handleSaveAnnotation = useCallback(() => {
    if(!currentEditor) return;
    const annotation = currentEditor.annotationService.getAnnotation();
    localStorage.setItem('annotation', JSON.stringify(annotation));
    console.log(annotation)
  },[currentEditor]);

  // 渲染标注
  const handleRenderAnnotation = useCallback(() => {
    if(!currentEditor) return;
    const annotation = JSON.parse(localStorage.getItem('annotation') || '[]');
    currentEditor.annotationService.renderAnnotation(annotation);
  },[currentEditor]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 拖动
    if(currentOperate === OperateType.DRAG) {
      isDraggingRef.current = true;
      // 记录拖动开始位置
      startXRef.current = e.clientX
      startYRef.current = e.clientY 
      // 记录拖动开始位置
      canvasPositionRef.current = {
        ...currentImagePosition
      }
    };
  },[currentImagePosition, currentOperate]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if(!isDraggingRef.current) return;
    deltaXRef.current = (e.clientX - startXRef.current);
    deltaYRef.current = (e.clientY - startYRef.current);
    // 拖动
    if(currentOperate === OperateType.DRAG && isDraggingRef.current) {
      handleDragImage(deltaXRef.current, deltaYRef.current);
    };
  },[currentOperate, handleDragImage]);

  const handleMouseUp = useCallback(() => {
    if(currentOperate === null) return;
    // 拖动结束
    if(currentOperate === OperateType.DRAG && isDraggingRef.current){
      isDraggingRef.current = false;
    };
  },[currentOperate]);
  const onEditorChange = useCallback((params: emitChangeParamsType) => {
    setUndoDisable(!params.canUndo);
    setRedoDisable(!params.canRedo);
  },[setUndoDisable, setRedoDisable])
  // 初始化应用
  useEffect(() => {
    const editor = new EditorApp(canvasContainerRef.current);
    editor.on('change', (params) => {
      onEditorChange(params);
    })
    setCurrentEditor(editor);
  }, [setCurrentEditor, onEditorChange]);

  // 图片发生变化时，加载图片
  useEffect(() => {
    loadImg();
  }, [loadImg]);

  // 监听图片及编辑器大小变化，更新缩放比例
  useEffect(() => {
    fitImage();
  }, [fitImage]);

  // 操作类型发生变化时，更新操作类型
  useEffect(() => {
    if(!currentEditor) return;
    if(currentOperate === OperateType.DRAG){
      currentEditor.setOperateType(null);
      return;
    }
    currentEditor.setOperateType(currentOperate);
  }, [currentEditor, currentOperate]);

  // 绑定放大缩小及拖动事件
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [handleMouseMove, handleMouseUp]);

  // 监听窗口变化，更新编辑器大小
  useEffect(() => {
    resizeContainer();
    window.addEventListener('resize', resizeContainer)
    return () => {
      window.removeEventListener('resize', resizeContainer)
    }
  }, [resizeContainer]);
  return (
    <div className={styles.ImageEditorContainer} ref={imageEditorContainer}>
      <div
        className='canvas-container'
        id="canvasContainer"
        ref={canvasContainerRef}
        style={{
          transform: `translate(${currentImagePosition.x}px, ${currentImagePosition.y}px) scale(${currentImageScale})`,
        }}
        onWheel={handleImageZoom}
        onMouseDown={handleMouseDown}
      ></div>
      {currentImage && <div className="image-information">
        <div className="image-information-item">{Math.floor(currentImageScale*100)}% <span className="reset-icon" onClick={()=>resetImage('scale')}><RetweetOutlined /></span></div>
        <div className="image-information-item">X: {Math.floor(currentImagePosition.x)}, Y: {Math.floor(currentImagePosition.y)} <span className="reset-icon" onClick={()=>resetImage('position')}><RetweetOutlined /></span></div>
      </div>}
      <div className="btns">
        <Space>
          <Button type="primary" onClick={handleDownload}>下载</Button>
          <Button type="primary" onClick={handlePrint}>查看数据</Button>
          <Button type="primary" onClick={handleSaveAnnotation}>保存标注</Button>
          <Button type="primary" onClick={handleRenderAnnotation}>渲染标注</Button>
        </Space>
      </div>
      <div
        ref={textInputRef}
        contentEditable={true}
        className="text-input"
        id="textInput"
      ></div>
    </div>
  );
}
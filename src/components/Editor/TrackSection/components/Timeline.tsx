import { useRef, useMemo, useEffect,useCallback } from 'react';
import {useEditorStyles} from '@/components/Editor/editor.style';
import { drawTimeLine, getSelectFrame } from '@/utils/timelineUtils';
import type { UserConfig, CanvasConfig } from '@/utils/timelineUtils';
import { useVideoStore } from '@/store';
interface TimelineProps {
  start?: number;
  step: number;
  scale: number;
  focusPosition?: {
    start: number;
    end: number;
  } | null
  onClick?: (frameIndex: number) => void;
}
const Timeline: React.FC<TimelineProps> = ({start = 0, step = 30, scale = 0, focusPosition = {start: 0, end: 0}, onClick}) => {
  const canvasContextRef = useRef<CanvasRenderingContext2D>({} as CanvasRenderingContext2D);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const timeLineRef = useRef<HTMLCanvasElement>(null);
  const { setPlay, setPlayStartFrame, videoBaseInfo } = useVideoStore();
  const { styles } = useEditorStyles();
  const canvasConfigs = useMemo(() => ({
    bgColor: 'transparent', // 背景颜色
    ratio: window.devicePixelRatio || 1, // 设备像素比
    textSize: 12, // 字号
    textScale: 0.83, // 支持更小号字： 10 / 12
    lineWidth: 1, // 线宽
    // eslint-disable-next-line
    textBaseline: 'middle' as 'middle', // 文字对齐基线 (ts 中定义的textBaseLine是一个联合类型)
    // eslint-disable-next-line
    textAlign: 'center' as 'center', // 文字对齐方式
    longColor: 'rgba(255, 255, 255, 0.2)', // 长线段颜色
    shortColor: 'rgba(255, 255, 255, 0.2)', // 短线段颜色
    textColor: 'rgba(255, 255, 255, 0.2)', // 文字颜色
    subTextColor: 'rgba(255, 255, 255, 0.2)', // 小文字颜色
    focusColor: 'rgba(255, 255, 255, 0.6)' // 选中元素区间
  }), []);
  const canvasAttr = useRef({
    width: 0,
    height: 0
  });
  const canvasStyle = useRef({
    width: '0px',
    height: '0px'
  });
  const updateTimeLine = useCallback(() => {
    drawTimeLine(canvasContextRef.current, { start, step, scale, focusPosition } as UserConfig, { ...canvasAttr.current, ...canvasConfigs } as CanvasConfig);
  }, [canvasContextRef, start, step, scale, focusPosition, canvasConfigs]);
  // 设置 canvas 上下文环境
  const setCanvasContext = useCallback(() => {
    canvasContextRef.current = timeLineRef.current?.getContext('2d') || {} as CanvasRenderingContext2D;
    canvasContextRef.current.font = `${canvasConfigs.textSize * canvasConfigs.ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "WenQuanYi Zen Hei", "Microsoft YaHei", Arial, sans-serif`;
    canvasContextRef.current.lineWidth = canvasConfigs.lineWidth;
    canvasContextRef.current.textBaseline = canvasConfigs.textBaseline;
    canvasContextRef.current.textAlign = canvasConfigs.textAlign;
  }, [canvasConfigs]);
  // 设置 canvas 大小
  const setCanvasRect = useCallback(() => {
    const { width, height } = canvasContainerRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    canvasAttr.current = { 
      width: width * canvasConfigs.ratio, 
      height: height * canvasConfigs.ratio
    };
    canvasStyle.current = {
      width: `${width}px`,
      height: `${height}px`
    };
    setTimeout(() => {
      setCanvasContext();
      updateTimeLine();
    });
  }, [canvasConfigs, setCanvasContext, updateTimeLine]);
  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const offset = event.nativeEvent.offsetX;
    const frameIndex = getSelectFrame(start + offset, scale, step);
    setPlay(false);
    onClick?.(frameIndex);
    // 延迟移动指针
    setTimeout(() => {
      if(videoBaseInfo.duration && frameIndex > Number(videoBaseInfo.duration)*30){
        setPlayStartFrame(Number(videoBaseInfo.duration)*30);
        return;
      }
      if(frameIndex < 10){
        setPlayStartFrame(0);
        return
      }
      setPlayStartFrame(frameIndex);
    }, 300);
  }
  useEffect(() => {
    setCanvasRect();
    window.addEventListener('resize', setCanvasRect, false);
  }, [setCanvasRect]);
  useEffect(() => {
    setCanvasRect();
  }, [start, step, scale, focusPosition, canvasConfigs, setCanvasRect]);
  return (
    <div ref={canvasContainerRef} className={styles.timeline}>
      <canvas 
        ref={timeLineRef} 
        style={canvasStyle.current}
        {...canvasAttr.current}
        onClick={handleClick}
      />
    </div>
  )
}
export default Timeline;
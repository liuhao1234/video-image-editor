import { useEffect, useRef } from 'react';
import { getVideoContainerSize } from "@/utils/videoUtils";
import { useVideoStore } from "@/store";

export default function useResize() {
  const { setVideoContainerSize } = useVideoStore();
  const isResizing = useRef(false);
  const resizerType = useRef<Resizer.resizerType>('tool');
  const contentRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const topContentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startPos = useRef(0);
  const startSize = useRef(0);
  const minSize = 360;
  const getSize = () => {
    const { width, height } = getVideoContainerSize();
    setVideoContainerSize({ width, height })
  };
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    type: Resizer.resizerType,
  ) => {
    resizerType.current = type;
    isResizing.current = true;
    document.body.style.userSelect = 'none';
    if (type === 'tool') {
      startPos.current = e.pageX;
      startSize.current = toolRef.current?.offsetWidth || 0;
    }
    if (type === 'properties') {
      startPos.current = e.pageX;
      startSize.current = propertiesRef.current?.offsetWidth || 0;
    }
    if (type === 'track') {
      startPos.current = e.pageY;
      startSize.current = trackRef.current?.offsetHeight || 0;
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    let dt = 0;
    let newSize = 0;
    if (resizerType.current === 'tool') {
      dt = e.pageX - startPos.current;
      newSize = startSize.current + dt;
      // 计算新宽度（初始宽度 + 移动距离）
      if (newSize < minSize) {
        newSize = minSize;
      }
      const topContentWidth = topContentRef.current?.offsetWidth || 0;
      const propertiesWidth = propertiesRef.current?.offsetWidth || 0;
      if (newSize > topContentWidth - propertiesWidth - minSize) {
        newSize = topContentWidth - propertiesWidth - minSize;
      }
      if (toolRef.current) {
        toolRef.current.style.width = `${newSize}px`;
      }
    }
    if (resizerType.current === 'properties') {
      dt = e.pageX - startPos.current;
      // 计算新高度（初始高度 + 移动距离）
      newSize = startSize.current - dt;
      if (newSize < minSize) {
        newSize = minSize;
      }
      const topContentWidth = topContentRef.current?.offsetWidth || 0;
      const toolWidth = toolRef.current?.offsetWidth || 0;
      if (newSize > topContentWidth - toolWidth - minSize) {
        newSize = topContentWidth - toolWidth - minSize;
      }
      if (propertiesRef.current) {
        propertiesRef.current.style.width = `${newSize}px`;
      }
    }
    if (resizerType.current === 'track') {
      dt = e.pageY - startPos.current;
      // 计算新高度（初始高度 + 移动距离）
      newSize = startSize.current - dt;
      if (newSize < minSize) {
        newSize = minSize;
      }
      const contentHeight = contentRef.current?.offsetHeight || 0;
      if (newSize > contentHeight - minSize) {
        newSize = contentHeight - minSize;
      }
      if (trackRef.current) {
        trackRef.current.style.height = `${newSize}px`;
      }
    }
    getSize()
  };
  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.userSelect = 'auto';
  };
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    isResizing,
    resizerType,
    contentRef,
    toolRef,
    previewRef,
    propertiesRef,
    topContentRef,
    trackRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}

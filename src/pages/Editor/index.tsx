import { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import useResize from "@/hooks/resizeHook";
import Header from "@/components/Editor/Header";
import ToolSection from "@/components/Editor/ToolSection";
import PropsSection from "@/components/Editor/PropsSection";
import PreviewSection from "@/components/Editor/PreviewSection";
import ExportModal from "@/components/Editor/ExportModal";
import TrackSection from "@/components/Editor/TrackSection";
import { useStyles } from "./index.style";
import { useFFmpegStore } from "@/store";
import { getVideoContainerSize } from "@/utils/videoUtils";
import { useVideoStore } from "@/store";

const VideoEditor: React.FC = () => {
  const { setVideoContainerSize } = useVideoStore();
  const { styles } = useStyles();
  const { loadFFmpeg } = useFFmpegStore();
  const {
    contentRef,
    toolRef,
    previewRef,
    propertiesRef,
    topContentRef,
    trackRef,
    handleMouseDown,
  } = useResize();
  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);
  // 监控播放区域大小
  const getSize = () => {
    const { width, height } = getVideoContainerSize();
    setVideoContainerSize({ width, height })
  }
  useEffect(()=>{
    getSize()
    window.addEventListener('resize', getSize)
  },[])
  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
    }}>
      <div className={styles.VideoEditorContainer}>
        <div className="header">
          <Header />
        </div>
        <div className="content" ref={contentRef}>
          <div ref={topContentRef} className="content-top">
            <div ref={toolRef} className="section section-tool">
              <ToolSection />
            </div>
            <div
              className="resizer resizer-vertical"
              onMouseDown={(e) => handleMouseDown(e, "tool")}
            ></div>
            <div ref={previewRef} className="section section-preview">
              <PreviewSection />
            </div>
            <div
              className="resizer resizer-vertical"
              onMouseDown={(e) => handleMouseDown(e, "properties")}
            ></div>
            <div ref={propertiesRef} className="section section-properties">
              <PropsSection />
            </div>
          </div>
          <div
            className="resizer resizer-horizontal"
            onMouseDown={(e) => handleMouseDown(e, "track")}
          ></div>
          <div ref={trackRef} className="section section-track">
            <TrackSection />
          </div>
        </div>
      </div>
      <ExportModal />
    </ConfigProvider>
  );
};

export default VideoEditor;

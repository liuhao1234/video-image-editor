import { useMemo } from 'react';
import { Popover } from 'antd';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import { secondsToTime } from '@/utils/videoUtils';
import { useVideoStore } from '@/store';
import { useEditorStyles } from '@/components/Editor/editor.style';

const VideoControls: React.FC = () => {
  const {styles} = useEditorStyles();
  const {
    play,
    setPlay,
    videoFile, 
    playStartFrame,
    frameCount,
    frameRate,
    canvasRatio,
    setCanvasRatio,
    videoBaseInfo,
  } = useVideoStore();
  const radioList = useMemo(() => {
    const {ratioW, ratioH} = videoBaseInfo || {};
    return [{
      label: '原始',
      value: `${ratioW}:${ratioH}`,
    },{
      label: '16:9',
      value: '16:9',
    },{
      label: '9:16',
      value: '9:16',
    },{
      label: '4:3',
      value: '4:3',
    }]
  }, [videoBaseInfo])
  const currentRatio = useMemo(() => {
    return radioList.find(item => item.value === canvasRatio);
  }, [canvasRatio, radioList])
  const handlePlayPause = () => {
    if(!videoFile) return; // 视频未加载
    setPlay(!play);
  }
  return <div className="preview-controls">
    <div className="left">
      <span className="time">{secondsToTime(playStartFrame/frameRate)} / {secondsToTime(frameCount/frameRate)}</span>
    </div>
    <div className="middle">
      <div className="play-pause" onClick={handlePlayPause}>
        {play?<PauseCircleFilled />:<PlayCircleFilled />}
      </div>
    </div>
    <div className="right">
      {currentRatio && <div className="video-ratio">
        <Popover 
          content={
            <div className={styles.ratioList}>
              {radioList.map(item => (
                <div onClick={() => setCanvasRatio(item.value)} className="ratio-item" key={item.value}>{item.label}</div>
              ))}
            </div>
          }
        >
          <span>{currentRatio?.label}</span>
        </Popover>
      </div>}
    </div>
  </div>
}

export default VideoControls;
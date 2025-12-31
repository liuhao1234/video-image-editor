import { useState,useCallback,useEffect, useRef } from 'react';
import { Tooltip, Slider } from 'antd';
import { 
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  SplitCellsOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PicCenterOutlined,
  PictureOutlined,
  // EyeOutlined,
  // UnlockOutlined
  VideoCameraOutlined,
} from '@ant-design/icons';
import { sliderStyle } from '@/constants';
import {useEditorStyles} from '@/components/Editor/editor.style';
import Timeline from './components/Timeline';
import TrackPlayPoint from './components/TrackPlayPoint';
import { getGridPixel } from '@/utils/timelineUtils';
import { useTrackStore,useVideoStore } from '@/store';

import VideoItem from './components/VideoItem';
import ImageItem from './components/ImageItem';
import type { VideoTrackItem } from '@/store/trackStore';
import { v4 as uuidv4 } from 'uuid';
const TrackSection: React.FC = () => {
  const { styles } = useEditorStyles();
  const trackListRef = useRef<HTMLDivElement>(null);
  const { selectTrackItem,trackScale,setTrackScale,trackList,setTrackList,setSelectTrackItem } = useTrackStore();
  const { videoFile,frameCount,setFrameCount,playStartFrame } = useVideoStore();
  const [startX, setStartX] = useState<number>(0);
  const handleScaleChange = useCallback((value: number) => {
    if(value<0 || value>100){
      return;
    }
    setTrackScale(value);
  },[setTrackScale])
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY;
      if(delta > 0){
        handleScaleChange(trackScale-10);
      }else{
        handleScaleChange(trackScale+10);
      }
    }
  },[trackScale,handleScaleChange])
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    setStartX(target.scrollLeft);
  },[setStartX])
  const handleSplitVideo = useCallback(() => {
    if(!selectTrackItem) return
    const splitVideo = [{
      ...(selectTrackItem as VideoTrackItem),
      end: playStartFrame,
      id: uuidv4(),
    },{
      ...(selectTrackItem as VideoTrackItem),
      start: playStartFrame,
      id: uuidv4(),
    }]
    const newTrackList = trackList.map(item=>{
      if(item.type === 'video'){
        const index = item.list.findIndex(videoItem => videoItem.id === selectTrackItem.id);
        if(index !== -1){
          item.list.splice(index,1,...splitVideo);
        }
      }
      return item
    })
    setTrackList(newTrackList);
    setSelectTrackItem(null);
  },[selectTrackItem, playStartFrame, trackList, setTrackList, setSelectTrackItem])
  const handleDeleteTrackItem = useCallback(() => {
    if(!selectTrackItem) return
    const newTrackList = trackList.map(item=>{
      if(item.type === selectTrackItem.type){
        const index = item.list.findIndex(videoItem => videoItem.id === selectTrackItem.id);
        if(index !== -1){
          item.list.splice(index,1);
        }
        const newFrameCount = item.list.reduce((acc,item)=>acc+(item.end-item.start),0);
        setFrameCount(newFrameCount);
      }
      return item
    })
    setTrackList(newTrackList);
    setSelectTrackItem(null);
  },[selectTrackItem, trackList, setTrackList, setSelectTrackItem, setFrameCount])
  useEffect(()=>{
    let node = null;
    if(trackListRef.current){
      node = trackListRef.current;
    }
    if(node){
      node.addEventListener('wheel',handleWheel,{passive:false});
    }
    return () => {
      if(node){
        node.removeEventListener('wheel',handleWheel);
      }
    }
  },[handleWheel])
  
  return (
    <div className={styles.trackSection}>
      <header className={`${styles.sectionHeader} ${styles.trackSectionHeader} bg-none`}>
        <div className="left-section">
          <div className={styles.headerItem}>
            <Tooltip placement="bottom" title="撤销">
              <i><UndoOutlined /></i>
            </Tooltip>
          </div>
          <div className={`${styles.headerItem} disabled`} >
            <Tooltip placement="bottom" title="重做">
              <i><RedoOutlined /></i>
            </Tooltip>
          </div>
          <div 
            className={`${styles.headerItem} ${playStartFrame > (selectTrackItem as VideoTrackItem)?.start && playStartFrame < (selectTrackItem as VideoTrackItem)?.end ? '' : 'disabled'}`}
            onClick={handleSplitVideo}
          >
            <Tooltip placement="bottom" title="分割">
              <i><SplitCellsOutlined /></i>
            </Tooltip>
          </div>
          <div 
            className={`${styles.headerItem} ${selectTrackItem ? '' : 'disabled'}`}
            onClick={handleDeleteTrackItem}
          >
            <Tooltip placement="bottom" title="删除">
              <i><DeleteOutlined /></i>
            </Tooltip>
          </div>
        </div>
        <div className="right-section">
          <Tooltip placement="bottom" title="轨道居中">
            <span className='btn-center'><PicCenterOutlined /></span>
          </Tooltip>
          <div className="scale">
            <span onClick={() => handleScaleChange(trackScale-10)}><ZoomOutOutlined /></span>
            <div className='slider-item'>
              <Slider
                tooltip={{open:false}}
                value={trackScale}
                min={0}
                max={100}
                step={10}
                styles={sliderStyle}
                onChange={handleScaleChange}
              />
            </div>
            <span onClick={() => handleScaleChange(trackScale+10)}><ZoomInOutlined /></span>
          </div>
        </div>
      </header>
      <section className={`${styles.sectionContent} ${styles.trackSectionContent} padding-none`}>
        <div className="left-content">
          {trackList.map((item) => (
            <div key={item.id} className={`track-icon ${item.type}`}>
              {item.type === 'video' ? <VideoCameraOutlined /> : <PictureOutlined />}
            </div>
          ))}
        </div>
        <div className="right-content" ref={trackListRef}>
          <Timeline
            start={startX}
            step={30}
            scale={trackScale}
            focusPosition={null}
          />
          {videoFile && <TrackPlayPoint start={startX} />}
          <div className={`${styles.trackListContainer} ${styles.customScroll}`} onScroll={handleScroll}>
            <div className="track-list" style={{width: `${getGridPixel(trackScale, frameCount+200)}px`}}>
              {trackList.map((item) => (
                <div key={item.id} className={`track-line ${item.type}`}>
                  {item.type === 'video' ? <VideoItem data={item} /> : <ImageItem data={item} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default TrackSection;
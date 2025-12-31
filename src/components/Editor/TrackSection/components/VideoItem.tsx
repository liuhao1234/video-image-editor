import { VideoCameraOutlined } from '@ant-design/icons';
import { useTrackStore, useVideoStore } from '@/store';
import type { TrackLine,VideoTrackItem } from '@/store/trackStore';
import { secondsToTime } from '@/utils/videoUtils';
import { getGridPixel } from '@/utils/timelineUtils';
import TrackHandler from './TrackHandler';

const VideoItem: React.FC<{ data: TrackLine }> = ({ data }) => {
  const {list} = data
  const { trackScale,selectTrackItem,setSelectTrackItem } = useTrackStore();
  const { videoBaseInfo,frameRate } = useVideoStore();
  const handleVideoClick = (item: VideoTrackItem) => {
    setSelectTrackItem(item)
  }
  return <>
    {list.map((item) => (
      <div 
        key={item.id} 
        className={`track-item video ${selectTrackItem?.id === item.id ? 'selected' : ''}`}
        style={{width: `${getGridPixel(trackScale, item.end - item.start)}px`}}
        onClick={()=>handleVideoClick(item as VideoTrackItem)}
      >
        <TrackHandler data={item} />
        <div className='title'>
          <span>{item.id}</span>
          <span>{secondsToTime((item.end - item.start)/frameRate)}</span>
        </div>
        <div className="frame-images">
          <span><VideoCameraOutlined /></span>
          <span>{videoBaseInfo.name}</span>
        </div>
      </div>
    ))}
  </>
};
export default VideoItem;
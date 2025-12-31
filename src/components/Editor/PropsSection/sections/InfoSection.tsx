import { useVideoStore } from '@/store/videoStore';
import { Descriptions } from 'antd';
import { secondsToTime } from '@/utils/videoUtils';

interface InfoSectionProps {
  style: React.CSSProperties
}

const InfoSection: React.FC<InfoSectionProps> = ({ style }) => {
  const { videoBaseInfo,frameRate } = useVideoStore();
  const { name, type, duration, dpiW, dpiH, ratioW, ratioH } = videoBaseInfo || {};
  const items = [{
    key: 'name',
    label: '视频名称',
    children: name || '-',
  },{
    key: 'type',
    label: '视频类型',
    children: type || '-',
  },{
    key: 'duration',
    label: '视频时长',
    children: duration ? secondsToTime(duration): '-',
  },{
    key: 'dpi',
    label: '分辨率',
    children: dpiW && dpiH ? `${dpiW}x${dpiH}` : '-',
  },{
    key: 'ratio',
    label: '宽高比',
    children: ratioW && ratioH ? `${ratioW}:${ratioH}` : '-',
  },{
    key: 'fps',
    label: '帧率',
    children: duration? frameRate : '-',
  }];
  return (
    <div style={ style }>
      <Descriptions
        column={1}
        items={items}
      />
    </div>
  )
}
export default InfoSection;

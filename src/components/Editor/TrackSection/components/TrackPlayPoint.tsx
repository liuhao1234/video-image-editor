import {useEditorStyles} from '@/components/Editor/editor.style';
import { useVideoStore,useTrackStore } from '@/store';
import { getGridPixel } from '@/utils/timelineUtils';
import { useMemo } from 'react';

const TrackPlayPoint: React.FC<{start: number}> = ({start}) => {
  const { styles } = useEditorStyles();
  const { playStartFrame } = useVideoStore();
  const { trackScale } = useTrackStore();
  const trackStyle = useMemo(() => {
    return {
      transform: `translate(${getGridPixel(trackScale, playStartFrame)-start}px, 0px)`,
      transition: 'all 0.3s linear',
    };
  }, [trackScale, playStartFrame, start]);
  return (
    <div className={styles.trackPlayPoint} style={trackStyle}>
      <div className="handler"></div>
    </div>
  )
}
export default TrackPlayPoint;
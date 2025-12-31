import type { TrackLine } from '@/store/trackStore';

const ImageItem: React.FC<{ data: TrackLine }> = ({ data }) => {
  return (
    <div className='track-item image'>{data.id}</div>
  );
};
export default ImageItem;
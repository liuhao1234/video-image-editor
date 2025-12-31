import { Button } from 'antd';
import { useRef } from 'react';
import { useVideoStore } from "@/store";
import { useEditorStyles } from '@/components/Editor/editor.style';
interface VideoSectionProps {
  style: React.CSSProperties
}

const VideoSection: React.FC<VideoSectionProps> = ({ style }) => {
  const { styles } = useEditorStyles();
  const { 
    videoBaseInfo, 
    setVideoBaseInfo, 
    setVideoFile, 
  } = useVideoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => {
    fileInputRef.current?.click();
  }
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoBaseInfo({
        ...videoBaseInfo,
        name: file.name,
        type: file.type,
      });
    }
  }
  return (
    <div className={styles.videoSection} style={ style }>
      <input
        ref={fileInputRef}
        type='file'
        style={{visibility:'hidden',width:0,height:0,}}
        onChange={onFileChange}
      />
      <Button 
        className={styles.btnNormal}
        size='small' 
        color="cyan" 
        variant="solid" 
        onClick={handleFileClick}
      >导入</Button>
    </div>
  )
}
export default VideoSection;
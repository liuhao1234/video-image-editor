import {useEditorStyles} from '@/components/Editor/editor.style';
import { PlaySquareOutlined, FontSizeOutlined, PictureOutlined, ReadOutlined } from '@ant-design/icons';
import { ToolTab } from '@/constants/enum';
import { useEditorStore } from '@/store';
import VideoSection from './sections/VideoSection';
import TextSection from './sections/TextSection';
import ImageSection from './sections/ImageSection';
import CaptionSection from './sections/CaptionSection';

const ToolSection: React.FC = () => {
  const { styles } = useEditorStyles();
  const { toolActive, setToolActive } = useEditorStore();
  return (
    <div className={styles.toolSection}>
      <header className={styles.sectionHeader}>
        <div className={`${styles.headerItem} ${toolActive === ToolTab.video ? 'active' : ''}`} onClick={() => setToolActive(ToolTab.video)}>
          <i><PlaySquareOutlined /></i>
          <span className='text'>视频</span>
        </div>
        <div className={`${styles.headerItem} ${toolActive === ToolTab.image ? 'active' : ''}`} onClick={() => setToolActive(ToolTab.image)}>
          <i><PictureOutlined /></i>
          <span className='text'>贴纸</span>
        </div>
        <div className={`${styles.headerItem} ${toolActive === ToolTab.text ? 'active' : ''}`} onClick={() => setToolActive(ToolTab.text)}>
          <i><FontSizeOutlined /></i>
          <span className='text'>文本</span>
        </div>
        <div className={`${styles.headerItem} ${toolActive === ToolTab.caption ? 'active' : ''}`} onClick={() => setToolActive(ToolTab.caption)}>
          <i><ReadOutlined /></i>
          <span className='text'>字幕</span>
        </div>
      </header>
      <section className={styles.sectionContent}>
        <VideoSection style={{display: toolActive === ToolTab.video ? 'block' : 'none'}} />
        <TextSection style={{display: toolActive === ToolTab.text ? 'block' : 'none'}} />
        <ImageSection style={{display: toolActive === ToolTab.image ? 'block' : 'none'}} />
        <CaptionSection style={{display: toolActive === ToolTab.caption ? 'block' : 'none'}} />
      </section>
    </div>
  )
}
export default ToolSection;

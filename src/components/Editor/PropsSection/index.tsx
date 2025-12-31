import {useEditorStyles} from '@/components/Editor/editor.style';
import { OrderedListOutlined, BgColorsOutlined } from '@ant-design/icons';
import { useEditorStore } from '@/store';
import { PropTab } from '@/constants/enum';
import InfoSection from './sections/InfoSection';
import AdjustSection from './sections/AdjustSection';

const PropsSection: React.FC = () => {
  const { styles } = useEditorStyles();
  const { propActive, setPropActive } = useEditorStore();
  return (
    <div className={styles.propsSection}>
      <header className={styles.sectionHeader}>
        <div className={`${styles.headerItem} ${propActive === PropTab.info ? 'active':''}`} onClick={() => setPropActive(PropTab.info)}>
          <i><OrderedListOutlined /></i>
          <span className='text'>信息</span>
        </div>
        <div className={`${styles.headerItem} ${propActive === PropTab.adjust ? 'active':''}`} onClick={() => setPropActive(PropTab.adjust)}>
          <i><BgColorsOutlined /></i>
          <span className='text'>调整</span>
        </div>
      </header>
      <section className={styles.sectionContent}>
        <InfoSection style={{display: propActive === PropTab.info ? 'block' : 'none'}}/>
        <AdjustSection style={{display: propActive === PropTab.adjust ? 'block' : 'none'}}/>
      </section>
    </div>
  )
}
export default PropsSection;

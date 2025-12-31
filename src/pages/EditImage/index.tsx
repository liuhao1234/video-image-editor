import { useStyles } from '@/pages/EditImage/styles/index.style';
import ImageList from '@/pages/EditImage/components/ImageList';
import ImageEditor from '@/pages/EditImage/components/ImageEditor';
import Operations from '@/pages/EditImage/components/Operations';

export default function EditImage() {
  const {styles} = useStyles();
  return (
    <div className={styles.EditorContainer}>
      <div className='img-list-section'>
        <ImageList />
      </div>
      <div className="main-content">
        <div className="img-preview-section">
          <ImageEditor />
        </div>
        <div className="operations-section">
          <Operations />
        </div>
      </div>
    </div>
  );
}
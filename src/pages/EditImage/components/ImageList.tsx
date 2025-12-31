import { useCallback } from 'react';
import { imageListData } from '../constants/data';
import { useStyles } from '../styles/index.style';
import { useImageEditorStore } from '../store/index';
import type { ImageDataType } from '../types';
export default function ImageList() {
  const {styles} = useStyles();
  const {currentImage, setCurrentImage} = useImageEditorStore();
  const handleImageClick = useCallback((item: ImageDataType) => {
    setCurrentImage(item);
  }, [setCurrentImage]);
  return (
    <div className={styles.ImgListContainer}>
      {imageListData.map((item) => (
        <div 
          className={`img-item ${currentImage?.id === item.id ? 'active' : ''}`} 
          key={item.id} 
          onClick={() => handleImageClick(item)}
        >
          <img src={item.src}/>
        </div>
      ))}
    </div>
  );
}

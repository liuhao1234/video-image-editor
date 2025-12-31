import { useEditorStyles } from '@/components/Editor/editor.style';
import { PlusCircleFilled } from '@ant-design/icons';
import testImg from '@/assets/images/test.jpg';
import { useVideoStore } from '@/store';
import { Assets, Sprite } from 'pixi.js';

interface ImageSectionProps {
  style: React.CSSProperties
}

const ImageSection: React.FC<ImageSectionProps> = ({ style }) => {
  const { pixiVideo } = useVideoStore();
  const { styles } = useEditorStyles();
  const imageList = [testImg];
  let dragTarget = null;
  
  function onDragStart() {
    dragTarget = this
    if(pixiVideo){
      pixiVideo.stage.on('pointermove', onDragMove);
    }
  }
  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.parent?.toLocal(event.global, undefined, dragTarget.position);
      console.log('onDragMove',dragTarget);
    }
  }
  function onDragEnd() {
    if (dragTarget) {
      pixiVideo?.stage.off('pointermove', onDragMove);
      dragTarget = null;
    }
  }
  const handleAddImage = async () => {
    console.log('add image');
    console.log(pixiVideo);
    const texture = await Assets.load(testImg);
    const sprite = new Sprite(texture);
    if(pixiVideo){
      pixiVideo.stage.addChild(sprite);
      pixiVideo.stage.eventMode = 'static';
      pixiVideo.stage.hitArea = pixiVideo.screen;
      pixiVideo.stage.on('pointerup', onDragEnd);
      pixiVideo.stage.on('pointerupoutside', onDragEnd);
    }
    sprite.eventMode = 'static'
    sprite.anchor.set(0.5);
    sprite.position.set(200, 100);
    sprite.on('pointerdown', onDragStart, sprite);
  }
  return (
    <div style={ style } className={styles.imageSection}>
      {
        imageList.map((item) => (
          <div className="image-item" key={item}>
            <img src={item} alt="" />
            <div className='add-btn' onClick={handleAddImage}><PlusCircleFilled /></div>
          </div>
        ))
      }
    </div>
  )
}
export default ImageSection;
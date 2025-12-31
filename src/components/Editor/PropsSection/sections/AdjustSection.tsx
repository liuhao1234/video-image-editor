import { useEditorStyles } from '@/components/Editor/editor.style';
import AdjustItem from '@/components/Editor/PropsSection/components/AdjustItem';
import { Space } from 'antd';
import { useVideoStore } from '@/store/videoStore';
import { getColorMatrixFilterValue } from '@/utils/videoUtils';

interface AdjustSectionProps {
  style: React.CSSProperties
}

const AdjustSection: React.FC<AdjustSectionProps> = ({ style }) => {
  const { styles } = useEditorStyles();
  const { videoAdjustInfo, setVideoAdjustInfo } = useVideoStore();
  const handleBrightnessChange = (val: number) => {
    console.log('handleBrightnessChange', val);
    // 取值范围0~2，1为原始亮度，0为黑色，2为白色
    const range = [0,2]
    const defaultVal = 1
    const result = getColorMatrixFilterValue(val, range, defaultVal)
    console.log('handleBrightnessChange', result)
    setVideoAdjustInfo({ ...videoAdjustInfo, brightness: result });
  }
  const handleContrastChange = (val: number) => {
    const range = [0,2]
    const defaultVal = 1
    const result = getColorMatrixFilterValue(val, range, defaultVal)
    console.log('handleContrastChange', result);
    setVideoAdjustInfo({ ...videoAdjustInfo, contrast: result });
  }
  const handleSaturationChange = (val: number) => {
    const range = [0,2]
    const defaultVal = 1
    const result = getColorMatrixFilterValue(val, range, defaultVal)
    console.log('handleSaturationChange', result);
    setVideoAdjustInfo({ ...videoAdjustInfo, saturation: result });
  }
  const handleSharpnessChange = (val: number) => {
    const range = [0,100]
    const defaultVal = 0
    const result = getColorMatrixFilterValue(val, range, defaultVal)
    console.log('handleSharpnessChange', result);
    setVideoAdjustInfo({ ...videoAdjustInfo, sharpness: result });
  }
  return (
    <div className={styles.adjustSection} style={ style }>
      <Space direction='vertical' style={{width:'100%'}}>
        <AdjustItem title='亮度' defaultValue={videoAdjustInfo.brightness as number} onChange={handleBrightnessChange} />
        <AdjustItem title='对比度' defaultValue={videoAdjustInfo.contrast as number} onChange={handleContrastChange} />
        <AdjustItem title='饱和度' defaultValue={videoAdjustInfo.saturation as number} onChange={handleSaturationChange} />
        <AdjustItem title='锐化' defaultValue={videoAdjustInfo.sharpness as number} onChange={handleSharpnessChange} />
      </Space>
    </div>
  )
}
export default AdjustSection;
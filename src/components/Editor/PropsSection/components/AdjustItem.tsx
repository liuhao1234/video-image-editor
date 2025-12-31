import { useEditorStyles } from '@/components/Editor/editor.style';
import { sliderStyle } from '@/constants';
import { Slider,InputNumber } from 'antd';
import { useState } from 'react';
import { useVideoStore } from '@/store';

interface AdjustItemProps {
  title: string;
  defaultValue?: number;
  onChange: (val: number) => void;
}
const AdjustItem: React.FC<AdjustItemProps> = ({ title, defaultValue=0, onChange }) => {
  const { setPlay } = useVideoStore();
  const { styles } = useEditorStyles();
  const [value, setValue] = useState(defaultValue);
  const handleChange = (val: number) => {
    setPlay(false);
    setValue(val);
    onChange(val);
  }
  return (
    <div className={styles.adjustSliderItem}>
      <span className="text">{title}</span>
      <div className="slider-group">
        <div className='slider-item'>
          <Slider
            tooltip={{open:false}}
            min={-50}
            max={50}
            value={value}
            defaultValue={defaultValue}
            styles={sliderStyle}
            onChange={handleChange}
          />
        </div>
        <InputNumber
          size='small'
          className='number-input'
          min={-50}
          max={50}
          value={value}
          defaultValue={0}
          onChange={(val)=>handleChange(val as number)}
        />
      </div>
    </div>
  );
};
export default AdjustItem;

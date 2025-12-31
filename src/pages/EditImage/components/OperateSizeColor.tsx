import { Select } from 'antd';
import { useStyles } from '../styles/index.style';
import type { SizeColorType } from '../types/index';
import { OperateType,OperateSize, OperateColor, OperateSizeText } from '../constants/enum';
import { useState, useEffect } from 'react';
interface OperateSizeColorProps {
  type?: OperateType;
  onChange: (value:SizeColorType) => void;
}

export default function OperateSizeColor({type, onChange}: OperateSizeColorProps) {
  const {styles} = useStyles();
  const [currentSize, setCurrentSize] = useState<OperateSize>(OperateSize.MEDIUM);
  const [currentColor, setCurrentColor] = useState<OperateColor>(OperateColor.RED);
  useEffect(() => {
    onChange({size: currentSize, color: currentColor});
  }, [currentSize, currentColor, onChange]);
  return (
    <div className={styles.OperateSizeColorContainer} onClick={(e) => e.stopPropagation()}>
      {type === OperateType.TEXT ? <div className="size">
        <Select
          options={Object.keys(OperateSize).map((key) => {
            const value = OperateSize[key as keyof typeof OperateSize];
            return {
              label: OperateSizeText[value],
              value: value,
            }
          })}
          value={currentSize}
          onChange={(value) => {
            setCurrentSize(value);
          }}
        />
      </div>:
      <div className="size">
        {Object.keys(OperateSize).map((key) => {
          const value = OperateSize[key as keyof typeof OperateSize];
          return <div
            key={key}
            className={`size-item ${value} ${currentSize === value ? 'active' : ''}`}
            onClick={() => setCurrentSize(value)}
          >
          </div>
        })}
      </div>}
      {type !== OperateType.MOSAIC && <div className="color">
        {Object.keys(OperateColor).map((key) => {
          const value = OperateColor[key as keyof typeof OperateColor];
          return <div
            key={key}
            className={`color-item ${value} ${currentColor === value ? 'active' : ''}`}
            onClick={() => setCurrentColor(value)}
          ></div>
        })}
      </div>}
    </div>
  );
}

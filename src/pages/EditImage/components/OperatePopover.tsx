import { Popover } from 'antd';
import { OperateType } from '../constants/enum';
import OperateSizeColor from './OperateSizeColor';
import type { SizeColorType } from '../types/index';
interface OperatePopoverProps {
  children: React.ReactNode;
  open: boolean;
  type?: OperateType;
  onChange?: (value:SizeColorType) => void;
}
export default function OperatePopover({children, open, type, onChange}: OperatePopoverProps) {
  const handleChange = (value:SizeColorType) => {
    onChange?.(value);
  }
  return (
    <Popover
      open={open}
      content={
        <OperateSizeColor type={type} onChange={handleChange}/>
      }
    >
      { children }
    </Popover>
  );
}
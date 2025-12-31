import { createStyles } from 'antd-style';
import { DownloadOutlined } from '@ant-design/icons';
import { Button,message  } from 'antd';
import { useEffect, useState } from 'react';
import { useEditorStore, useVideoStore } from '@/store';
import dayjs from 'dayjs';
const Header: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { styles } = useStyles();
  const [date, setDate] = useState('');
  const { setExportModalVisible } = useEditorStore();
  const { videoFile } = useVideoStore();
  const handleExportClick = () => {
    if(!videoFile) {
      messageApi.warning('请先上传视频');
      return;
    }
    setExportModalVisible(true);
  }
  useEffect(() => {
    const date = dayjs().format('M月DD日');
    setDate(date);
  }, [])
  return (
    <div className={styles.header}>
      {contextHolder}
      <div className='left-section'></div>
      <div className='middle-section'>{date}</div>
      <div className='right-section'>
        <Button 
          size='small' 
          color="cyan" 
          variant="solid" 
          icon={<DownloadOutlined />}
          onClick={handleExportClick}
        >导出</Button>
      </div>
    </div>
  )
}
const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    fontSize: '14px',
    padding: '0 10px',
    '.right-section': {
      'button': {
        span:{
          fontSize: '12px',
        }
      }
    }
  }
}))
export default Header;
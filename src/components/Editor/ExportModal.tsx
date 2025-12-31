import { Row,Col,Modal,Space,Button,Flex,Form,Select,Input } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import { useEditorStore } from '@/store';
import { useEditorStyles } from '@/components/Editor/editor.style';
import { useVideoStore, useFFmpegStore } from '@/store';
import dayjs from 'dayjs';
import { useMemo, useState } from "react";
export interface ExportFormValues {
  name: string;
  format: string;
  dpi: string;
  fps: string;
}
const ExportModal = () => {
  const { styles } = useEditorStyles();
  const { videoFile, videoBaseInfo, videoAdjustInfo } = useVideoStore();
  const { ffmpeg,progress,setProgress } = useFFmpegStore();
  const [loading, setLoading] = useState(false);
  const progressText = useMemo(() => {
    return `${Math.floor(progress*100)}%`
  }, [progress])
  const [form] = Form.useForm();
  const initialValues = {
    name: videoBaseInfo.name,
    format: 'mp4',
    dpi: '',
    fps: '30',
    // bitrate: '1',
  }
  const { exportModalVisible, setExportModalVisible } = useEditorStore();
  const handleCancel = () => {
    setExportModalVisible(false);
  }
  const handleExport = async () => {
    const values = await form.validateFields();
    const { brightness,contrast,saturation } = videoAdjustInfo;
    console.log(values)
    console.log(videoAdjustInfo)
    if (ffmpeg && ffmpeg.loaded) {
      setLoading(true);
      const { 
        name, 
        format, 
        // dpi, 
        fps 
      } = values;
      // const sourceDpiHeight = videoBaseInfo.dpiH || '1080';
      const exportFileName = `${name}${dayjs().format('YYYYMMDDHHmmss')}.${format}`;
      const command = [
        `-i`, videoFile!.name, 
        // `-vf`, `scale=-1:${dpi || sourceDpiHeight}`, 
        `-vf`, `eq=brightness=${brightness||1}:contrast=${contrast||0}:saturation=${saturation||0}`,
        `-r`, fps, 
        `-c:v`, `libx264`, 
        exportFileName
      ];
      console.log('command', command)
      await ffmpeg.exec(command);
      const fileData = await ffmpeg.readFile(exportFileName);
      if (fileData) {
        const blob = new Blob([fileData], { type: `video/${format}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = exportFileName;
        a.click();
        URL.revokeObjectURL(url);
        setProgress(0);
      }
      setLoading(false);
    }
  }
  return (
    <Modal
      className={styles.exportModal}
      title=""
      closable={false}
      open={exportModalVisible}
      footer={null}
    >
      <Row>
        <Col span={24}>
          <h2>导出视频 {progress>0?progressText:''}</h2>
        </Col>
        <Col span={24}>
          <div className="export-form">
            <Form<ExportFormValues>
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 10 }}
              initialValues={initialValues}
              disabled={loading}
            >
              <Form.Item label='名称' name="name">
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item label='格式' name="format">
                <Select options={[{label: 'MP4', value: 'mp4'}]} />
              </Form.Item>
              <Form.Item label='分辨率' name="dpi">
                <Select options={[{label: '原始', value: ''},{label: '1080p', value: '1080'}, {label: '720p', value: '720'}, {label: '480p', value: '480'}]} />
              </Form.Item>
              <Form.Item label='帧率(fps)' name="fps">
                <Select options={[{label: '60', value: '60'}, {label: '30', value: '30'}, {label: '24', value: '24'}, {label: '15', value: '15'}]} />
              </Form.Item>
              {/* <Form.Item label='码率(kbps)' name="bitrate">
                <Select defaultValue='1' options={[{label: '更低', value: '0'}, {label: '推荐', value: '1'}, {label: '更高', value: '2'}]} />
              </Form.Item> */}
            </Form>
          </div>
        </Col>
        <Col span={24}>
          <Flex justify='space-between'>
            {/* <Space className='detail'>
              <DeliveredProcedureOutlined />
              <span>时长:46s | 大小:12.3MB</span>
            </Space> */}
            <Space>
              <Button size='small' onClick={handleCancel} disabled={loading}>取消</Button>
              <Button
                loading={loading}
                size='small' 
                color="cyan" 
                variant="solid"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >导出</Button>
            </Space>
          </Flex>
        </Col>
      </Row>
    </Modal>
  );
};

export default ExportModal;
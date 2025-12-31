import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { timeToSecondsWithNumeral } from '@/utils/videoUtils';
import type { VideoBaseInfo } from '@/store/videoStore';

let videoBaseInfo:Partial<VideoBaseInfo> = {}
export const writeFileToFFmpeg = async (ffmpeg: FFmpeg | null, file: File) => {
  if (!ffmpeg || !ffmpeg.loaded) {
    return;
  }
  await ffmpeg.writeFile(file.name, await fetchFile(file));
}

export const getVideoInfo = async (ffmpeg: FFmpeg | null, file: File): Promise<Partial<VideoBaseInfo>> => {
  if (!ffmpeg || !ffmpeg.loaded) {
    return {};
  }
  videoBaseInfo = {}
  const command = ['-i', file.name];
  await ffmpeg.exec(command);
  return videoBaseInfo
}
export const parseMetadata = (logs: string) => {
  if (!logs) {
    return;
  }
  const formatMatch = logs.match(/Input #\d+,.*?from '([^']+)'/);
  if (formatMatch) {
    console.log(1111111111, formatMatch)
    const videoName = formatMatch[1]
    const videoNameList = videoName.split('.');
    videoBaseInfo = {
      ...videoBaseInfo,
      name: videoNameList[0],
      type: videoNameList[1],
    }
  };

  const durationMatch = logs.match(/Duration: (\d+:\d+:\d+\.\d+), start: .*, bitrate: (\d+ kb\/s)/);
  if (durationMatch) {
    // console.log(1111111111, durationMatch);
    videoBaseInfo = {
      ...videoBaseInfo,
      duration: timeToSecondsWithNumeral(durationMatch[1]),
      bitrate: durationMatch[2],
    }
  }

  // const videoMatch = logs.match(/Stream #0:0.*?Video: (\w+)(?: \(([^)]+)\))?.*?(\w+)\(.*?\), (\d+)x(\d+).*?\[SAR (\d+:\d+) DAR (\d+:\d+)\], (\d+ kb\/s), (\d+\.\d+ fps)/);
  // const videoMatch = logs.match(/Stream .*?Video: (\w+).*?, (\d+)x(\d+).*?DAR (\d+:\d+).*?, (\d+ kb\/s), (\d+\.\d+ fps).*?/);
  const videoMatch = logs.match(/Stream #\d+:\d+.*Video: .+/);
  if(videoMatch) {
    const videoLine = videoMatch[0];
    const encoder = videoLine.match(/Video: (\w+)/)?.[1];
    const dpi = videoLine.match(/,\s(\d+x\d+)/)?.[1];
    const ratio = videoLine.match(/DAR (\d+:\d+)/)?.[1];
    const fps = videoLine.match(/,\s(\d+(\.\d+)?)\sfps/)?.[1];
    const dpiList = dpi?.split('x');
    const dpiW = dpiList?.[0] || '';
    const dpiH = dpiList?.[1] || '';
    videoBaseInfo = {
      ...videoBaseInfo,
      encoder: encoder || '',
      dpi: dpi || '',
      dpiW,
      dpiH,
      ratio: ratio || '',
      fps: fps || '',
    }
  }
}

export const getFrameFiles = async (ffmpeg: FFmpeg | null, file: File): Promise<string[]> => {
  if (!ffmpeg || !ffmpeg.loaded) {
    return [];
  }
  console.log('获取帧数据', file)
  await ffmpeg.createDir('frames')
  await ffmpeg.exec([
    '-i', file.name, 
    '-vf', "select='eq(pict_type,PICT_TYPE_I)'",  // 提取关键帧
    '-vsync', 'vfr',  // 视频同步模式，vfr 表示视频帧速率与输入视频一致
    // '-vframes', '20', // 最多提取多少帧
    // '-r', '2', // 每秒两帧
    // '-q:v', '31',
    'frames/%04d.jpg'
  ]); // , '-vframes', '20' 最多提取多少帧 ； '-r', '2',每秒两帧
  const frameFiles = await ffmpeg.listDir('frames');
  console.log('获取到的帧文件', frameFiles);
  const frameFilesUrl: string[] = []
  for (const frameFile of frameFiles) {
    if (frameFile.name.endsWith('.jpg')) {
      const frameData = await ffmpeg.readFile(`frames/${frameFile.name}`);
      const frameBlob = new Blob([frameData], { type: 'image/jpeg' }); // 注意 MIME 类型应为 image/jpeg
      const frameUrl = URL.createObjectURL(frameBlob);
      frameFilesUrl.push(frameUrl);
    }
    // 可选：处理完后删除文件释放内存
    if(!frameFile.isDir) {
      await ffmpeg.deleteFile(`frames/${frameFile.name}`);
    }
  }
  console.log('获取到的帧url', frameFilesUrl);
  await ffmpeg.deleteDir('frames');
  return frameFilesUrl;
}


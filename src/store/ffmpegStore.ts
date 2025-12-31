import { create } from 'zustand'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { parseMetadata } from '@/utils/ffmpegUtils';

const baseURL = '/dist/esm'
type ExecType = 'info' | 'frame' | null; // info 获取视频信息 frame 获取视频帧
interface FFmpegStoreState {
  ffmpeg: FFmpeg | null;
  progress: number;
  execType: ExecType; // 当前执行正在做什么
  loadFFmpeg: () => Promise<void>;
  setExecType: (execType: ExecType) => void;
  setProgress: (progress: number) => void;
}
export const useFFmpegStore = create<FFmpegStoreState>((set, get) => ({
  ffmpeg: null,
  progress: 0,
  execType: null,
  loadFFmpeg: async () => {
    const ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => {
        console.log('ffmpeg log', message);
        const { execType } = get();
        if (execType === 'info') {
          parseMetadata(message);
        }
    });
    ffmpeg.on('progress', ({ progress }) => {
        console.log('ffmpeg progress', progress);
        set({ progress });
    });
    try {
      await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (error) {
      console.log('Error loading ffmpeg-core', error);
    }
    set({ ffmpeg });
  },
  setExecType: (execType) => set({ execType }),
  setProgress: (progress) => set({ progress }),
}))

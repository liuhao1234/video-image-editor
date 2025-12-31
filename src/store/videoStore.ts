import { create } from 'zustand'
import { Application } from 'pixi.js';

export interface VideoBaseInfo {
  name: string; // 视频名称
  type: string; // 视频类型 video/mp4
  duration: number; // 视频时长（单位：秒）
  dpiW: number; // 分辨率宽度
  dpiH: number; // 分辨率高度
  ratioW: number; // 宽高比宽度
  ratioH: number; // 宽高比高度
}
interface VideoAdjustInfo {
  brightness: number; // 亮度
  contrast: number; // 对比度
  saturation: number; // 饱和度
  sharpness: number; // 锐度
}
interface VideoStoreState {
  play: boolean; // 播放状态
  setPlay: (play: boolean) => void;
  pixiVideo: Application | null; // pixi视频实例
  setPixiVideo: (pixiVideo: Application) => void;
  videoFile: File | null; // 视频文件
  setVideoFile: (videoFile: File) => void;
  videoBaseInfo: Partial<VideoBaseInfo>; // 视频基础信息
  setVideoBaseInfo: (videoBaseInfo: Partial<VideoBaseInfo>) => void;
  videoAdjustInfo: Partial<VideoAdjustInfo>; // 视频调整信息
  setVideoAdjustInfo: (videoAdjustInfo: Partial<VideoAdjustInfo>) => void;
  videoContainerSize: { // 视频容器大小
    width: number,
    height: number,
  },
  setVideoContainerSize: (videoContainerSize: { width: number, height: number }) => void;
  frameRate: number; // 视频帧率
  setFrameRate: (frameRate: number) => void; // 设置视频帧率
  frameCount: number; // 视频总帧数
  setFrameCount: (frameCount: number) => void; // 设置视频总帧数
  playMomentFrame: number | null; // 临时帧（单位：秒）
  setPlayMomentFrame: (momentFrame: number | null) => void; // 设置临时帧（单位：秒）
  playStartFrame: number; // 播放开始帧（单位：秒）
  setPlayStartFrame: (playStartFrame: number) => void; // 设置播放开始帧（单位：秒）
  canvasRatio: string,
  setCanvasRatio: (canvasRatio: string) => void,
}
export const useVideoStore = create<VideoStoreState>((set) => ({
  play: false, // 视频播放状态
  setPlay: (play: boolean) => set({ play }),
  pixiVideo: null, // pixi视频实例
  setPixiVideo: (pixiVideo: Application) => set({ pixiVideo }),
  videoFile: null, // 视频文件
  setVideoFile: (videoFile: File) => set({ videoFile }),
  videoBaseInfo: {}, // 视频基础信息
  setVideoBaseInfo: (info: Partial<VideoBaseInfo>) => set((state) => ({ videoBaseInfo: { ...state.videoBaseInfo, ...info } })),
  videoAdjustInfo: {}, // 视频调整信息
  setVideoAdjustInfo: (info: Partial<VideoAdjustInfo>) => set((state) => ({ videoAdjustInfo: { ...state.videoAdjustInfo, ...info } })),
  frameRate: 30, // 视频帧率
  setFrameRate: (frameRate: number) => set({ frameRate }), // 设置视频帧率
  frameCount: 0, // 视频总帧数
  setFrameCount: (frameCount: number) => set({ frameCount }), // 设置视频总帧数
  playMomentFrame: null, // 临时帧（单位：帧）
  setPlayMomentFrame: (momentFrame: number | null) => set({ playMomentFrame: momentFrame }), // 设置临时帧（单位：帧）
  playStartFrame: 0, // 播放开始帧（单位：秒）
  setPlayStartFrame: (playStartFrame: number) => set({ playStartFrame }), // 设置播放开始帧（单位：秒）
  videoContainerSize: {
    width: 0,
    height: 0,
  },
  setVideoContainerSize: (videoContainerSize: { width: number, height: number }) => set({ videoContainerSize }),
  canvasRatio: '',
  setCanvasRatio: (canvasRatio: string) => set({ canvasRatio }),
}))

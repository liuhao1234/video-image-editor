import { create } from 'zustand'

type TrackType = 'video' | 'image';
interface VideoSource {
  id: string, // 视频源id
  url: string, // 视频源url
  name: string, // 视频源名称
  format: string, // 视频源格式
  duration: number, // 视频源时长
  width: number, // 视频源宽度
  height: number // 视频源高度
}

export interface VideoTrackItem {
  id: string, // 视频源id
  type: 'video', // 视频源类型
  source?: VideoSource, // 视频源
  name: string, // 视频源名称
  frameCount: number, // 视频源帧数
  start: number, // 视频源开始时间
  end: number, // 视频源结束时间
  offsetL: number, // 视频源左偏移
  offsetR: number, // 视频源右偏移
}

export interface ImageTrackItem {
  id: string, // 轨道id
  type: 'image'; // 轨道类型
  name: string; // 轨道名称
  source: Blob; // 图片源
  start: number; // 轨道开始时间
  end: number; // 轨道结束时间
}

export type TrackItem = VideoTrackItem | ImageTrackItem;
export interface TrackLine {
  id: string; // 轨道id
  type: TrackType; // 轨道类型
  list: TrackItem[]; // 轨道资源
}
interface TrackStoreState {
  selectTrackItem: TrackItem | null; // 选中的视频轨道项
  setSelectTrackItem: (item: TrackItem | null) => void; // 设置选中的视频轨道项
  trackScale: number; // 视频时间轴缩放比例
  setTrackScale: (scale: number) => void; // 设置视频缩放比例
  trackList: TrackLine[]; // 显示的轨道列表
  setTrackList: (trackList: TrackLine[]) => void; // 设置轨道列表
  addTrackLine: (trackLine: TrackLine) => void; // 新增轨道
}
export const useTrackStore = create<TrackStoreState>((set) => ({
  selectTrackItem: null, // 选中的视频轨道项
  setSelectTrackItem: (item: TrackItem | null) => set({ selectTrackItem: item }), // 设置选中的视频轨道项
  trackScale: 30, // 视频缩放比例
  setTrackScale: (scale: number) => set({ trackScale: scale }), // 设置视频缩放比例
  trackList:[],
  setTrackList: (trackList: TrackLine[]) => set({ trackList: trackList }), // 设置轨道列表
  addTrackLine: (trackLine: TrackLine) => set((state) => ({ trackList: [...state.trackList, trackLine] })), // 新增轨道
}))
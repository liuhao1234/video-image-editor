import { create } from 'zustand'
import { ToolTab, PropTab } from '@/constants/enum';
// 项目状态
interface TrackState {
  duration: number;       // 项目总时长(ms)
  zoom: number;           // 时间轴缩放比例(px/ms)
  tracks: Track[];        // 轨道列表
  playHeadTime: number;   // 播放头位置(ms)
  isPlaying: boolean;     // 播放状态
}
// 轨道
interface Track {
  id: string;
  type: 'video' | 'audio' | 'text';
  clips: Clip[];
  locked: boolean;
  show: boolean;
}
// 片段
interface Clip {
  id: string;
  trackId: string;
  type: 'video' | 'audio' | 'text';
  source: string;         // 媒体源ID或内容
  startTime: number;      // 片段在时间轴上的开始位置(ms)
  duration: number;       // 片段显示时长(ms)
  inPoint: number;        // 媒体源的入点(ms)
  outPoint: number;       // 媒体源的出点(ms)
}
interface EditorStoreState {
  toolActive: Editor.ToolTab,
  propActive: Editor.PropTab,
  exportModalVisible: boolean,
  trackState: TrackState,//轨道信息
  setToolActive: (toolActive: Editor.ToolTab) => void,
  setPropActive: (propActive: Editor.PropTab) => void,
  setExportModalVisible: (exportModalVisible: boolean) => void,
  setTrackState: (trackState: TrackState) => void,
}
export const useEditorStore = create<EditorStoreState>((set) => ({
  toolActive: ToolTab.video,
  propActive: PropTab.info,
  exportModalVisible: false,
  trackState: {
    duration: 0,
    zoom: 1,
    tracks: [],
    playHeadTime: 0,
    isPlaying: false,
  },//轨道信息
  setToolActive: (toolActive) => set({ toolActive }),
  setPropActive: (propActive) => set({ propActive }),
  setExportModalVisible: (exportModalVisible) => set({ exportModalVisible }),
  setTrackState: (trackState) => set({ trackState }),
}))

import { create } from 'zustand'
import type { ImageDataType, PositionType } from '../types';
import { OperateType } from '../constants/enum';
import EditorApp from '../classes/EditorApp.ts';
import { Sprite } from 'pixi.js';
interface ImageEditorStore {
  currentEditor: EditorApp | null;
  setCurrentEditor: (currentEditor: EditorApp | null) => void;
  currentImage: ImageDataType | null;
  setCurrentImage: (currentImage: ImageDataType | null) => void;
  currentImageSprite: Sprite | null;
  setCurrentImageSprite: (currentImageSprite: Sprite | null) => void;
  currentImageScale: number;
  setCurrentImageScale: (currentImageScale: number) => void;
  currentImagePosition: PositionType;
  setCurrentImagePosition: (currentImagePosition: PositionType) => void;
  currentOperate: OperateType | null;
  setCurrentOperate: (currentOperate: OperateType | null) => void;
  editorSize: {
    width: number,
    height: number,
  };
  setEditorSize: (editorSize: {width: number, height: number}) => void,
  currentSelectElementId: string | null,
  setCurrentSelectElementId: (currentSelectElementId: string | null) => void,
  undoDisable: boolean,
  setUndoDisable: (undoDisable: boolean) => void,
  redoDisable: boolean,
  setRedoDisable: (redoDisable: boolean) => void,
}
export const useImageEditorStore = create<ImageEditorStore>((set) => ({
  currentEditor: null,
  setCurrentEditor: (currentEditor: EditorApp | null) => set({ currentEditor }),
  currentImage: null,
  setCurrentImage: (currentImage: ImageDataType | null) => set({ currentImage }),
  currentImageSprite: null,
  setCurrentImageSprite: (currentImageSprite: Sprite | null) => set({ currentImageSprite }),
  currentImageScale: 1,
  setCurrentImageScale: (currentImageScale: number) => set({ currentImageScale }),
  currentImagePosition: {
    x: 0,
    y: 0,
  },
  setCurrentImagePosition: (currentImagePosition: PositionType) => set({ currentImagePosition }),
  currentOperate: null,
  setCurrentOperate: (currentOperate: OperateType | null) => set({ currentOperate }),
  editorSize: {
    width: 1,
    height: 1,
  },
  setEditorSize: (editorSize: {width: number, height: number}) => set({ editorSize }),
  currentSelectElementId: null,
  setCurrentSelectElementId: (currentSelectElementId: string | null) => set({ currentSelectElementId }),
  undoDisable: true,
  setUndoDisable: (undoDisable: boolean) => set({ undoDisable }),
  redoDisable: true,
  setRedoDisable: (redoDisable: boolean) => set({ redoDisable }),
}))
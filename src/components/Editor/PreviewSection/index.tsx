import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useEditorStyles } from '@/components/Editor/editor.style';
import VideoControls from './components/VideoControls';
import { useVideoStore, useTrackStore } from '@/store';
import type { VideoTrackItem } from '@/store/trackStore';
import { calculateAspectRatio } from '@/utils/videoUtils';
import { Application, Sprite, Texture, ColorMatrixFilter } from 'pixi.js';
import type { Filter } from 'pixi.js';
import { v4 as uuidv4 } from 'uuid';
import { BrightnessFilter } from '@/utils/webgl/brightness_filter';
import { ContrastFilter } from '@/utils/webgl/contrast_filter';
import { SaturationFilter } from '@/utils/webgl/saturation_filter';
import { SharpnessFilter } from '@/utils/webgl/sharpness_filter';



const PreviewSection: React.FC = () => {
  const { styles } = useEditorStyles();
  const playerRef = useRef<HTMLDivElement>(null);
  const playerTimerRef = useRef<NodeJS.Timeout>(null);
  const colorMatrixFilter = useRef<ColorMatrixFilter>(null);
  // 亮度滤镜
  const brightnessFilter = useRef<Filter>(null);
  // 对比度滤镜
  const contrastFilter = useRef<Filter>(null);
  // 饱和度滤镜
  const saturationFilter = useRef<Filter>(null);
  // 锐化滤镜
  const sharpnessFilter = useRef<Filter>(null);
  const pixiApp = useRef<Application>(null);
  const [scale, setScale] = useState<number>(1);
  const { addTrackLine } = useTrackStore();
  const { 
    play,
    setPlay,
    videoFile, 
    videoBaseInfo, 
    videoAdjustInfo,
    setVideoBaseInfo, 
    setFrameCount,
    videoContainerSize,
    canvasRatio,
    setCanvasRatio, 
    playStartFrame,
    setPlayStartFrame,
    frameRate,
    frameCount,
    playMomentFrame,
    setPixiVideo,
  } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = useMemo(() => videoFile ? URL.createObjectURL(videoFile) : null, [videoFile]);
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({});

  const startPlay = () => {
    let playFrame = playStartFrame;
    if(playStartFrame >= frameCount) {
      setPlayStartFrame(0);
      playFrame = 0;
      videoRef.current!.currentTime = 0;
    };
    playerTimerRef.current = setInterval(()=>{
      if(playFrame >= frameCount){
        stopPlay();
        return;
      }
      playFrame++;
      setPlayStartFrame(playFrame);
    },1000/frameRate)
    videoRef.current!.play();
  }
  const stopPlay = () => {
    if (!playerTimerRef.current) return
    clearInterval(playerTimerRef.current);
    playerTimerRef.current = null;

    videoRef.current!.pause();
    setPlay(false);
  }
  // 渲染Pixi
  const initPixi = useCallback(async ()=>{
    if(!videoBaseInfo.dpiW) return;
    playerRef.current?.getElementsByTagName('canvas')[0]?.remove();
    // 初始化Pixi应用
    pixiApp.current = new Application();
    await pixiApp.current.init({
      width: videoBaseInfo.dpiW,
      height: videoBaseInfo.dpiH,
      backgroundColor: "#000000",
      preference: 'webgl', // or 'webgpu'
    });
    // 视频纹理
    const videoTexture = Texture.from(videoRef.current!);
    // 视频精灵
    const videoSprite = new Sprite(videoTexture);
    colorMatrixFilter.current = new ColorMatrixFilter();
    // 亮度滤镜
    brightnessFilter.current = BrightnessFilter;
    // 对比度滤镜
    contrastFilter.current = ContrastFilter;
    // 饱和度滤镜
    saturationFilter.current = SaturationFilter;
    // 锐化滤镜
    sharpnessFilter.current = SharpnessFilter;

    videoSprite.filters = [
      // colorMatrixFilter.current,
      brightnessFilter.current,
      contrastFilter.current,
      saturationFilter.current,
      // sharpnessFilter.current,
    ];
    pixiApp.current.stage.addChild(videoSprite);
    // 视频画布
    playerRef.current?.appendChild(pixiApp.current.canvas);
    videoRef.current?.pause();
    setPixiVideo(pixiApp.current);
  },[setPixiVideo, videoBaseInfo.dpiH, videoBaseInfo.dpiW])
  // 亮度滤镜
  useEffect(() => {
    if(brightnessFilter.current){
      brightnessFilter.current.resources.brightnessUniforms.uniforms.uBrightness = videoAdjustInfo.brightness as number;
    }
  }, [videoAdjustInfo.brightness])
  // 对比度滤镜
  useEffect(() => {
    if(contrastFilter.current){
      contrastFilter.current.resources.contrastUniforms.uniforms.uContrast = videoAdjustInfo.contrast as number;
    }
  }, [videoAdjustInfo.contrast])
  // 饱和度滤镜
  useEffect(() => {
    if(saturationFilter.current){
      saturationFilter.current.resources.saturationUniforms.uniforms.uSaturation = videoAdjustInfo.saturation as number;
    }
  }, [videoAdjustInfo.saturation])
  // 锐化滤镜
  useEffect(() => {
    if(sharpnessFilter.current){
      sharpnessFilter.current.resources.sharpnessUniforms.uniforms.uSharpness = videoAdjustInfo.sharpness as number;
    }
  }, [videoAdjustInfo.sharpness])
  
  // 视频【加载完成】事件
  useEffect(() => {
    if(!videoUrl) return;
    videoRef.current?.addEventListener('loadedmetadata', () => {
      const duration = videoRef.current?.duration || 0;
      const videoWidth = videoRef.current?.videoWidth || 0;
      const videoHeight = videoRef.current?.videoHeight || 0;
      // 计算视频宽高比
      const {ratioW, ratioH} = calculateAspectRatio(videoWidth, videoHeight);
      setVideoBaseInfo({
        duration,
        dpiW: videoWidth,
        dpiH: videoHeight,
        ratioW,
        ratioH,
      })
      setCanvasRatio(`${ratioW}:${ratioH}`);
      const frameCount = Math.round(duration * frameRate);
      setFrameCount(frameCount);
      console.log('duration', duration);
      addTrackLine({
        id: uuidv4(),
        type: 'video',
        list: [{
          id: uuidv4(),
          type: 'video',
          frameCount,
          start: 0,
          end: frameCount,
          offsetL: 0,
          offsetR: 0,
        } as VideoTrackItem],
      })
    })
  }, [videoUrl, frameRate])
  
  useEffect(() => {
    initPixi();
  }, [initPixi])
  useEffect(() => {
    if(!videoFile) return;
    const { dpiW } = videoBaseInfo || {};
    // 当前预览区域的宽高
    const {width, height} = videoContainerSize;
    // 当前画布宽高比
    const [ratioW, ratioH] = canvasRatio.split(':').map(Number);
    // 计算视频区域宽高比
    const containerRatio = width / height;
    // 计算视频画布宽高
    let canvasWidth = width;
    let canvasHeight = height;
    if(containerRatio > ratioW! / ratioH!){
      canvasWidth = height * ratioW! / ratioH!;
    }else{
      canvasHeight = width * ratioH! / ratioW!;
    }
    setCanvasStyle({
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
    })
    
    setScale(canvasWidth / dpiW!);
  }, [videoContainerSize,videoBaseInfo,canvasRatio,videoFile])
  useEffect(() => {
    if(!videoFile) return;
    if(play){
      startPlay();
    }else{
      stopPlay();
    }
  }, [play, videoFile])
  useEffect(() => {
    if(play) return;
    if(videoRef.current){
      videoRef.current.currentTime = playStartFrame / frameRate;
    }
  }, [play, playStartFrame, frameRate])
  // 临时演示：播放到指定帧
  useEffect(() => {
    if (!videoRef.current) return
    if(playMomentFrame !== null){
      videoRef.current.currentTime = playMomentFrame / frameRate;
    }else{
      videoRef.current.currentTime = playStartFrame / frameRate;
    }
  }, [playMomentFrame, frameRate])
  return (
    <div className={styles.previewSection}>
      {videoUrl && <video ref={videoRef} src={videoUrl} />}
      <div className="preview-container">
        {/* 视频区域 */}
        <div className="preview-inner" id="previewContainer">
          {/* 视频画布 */}
          <div className="video-canvas" style={canvasStyle}>
            {/* 视频播放区 */}
            <div className="video-player" ref={playerRef} style={{transform: `scale(${scale})`,transition: 'transform 0.3s ease-in-out'}}></div>
          </div>
        </div>
      </div>
      <VideoControls />
    </div>
  )
}
export default PreviewSection;

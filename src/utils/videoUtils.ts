import numeral from 'numeral';
import { Application } from 'pixi.js';

/**
 * 使用辗转相除法（欧几里得算法）计算两个数的最大公约数 (GCD)
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} - a 和 b 的最大公约数
 */
function gcd(a: number, b: number) {
  // 确保 a 和 b 都是正数
  a = Math.abs(a);
  b = Math.abs(b);
  
  // 当 b 不为 0 时，反复用 a % b 的结果更新 a 和 b
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
}

/**
 * 根据宽度和高度计算宽高比
 * @param {number} width - 视频宽度
 * @param {number} height - 视频高度
 * @returns {string} - 格式化后的宽高比字符串，如 "16:9"
 */
export function calculateAspectRatio(width: number, height: number) {
  if (width <= 0 || height <= 0) {
    return { ratioW: 0, ratioH: 0 };
  }

  const commonDivisor = gcd(width, height);
  const ratioW = width / commonDivisor;
  const ratioH = height / commonDivisor;

  return { ratioW, ratioH };
}

// 将ffmpeg的提取的时间格式转换为秒 （00:00:00.00 -> 000000）
export function timeToSecondsWithNumeral(timeStr: string) {
  const [timePart,millisecondsPart] = timeStr.split('.');
  const totalSeconds = numeral(timePart).format('X'); // 将 "hh:mm:ss" 转为总秒数
  const totalMilliseconds = numeral(millisecondsPart).format('000'); // 将 "000" 转为总毫秒数
  return `${totalSeconds}.${totalMilliseconds}`
}

// 将秒转换为时间格式 （000000.00 -> 00:00:00:00）
export function secondsToTime(seconds: number) {
  // 处理无效值（负数或非数字）
  if (isNaN(seconds) || seconds < 0) {
    return '00:00:00:00';
  }
  const currentFrameCount = seconds * 30;
  return formatPlayerTime(currentFrameCount);
}

// 将帧数转换为时间格式 （000000 -> 00:00:00:00）
export function formatPlayerTime(frameCount: number) {
    const f = Math.round(frameCount % 30);
    frameCount = Math.floor(frameCount / 30);
    const s = frameCount % 60;
    frameCount = Math.floor(frameCount / 60);
    const m = frameCount % 60;
    frameCount = Math.floor(frameCount / 60);
    const h = frameCount;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}:${f < 10 ? '0' : ''}${f}`;
}
// 根据slider的值获取颜色矩阵滤镜值
// 颜色矩阵滤镜值范围：-50 ~ 50
// 默认值：0 为正常值
export function getColorMatrixFilterValue(val: number, range: number[], defaultVal: number) {
  let result = defaultVal
  if(val >= 0){
    result = defaultVal + (range[1]-defaultVal)/50*val
  }else{
    result = defaultVal + (defaultVal-range[0])/50*val
  }
  return result
}
// 获取视频容器大小
export function getVideoContainerSize() {
  const previewContainer = document.getElementById('previewContainer');
  if(previewContainer){
    const { width, height } = previewContainer.getBoundingClientRect();
    return { width: Math.round(width), height: Math.round(height) }
  }
  return { width: 0, height: 0 }
}
interface CreatePixiAppParams {
  width: number,
  height: number,

}
// 创建pixi应用
export async function createPixiApp(params: CreatePixiAppParams) {
  const app = new Application()
  await app.init({
    backgroundColor: "#000000",
    antialias: true, // 开启抗锯齿
    ...params,
  })
  return app
}
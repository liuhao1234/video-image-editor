// 根据图片和编辑区域的大小计算图片的缩放比例
export const calculateImageScale = (imageSize: { width: number, height: number }, editorSize: { width: number, height: number }) => {
  const { width: imageWidth, height: imageHeight } = imageSize;
  const { width: editorWidth, height: editorHeight } = editorSize;
  const scale = Math.min(
    editorWidth / imageWidth,
    editorHeight / imageHeight,
  )
  return scale;
}
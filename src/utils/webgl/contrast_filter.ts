import { Filter, GlProgram } from 'pixi.js';
// 1. 定义顶点着色器（通用，无需修改）
const vertex = `
  in vec2 aPosition; // 输入：顶点位置（范围 [0, 1]）
  out vec2 vTextureCoord; // 输出：纹理坐标（范围 [0, 1]）

  void main() {
    gl_Position = vec4((aPosition * 2.0 - 1.0), 0.0, 1.0);
    vTextureCoord = vec2(aPosition.x, 1.0 - aPosition.y)*0.78; // 纹理坐标与顶点坐标同步
  }
`;

// 2. 定义片段着色器（核心：调整亮度）
const fragment = `
  in vec2 vTextureCoord;
  uniform sampler2D uTexture; // 输入纹理（原始图像）
  uniform float uContrast;   // 对比度系数（由 CPU 传递，默认 1.0）

  void main() {
    // 1. 采样原始纹理颜色（RGBA 范围 [0,1]）
    vec4 color = texture2D(uTexture, vTextureCoord);
    
    // 2. 应用对比度公式（只调整 RGB 通道，保留 alpha 透明度）
    color.rgb = (color.rgb - 0.5) * uContrast + 0.5;
    
    // 3. 限制颜色范围在 [0,1]（避免溢出导致异常）
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    
    // 输出最终颜色
    gl_FragColor = color;
  }
`;

const ContrastFilter = new Filter({
    // Shader programs
    glProgram: new GlProgram({ vertex, fragment }),

    // Resources (uniforms, textures, etc)
    resources: {
      contrastUniforms: {
        uContrast: { value: 1, type: 'f32' }
      }
    }
});
export { ContrastFilter };
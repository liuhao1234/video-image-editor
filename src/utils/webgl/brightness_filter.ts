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
  uniform sampler2D uTexture;
  uniform float uBrightness; // 亮度系数：>1 提亮，<1 变暗，1 不变

  void main() {
    vec4 color = texture(uTexture, vTextureCoord);
    // 调整 RGB 通道的亮度（保持 alpha 不变）
    color.rgb *= uBrightness;
    // 限制颜色范围在 [0, 1]（避免过曝）
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    gl_FragColor = color;
  }
`;

const BrightnessFilter = new Filter({
    // Shader programs
    glProgram: new GlProgram({ vertex, fragment }),

    // Resources (uniforms, textures, etc)
    resources: {
      brightnessUniforms: {
        uBrightness: { value: 1, type: 'f32' }
      }
    }
});
export { BrightnessFilter };
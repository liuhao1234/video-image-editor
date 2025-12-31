import { Filter, GlProgram } from 'pixi.js';
// 1. 定义顶点着色器（通用，无需修改）
const vertex = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// 2. 定义片段着色器（核心：调整亮度）
const fragment = `
  precision mediump float;
  uniform sampler2D u_texture;  // 视频纹理
  uniform vec2 u_textureSize;   // 纹理尺寸（宽高）
  uniform float uSharpness;    // 锐化强度（0-3）
  varying vec2 v_texCoord;      // 纹理坐标

  // 5x5 锐化卷积核（权重总和为 1）
  const float kernel[25] = float[](
    -1.0, -1.0, -1.0, -1.0, -1.0,
    -1.0,  2.0,  2.0,  2.0, -1.0,
    -1.0,  2.0,  8.0,  2.0, -1.0,
    -1.0,  2.0,  2.0,  2.0, -1.0,
    -1.0, -1.0, -1.0, -1.0, -1.0
  );

  void main() {
    vec2 texelSize = 1.0 / u_textureSize;  // 单个像素的纹理坐标步长
    vec4 color = vec4(0.0);

    // 遍历 5x5 卷积核
    for (int y = 0; y < 5; y++) {
      for (int x = 0; x < 5; x++) {
        // 计算当前采样点的纹理坐标（偏移 kernel 中心）
        vec2 offset = vec2(
          float(x - 2) * texelSize.x,  // x 方向偏移（-2 到 +2）
          float(y - 2) * texelSize.y   // y 方向偏移（-2 到 +2）
        );
        // 采样纹理并应用卷积权重
        float weight = kernel[y * 5 + x];
        color += texture2D(u_texture, v_texCoord + offset) * weight;
      }
    }

    // 混合原始图像和锐化结果（控制强度）
    vec4 original = texture2D(u_texture, v_texCoord);
    gl_FragColor = mix(original, color, uSharpness);
  }
`;

const SharpnessFilter = new Filter({
    // Shader programs
    glProgram: new GlProgram({ vertex, fragment }),

    // Resources (uniforms, textures, etc)
    resources: {
      sharpnessUniforms: {
        uSharpness: { value: 1, type: 'f32' },
        // uTextureSize: { value: [960,400], type: 'vec2<f32>' } // 添加纹理尺寸（vec2）
      }
    }
});
export { SharpnessFilter };
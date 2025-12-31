// 输入纹理（视频帧，FFmpeg 自动传入）
uniform sampler2D in0;
// 纹理坐标（每个像素在纹理中的位置，范围 0-1，由 FFmpeg 自动传递）
in vec2 texCoord;
// 输出像素颜色
out vec4 fragColor;

// 亮度参数（可通过 FFmpeg 命令动态传递）
uniform float brightness;

void main() {
    // 1. 读取原始像素颜色（RGBA 格式）
    vec4 color = texture(in0, texCoord);
    
    // 2. 调整亮度：RGB 通道乘以亮度系数（alpha 通道不变）
    // 注意：brightness=1.0 为原始亮度，>1 增强，<1 减弱
    color.rgb *= brightness;
    
    // 3. 限制颜色值在 [0, 1] 范围内（防止过曝或欠曝）
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    
    // 4. 输出处理后的颜色
    fragColor = color;
}
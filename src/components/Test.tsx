import { useState, useRef } from 'react'
import { fetchFile } from '@ffmpeg/util';
import { useFFmpegStore } from '@/store';

function Test() {
    const { ffmpeg, loadFFmpeg } = useFFmpegStore();
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        await loadFFmpeg();
        setLoaded(true);
    }
    // 调整饱和度
    const adjustSaturation = async ()=>{
        if (!ffmpeg || !ffmpeg.loaded) {
            return;
        }
        const file = fileInputRef.current?.files?.[0];
        const saturation = valueRef.current?.value;
        if (!file || !saturation) {
            return;
        }
        try {
            // 1. 将视频文件写入 FFmpeg 虚拟文件系统
            await ffmpeg.writeFile('input.mp4', await fetchFile(file));
            // 2. 执行 FFmpeg 命令：使用 eq 滤镜调整亮度
            // 命令解析：
            // -i input.mp4：输入文件
            // -vf "eq=brightness=${brightness}"：应用亮度滤镜
            // -c:a copy：音频流直接复制（不重新编码）
            // output.mp4：输出文件
            console.log('contrast', saturation);
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-vf', `eq=saturation=${saturation}`,
                'output.mp4'
            ]);
            // 3. 从虚拟文件系统读取处理后的视频
            const fileData = await ffmpeg.readFile('output.mp4');
            const data = new Uint8Array(fileData as ArrayBuffer)
            if (videoRef.current) {
                videoRef.current.src =
                URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
            }
        } catch (err) {
            console.error('FFmpeg 错误:', err);
        }
    }
    // 处理视频对比度
    const adjustContrast = async ()=>{
        if (!ffmpeg || !ffmpeg.loaded) {
            return;
        }
        const file = fileInputRef.current?.files?.[0];
        const contrast = valueRef.current?.value;
        if (!file || !contrast) {
            return;
        }
        try {
            // 1. 将视频文件写入 FFmpeg 虚拟文件系统
            await ffmpeg.writeFile('input.mp4', await fetchFile(file));
            // 2. 执行 FFmpeg 命令：使用 eq 滤镜调整亮度
            // 命令解析：
            // -i input.mp4：输入文件
            // -vf "eq=brightness=${brightness}"：应用亮度滤镜
            // -c:a copy：音频流直接复制（不重新编码）
            // output.mp4：输出文件
            console.log('contrast', contrast);
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-vf', `eq=contrast=${contrast}`,
                'output.mp4'
            ]);
            // 3. 从虚拟文件系统读取处理后的视频
            const fileData = await ffmpeg.readFile('output.mp4');
            const data = new Uint8Array(fileData as ArrayBuffer)
            if (videoRef.current) {
                videoRef.current.src =
                URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
            }
        } catch (err) {
            console.error('FFmpeg 错误:', err);
        }
    }
    // 处理视频亮度调整
    const adjustBrightness = async () => {
        if (!ffmpeg || !ffmpeg.loaded) {
            return;
        }
        const file = fileInputRef.current?.files?.[0];
        const brightness = valueRef.current?.value;
        if (!file || !brightness) {
            return;
        }
        try {
            // 1. 将视频文件写入 FFmpeg 虚拟文件系统
            await ffmpeg.writeFile('input.mp4', await fetchFile(file));
            // 2. 执行 FFmpeg 命令：使用 eq 滤镜调整亮度
            // 命令解析：
            // -i input.mp4：输入文件
            // -vf "eq=brightness=${brightness}"：应用亮度滤镜
            // -c:a copy：音频流直接复制（不重新编码）
            // output.mp4：输出文件
            console.log('brightness', brightness);
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-vf', `eq=brightness=${brightness}`,
                'output.mp4'
            ]);
            // 3. 从虚拟文件系统读取处理后的视频
            const fileData = await ffmpeg.readFile('output.mp4');
            const data = new Uint8Array(fileData as ArrayBuffer)
            if (videoRef.current) {
                videoRef.current.src =
                URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
            }
        } catch (err) {
            console.error('FFmpeg 错误:', err);
        }
    };
    // 转换视频格式
    const transcode = async () => {
        if (!ffmpeg) {
            return;
        }
        if (fileInputRef.current?.files?.[0]) {
            await ffmpeg.writeFile('input.webm', await fetchFile(fileInputRef.current.files[0]));
        }
        await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
        const fileData = await ffmpeg.readFile('output.mp4');
        const data = new Uint8Array(fileData as ArrayBuffer)
        if (videoRef.current) {
            videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
        }
    }
    // 获取视频信息
    const getVideoInfo = async () => {
        if (!ffmpeg) {
            return;
        }
        if (fileInputRef.current?.files?.[0]) {
            await ffmpeg.writeFile('input.webm', await fetchFile(fileInputRef.current.files[0]));
        }
        const info = await ffmpeg.exec(['-i', 'input.webm']);
        console.log(info);
    }
    return (loaded
        ? (
            <>
                <input type="file" ref={fileInputRef} />
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Transcode webm to mp4</button>
                <button onClick={getVideoInfo}>Get video info</button>
                <input type="text" ref={valueRef}/>
                <button onClick={adjustBrightness} title="-1,1,default 0">Adjust brightness</button>
                <button onClick={adjustContrast} title="0,3,default 1">Adjust contrast</button>
                <button onClick={adjustSaturation} title="0,3,default 1">Adjust saturation</button>
                <p ref={messageRef}></p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}

export default Test

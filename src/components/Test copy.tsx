import { useState, useRef, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

function Test() {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const load = async () => {
        const baseURL = '/dist/esm'
        // const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }) => {
            if (messageRef.current) {
                messageRef.current.innerHTML = message;
            }
            console.log(message);
        });
        ffmpeg.on('progress', ({ progress }) => {
            console.log('progress', progress);
        });
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
        } catch (error) {
            console.log('Error loading ffmpeg-core', error);
        }
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
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
    const getVideoInfo = async () => {
        const ffmpeg = ffmpegRef.current;
        if (fileInputRef.current?.files?.[0]) {
            await ffmpeg.writeFile('input.webm', await fetchFile(fileInputRef.current.files[0]));
        }
        const info = await ffmpeg.exec(['-i', 'input.webm']);
        console.log(info);
    }
    useEffect(() => {
      // load()
    }, [])
    return (loaded
        ? (
            <>
                <input type="file" ref={fileInputRef} />
                <video ref={videoRef} controls></video><br/>
                <button onClick={transcode}>Transcode webm to mp4</button>
                <button onClick={getVideoInfo}>Get video info</button>
                <p ref={messageRef}></p>
            </>
        )
        : (
            <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
        )
    );
}

export default Test

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const run = promisify(execFile);

// Studio-only conversion. Original MOVs are never modified.
export async function movToMp4(input: Buffer): Promise<Buffer> {
  const directory = await mkdtemp(path.join(tmpdir(), 'portfolio-mov-'));
  try {
    const source = path.join(directory, 'input.mov');
    const output = path.join(directory, 'output.mp4');
    await writeFile(source, input);
    const { stdout } = await run('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', source], { timeout: 30000, maxBuffer: 1024 * 1024 });
    const streams = JSON.parse(stdout).streams as { codec_type: string; codec_name: string; pix_fmt?: string }[];
    const video = streams.find(stream => stream.codec_type === 'video');
    const audio = streams.find(stream => stream.codec_type === 'audio');
    if (!video) throw new Error('The MOV file does not contain a video track.');
    const copyVideo = video.codec_name === 'h264' && video.pix_fmt === 'yuv420p';
    await run('ffmpeg', [
      '-nostdin', '-v', 'error', '-i', source,
      '-map', '0:v:0', '-map', '0:a:0?', '-map_metadata', '0',
      ...(copyVideo ? ['-c:v', 'copy'] : ['-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2', '-pix_fmt', 'yuv420p']),
      ...(audio?.codec_name === 'aac' ? ['-c:a', 'copy'] : ['-c:a', 'aac', '-b:a', '192k']),
      '-movflags', '+faststart', output,
    ], { timeout: 300000, maxBuffer: 1024 * 1024 });
    const result = await readFile(output);
    if (result.length > 100 * 1024 * 1024) throw new Error('The converted video exceeds 100 MB. Export a smaller video and try again.');
    return result;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error('MOV uploads need FFmpeg and FFprobe installed on this computer. MP4 uploads work without them.');
    }
    if (error instanceof Error && !('cmd' in error)) throw error;
    throw new Error('Could not convert this MOV. Try exporting it as an H.264 MP4.');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

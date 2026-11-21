import { loadFfmpeg, type FfmpegProgress } from "./ffmpegClient";

export type VideoQuality = "high" | "medium" | "low";

const CRF_BY_QUALITY: Record<VideoQuality, number> = {
  high: 23,
  medium: 28,
  low: 33,
};

export async function compressVideo(
  file: File,
  quality: VideoQuality,
  onProgress?: (p: FfmpegProgress) => void
): Promise<Blob> {
  const ffmpeg = await loadFfmpeg(onProgress);

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.({ stage: "encoding", ratio: progress });
  });

  const { fetchFile } = await import("@ffmpeg/util");
  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] || ".mp4");
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  onProgress?.({ stage: "encoding", ratio: 0 });
  await ffmpeg.exec([
    "-i", inputName,
    "-vcodec", "libx264",
    "-crf", String(CRF_BY_QUALITY[quality]),
    "-preset", "veryfast",
    "-acodec", "aac",
    "output.mp4",
  ]);

  const data = await ffmpeg.readFile("output.mp4");
  return new Blob([data as Uint8Array], { type: "video/mp4" });
}

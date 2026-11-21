import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropZone from "@/components/tools/FileDropZone";
import { Button } from "@/components/ui/button";
import { compressVideo, type VideoQuality } from "@/lib/tools/compressVideo";
import { formatBytes } from "@/lib/tools/compressFile";
import type { FfmpegProgress } from "@/lib/tools/ffmpegClient";

const QUALITIES: VideoQuality[] = ["high", "medium", "low"];

const ComprimirVideoPage = () => {
  const { t } = useTranslation("tools");

  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<VideoQuality>("medium");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [progress, setProgress] = useState<FfmpegProgress | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setResultUrl(null);
    setResultSize(null);
    setError(null);
  };

  const reset = () => {
    setFile(null);
    setResultUrl(null);
    setResultSize(null);
    setError(null);
    setProgress(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await compressVideo(file, quality, setProgress);
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
    } catch {
      setError(t("ui.error_generic"));
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const qualityButtonClass = (active: boolean) =>
    `rounded-full px-5 py-1.5 text-sm ${
      active ? "bg-white text-black" : "bg-transparent text-white border border-neutral-700 hover:bg-white/10"
    }`;

  const progressLabel = () => {
    if (!progress) return t("ui.processing");
    if (progress.stage === "loading") return t("ui.gif_loading_ffmpeg");
    return t("ui.video_compressing");
  };

  return (
    <ToolPageLayout toolId="comprimir-video">
      <div className="border border-neutral-800 rounded-xl p-6 md:p-8">
        {!file ? (
          <FileDropZone
            accept="video/mp4,video/webm,video/quicktime"
            label={t("ui.upload_label_video")}
            hint={t("ui.upload_hint_video")}
            onFile={handleFile}
            toolId="comprimir-video"
          />
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400 truncate max-w-[60%]">{file.name}</span>
              <Button
                variant="outline"
                onClick={reset}
                className="rounded-full px-6 border-neutral-700 text-white bg-transparent hover:bg-white/10"
              >
                {t("ui.reset_button_file")}
              </Button>
            </div>

            <div>
              <p className="text-neutral-400 text-sm mb-2">{t("ui.video_quality_label")}</p>
              <div className="flex gap-2">
                {QUALITIES.map((q) => (
                  <button key={q} onClick={() => setQuality(q)} className={qualityButtonClass(quality === q)}>
                    {t(`ui.video_quality_${q}`)}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-neutral-500 text-xs">{t("ui.gif_first_time_notice")}</p>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {resultSize !== null && (
              <div className="flex gap-6 text-sm">
                <span className="text-neutral-400">
                  {t("ui.original_size")}: {formatBytes(file.size)}
                </span>
                <span className="text-neutral-400">
                  {t("ui.compressed_size")}: {formatBytes(resultSize)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {!resultUrl ? (
                <Button
                  onClick={handleCompress}
                  isLoading={processing}
                  loadingText={progressLabel()}
                  className="bg-white text-black hover:bg-white/80 rounded-full px-8"
                >
                  {t("ui.compress_button")}
                </Button>
              ) : (
                <a href={resultUrl} download={`${file.name.replace(/\.[^.]+$/, "")}-comprimido.mp4`}>
                  <Button className="bg-white text-black hover:bg-white/80 rounded-full px-8">
                    <Download className="w-4 h-4" />
                    {t("ui.download_button")}
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ComprimirVideoPage;

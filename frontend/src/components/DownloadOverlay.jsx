import { Loader2 } from "lucide-react";

const DownloadOverlay = () => {
  return (
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/40 backdrop-blur-sm
        flex flex-col items-center justify-center
        cursor-wait
      "
    >
      <Loader2 className="w-10 h-10 text-white animate-spin mb-3" />
      <p className="text-white text-sm sm:text-base font-medium">
        Downloading…
      </p>
    </div>
  );
};

export default DownloadOverlay;

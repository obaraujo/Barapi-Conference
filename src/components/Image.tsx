import { DetailedHTMLProps, ImgHTMLAttributes, useState } from "react";
import Skeleton from "react-loading-skeleton";

interface imageProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export function Image({ className, ...props }: imageProps) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`${className} relative overflow-hidden`}>
      {loading && (
        <span className="absolute -top-1 left-0 h-full w-full">
          <Skeleton className="h-full w-full " />
        </span>
      )}

      <img
        className={`h-full w-full object-cover drop-shadow-lg transition-opacity ${
          !loading ? "opacity-100" : "opacity-0"
        }`}
        {...props}
        decoding="async"
        loading="lazy"
        onLoad={handleImageLoad}
      />
      <div className="absolute left-0 top-0 h-full w-full"></div>
    </div>
  );
}

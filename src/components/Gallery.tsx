import { Image } from "@/components/Image";
import { imageProps } from "@/types/images";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
export function Gallery({ images }: { images: imageProps[] }) {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{
        enabled: true,
        type: "fraction",
      }}
      className="z-0 mb-4 aspect-square rounded-xl bg-gray-barapi"
      loop={true}
    >
      {images.length > 0 &&
        images.map(({ src, srcset, width, height, alt, sizes }) => {
          return (
            <SwiperSlide key={src}>
              <Image
                className="h-full w-full max-w-unset"
                src={src}
                srcSet={srcset}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
              />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}

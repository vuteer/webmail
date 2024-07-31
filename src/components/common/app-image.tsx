// image component with lazy loading implemented
"use client"; 

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import { useTheme } from "next-themes";

interface AppImageProps {
  title: string;
  alt: string;
  src: string;
  objectFit?: "cover" | "contain" | undefined;
  fill?: boolean;
  width?: number;
  height?: number;
  cls?: string;
  nonBlur?: boolean
  // props: any
}

export const aspectRatio = `aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200`; 

const AppImage: React.FC<AppImageProps> = ({
  title,
  alt,
  src,
  objectFit,
  fill,
  cls,
  width,
  height,
  nonBlur
  // ...props
}) => {
  const [isLoading, setLoading] = React.useState<boolean>(true);
  // const {theme} = useTheme(); 

  return (
    // <div className={cn(`)}>
    <>  
    {fill ? (
        <Image
          alt={alt}
          src={src}
          title={title}
          fill
          className={cn(
            "rounded-lg duration-700 ease-in-out group-hover:opacity-75",
            `object-${objectFit || "contain"}`,
            isLoading && !nonBlur
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0",
            cls || ""
          )}
          onLoad={() => setLoading(false)}
          // {...props}
        />
      ) : (
        <Image
          alt={alt}
          src={src}
          title={title}
          width={width}
          height={height}
          className={cn(
            "duration-700 ease-in-out group-hover:opacity-75",
            `object-${objectFit || "contain"}`,
            isLoading && !nonBlur
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0",
            cls || ""
          )}
          onLoad={() => setLoading(false)}
          // {...props}
        />
      )}
    {/* </div> */}
      </>
  );
};

export default AppImage;

import { IconProps } from "@/lib/types";
import Image from "next/image";

const sizeValues: Record<
  "sm" | "md" | "lg",
  { width: number; height: number }
> = {
  sm: {
    width: 16,
    height: 16,
  },
  md: {
    width: 24,
    height: 24,
  },
  lg: {
    width: 32,
    height: 32,
  },
};

export default function Icon({
  size = "sm",
  url,
  alt,
  className,
  onClick,
}: IconProps) {
  const sizeConversion: { width: number; height: number } = sizeValues[size];
  return (
    <Image
      width={sizeConversion.width}
      height={sizeConversion.height}
      src={url}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
}

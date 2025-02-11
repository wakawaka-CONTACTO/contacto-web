import { useState } from "react"
import Image from "next/image"

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  svgProps?: React.SVGAttributes<SVGSVGElement>;
  backgroundColor?: string;
  textColor?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className,
  fill,
  svgProps,
  backgroundColor = "white",
  textColor = "black",
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={className} style={{ position: fill ? 'relative' : 'initial' }}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
          fill={fill}
          style={fill ? { objectFit: 'cover' } : {}}
        />
      ) : (
        <svg {...svgProps} viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill={backgroundColor} />
          <style>
            {`
              .logo-text {
                font-family: monospace;
                font-size: 32px;
                font-weight: bold;
                fill: ${textColor};
              }
            `}
          </style>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="logo-text">
            CONTACTO
          </text>
        </svg>
      )}
    </div>
  );
} 
import type { CarBrand } from '../lib/types';
import { CAR_BRAND_COLOR } from '../lib/types';
import carsImage from '../assets/cars.png';

interface Props {
  brand: CarBrand;
  cx: number;
  cy: number;
  size?: number;     // diameter in 343-base units
}

// Crop centers for 1536 wide horizontal-strip image (3 cars side by side)
const CAR_CENTERS_RATIO: Record<CarBrand, { cx: number; cy: number }> = {
  mercedes: { cx: 256 / 1536,  cy: 620 / 1024 },
  jaguar:   { cx: 768 / 1536,  cy: 620 / 1024 },
  audi:     { cx: 1280 / 1536, cy: 620 / 1024 },
};

const ASPECT = 1536 / 1024;     // image aspect
const CROP_RATIO = 480 / 1536;  // square crop = 480px of original 1536 wide

export function CarPin({ brand, cx, cy, size = 36 }: Props) {
  const ring = CAR_BRAND_COLOR[brand];
  const id = `clip-${brand}-${cx.toFixed(0)}-${cy.toFixed(0)}`;
  const half = size / 2;

  // Image fill rect inside circle
  // We want a square crop centered on car. The visible window is `size` (in svg units).
  // In the image, the crop window is CROP_RATIO of full width = 480 of 1536.
  // Image displayed inside the circle: scaled so that 480px of image = `size` svg units.
  const scale = size / (1536 * CROP_RATIO);  // = size / 480
  const imgWidth = 1536 * scale;
  const imgHeight = 1024 * scale;
  const center = CAR_CENTERS_RATIO[brand];
  const imgCx = center.cx * 1536 * scale;
  const imgCy = center.cy * 1024 * scale;
  const imgX = -imgCx;
  const imgY = -imgCy;

  return (
    <g transform={`translate(${cx} ${cy})`} style={{ pointerEvents: 'none', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.22))' }}>
      <defs>
        <clipPath id={id}>
          <circle cx={0} cy={0} r={half - 2} />
        </clipPath>
      </defs>
      {/* outer ring */}
      <circle cx={0} cy={0} r={half} fill="#fff" stroke={ring} strokeWidth={Math.max(1.8, size * 0.07)} />
      {/* clipped car image */}
      <g clipPath={`url(#${id})`}>
        <image
          href={carsImage}
          x={imgX}
          y={imgY}
          width={imgWidth}
          height={imgHeight}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </g>
  );
}

import type { CarBrand } from '../lib/types';
import { CAR_NAMES } from '../lib/types';
import carsImage from '../assets/cars.png';

interface Props {
  brand: CarBrand;
  width?: number;
  height?: number;
}

const CAR_PANEL_W = 1536 / 3;      // 512
const CAR_BODY_CY = 620;            // car body center in 1024 image
const PANEL_CX: Record<CarBrand, number> = {
  mercedes: 256,
  jaguar:   768,
  audi:     1280,
};

/** Horizontal car card: shows ONE car (cropped from the 3-car strip) with its name on the right */
export function CarPanel({ brand, width = 311, height = 130 }: Props) {
  const scale = width / CAR_PANEL_W;
  const fullW = 1536 * scale;
  const fullH = 1024 * scale;
  const cx = PANEL_CX[brand] * scale;
  const cy = CAR_BODY_CY * scale;
  const imgX = width / 2 - cx;
  const imgY = height / 2 - cy;

  return (
    <div
      className="relative bg-white border border-ink-200 rounded-[14px] overflow-hidden flex items-center"
      style={{ width, height }}
    >
      <img
        src={carsImage}
        alt=""
        style={{
          position: 'absolute',
          left: imgX,
          top: imgY,
          width: fullW,
          height: fullH,
          objectFit: 'fill',
          pointerEvents: 'none',
        }}
      />
      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-ink-900 font-bold text-base">
        {CAR_NAMES[brand]}
      </div>
    </div>
  );
}

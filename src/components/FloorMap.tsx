import { useRef } from 'react';
import { ZONES, DESIGNATED_SPOT } from '../lib/zones';
import type { CarBrand, ParkingRecord } from '../lib/types';
import { CarPin } from './CarPin';
import { DesignatedStar } from './DesignatedStar';

const ZONE_COLORS: Record<string, string> = {
  L: '#CFE3F0', A: '#CFE3F0', C: '#CFE3F0', D: '#CFE3F0',
  B: '#4E86B6',
  F: '#C9E6C9', E: '#C9E6C9',
  K: '#F8D4AB', G: '#F8D4AB', H: '#F8D4AB',
  I: '#F3D6E7',
  J: '#C79AB7',
  '주차불가': '#888888',
};

const WHITE_LABEL_ZONES = new Set(['B', 'J']);

interface Props {
  /** Side length in CSS px (map is square). */
  size: number;
  /** Whether designated star is emphasized (true on B5 floor) */
  starEmphasized: boolean;
  /** Pins to draw on the map */
  pins?: ParkingRecord[];
  /** Tap handler (for record screen). x/y in 343-base. */
  onMapTap?: (x: number, y: number) => void;
  /** Currently active pin (the brand being placed) — drawn last on top */
  activeBrand?: CarBrand;
  /** Mini mode — hides zone labels for very small renderings */
  miniLabels?: boolean;
}

export function FloorMap({ size, starEmphasized, pins = [], onMapTap, activeBrand, miniLabels = false }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!onMapTap || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 343;
    const y = ((e.clientY - rect.top) / rect.height) * 343;
    if (x < 0 || y < 0 || x > 343 || y > 343) return;
    onMapTap(x, y);
  }

  const labelFontSize = miniLabels ? 9 : 14;

  return (
    <svg
      ref={ref}
      viewBox="0 0 343 343"
      width={size}
      height={size}
      onClick={handleClick}
      style={{
        background: '#ffffff',
        borderRadius: 6,
        border: '1.5px solid #222',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        cursor: onMapTap ? 'crosshair' : 'default',
        display: 'block',
      }}
    >
      {/* 신기펙토 sign */}
      <rect x={198} y={6} width={90} height={10} fill="#F5C4C9" rx={2} />
      {/* Elevators */}
      <g>
        <rect x={192} y={18} width={42} height={32} fill="#fff" stroke="#222" strokeWidth={1.2} rx={2} />
        <text x={213} y={40} fontSize={14} textAnchor="middle" fill="#222">⇅</text>
      </g>
      <g>
        <rect x={248} y={18} width={42} height={32} fill="#fff" stroke="#222" strokeWidth={1.2} rx={2} />
        <text x={269} y={40} fontSize={14} textAnchor="middle" fill="#222">⇅</text>
      </g>

      {/* Zones */}
      {ZONES.map(([x, y, w, h, name]) => (
        <g key={name as string}>
          <rect x={x} y={y} width={w} height={h} fill={ZONE_COLORS[name] ?? '#eee'} rx={4} />
          {!miniLabels && name !== '주차불가' && (
            <text
              x={x + w / 2}
              y={y + h / 2 + labelFontSize / 3}
              fontSize={labelFontSize}
              fontWeight={700}
              textAnchor="middle"
              fill={WHITE_LABEL_ZONES.has(name as string) ? '#fff' : '#222'}
              style={{ pointerEvents: 'none' }}
            >
              {name}
            </text>
          )}
          {miniLabels && !['주차불가', 'B', 'J'].includes(name as string) && (
            <text
              x={x + w / 2}
              y={y + h / 2 + labelFontSize / 3}
              fontSize={labelFontSize}
              fontWeight={700}
              textAnchor="middle"
              fill="#333"
              style={{ pointerEvents: 'none' }}
            >
              {name}
            </text>
          )}
        </g>
      ))}

      {/* Designated spot star (B5 emphasized, others dimmed) */}
      <DesignatedStar cx={DESIGNATED_SPOT.x} cy={DESIGNATED_SPOT.y} emphasized={starEmphasized} />

      {/* Pins on top */}
      {pins.map((pin) => (
        <CarPin
          key={pin.carBrand}
          brand={pin.carBrand}
          cx={pin.pinX}
          cy={pin.pinY}
          size={miniLabels ? 22 : 36}
        />
      ))}
    </svg>
  );
}

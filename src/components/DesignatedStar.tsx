interface Props {
  cx: number;
  cy: number;
  emphasized: boolean;
}

// SVG 5-point star path centered at origin with radius r
function starPath(r: number): string {
  const points: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.5;
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  return 'M ' + points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ') + ' Z';
}

export function DesignatedStar({ cx, cy, emphasized }: Props) {
  const r = emphasized ? 13 : 11;
  return (
    <g transform={`translate(${cx} ${cy})`} style={{ pointerEvents: 'none' }} opacity={emphasized ? 1 : 0.55}>
      <path
        d={starPath(r)}
        fill="#FEE500"
        stroke="#222"
        strokeWidth={emphasized ? 1.5 : 1}
        strokeLinejoin="round"
      />
    </g>
  );
}

import { useState } from 'react';
import { FloorMap } from '../components/FloorMap';
import { CarPin } from '../components/CarPin';
import type { CarBrand, Floor, ParkingRecord } from '../lib/types';
import { CAR_NAMES, FLOORS } from '../lib/types';
import { pointToZone } from '../lib/zones';

interface Props {
  initialBrand?: CarBrand;
  initialFloor?: Floor;
  initialRecord?: ParkingRecord | null;
  onSave: (record: ParkingRecord) => void;
  onGoStatus: () => void;
}

export function Record({
  initialBrand = 'mercedes',
  initialFloor = 'B5',
  initialRecord = null,
  onSave,
  onGoStatus,
}: Props) {
  const [brand, setBrand] = useState<CarBrand>(initialBrand);
  const [floor, setFloor] = useState<Floor>(initialFloor);
  const [pin, setPin] = useState<{ x: number; y: number } | null>(
    initialRecord && initialRecord.carBrand === initialBrand && initialRecord.floor === initialFloor
      ? { x: initialRecord.pinX, y: initialRecord.pinY }
      : null,
  );

  const zone = pin ? pointToZone(pin.x, pin.y) : null;
  const canSave = !!pin && zone && zone !== '주차불가';

  function handleSave() {
    if (!pin || !zone) return;
    onSave({
      carBrand: brand,
      floor,
      pinX: pin.x,
      pinY: pin.y,
      zone,
      recordedAt: Date.now(),
    });
  }

  return (
    <div className="h-full w-full bg-bg-page flex flex-col">
      <div className="h-[44px]" />
      <div className="relative h-14 flex items-center justify-center">
        <h1 className="text-ink-900 font-bold text-xl">주차 기록</h1>
        <button
          onClick={onGoStatus}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-800 text-sm font-medium"
        >
          현황 →
        </button>
      </div>

      {/* Car chips */}
      <div className="px-4 pt-3 flex gap-2">
        {(['mercedes', 'jaguar', 'audi'] as CarBrand[]).map((b) => {
          const selected = brand === b;
          return (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-[10px] rounded-[12px] border transition ${
                selected ? 'bg-kakao border-kakao border-[2px]' : 'bg-white border-ink-200'
              }`}
            >
              <ChipPin brand={b} />
              <span className="font-bold text-sm text-ink-900">{CAR_NAMES[b]}</span>
            </button>
          );
        })}
      </div>

      {/* Floor pills */}
      <div className="px-4 pt-3 flex gap-2">
        {FLOORS.map((f) => {
          const selected = f === floor;
          return (
            <button
              key={f}
              onClick={() => setFloor(f)}
              className={`flex-1 py-[10px] rounded-[12px] border transition font-bold ${
                selected
                  ? 'bg-ink-900 text-white border-ink-900'
                  : 'bg-white text-ink-800 border-ink-200'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="flex-1 px-4 pt-4 flex flex-col items-center">
        <div style={{ width: '100%', maxWidth: 343, aspectRatio: '1 / 1' }}>
          <FloorMap
            size={343}
            starEmphasized={floor === 'B5'}
            onMapTap={(x, y) => setPin({ x, y })}
            pins={pin ? [{ carBrand: brand, floor, pinX: pin.x, pinY: pin.y, zone: zone ?? 'A', recordedAt: 0 }] : []}
            activeBrand={brand}
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-ink-800 font-medium">
            {pin ? (
              zone === '주차불가' ? (
                <span className="text-[#E02000]">주차 불가 영역이에요. 다른 위치를 선택해주세요.</span>
              ) : (
                <>
                  <strong>{CAR_NAMES[brand]}</strong> · {floor} {zone}구역에 주차했어요
                </>
              )
            ) : (
              <span className="text-ink-400">지도에서 차를 세운 위치를 탭해주세요</span>
            )}
          </p>
        </div>
      </div>

      {/* Save CTA */}
      <div className="px-4 pb-8 pt-3">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-4 rounded-[12px] font-bold text-base transition ${
            canSave ? 'bg-kakao text-ink-900 active:opacity-80' : 'bg-ink-200 text-ink-400'
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
}

function ChipPin({ brand }: { brand: CarBrand }) {
  return (
    <div style={{ width: 24, height: 24 }}>
      <svg viewBox="-12 -12 24 24" width={24} height={24}>
        <CarPin brand={brand} cx={0} cy={0} size={22} />
      </svg>
    </div>
  );
}

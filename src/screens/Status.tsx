import { useState } from 'react';
import { FloorMap } from '../components/FloorMap';
import { CarPin } from '../components/CarPin';
import type { CarBrand, Floor, ParkingRecord } from '../lib/types';
import { CAR_NAMES, FLOORS } from '../lib/types';
import type { SyncStatus } from '../lib/sync';

interface Props {
  records: { [K in CarBrand]: ParkingRecord | null };
  syncStatus: SyncStatus;
  groupId: string;
  onGoRecord: () => void;
  onClearCar: (brand: CarBrand) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (isToday) return `${hh}:${mm}`;
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}

export function Status({ records, syncStatus, groupId, onGoRecord, onClearCar }: Props) {
  const [actionFor, setActionFor] = useState<CarBrand | null>(null);

  const byFloor: { [K in Floor]: ParkingRecord[] } = { B3: [], B4: [], B5: [], B6: [] };
  (Object.values(records).filter(Boolean) as ParkingRecord[]).forEach((r) => byFloor[r.floor].push(r));

  return (
    <div className="h-full w-full bg-bg-page flex flex-col">
      <div className="h-[44px]" />
      <div className="relative h-14 flex items-center justify-center">
        <h1 className="text-ink-900 font-bold text-xl">차량 현황</h1>
        <button
          onClick={onGoRecord}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-800 text-sm font-medium"
        >
          + 기록
        </button>
        <SyncBadge status={syncStatus} groupId={groupId} />
      </div>

      {/* 4 mini floor maps */}
      <div className="px-4 pt-1 grid grid-cols-2 gap-3">
        {FLOORS.map((f) => {
          const pins = byFloor[f];
          const empty = pins.length === 0;
          return (
            <div key={f}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-ink-900 font-bold text-sm">{f}</span>
                {empty && <span className="text-ink-400 text-xs">없음</span>}
              </div>
              <div style={{ opacity: empty ? 0.4 : 1 }}>
                <FloorMap size={158} starEmphasized={f === 'B5'} pins={pins} miniLabels />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary list */}
      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-2 overflow-y-auto">
        {(['mercedes', 'jaguar', 'audi'] as CarBrand[]).map((brand) => {
          const r = records[brand];
          return (
            <button
              key={brand}
              onClick={() => r && setActionFor(brand)}
              className="bg-white border border-ink-200 rounded-[12px] px-3 py-[10px] flex items-center gap-3 text-left active:bg-bg-fill transition"
            >
              <div style={{ width: 32, height: 32 }}>
                <svg viewBox="-16 -16 32 32" width={32} height={32}>
                  <CarPin brand={brand} cx={0} cy={0} size={30} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[15px] text-ink-900">{CAR_NAMES[brand]}</span>
                  {r ? (
                    <span className="font-bold text-[13px] text-ink-800">
                      {r.floor} · {r.zone}구역
                    </span>
                  ) : (
                    <span className="text-[13px] text-ink-400">위치 미기록</span>
                  )}
                </div>
                {r && <div className="text-xs text-ink-400 mt-0.5">{formatTime(r.recordedAt)}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action sheet */}
      {actionFor && (
        <ActionSheet
          carName={CAR_NAMES[actionFor]}
          onLeave={() => {
            onClearCar(actionFor);
            setActionFor(null);
          }}
          onClose={() => setActionFor(null)}
        />
      )}
    </div>
  );
}

function SyncBadge({ status, groupId }: { status: SyncStatus; groupId: string }) {
  const dot =
    status === 'live' ? 'bg-[#47B881]' :
    status === 'syncing' ? 'bg-[#FF9800]' : 'bg-ink-200';
  const label =
    status === 'live' ? '실시간' :
    status === 'syncing' ? '동기화 중' : '오프라인';
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5" title={`그룹: ${groupId}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="text-[11px] text-ink-400">{label}</span>
    </div>
  );
}

function ActionSheet({ carName, onLeave, onClose }: { carName: string; onLeave: () => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-10" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute left-3 right-3 bottom-3 rounded-[14px] bg-white overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 text-center text-ink-400 text-xs border-b border-ink-200">
          {carName} 옵션
        </div>
        <button
          onClick={onLeave}
          className="w-full py-4 text-[#E02000] font-bold border-b border-ink-200 active:bg-bg-fill"
        >
          출차 처리
        </button>
        <button onClick={onClose} className="w-full py-4 text-ink-800 font-medium active:bg-bg-fill">
          취소
        </button>
      </div>
    </div>
  );
}

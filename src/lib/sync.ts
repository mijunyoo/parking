import { useEffect, useState } from 'react';
import type { CarBrand, ParkingRecord } from './types';
import { supabase, isSyncEnabled, type DbRow } from './supabase';
import { getGroupId } from './group';
import { loadAll, saveCurrent as saveLocalCurrent, clearCar as clearLocalCar } from './storage';

type RecordsState = { [K in CarBrand]: ParkingRecord | null };

function dbToRecord(row: DbRow): ParkingRecord {
  return {
    carBrand: row.car_brand,
    floor: row.floor,
    pinX: row.pin_x,
    pinY: row.pin_y,
    zone: row.zone as ParkingRecord['zone'],
    recordedAt: new Date(row.recorded_at).getTime(),
  };
}

function recordToDb(groupId: string, r: ParkingRecord): DbRow {
  return {
    group_id: groupId,
    car_brand: r.carBrand,
    floor: r.floor,
    pin_x: r.pinX,
    pin_y: r.pinY,
    zone: r.zone,
    recorded_at: new Date(r.recordedAt).toISOString(),
  };
}

export type SyncStatus = 'offline' | 'syncing' | 'live';

export function useFamilySync() {
  const [records, setRecords] = useState<RecordsState>(loadAll());
  const [status, setStatus] = useState<SyncStatus>('offline');
  const groupId = getGroupId();

  // Initial fetch + realtime subscription
  useEffect(() => {
    if (!isSyncEnabled || !supabase) {
      setStatus('offline');
      return;
    }
    let active = true;
    setStatus('syncing');

    (async () => {
      const { data, error } = await supabase
        .from('parking_records')
        .select('*')
        .eq('group_id', groupId);
      if (!active) return;
      if (error) {
        console.warn('[sync] fetch error', error);
        setStatus('offline');
        return;
      }
      const next: RecordsState = { mercedes: null, jaguar: null, audi: null };
      (data as DbRow[]).forEach((row) => {
        next[row.car_brand] = dbToRecord(row);
      });
      setRecords(next);
      setStatus('live');
    })();

    const channel = supabase
      .channel(`parking:${groupId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parking_records', filter: `group_id=eq.${groupId}` },
        (payload) => {
          if (!active) return;
          if (payload.eventType === 'DELETE') {
            const old = payload.old as DbRow;
            setRecords((prev) => ({ ...prev, [old.car_brand]: null }));
          } else {
            const row = payload.new as DbRow;
            setRecords((prev) => ({ ...prev, [row.car_brand]: dbToRecord(row) }));
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  /** Save (upsert) a parking record. Optimistic local update + remote upsert. */
  async function save(record: ParkingRecord) {
    setRecords((prev) => ({ ...prev, [record.carBrand]: record }));
    saveLocalCurrent(record);
    if (!isSyncEnabled || !supabase) return;
    const { error } = await supabase
      .from('parking_records')
      .upsert(recordToDb(groupId, record), { onConflict: 'group_id,car_brand' });
    if (error) console.warn('[sync] save error', error);
  }

  /** Clear (delete) a car's current parking. */
  async function clear(brand: CarBrand) {
    setRecords((prev) => ({ ...prev, [brand]: null }));
    clearLocalCar(brand);
    if (!isSyncEnabled || !supabase) return;
    const { error } = await supabase
      .from('parking_records')
      .delete()
      .eq('group_id', groupId)
      .eq('car_brand', brand);
    if (error) console.warn('[sync] clear error', error);
  }

  return { records, status, groupId, save, clear };
}

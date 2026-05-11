import type { CarBrand, ParkingRecord } from './types';

const KEY = 'naeoju.records.v1';

type Store = Record<CarBrand, ParkingRecord | null>;

const empty: Store = { mercedes: null, jaguar: null, audi: null };

export function loadAll(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed };
  } catch {
    return { ...empty };
  }
}

export function saveCurrent(record: ParkingRecord): Store {
  const all = loadAll();
  all[record.carBrand] = record;
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

export function clearCar(brand: CarBrand): Store {
  const all = loadAll();
  all[brand] = null;
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}

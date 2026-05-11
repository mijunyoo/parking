export type CarBrand = 'mercedes' | 'jaguar' | 'audi';
export type Floor = 'B3' | 'B4' | 'B5' | 'B6';
export type ZoneName =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
  | '주차불가';

export const FLOORS: Floor[] = ['B3', 'B4', 'B5', 'B6'];

export const CAR_NAMES: Record<CarBrand, string> = {
  mercedes: '아빠차',
  jaguar:   '엄마차',
  audi:     '미르차',
};

export const CAR_BRAND_COLOR: Record<CarBrand, string> = {
  mercedes: '#16409C',
  jaguar:   '#E54E9B',
  audi:     '#C11010',
};

export interface ParkingRecord {
  carBrand: CarBrand;
  floor: Floor;
  pinX: number;     // 0..343 (map base coordinate)
  pinY: number;     // 0..343
  zone: ZoneName;
  recordedAt: number; // unix ms
}

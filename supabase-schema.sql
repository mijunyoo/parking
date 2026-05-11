-- =====================================================
-- 나어주 — 가족 주차 위치 공유 앱 / Supabase 스키마
-- =====================================================
-- 사용법:
-- 1. Supabase 대시보드 → SQL Editor → New query
-- 2. 이 파일 전체를 붙여넣고 Run
-- 3. .env.local 에 Project URL, anon key 입력
-- =====================================================

-- 1) 테이블: 가족 그룹별 차량 현재 위치 (각 차량당 1개 행)
create table if not exists public.parking_records (
  group_id    text not null,
  car_brand   text not null check (car_brand in ('mercedes','jaguar','audi')),
  floor       text not null check (floor in ('B3','B4','B5','B6')),
  pin_x       numeric not null,
  pin_y       numeric not null,
  zone        text not null,
  recorded_at timestamptz not null default now(),
  primary key (group_id, car_brand)
);

-- 2) Realtime 활성화 (Supabase가 변경사항을 즉시 broadcast)
alter publication supabase_realtime add table public.parking_records;

-- 3) Row Level Security — 가족 그룹 URL을 아는 누구나 읽기/쓰기 허용
--    (인증 없는 단순 모델. 외부에 URL이 노출되지 않게 가족끼리만 공유.)
alter table public.parking_records enable row level security;

create policy "anyone can read"
  on public.parking_records for select
  using (true);

create policy "anyone can insert"
  on public.parking_records for insert
  with check (true);

create policy "anyone can update"
  on public.parking_records for update
  using (true);

create policy "anyone can delete"
  on public.parking_records for delete
  using (true);

-- 끝

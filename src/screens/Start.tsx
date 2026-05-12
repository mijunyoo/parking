import carsRow from '../assets/car-row.jpeg';

interface Props {
  onStart: () => void;
}

export function Start({ onStart }: Props) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="h-[6px] bg-kakao" />

      <div className="px-8 pt-12 text-center">
        <p className="text-ink-600 text-base font-medium">나 여기 주차했누?</p>
        <h1 className="mt-3 text-[88px] leading-none font-black text-ink-900 tracking-tight">
          나여주?
        </h1>
      </div>

      <div className="mt-10 px-8 flex justify-center">
        <img
          src={carsRow}
          alt="cars"
          className="w-full max-w-[360px] h-auto object-contain"
        />
      </div>

      <div className="mt-10 px-8">
        <button
          onClick={onStart}
          className="w-full py-[18px] rounded-[16px] bg-kakao text-ink-900 font-bold text-[17px] active:opacity-80 transition"
        >
          시작하기
        </button>
      </div>

      <div className="flex-1" />

      <div className="px-8 pb-8 pt-4">
        <p className="text-center text-ink-400 text-xs">가입 없이 가족 링크로 바로 시작</p>
      </div>
    </div>
  );
}

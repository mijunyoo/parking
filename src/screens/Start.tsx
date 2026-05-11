import { CarPanel } from '../components/CarPanel';

interface Props {
  onStart: () => void;
}

export function Start({ onStart }: Props) {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="h-[32px]" />
      <div className="h-[6px] bg-kakao" />

      <div className="px-8 pt-12 text-center">
        <p className="text-ink-600 text-base font-medium">나 어디 주차했지?</p>
        <h1 className="mt-3 text-[88px] leading-none font-black text-ink-900 tracking-tight">나어주</h1>
      </div>

      <div className="mt-8 flex-1 flex flex-col items-center gap-3 px-8">
        <CarPanel brand="mercedes" />
        <CarPanel brand="jaguar" />
        <CarPanel brand="audi" />
      </div>

      <div className="px-8 pb-8 pt-4">
        <button
          onClick={onStart}
          className="w-full py-[18px] rounded-[16px] bg-kakao text-ink-900 font-bold text-[17px] active:opacity-80 transition"
        >
          시작하기
        </button>
        <p className="mt-3 text-center text-ink-400 text-xs">가입 없이 가족 링크로 바로 시작</p>
      </div>
    </div>
  );
}

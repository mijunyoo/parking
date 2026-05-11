import { useState } from 'react';
import { Start } from './screens/Start';
import { Record as RecordScreen } from './screens/Record';
import { Status } from './screens/Status';
import { useFamilySync } from './lib/sync';
import type { ParkingRecord } from './lib/types';

type ScreenName = 'start' | 'record' | 'status';

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('start');
  const { records, status, groupId, save, clear } = useFamilySync();

  async function handleSave(record: ParkingRecord) {
    await save(record);
    setScreen('status');
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-bg-page">
      <div className="relative w-full max-w-[420px] h-full max-h-[900px] bg-white shadow-xl overflow-hidden md:rounded-[24px] md:my-4">
        {screen === 'start' && <Start onStart={() => setScreen('status')} />}
        {screen === 'record' && (
          <RecordScreen
            initialBrand="mercedes"
            initialFloor="B5"
            initialRecord={records.mercedes}
            onSave={handleSave}
            onGoStatus={() => setScreen('status')}
          />
        )}
        {screen === 'status' && (
          <Status
            records={records}
            syncStatus={status}
            groupId={groupId}
            onGoRecord={() => setScreen('record')}
            onClearCar={clear}
          />
        )}
      </div>
    </div>
  );
}

'use client';

import { useDateStore } from '@/store/dateStore';

export function DateSelector() {
  const selectedDate = useDateStore((state) => state.selectedDate);
  const setSelectedDate = useDateStore((state) => state.setSelectedDate);

  return (
    <div className="date-selector">
      <label className="field" style={{ minWidth: 220 }}>
        Selected day
        <input
          className="input"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          aria-label="Select task date"
        />
      </label>
      <button className="ghost-btn" type="button" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}>
        Today
      </button>
    </div>
  );
}

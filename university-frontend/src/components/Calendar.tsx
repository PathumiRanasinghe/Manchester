import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

const holidays = [
  { date: '2025-12-04', label: 'Unduvap Full Moon' },
  { date: '2025-12-25', label: 'Christmas Day' },
  { date: '2025-12-24', label: 'Christmas Eve' },
  { date: '2026-01-03', label: 'Duruthu Full Moon' },
];

function getHoliday(date: Date) {
  const iso = format(date, 'yyyy-MM-dd');
  return holidays.find(h => h.date === iso)?.label || null;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); 
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = 'EEE';
  const days = [];
  let day = startDate;
  let formattedDate = '';

  for (let i = 0; i < 7; i++) {
    formattedDate = format(addDays(day, i), dateFormat);
    days.push(
      <div key={i} className="text-xs font-semibold text-gray-500 text-center py-2">
        {formattedDate}
      </div>
    );
  }

  const rows = [];
  let daysInRow = [];
  let d = day;
  while (d <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = d;
      const isToday = isSameDay(cloneDay, today);
      const holiday = getHoliday(cloneDay);
      daysInRow.push(
        <div
          key={cloneDay.toString()}
          className={`h-10 border border-gray-200 relative flex flex-col items-center justify-center ${!isSameMonth(cloneDay, monthStart) ? 'bg-gray-50 text-gray-300' : ''}`}
        >
          <span className={`text-sm ${isToday ? 'bg-blue-500 text-white rounded-full px-2' : 'text-gray-700'}`}>{format(cloneDay, 'd')}</span>
          {holiday && (
            <span className="absolute bottom-1 left-1 right-1 bg-indigo-200 text-indigo-800 text-xs rounded px-1 truncate" title={holiday}>{holiday}</span>
          )}
        </div>
      );
      d = addDays(d, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={d.toString()}>
        {daysInRow}
      </div>
    );
    daysInRow = [];
  }

  return (
    <div>
      <div className="font-semibold text-lg text-stone-700 mb-2">Calendar</div>
      <div className="flex items-center justify-between mb-2">
        <button className="px-2 py-1 rounded bg-gray-200" onClick={() => setCurrentMonth(addDays(monthStart, -1))}>{'<'}</button>
        <span className="font-bold text-md">{format(currentMonth, 'MMM yyyy')}</span>
        <button className="px-2 py-1 rounded bg-gray-200" onClick={() => setCurrentMonth(addDays(monthEnd, 1))}>{'>'}</button>
      </div>
      <div className="grid grid-cols-7 border-b border-gray-200">{days}</div>
      <div className="flex flex-col gap-0">{rows}</div>
    </div>
  );
}

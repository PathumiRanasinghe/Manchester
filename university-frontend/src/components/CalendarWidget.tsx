const daysOfWeek = ['MO','TU','WE','TH','FR','SA','SU'];

function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function CalendarWidget() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const days = getMonthDays(year, month);
  const firstDay = days[0].getDay();
  const offset = (firstDay === 0 ? 6 : firstDay - 1);

  return (
    <div className="bg-indigo-900 text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span>{monthName} {year}</span>
        <span className="text-lg">{today}</span>
      </div>
      <div className="grid grid-cols-7 gap-2 text-xs">
        {daysOfWeek.map((d, i) => (
          <div key={d} className="text-center">{d}</div>
        ))}
        {Array(offset).fill(null).map((_, i) => (
          <div key={i}></div>
        ))}
        {days.map((dateObj) => {
          const d = dateObj.getDate();
          const isToday = d === today;
          return (
            <div
              key={d}
              className={`text-center py-1 rounded ${isToday ? 'bg-indigo-400 text-white' : 'bg-indigo-800'}`}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
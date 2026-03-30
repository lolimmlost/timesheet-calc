import React from 'react';
import { calculateDailyHours, formatHoursDisplay } from '../utils/timeCalculations';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

/**
 * PrintView - A clean, print-optimized timesheet layout
 * Compact design to fit on a single page
 */
const PrintView = ({ timesheetData, weeklyTotal }) => {
  const formatTime = (hour, minute, period) => {
    if (!hour) return '-';
    return `${hour}:${(minute || '0').toString().padStart(2, '0')} ${period}`;
  };

  const formatBreak = (hours, minutes) => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    if (h === 0 && m === 0) return '-';
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const getDailyHours = (dayData) => {
    return calculateDailyHours(
      dayData.startHour ? {
        hour: parseInt(dayData.startHour),
        minute: parseInt(dayData.startMinute),
        period: dayData.startPeriod
      } : null,
      dayData.endHour ? {
        hour: parseInt(dayData.endHour),
        minute: parseInt(dayData.endMinute),
        period: dayData.endPeriod
      } : null,
      {
        hours: parseInt(dayData.breakHours),
        minutes: parseInt(dayData.breakMinutes)
      },
      dayData.isOvernight
    );
  };

  // Calculate stats
  const daysWorked = DAYS_OF_WEEK.filter(({ key }) => getDailyHours(timesheetData.days[key]) > 0).length;
  const avgHoursPerDay = daysWorked > 0 ? weeklyTotal / daysWorked : 0;
  const overtime = weeklyTotal > 40 ? weeklyTotal - 40 : 0;

  return (
    <div className="print-view hidden print:block">
      {/* Compact Header with Employee Info inline */}
      <div className="print-header flex justify-between items-end border-b-2 border-black pb-2 mb-3">
        <div>
          <h1 className="text-xl font-bold">Weekly Timesheet</h1>
        </div>
        <div className="text-right text-sm">
          <div><span className="font-semibold">Employee:</span> {timesheetData.name || '_________________'}</div>
          <div><span className="font-semibold">Period:</span> {timesheetData.dateRange || '_________________'}</div>
        </div>
      </div>

      {/* Timesheet Table - Compact */}
      <table className="print-table w-full border-collapse mb-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 px-2 py-1 text-left font-semibold">Day</th>
            <th className="border border-gray-400 px-2 py-1 text-center font-semibold">Start</th>
            <th className="border border-gray-400 px-2 py-1 text-center font-semibold">End</th>
            <th className="border border-gray-400 px-2 py-1 text-center font-semibold">Break</th>
            <th className="border border-gray-400 px-2 py-1 text-right font-semibold">Hours</th>
          </tr>
        </thead>
        <tbody>
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const dayData = timesheetData.days[key];
            const hours = getDailyHours(dayData);
            const hasData = dayData.startHour || dayData.endHour;

            return (
              <tr key={key} className={hasData ? '' : 'text-gray-400'}>
                <td className="border border-gray-400 px-2 py-1 font-medium">
                  {label}{dayData.isOvernight && '*'}
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">
                  {formatTime(dayData.startHour, dayData.startMinute, dayData.startPeriod)}
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">
                  {formatTime(dayData.endHour, dayData.endMinute, dayData.endPeriod)}
                </td>
                <td className="border border-gray-400 px-2 py-1 text-center">
                  {formatBreak(dayData.breakHours, dayData.breakMinutes)}
                </td>
                <td className="border border-gray-400 px-2 py-1 text-right font-medium tabular-nums">
                  {hours > 0 ? formatHoursDisplay(hours) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td colSpan="4" className="border border-gray-400 px-2 py-1 text-right">
              Total:
            </td>
            <td className="border border-gray-400 px-2 py-1 text-right tabular-nums">
              {formatHoursDisplay(weeklyTotal)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Compact Summary - inline */}
      <div className="print-summary flex justify-between items-center mb-4 py-2 px-3 bg-gray-50 border border-gray-300 text-sm">
        <div><span className="font-semibold">Days Worked:</span> {daysWorked}</div>
        <div><span className="font-semibold">Avg/Day:</span> {formatHoursDisplay(avgHoursPerDay)}</div>
        <div><span className="font-semibold">Overtime (40h+):</span> {overtime > 0 ? formatHoursDisplay(overtime) : '-'}</div>
      </div>

      {/* Signature Lines - More compact */}
      <div className="print-signatures grid grid-cols-2 gap-6 mt-6">
        <div>
          <div className="border-b border-black mb-1 h-6"></div>
          <div className="text-xs flex justify-between">
            <span className="font-semibold">Employee Signature</span>
            <span>Date: __________</span>
          </div>
        </div>
        <div>
          <div className="border-b border-black mb-1 h-6"></div>
          <div className="text-xs flex justify-between">
            <span className="font-semibold">Supervisor Signature</span>
            <span>Date: __________</span>
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="print-footer mt-4 pt-2 border-t border-gray-300 text-xs text-gray-500 flex justify-between">
        <span>{new Date().toLocaleDateString()}</span>
        <span>* Overnight shift</span>
        <span>Time Card Calculator</span>
      </div>
    </div>
  );
};

export default PrintView;

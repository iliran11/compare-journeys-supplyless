import dayjs from 'dayjs';

export default function padTime(time, minutesDelta) {
  const clamped = Math.max(0, Math.min(1439, dayjs('2000-01-01 ' + time).diff(dayjs('2000-01-01'), 'minute') + minutesDelta));
  return dayjs('2000-01-01').add(clamped, 'minute').format('HH:mm');
}

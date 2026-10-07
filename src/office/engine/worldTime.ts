export type WorldPeriod =
  | 'NIGHT'
  | 'DAWN'
  | 'MORNING'
  | 'AFTERNOON'
  | 'EVENING'
  | 'DUSK';

export interface WorldTime {
  hour: number;
  minute: number;
  second: number;

  period: WorldPeriod;

  isDay: boolean;
  isWorkingTime: boolean;
  isPrayerTime: boolean;
}

export function getWorldTime(
  date = new Date(),
): WorldTime {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  let period: WorldPeriod;

  if (hour >= 5 && hour < 6) {
    period = 'DAWN';
  } else if (hour >= 6 && hour < 12) {
    period = 'MORNING';
  } else if (hour >= 12 && hour < 17) {
    period = 'AFTERNOON';
  } else if (hour >= 17 && hour < 19) {
    period = 'DUSK';
  } else if (hour >= 19 && hour < 22) {
    period = 'EVENING';
  } else {
    period = 'NIGHT';
  }

  const isDay =
    hour >= 6 &&
    hour < 18;

  const isWorkingTime =
    hour >= 8 &&
    hour < 17;

  const isPrayerTime =
    isPrayerWindow(hour, minute);

  return {
    hour,
    minute,
    second,
    period,
    isDay,
    isWorkingTime,
    isPrayerTime,
  };
}

function isPrayerWindow(
  hour: number,
  minute: number,
): boolean {
  const time = hour * 60 + minute;

  const fajrStart = 4 * 60 + 30;
  const fajrEnd = 5 * 60 + 30;

  const dhuhrStart = 12 * 60;
  const dhuhrEnd = 13 * 60 + 30;

  const asrStart = 15 * 60;
  const asrEnd = 16 * 60 + 30;

  const maghribStart = 18 * 60;
  const maghribEnd = 19 * 60;

  const ishaStart = 19 * 60 + 30;
  const ishaEnd = 21 * 60;

  return (
    (time >= fajrStart && time < fajrEnd) ||
    (time >= dhuhrStart && time < dhuhrEnd) ||
    (time >= asrStart && time < asrEnd) ||
    (time >= maghribStart && time < maghribEnd) ||
    (time >= ishaStart && time < ishaEnd)
  );
}

export function formatWorldClock(
  time: WorldTime,
): string {
  return `${String(time.hour).padStart(2, '0')}:${String(
    time.minute,
  ).padStart(2, '0')}`;
}

export function getPeriodLabel(
  period: WorldPeriod,
): string {
  switch (period) {
    case 'DAWN':
      return 'Fajar';

    case 'MORNING':
      return 'Pagi';

    case 'AFTERNOON':
      return 'Siang';

    case 'DUSK':
      return 'Senja';

    case 'EVENING':
      return 'Malam';

    default:
      return 'Malam';
  }
}

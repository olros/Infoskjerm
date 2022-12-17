import type { SessionIdStorageStrategy } from '@remix-run/node';
import { createCookieSessionStorage } from '@remix-run/node';
import { hoursToSeconds } from 'date-fns';

import type { ElectricityRegion } from './routes';
import type { StopPlace } from './routes/api.entur.search';

export const DEFAULT_COOKIE_OPTIONS: SessionIdStorageStrategy['cookie'] = {
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  secrets: ['infoscreen'],
  secure: process.env.NODE_ENV === 'production',
};

export type KioskSessionData = {
  stopPlace: StopPlace | null;
  electricityRegion: ElectricityRegion['id'] | null;
};

export const kioskSession = createCookieSessionStorage({
  cookie: {
    ...DEFAULT_COOKIE_OPTIONS,
    name: '_infoscreen',
    maxAge: hoursToSeconds(24 * 365 * 2), // 2 years
  },
});

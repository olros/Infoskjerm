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

export const getKioskSettings = async (request: Request) => {
  const session = await kioskSession.getSession(request.headers?.get('Cookie'));
  const data: KioskSessionData = { electricityRegion: null, stopPlace: null };
  if (session.has('electricityRegion')) {
    data['electricityRegion'] = session.get('electricityRegion') as KioskSessionData['electricityRegion'];
  }
  if (session.has('stopPlace')) {
    data['stopPlace'] = JSON.parse(session.get('stopPlace')) as KioskSessionData['stopPlace'];
  }
  return data;
};

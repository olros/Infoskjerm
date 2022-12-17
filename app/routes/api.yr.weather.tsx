import type { LoaderArgs } from '@remix-run/node';
import { getKioskSettings } from '~/cookies.server';

import type { StopPlace } from './api.entur.search';

type WeatherRawResponse = {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number, number] };
  properties: {
    meta: {
      updated_at: string;
      units: {
        air_temperature: string;
        precipitation_amount: string;
        precipitation_rate: string;
        relative_humidity: string;
        wind_from_direction: string;
        wind_speed: string;
        wind_speed_of_gust: string;
      };
      radar_coverage: string;
    };
    timeseries: [
      {
        time: string;
        data: {
          instant: {
            details: {
              air_temperature: number;
              precipitation_rate: number;
              relative_humidity: number;
              wind_from_direction: number;
              wind_speed: number;
              wind_speed_of_gust: number;
            };
          };
        };
      },
      {
        time: string;
        data: {
          instant: {
            details: {
              precipitation_rate: number;
            };
          };
        };
      },
    ];
  };
};

export type WeatherResponse = {
  timeseries: WeatherRawResponse['properties']['timeseries'];
  rainNext90min: number;
  now: WeatherRawResponse['properties']['timeseries'][0]['data']['instant']['details'];
};

export const loader = async ({ request }: LoaderArgs) => {
  const kioskSettings = await getKioskSettings(request);
  if (!kioskSettings.stopPlace) {
    return [];
  }
  return await loadWeather(kioskSettings.stopPlace);
};

export const loadWeather = async (stopPlace: StopPlace): Promise<WeatherResponse> => {
  const lat = Number(stopPlace.lat.toFixed(4));
  const lon = Number(stopPlace.lon.toFixed(4));
  const results: WeatherRawResponse = await fetch(`https://api.met.no/weatherapi/nowcast/2.0/complete?lat=${lat}&lon=${lon}`, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'infoskjerm.olafros.com github.com/olros',
    },
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  const timeseries = results.properties.timeseries;
  const rainNext90min = timeseries.reduce((sum, point) => sum + point.data.instant.details.precipitation_rate, 0);
  const details = timeseries[0].data.instant.details;

  return {
    rainNext90min,
    now: details,
    timeseries,
  };
};

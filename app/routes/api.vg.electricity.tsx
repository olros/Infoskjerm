import type { LoaderArgs } from '@remix-run/node';
import { getKioskSettings } from '~/cookies.server';
import { format } from 'date-fns';

import type { ElectricityRegion } from '.';

export const loader = async ({ request }: LoaderArgs) => {
  const kioskSettings = await getKioskSettings(request);
  if (!kioskSettings.electricityRegion) {
    return [];
  }
  return await loadElectricitryPrices(kioskSettings.electricityRegion);
};

type ElectricityRawResponse = {
  date: string;
  updated: string;
  price: Record<ElectricityRegion['id'], number>;
  priceByHour: {
    date: string;
    updated: string;
    hours: string[];
    pricesObj: Record<ElectricityRegion['id'], number[]>;
  };
};

export type ElectricityResponsePrice = {
  hour: string;
  price: number;
};

export type ElectricityResponse = {
  averagePrice: number;
  prices: ElectricityResponsePrice[];
};

export const loadElectricitryPrices = async (electricityRegion: string): Promise<ElectricityResponse> => {
  const date = format(new Date(), 'yyyy-MM-dd');
  const results: ElectricityRawResponse = await fetch(`https://redutv-api.vg.no/power-data/v2/nordpool/price-by-date/${date}`, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  const response: ElectricityResponse = {
    averagePrice: results.price[electricityRegion],
    prices: results.priceByHour.pricesObj[electricityRegion].map((price, index) => ({
      price,
      hour: results.priceByHour.hours[index].split('-')[0],
    })),
  };
  return response;
};

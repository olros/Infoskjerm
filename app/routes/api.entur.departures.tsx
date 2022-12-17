import type { LoaderArgs } from '@remix-run/node';
import { getKioskSettings } from '~/cookies.server';

import type { StopPlace } from './api.entur.search';

export type Departure = {
  realtime: boolean;
  aimedDepartureTime: string;
  expectedDepartureTime: string;
  destinationDisplay: {
    frontText: string;
  };
  serviceJourney: {
    id: string;
    line: {
      publicCode: string;
    };
  };
};

export type DeparturesResponse = {
  data: {
    stopPlace: {
      id: string;
      name: string;
      estimatedCalls: Departure[];
    };
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const kioskSettings = await getKioskSettings(request);
  if (!kioskSettings.stopPlace) {
    return [];
  }
  return await loadStopPlaceDepartures(kioskSettings.stopPlace);
};

export const loadStopPlaceDepartures = async (stopPlace: StopPlace): Promise<DeparturesResponse> => {
  const query = `
{
  stopPlace(id: "${stopPlace.id}") {
    id
    name
    estimatedCalls(
      timeRange: 86400
      numberOfDepartures: 20
      arrivalDeparture: departures
    ) {
      realtime
      aimedDepartureTime
      expectedDepartureTime
      destinationDisplay {
        frontText
      }
      serviceJourney {
        id
        line {
          publicCode
        }
      }
    }
  }
}`;
  const results: DeparturesResponse = await fetch(`https://api.entur.io/journey-planner/v3/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ET-Client-Name': 'infoskjerm.olafros.com' },
    body: JSON.stringify({ query }),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));
  return results;
};

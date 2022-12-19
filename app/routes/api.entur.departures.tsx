import type { LoaderArgs } from '@remix-run/node';
import { getKioskSettings } from '~/cookies.server';

import type { StopPlace } from './api.entur.search';

type DepartureRaw = {
  realtime: boolean;
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

type DeparturesRawResponse = {
  data: {
    stopPlace: {
      id: string;
      name: string;
      estimatedCalls: DepartureRaw[];
    };
  };
};

export type Departure = {
  publicCode: string;
  frontText: string;
  realtime: boolean;
  departureTime: string;
  id: string;
};

export type DeparturesResponse = {
  name: string;
  departures: Departure[];
};

export const loader = async ({ request }: LoaderArgs) => {
  const kioskSettings = await getKioskSettings(request);
  if (!kioskSettings.stopPlace) {
    return null;
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
  const results: DeparturesRawResponse = await fetch(`https://api.entur.io/journey-planner/v3/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ET-Client-Name': 'infoskjerm.olafros.com' },
    body: JSON.stringify({ query }),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));
  return {
    name: results.data.stopPlace.name,
    departures: results.data.stopPlace.estimatedCalls.map((call) => ({
      departureTime: call.expectedDepartureTime,
      frontText: call.destinationDisplay.frontText,
      publicCode: call.serviceJourney.line.publicCode,
      realtime: call.realtime,
      id: call.serviceJourney.id,
    })),
  };
};

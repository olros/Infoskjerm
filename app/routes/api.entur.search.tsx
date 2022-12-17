import type { LoaderArgs } from '@remix-run/node';

type StopPlaceRaw = {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: 'NSR:StopPlace:3256';
    gid: 'whosonfirst:venue:NSR:StopPlace:3256';
    layer: 'venue';
    source: 'whosonfirst';
    source_id: 'NSR:StopPlace:3256';
    name: 'Rødhettes vei';
    street: 'NOT_AN_ADDRESS-NSR:StopPlace:3256';
    accuracy: 'point';
    country_a: 'NOR';
    county: 'Viken';
    county_gid: 'whosonfirst:county:KVE:TopographicPlace:30';
    locality: 'Asker';
    locality_gid: 'whosonfirst:locality:KVE:TopographicPlace:3025';
    label: 'Rødhettes vei, Asker';
    category: ['onstreetBus'];
    tariff_zones: ['BRA:TariffZone:215', 'RUT:FareZone:5', 'RUT:TariffZone:2V'];
  };
};

export type StopPlace = {
  id: string;
  label: string;
  lat: number;
  lon: number;
};

export const loader = async ({ request }: LoaderArgs): Promise<StopPlace[]> => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const search = searchParams.get('search');
  if (search) {
    const results: StopPlaceRaw[] = await fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${search}&size=20&lang=no&layers=venue`, {
      headers: {
        'ET-Client-Name': 'infoskjerm.olafros.com',
      },
    })
      .then((r) => r.json())
      .then((d) => d.features)
      .catch(() => []);

    return results.map((feature) => ({
      id: feature.properties.id,
      label: feature.properties.label,
      lon: feature.geometry.coordinates[0],
      lat: feature.geometry.coordinates[1],
    }));
  }
  return [];
};

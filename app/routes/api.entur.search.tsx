import type { LoaderArgs } from '@remix-run/node';

export type StopPlace = {
  id: string;
  label: string;
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const search = searchParams.get('search');
  if (search) {
    const results: StopPlace[] = await fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${search}&size=20&lang=no&layers=venue`, {
      headers: {
        'ET-Client-Name': 'infoskjerm.olafros.com',
      },
    })
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((d) => d.features.map((feature: any) => ({ id: feature.properties.id, label: feature.properties.label } as StopPlace)))
      .catch(() => []);
    return results;
  }
  return [];
};

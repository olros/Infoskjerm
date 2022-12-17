import { Card, styled, Typography } from '@mui/joy';
import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Departures } from '~/components/Departures';
import { Electricity } from '~/components/Electricity';
import { Weather } from '~/components/Weather';
import { getKioskSettings } from '~/cookies.server';

import { loadStopPlaceDepartures } from './api.entur.departures';
import { loadElectricitryPrices } from './api.vg.electricity';
import { loadWeather } from './api.yr.weather';

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: '1fr 1fr',
  padding: theme.spacing(2),
  height: '100vh',
  gap: theme.spacing(2),
}));

export const loader = async ({ request }: LoaderArgs) => {
  const kioskSettings = await getKioskSettings(request);

  if (!kioskSettings.stopPlace || !kioskSettings.electricityRegion) {
    throw redirect('/');
  }

  const [departures, electricitryPrices, weather] = await Promise.all([
    loadStopPlaceDepartures(kioskSettings.stopPlace),
    loadElectricitryPrices(kioskSettings.electricityRegion),
    loadWeather(kioskSettings.stopPlace),
  ]);

  return { departures, electricitryPrices, weather };
};

export default function Infoscreen() {
  const { departures, electricitryPrices, weather } = useLoaderData<typeof loader>();

  return (
    <Grid>
      <Card variant='outlined'>
        <Typography level='h2'>Strømprisen nå</Typography>
        <Electricity electricityResponse={electricitryPrices} />
      </Card>
      <Card sx={{ gridRow: 'span 2', gap: 1, overflow: 'hidden' }} variant='outlined'>
        <Departures departuresResponse={departures} />
      </Card>
      <Card variant='outlined'>
        <Typography level='h2'>Været nå</Typography>
        <Weather weatherResponse={weather} />
      </Card>
    </Grid>
  );
}

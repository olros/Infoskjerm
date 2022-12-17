import { Box, Typography } from '@mui/joy';
import { useFetcher } from '@remix-run/react';
import { getHours, minutesToMilliseconds } from 'date-fns';
import { useMemo, useState } from 'react';
import type { AxisOptions, UserSerie } from 'react-charts';
import { Chart } from 'react-charts';
import { useInterval } from 'usehooks-ts';

import type { ElectricityResponse, ElectricityResponsePrice } from '~/routes/api.vg.electricity';

export type ElectricityProps = {
  electricityResponse: ElectricityResponse;
};

export const Electricity = ({ electricityResponse }: ElectricityProps) => {
  const fetcher = useFetcher<ElectricityResponse>();
  const [hour, setHour] = useState(getHours(new Date()));

  const response = fetcher.data || electricityResponse;

  const primaryAxis = useMemo<AxisOptions<ElectricityResponsePrice>>(() => ({ getValue: (datum) => datum.hour }), []);
  const secondaryAxes = useMemo<AxisOptions<ElectricityResponsePrice>[]>(
    () => [{ getValue: (datum) => datum.price, elementType: 'line', hardMin: 0, hardMax: Math.max(...response.prices.map((p) => p.price)) * 1.1 }],
    [response],
  );

  const data: UserSerie<ElectricityResponsePrice>[] = [{ label: 'Pris', data: response.prices }];

  useInterval(() => setHour(getHours(new Date())), minutesToMilliseconds(1));
  useInterval(() => fetcher.load(`/api/entur/departures`), minutesToMilliseconds(10));

  return (
    <>
      <Typography level='body2'>
        Gjennomsnittsprisen i dag er {response.averagePrice} øre per kWh. Prisene i tabellen vises i øre per kWh og inkluderer <b>ikke</b> nettleie, avgifter og
        mva.
      </Typography>
      <Box sx={{ p: 1, width: '100%', height: '100%' }}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            dark: true,
            tooltip: false,
            primaryCursor: { value: response.prices[hour].hour },
            secondaryCursor: { value: response.prices[hour].price },
          }}
        />
      </Box>
    </>
  );
};

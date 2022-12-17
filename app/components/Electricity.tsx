import { Box, Typography } from '@mui/joy';
import { useMemo } from 'react';
import type { AxisOptions, UserSerie } from 'react-charts';
import { Chart } from 'react-charts';

import type { ElectricityResponse, ElectricityResponsePrice } from '~/routes/api.vg.electricity';

export type ElectricityProps = {
  electricityResponse: ElectricityResponse;
};

export const Electricity = ({ electricityResponse }: ElectricityProps) => {
  const primaryAxis = useMemo<AxisOptions<ElectricityResponsePrice>>(() => ({ getValue: (datum) => datum.hour }), []);
  const secondaryAxes = useMemo<AxisOptions<ElectricityResponsePrice>[]>(() => [{ getValue: (datum) => datum.price, elementType: 'line' }], []);

  const data: UserSerie<ElectricityResponsePrice>[] = [
    {
      label: 'Pris',
      data: electricityResponse.prices,
    },
  ];

  return (
    <>
      <Typography level='body2'>
        Gjennomsnittsprisen i dag er {electricityResponse.averagePrice} øre per kWh. Prisene i tabellen vises i øre per kWh, <b>ikke</b> inkludert nettleie,
        avgifter og mva.
      </Typography>
      <Box sx={{ p: 1, width: '100%', height: '100%' }}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            initialHeight: 1000,
            initialWidth: 300,
            dark: true,
            tooltip: false,
          }}
        />
      </Box>
    </>
  );
};

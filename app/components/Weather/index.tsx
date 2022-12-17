import type { StackProps, TypographyProps } from '@mui/joy';
import { Box } from '@mui/joy';
import { Stack, Typography } from '@mui/joy';
import { useFetcher } from '@remix-run/react';
import Next90Graph from '~/components/Weather/Next90Graph';
import RainIcon from '~/components/Weather/weather-icons/RainIcon';
import TemperatureIcon from '~/components/Weather/weather-icons/TemperatureIcon';
import WindIcon from '~/components/Weather/weather-icons/WindIcon';
import { minutesToMilliseconds } from 'date-fns';
import type { ReactNode } from 'react';
import { useInterval } from 'usehooks-ts';

import type { WeatherResponse } from '~/routes/api.yr.weather';

type DetailProps = Omit<StackProps, 'title'> & {
  icon: ReactNode;
  title: TypographyProps<'p'>['children'];
  label: TypographyProps<'p'>['children'];
};

const Detail = ({ icon, title, label, ...props }: DetailProps) => (
  <Stack alignItems='center' justifyContent='flex-start' sx={{ flex: 1 }} {...props}>
    <Stack alignItems='center' flexDirection='row' gap={0.5}>
      {icon}
      <Typography fontSize='1.8rem' fontWeight='bold'>
        {title}
      </Typography>
    </Stack>
    <Typography sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
  </Stack>
);

export type WeatherProps = {
  weatherResponse: WeatherResponse;
};

export const Weather = ({ weatherResponse }: WeatherProps) => {
  const fetcher = useFetcher<WeatherResponse>();

  useInterval(() => fetcher.load(`/api/yr/weather`), minutesToMilliseconds(5));

  const weather = fetcher.data ? fetcher.data : weatherResponse;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 2, width: '100%', height: '100%', overflow: 'hidden' }}>
      <Stack gap={4} justifyContent='center'>
        <Typography fontSize='1.3rem' level='h3' sx={{ pl: 2 }}>
          {weather.rainNext90min === 0 ? 'Det blir opphold neste 90 minutter' : 'Nedbør neste 90 minutter'}
        </Typography>
        {weather.rainNext90min >= 0 && <Next90Graph timeseries={weather.timeseries} />}
      </Stack>
      <Stack alignItems='flex-end' gap='1rem' justifyContent='space-between' sx={{ pb: 1, pr: 1 }}>
        <Detail icon={<TemperatureIcon size='1.5rem' />} label={`° C`} sx={{ flex: 'unset' }} title={Math.round(weather.now.air_temperature || 0)} />
        <Detail icon={<RainIcon size='1.5rem' />} label={`mm regn`} sx={{ flex: 'unset' }} title={Math.round(weather.now.precipitation_rate || 0)} />
        <Detail
          icon={<WindIcon size='1.5rem' />}
          label={`(${Math.round(weather.now.wind_speed_of_gust || 0)}) m/s`}
          sx={{ flex: 'unset' }}
          title={Math.round(weather.now.precipitation_rate || 0)}
        />
      </Stack>
    </Box>
  );
};

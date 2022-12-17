import { Box, Stack, Typography, useTheme } from '@mui/joy';
import { precipitationPathDescriptionFromNowcastPoints } from '~/components/Weather/weather-utils';
import type { ReactNode } from 'react';

import type { WeatherResponse } from '~/routes/api.yr.weather';

const Tick = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      height: '100%',
      position: 'relative',
      top: 0,
      ':after': {
        backgroundColor: (theme) => theme.palette.text.primary,
        content: '""',
        display: 'block',
        height: '0.26rem',
        left: '50%',
        position: 'absolute',
        top: '0.13rem',
        width: 1,
      },
    }}>
    <Typography
      component='span'
      sx={{
        fontSize: '1rem',
        left: '50%',
        position: 'absolute',
        top: '0.8rem',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
      }}>
      {children}
    </Typography>
  </Box>
);

const Icon = ({ children }: { children: ReactNode }) => (
  <Box sx={{ color: (theme) => theme.palette.text.primary, height: 1, position: 'relative', width: '100%' }}>
    <Box
      aria-hidden='true'
      component='svg'
      focusable='false'
      height='1rem'
      sx={{ left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)' }}
      viewBox='0 0 24 24'
      width='1rem'
      x='0'
      y='0'>
      {children}
    </Box>
  </Box>
);

export type Next90GraphProps = {
  timeseries: WeatherResponse['timeseries'];
};

const DURATION_MINUTES = 90;

const GRAPH_WIDTH = 220;
const GRAPH_HEIGHT = 50;

const Next90Graph = ({ timeseries }: Next90GraphProps) => {
  const theme = useTheme();
  const horizontalGridLines = [Math.round((50 / 3) * 0) + 0.5, Math.round((50 / 3) * 1) + 0.5, Math.round((50 / 3) * 2) + 0.5, Math.round((50 / 3) * 3) - 0.5];

  const svgD = precipitationPathDescriptionFromNowcastPoints({
    points: timeseries,
    targetDuration: DURATION_MINUTES,
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
  });

  return (
    <Box sx={{ pr: 1.5, pb: 4, pl: 2, position: 'relative', color: (theme) => theme.palette.text.primary }}>
      <div aria-hidden='true'>
        <Stack flexDirection='row' justifyContent='space-between' sx={{ height: '3rem', bottom: 0, left: '2rem', position: 'absolute', right: '1.6rem' }}>
          <Tick>Nå</Tick>
          <Tick>15</Tick>
          <Tick>30</Tick>
          <Tick>45</Tick>
          <Tick>60</Tick>
          <Tick>75</Tick>
          <Tick>90 min</Tick>
        </Stack>

        <Box sx={{ width: '1rem', height: { xs: '50%', lg: '64%', xl: '75%' }, position: 'absolute', left: 0, top: (theme) => theme.spacing(-1) }}>
          <Stack justifyContent='space-between' sx={{ position: 'absolute', inset: 0 }}>
            <Icon>
              <path
                d='M3.837 13.186C3.837 6.535 12 2 12 2s8.163 4.535 8.163 11.186c0 4.592-3.655 8.314-8.163 8.314-4.508 0-8.163-3.722-8.163-8.314z'
                fill='currentColor'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='1.5'
                width='24'
                x='0'
                y='0'></path>
            </Icon>
            <Icon>
              <path
                d='M3.837 13.186C3.837 6.535 12 2 12 2s8.163 4.535 8.163 11.186c0 4.592-3.655 8.314-8.163 8.314-4.508 0-8.163-3.722-8.163-8.314z'
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='1.5'></path>
              <path d='M12 21c4.418 0 8-3 8-9.5H4C4 18 7.582 21 12 21z' fill='currentColor'></path>
            </Icon>
            <Icon>
              <path
                d='M3.837 13.186C3.837 6.535 12 2 12 2s8.163 4.535 8.163 11.186c0 4.592-3.655 8.314-8.163 8.314-4.508 0-8.163-3.722-8.163-8.314z'
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='1.5'></path>
              <path d='M12 21.5c3.362 0 6.25-2.07 7.5-5.027h-15C5.75 19.43 8.638 21.5 12 21.5z' fill='currentColor'></path>
            </Icon>
          </Stack>
        </Box>

        <Box sx={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
          <Box component='svg' preserveAspectRatio='none' sx={{ display: 'block', width: '100%' }} viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}>
            <defs>
              <clipPath id='now-graph__curve-clip-path'>
                <rect height={GRAPH_HEIGHT - 1} width={GRAPH_WIDTH} x='0' y='0' />
              </clipPath>
            </defs>
            <path clipPath='url(#now-graph__curve-clip-path)' d={svgD} fill={theme.palette.primary[500]} />
            <Box component='g' sx={(theme) => ({ stroke: theme.palette.text.primary, strokeOpacity: '.2' })}>
              {horizontalGridLines.map((line) => (
                <line key={line} x1={0} x2='100%' y1={line} y2={line} />
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default Next90Graph;

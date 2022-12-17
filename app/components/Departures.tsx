import { keyframes } from '@emotion/react';
import { Card, Stack, styled, Typography } from '@mui/joy';
import { useFetcher } from '@remix-run/react';
import { differenceInMinutes, format, parseISO, secondsToMilliseconds } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useInterval } from 'usehooks-ts';

import type { DeparturesResponse } from '~/routes/api.entur.departures';

const formatTime = (date: Date) => {
  const minutesUntil = differenceInMinutes(date, new Date());
  if (minutesUntil < 1) {
    return 'Nå';
  }
  if (minutesUntil < 15) {
    return `${minutesUntil} min`;
  }
  return format(date, 'HH:mm', { locale: nb });
};

const pulse = keyframes(
  { '0%': { boxShadow: '0 0 0 0 #1a7d3699' } },
  { '90%': { boxShadow: '0 0 0 12px #1a7d3600' } },
  { '100%': { boxShadow: '0 0 0 0 #1a7d3600' } },
);

const Pulse = styled('div')(({ theme }) => ({
  animation: `${pulse} 2.5s infinite`,
  background: theme.palette.success[500],
  borderRadius: '50%',
  boxShadow: `0 0 0 ${theme.palette.success[500]}`,
  height: theme.spacing(1.5),
  width: theme.spacing(1.5),
  margin: theme.spacing(1, 1, 1, 1.5),
}));

export type DeparturesProps = {
  departuresResponse: DeparturesResponse;
};

export const Departures = ({ departuresResponse }: DeparturesProps) => {
  const fetcher = useFetcher<DeparturesResponse>();

  useInterval(() => fetcher.load(`/api/entur/departures`), secondsToMilliseconds(10));

  const stopPlace = fetcher.data ? fetcher.data.data.stopPlace : departuresResponse.data.stopPlace;
  return (
    <>
      <Typography level='h2'>{stopPlace.name}</Typography>
      <Stack gap={1} sx={{ overflow: 'auto' }}>
        {stopPlace.estimatedCalls.map((call) => (
          <Card
            key={call.serviceJourney.id}
            sx={{ p: 0.5, display: 'grid', gap: 1, gridTemplateColumns: '60px 1fr auto auto', alignItems: 'center' }}
            variant='outlined'>
            <Card sx={{ p: 1 }} variant='soft'>
              <Typography fontSize='1.3rem' fontWeight='bold' level='h3' textAlign='center'>
                {call.serviceJourney.line.publicCode}
              </Typography>
            </Card>
            <Typography fontSize='1.3rem' fontWeight='bold' level='h3'>
              {call.destinationDisplay.frontText}
            </Typography>
            <Pulse sx={{ opacity: call.realtime ? 1 : 0 }} />
            <Typography fontSize='1.3rem' fontWeight='bold' level='h3' sx={{ mr: 1 }}>
              {formatTime(parseISO(call.expectedDepartureTime))}
            </Typography>
          </Card>
        ))}
      </Stack>
    </>
  );
};

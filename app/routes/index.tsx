import { Button, Card, List, ListItem, Radio, RadioGroup, Stack, styled, TextField, Typography } from '@mui/joy';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useFetcher, useLoaderData } from '@remix-run/react';
import type { KioskSessionData } from '~/cookies.server';
import { kioskSession } from '~/cookies.server';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

import type { StopPlace } from './api.entur.search';

export type ElectricityRegion = {
  id: string;
  label: string;
};

export const ELECTRICITY_REGIONS: ElectricityRegion[] = [
  { id: 'bergen', label: 'Bergen' },
  { id: 'kristiansand', label: 'Kristiansand' },
  { id: 'oslo', label: 'Oslo' },
  { id: 'tromso', label: 'Tromsø' },
  { id: 'trondheim', label: 'Trondheim' },
];

const Grid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridTemplateRows: 'auto 1fr auto',
  padding: theme.spacing(2),
  height: '100vh',
  gap: theme.spacing(2),
}));

export const loader = async ({ request }: LoaderArgs) => {
  const session = await kioskSession.getSession(request.headers?.get('Cookie'));
  const data: KioskSessionData = { electricityRegion: null, stopPlace: null };
  if (session.has('electricityRegion')) {
    data['electricityRegion'] = session.get('electricityRegion') as KioskSessionData['electricityRegion'];
  }
  if (session.has('stopPlace')) {
    data['stopPlace'] = JSON.parse(session.get('stopPlace')) as KioskSessionData['stopPlace'];
  }
  return data;
};

export const action = async ({ request }: ActionArgs) => {
  const session = await kioskSession.getSession(request.headers?.get('Cookie'));
  const formData = await request.formData();
  const intent = formData.get('_intent') as keyof KioskSessionData | null;
  if (intent === 'electricityRegion') {
    const electricityRegion = formData.get('electricityRegion') as string;
    session.set('electricityRegion', electricityRegion);
  }
  if (intent === 'stopPlace') {
    const stopPlace = formData.get('stopPlace') as string;
    session.set('stopPlace', stopPlace);
  }
  return json(
    { ok: true },
    {
      headers: { 'Set-Cookie': await kioskSession.commitSession(session) },
    },
  );
};

export default function Index() {
  const { electricityRegion, stopPlace } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<StopPlace[]>();

  const [stopPlaceSearch, setStopPlaceSearch] = useState('');
  const searchText = useDebounce(stopPlaceSearch);

  useEffect(() => {
    if (searchText) {
      fetcher.load(`/api/entur/search?search=${searchText}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <Grid>
      <Card sx={{ gridColumn: 'span 2' }} variant='outlined'>
        <Typography level='h1' textAlign='center'>
          Konfigurer din infoskjerm
        </Typography>
      </Card>
      <Card variant='outlined'>
        <Typography level='h2'>Velg strømregion</Typography>
        <Typography>Velg hvilken strømregion du tilhører og vil se dagens strømpriser for</Typography>
        <Form method='post'>
          <RadioGroup aria-label='Velg strømregion' defaultValue={electricityRegion || ELECTRICITY_REGIONS[2].id} name='electricityRegion'>
            <List
              sx={(theme) => ({
                '--List-gap': theme.spacing(1),
                '--List-item-paddingY': theme.spacing(1.5),
                '--List-item-radius': theme.radius.sm,
              })}>
              {ELECTRICITY_REGIONS.map((item) => (
                <ListItem key={item.id} sx={{ boxShadow: 'sm', bgcolor: 'background.body' }} variant='outlined'>
                  <Radio
                    label={item.label}
                    overlay
                    slotProps={{
                      action: ({ checked }) => ({
                        sx: (theme) => ({
                          ...(checked && {
                            inset: -1,
                            border: '2px solid',
                            borderColor: theme.vars.palette.primary[500],
                          }),
                        }),
                      }),
                    }}
                    sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}
                    value={item.id}
                  />
                </ListItem>
              ))}
            </List>
          </RadioGroup>
          <Button fullWidth name='_intent' sx={{ mt: 0.5 }} type='submit' value='electricityRegion'>
            Lagre
          </Button>
        </Form>
      </Card>
      <Card variant='outlined'>
        <Typography level='h2'>Velg holdeplass</Typography>
        <Typography>
          Finn holdeplassen du bruker oftest og se kommende avgangstider i sanntid fra den. Du vil også se dagens vær basert på posisjonen til den valgte
          holdeplassen.
        </Typography>
        {stopPlace && (
          <Card sx={{ mt: 2 }} variant='soft'>
            <Typography>Valgt: {stopPlace.label}</Typography>
          </Card>
        )}
        <Form method='post'>
          <input name='_intent' type='hidden' value='stopPlace' />
          <Stack gap={1}>
            <TextField label='Finn holdeplass' onChange={(e) => setStopPlaceSearch(e.target.value)} sx={{ mt: 2 }} />
            {(fetcher.data || []).map((s) => (
              <Card key={s.id} sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} variant='outlined'>
                <Typography>{s.label}</Typography>
                <Button
                  disabled={s.id === stopPlace?.id}
                  name='stopPlace'
                  type='submit'
                  value={JSON.stringify(s)}
                  variant={s.id === stopPlace?.id ? 'solid' : 'outlined'}>
                  {s.id === stopPlace?.id ? 'Valgt' : 'Velg'}
                </Button>
              </Card>
            ))}
          </Stack>
        </Form>
      </Card>
      <Button component={Link} disabled={!stopPlace || !electricityRegion} sx={{ gridColumn: 'span 2' }} to={`/s`}>
        Åpne infoskjerm
      </Button>
    </Grid>
  );
}

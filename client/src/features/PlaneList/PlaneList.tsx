import { Container, Grid, CircularProgress, Alert, AlertTitle } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PlaneCard from './PlaneCard/PlaneCard';
import { fetchPlanes, selectPlanes } from './planeListSlice';

export function PlaneList() {
  const dispatch = useAppDispatch()
  const planes = useAppSelector(selectPlanes)

  const planesFetchStatus = useAppSelector(state => state.planeList.status)

  useEffect(() => {
    if (planesFetchStatus === 'idle') {
      dispatch(fetchPlanes())
    }
  }, [planesFetchStatus, dispatch])


  let planeCards = planes.map((plane) => (
    <Grid key={plane.id} item xs={12} sm={6} md={4} lg={4}>
      <PlaneCard {...plane}/>
    </Grid>
  ))

  const renderSwitch = () => {
    switch(planesFetchStatus) {
      case 'idle': case 'loading': {
        return (
          <CircularProgress />
        )
      }
      case 'succeeded': {
        return (
          <Grid container spacing={2}>
            {planeCards}
          </Grid>
        )
      }
      case 'failed': {
        return (
          <Alert severity="error">
            <AlertTitle sx={{ display: 'flex', justifyContent: 'left'}}>Error</AlertTitle>
            We have some technical problems. Try to refresh the page.
          </Alert>
        )
      }
    }
  }

  return (
    <Container maxWidth="lg" sx={{padding: '70px'}}>
        {renderSwitch()}
    </Container>
  );
}
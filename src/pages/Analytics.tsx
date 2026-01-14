import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { CyclesComparisonChart } from '../components/analytics/CyclesComparisonChart';
import { TaskDistributionChart } from '../components/analytics/TaskDistributionChart';

export function Analytics() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analyses et Statistiques
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visualisez l'investissement temporel et la répartition des tâches sur l'exploitation.
        </Typography>
      </Box>

            <Grid container spacing={4}>

              <Grid size={{ xs: 12 }}>

                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>

                  <CyclesComparisonChart />

                </Paper>

              </Grid>

              

              <Grid size={{ xs: 12 }}>

                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>

                  <TaskDistributionChart />

                </Paper>

              </Grid>

            </Grid>

      
    </Container>
  );
}

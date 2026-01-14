import { Box, CircularProgress, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import _ from 'lodash';
import { useActivities } from '../../hooks/useActivities';
import { useCycles } from '../../hooks/useCycles';
import { useTimes } from '../../hooks/useTimes';

export function CyclesComparisonChart() {
  const { data: times, isLoading: loadingTimes } = useTimes();
  const { data: activities, isLoading: loadingActivities } = useActivities();
  const { data: cycles, isLoading: loadingCycles } = useCycles();

  if (loadingTimes || loadingActivities || loadingCycles) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!times || !activities || !cycles || times.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">Aucune donnée disponible pour le graphique.</Typography>
      </Box>
    );
  }

  // 1. Prepare data for the chart
  // Group times by cycle and then by activity
  const dataByCycle = _.groupBy(times, 'cycle_id');

  // Get active cycles (those that have time entries)
  const activeCycleIds = Object.keys(dataByCycle).map(Number);
  const chartCycles = cycles.filter((c) => activeCycleIds.includes(c.id));

  // Prepare series: one series per activity
  const series = activities.map((activity) => {
    const activityData = chartCycles.map((cycle) => {
      const cycleTimes = dataByCycle[cycle.id] || [];
      const activityTimes = cycleTimes.filter((t) => t.activity_id === activity.id);
      const totalMinutes = _.sumBy(activityTimes, 'minutes');
      return totalMinutes / 60; // Convert to hours
    });

    return {
      data: activityData,
      label: activity.name,
      stack: 'total',
    };
  });

  const xAxisData = chartCycles.map((c) => {
    const vegName = c.vegetables?.name || 'Inconnu';
    const parcelName = c.parcels?.name || 'Inconnu';
    return `${vegName} (${parcelName})`;
  });

  return (
    <Box sx={{ width: '100%', height: 400, mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Comparaison du temps investi par cycle (en heures)
      </Typography>
      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            data: xAxisData,
            label: 'Cycles (Légume - Parcelle)',
          },
        ]}
        series={series}
        height={350}
        margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
          } as never,
        }}
      />
    </Box>
  );
}

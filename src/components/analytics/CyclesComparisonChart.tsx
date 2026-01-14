import { BarChart } from '@mui/x-charts/BarChart';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTimes } from '../../hooks/useTimes';
import { useActivities } from '../../hooks/useActivities';
import { useCycles } from '../../hooks/useCycles';
import _ from 'lodash';

export function CyclesComparisonChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    return isMobile ? vegName : `${vegName} (${parcelName})`;
  });

  return (
    <Box sx={{ width: '100%', height: isMobile ? 450 : 400, mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Temps investi par cycle (h)
      </Typography>
      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            data: xAxisData,
            label: isMobile ? '' : 'Cycles (Légume - Parcelle)',
          },
        ]}
        series={series}
        height={isMobile ? 400 : 350}
        margin={{
          top: 20,
          right: 10,
          left: 40,
          bottom: isMobile ? 100 : 60,
        }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
            labelStyle: {
              fontSize: isMobile ? 10 : 12,
            },
          } as never,
        }}
      />
    </Box>
  );
}

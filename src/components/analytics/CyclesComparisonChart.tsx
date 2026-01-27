import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useActivities } from '../../hooks/useActivities';
import { useCycles } from '../../hooks/useCycles';
import { useTimes } from '../../hooks/useTimes';

export function CyclesComparisonChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: times, isLoading: loadingTimes } = useTimes();
  const { data: activities, isLoading: loadingActivities } = useActivities();
  const { data: cycles, isLoading: loadingCycles } = useCycles();

  const [selectedCycleIds, setSelectedCycleIds] = useState<number[]>([]);

  // 1. Get all active cycles (those that have time entries)
  const activeCycles = useMemo(() => {
    if (!times || !cycles) return [];
    const cycleIdsWithData = new Set(times.map((t) => t.cycle_id));
    return cycles.filter((c) => cycleIdsWithData.has(c.id));
  }, [times, cycles]);

  // 2. Initialize or filter selected cycles
  const chartCycles = useMemo(() => {
    if (selectedCycleIds.length === 0) return activeCycles;
    return activeCycles.filter((c) => selectedCycleIds.includes(c.id));
  }, [activeCycles, selectedCycleIds]);

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

  const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedCycleIds(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  // 3. Prepare data by cycle
  const dataByCycle = _.groupBy(times, 'cycle_id');

  // 4. Calculate totals for bar labels, axes and tooltips
  const totalsPerCycle = chartCycles.map((cycle) => {
    const cycleTimes = dataByCycle[cycle.id] || [];
    return _.sumBy(cycleTimes, 'minutes') / 60;
  });

  // 5. Prepare base series
  const baseSeries = activities.map((activity) => {
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
      valueFormatter: (value: number | null, context: { dataIndex: number }) => {
        if (!value) return '0h';
        const total = totalsPerCycle[context.dataIndex] || 0;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
        return `${value.toFixed(1)}h (${percentage}% du cycle)`;
      },
    };
  });

  // 6. Add barLabel to series (MUI v8 way)
  const series = baseSeries.map((s) => ({
    ...s,
  }));

  const xAxisData = chartCycles.map((c, index) => {
    const vegName = c.vegetables?.name || 'Inconnu';
    const parcelName = c.parcels?.name || 'Inconnu';
    const total = totalsPerCycle[index];
    const totalStr = total !== undefined ? `${total.toFixed(1)}h` : '0h';
    return isMobile ? `${vegName}\n${totalStr}` : `${vegName} (${parcelName})\n${totalStr}`;
  });

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Temps investi par cycle (h)
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <FormControl sx={{ minWidth: 300, maxWidth: '100%' }}>
          <InputLabel id="cycle-select-label">Cycles à comparer</InputLabel>
          <Select
            labelId="cycle-select-label"
            multiple
            value={selectedCycleIds}
            onChange={handleSelectChange}
            input={<OutlinedInput label="Cycles à comparer" />}
            renderValue={(selected) => {
              if (selected.length === 0) return 'Tous les cycles';
              return `${selected.length} cycle(s) sélectionné(s)`;
            }}
          >
            {activeCycles.map((cycle) => {
              const isFinished = cycle.ends_at ? new Date(cycle.ends_at) < new Date() : false;
              const cycleTimes = dataByCycle[cycle.id] || [];
              const totalHours = _.sumBy(cycleTimes, 'minutes') / 60;

              return (
                <MenuItem key={cycle.id} value={cycle.id}>
                  <Checkbox checked={selectedCycleIds.indexOf(cycle.id) > -1} />
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: isFinished ? 'success.main' : 'warning.main',
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  />
                  <ListItemText
                    primary={`${cycle.vegetables?.name} (${cycle.parcels?.name})`}
                    secondary={`${new Date(cycle.starts_at).toLocaleDateString()} • Total: ${totalHours.toFixed(1)}h`}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: isMobile ? 450 : 400 }}>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: xAxisData,
            },
          ]}
          series={series}
          height={isMobile ? 400 : 350}
          margin={{
            top: 20,
            right: 10,
            left: 40,
            bottom: isMobile ? 140 : 60,
          }}
          slotProps={{
            legend: {
              direction: isMobile ? 'column' : 'row',
              position: { vertical: 'bottom', horizontal: isMobile ? 'start' : 'middle' },
              padding: 0,
              labelStyle: {
                fontSize: isMobile ? 11 : 12,
              },
            } as never,
          }}
        />
      </Box>
    </Box>
  );
}

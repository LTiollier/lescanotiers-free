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

  // 3. Prepare series: one series per activity
  const dataByCycle = _.groupBy(times, 'cycle_id');
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
              const isFinished = new Date(cycle.ends_at) < new Date();
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
                    secondary={new Date(cycle.starts_at).toLocaleDateString()}
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
              label: isMobile ? '' : 'Cycles',
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

import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useCycles } from '../../hooks/useCycles';
import { useTimes } from '../../hooks/useTimes';

export function TaskDistributionChart() {
  const { data: times, isLoading: loadingTimes } = useTimes();
  const { data: cycles, isLoading: loadingCycles } = useCycles();
  const [selectedCycleId, setSelectedCycleId] = useState<number | ''>('');

  const chartData = useMemo(() => {
    if (!times || !selectedCycleId) return [];

    const cycleTimes = times.filter((t) => t.cycle_id === selectedCycleId);
    const groupedByActivity = _.groupBy(cycleTimes, 'activities.name');

    return Object.entries(groupedByActivity).map(([name, entries], index) => ({
      id: index,
      value: _.sumBy(entries, 'minutes') / 60, // Total in hours
      label: name,
    }));
  }, [times, selectedCycleId]);

  if (loadingTimes || loadingCycles) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const activeCycles = cycles?.filter((c) => times?.some((t) => t.cycle_id === c.id)) || [];

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Répartition des tâches par cycle
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Choisir un cycle</InputLabel>
          <Select
            value={selectedCycleId}
            label="Choisir un cycle"
            onChange={(e) => setSelectedCycleId(e.target.value as number)}
          >
            {activeCycles.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.vegetables?.name} ({c.parcels?.name}) -{' '}
                {new Date(c.starts_at).toLocaleDateString()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedCycleId ? (
        <Box sx={{ height: 350, display: 'flex', justifyContent: 'center' }}>
          {chartData.length > 0 ? (
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { fade: 'global', highlighted: 'item' } as never,
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 60,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                } as never,
              }}
            />
          ) : (
            <Typography sx={{ mt: 4 }} color="textSecondary">
              Aucune donnée de temps pour ce cycle.
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textSecondary">
            Veuillez sélectionner un cycle pour voir la répartition.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

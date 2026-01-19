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
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo, useState } from 'react';
import { useActivities } from '../../hooks/useActivities';
import { useCycles } from '../../hooks/useCycles';
import { useTimes } from '../../hooks/useTimes';
import { useUsers } from '../../hooks/useUsers';
import { useVegetables } from '../../hooks/useVegetables';

export function ProductionCostChart() {
  const { data: cycles, isLoading: isLoadingCycles, error: errorCycles } = useCycles();
  const { data: times, isLoading: isLoadingTimes, error: errorTimes } = useTimes();
  const { data: users, isLoading: isLoadingUsers, error: errorUsers } = useUsers();
  const {
    data: vegetables,
    isLoading: isLoadingVegetables,
    error: errorVegetables,
  } = useVegetables();
  const {
    data: activities,
    isLoading: isLoadingActivities,
    error: errorActivities,
  } = useActivities();
  const [selectedCycleIds, setSelectedCycleIds] = useState<number[]>([]);

  const activeCycles = useMemo(() => {
    if (!cycles || !times) return [];
    const cycleIdsWithData = new Set(times.map((t) => t.cycle_id));
    return cycles.filter((c) => cycleIdsWithData.has(c.id));
  }, [cycles, times]);

  const handleSelectChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedCycleIds(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  if (
    isLoadingCycles ||
    isLoadingTimes ||
    isLoadingUsers ||
    isLoadingVegetables ||
    isLoadingActivities
  ) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorCycles || errorTimes || errorUsers || errorVegetables || errorActivities) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">
          Erreur lors du chargement des données:{' '}
          {errorCycles?.message ||
            errorTimes?.message ||
            errorUsers?.message ||
            errorVegetables?.message ||
            errorActivities?.message}
        </Typography>
      </Box>
    );
  }

  if (!cycles || !times || !users || !vegetables || !activities) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>Aucune donnée disponible pour afficher les coûts de production.</Typography>
      </Box>
    );
  }

  const plantingActivity = activities.find((activity) => activity.name === 'Plantation');
  if (!plantingActivity) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">
          Erreur : L'activité "Plantation" n'a pas été trouvée. Impossible de calculer le coût des
          semis.
        </Typography>
      </Box>
    );
  }

  // --- Data processing for the chart ---
  const processedData = activeCycles
    .filter((cycle) => selectedCycleIds.includes(cycle.id))
    .map((cycle) => {
      const cycleTimes = times.filter((time) => time.cycle_id === cycle.id);
      const relatedVegetable = vegetables.find((veg) => veg.id === cycle.vegetable_id);

      let seedlingCost = 0;
      if (cycle.seedling_cost_in_cents !== null && cycle.seedling_cost_in_cents !== undefined) {
        const plantingActivityId = plantingActivity.id;
        const plantingTimes = cycleTimes.filter((time) => time.activity_id === plantingActivityId);
        const totalSeedlings = plantingTimes.reduce((sum, time) => sum + (time.quantity || 0), 0);
        seedlingCost = cycle.seedling_cost_in_cents * totalSeedlings;
      }

      let laborCost = 0;
      for (const timeEntry of cycleTimes) {
        const userProfile = users.find((user) => user.id === timeEntry.user_id);
        if (
          userProfile &&
          userProfile.hourly_rate_in_cents !== null &&
          userProfile.hourly_rate_in_cents !== undefined
        ) {
          laborCost += (timeEntry.minutes / 60) * userProfile.hourly_rate_in_cents;
        }
      }

      const totalCycleCostInCents = (cycle.utility_costs_in_cents || 0) + seedlingCost + laborCost;
      const totalMinutes = cycleTimes.reduce((sum, time) => sum + time.minutes, 0);
      const totalHours = totalMinutes / 60;

      const costPerHour = totalHours > 0 ? totalCycleCostInCents / 100 / totalHours : 0;

      return {
        cycleName: `${relatedVegetable?.name || 'Inconnu'} - ${new Date(cycle.starts_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
        costPerHour: costPerHour,
      };
    });

  const chartLabels = processedData.map((data) => data.cycleName);
  const costPerHourData = processedData.map((data) => data.costPerHour);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Rapport Coût/Heure par Cycle
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <FormControl sx={{ minWidth: 300, maxWidth: '100%' }}>
          <InputLabel id="cycle-cost-multiselect-label">Filtrer par cycles</InputLabel>
          <Select
            labelId="cycle-cost-multiselect-label"
            multiple
            value={selectedCycleIds}
            onChange={handleSelectChange}
            input={<OutlinedInput label="Filtrer par cycles" />}
            renderValue={(selected) => {
              if (selected.length === 0) return <em>Sélectionner des cycles...</em>;
              return `${selected.length} cycle(s) sélectionné(s)`;
            }}
          >
            {activeCycles.map((cycle) => (
              <MenuItem key={cycle.id} value={cycle.id}>
                <Checkbox checked={selectedCycleIds.indexOf(cycle.id) > -1} />
                <ListItemText
                  primary={`${cycle.vegetables?.name} (${cycle.parcels?.name})`}
                  secondary={new Date(cycle.starts_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {selectedCycleIds.length > 0 ? (
        <BarChart
          height={300}
          series={[{ data: costPerHourData, label: 'Coût par Heure (€/h)', color: '#8884d8' }]}
          xAxis={[{ data: chartLabels, scaleType: 'band' }]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      ) : (
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography color="textSecondary">
            Veuillez sélectionner un ou plusieurs cycles pour afficher le rapport.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

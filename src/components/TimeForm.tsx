import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useActivities } from '../hooks/useActivities';
import { useCycles } from '../hooks/useCycles';
import type { Database } from '../types/database.types';
import { VegetableAvatar } from './VegetableAvatar';

type Time = Database['public']['Tables']['times']['Row'];

interface TimeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    cycleId: number,
    activityId: number,
    date: string,
    minutes: number,
    quantity: number | null,
  ) => void;
  time?: Time | null;
  isLoading?: boolean;
}

export function TimeForm({ open, onClose, onSubmit, time, isLoading }: TimeFormProps) {
  const [cycleId, setCycleId] = useState<number | ''>('');
  const [activityId, setActivityId] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [minutes, setMinutes] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');

  const { data: cycles, isLoading: cyclesLoading } = useCycles();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (time) {
      setCycleId(time.cycle_id);
      setActivityId(time.activity_id);
      setDate(time.date);
      setMinutes(time.minutes);
      setQuantity(time.quantity || '');
    } else {
      setCycleId('');
      setActivityId('');
      setDate('');
      setMinutes('');
      setQuantity('');
    }
  }, [time, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cycleId && activityId && date && minutes) {
      onSubmit(
        Number(cycleId),
        Number(activityId),
        date,
        Number(minutes),
        quantity ? Number(quantity) : null,
      );
    }
  };

  const isFormValid = cycleId && activityId && date && minutes;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{time ? 'Modifier le temps passé' : 'Nouveau temps passé'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required disabled={isLoading || cyclesLoading}>
            <InputLabel>Cycle</InputLabel>
            <Select
              value={cycleId}
              onChange={(e) => setCycleId(e.target.value ? Number(e.target.value) : '')}
              label="Cycle"
            >
              {cyclesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                cycles?.map((cycle) => (
                  <MenuItem key={cycle.id} value={cycle.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <VegetableAvatar
                        imageUrl={cycle.vegetables?.image_url}
                        name={cycle.vegetables?.name || 'N/A'}
                        size="small"
                      />
                      <span>
                        {cycle.vegetables?.name || 'N/A'} - {cycle.parcels?.name || 'N/A'}
                      </span>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" required disabled={isLoading || activitiesLoading}>
            <InputLabel>Activité</InputLabel>
            <Select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value ? Number(e.target.value) : '')}
              label="Activité"
            >
              {activitiesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                activities?.map((activity) => (
                  <MenuItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            label="Durée (minutes)"
            type="number"
            fullWidth
            required
            value={minutes}
            onChange={(e) => setMinutes(e.target.value ? Number(e.target.value) : '')}
            disabled={isLoading}
            inputProps={{ min: 1 }}
          />

          <TextField
            margin="dense"
            label="Quantité récoltée (optionnel)"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
            disabled={isLoading}
            inputProps={{ min: 0 }}
            helperText="En kg, unités, etc. selon le contexte"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !isFormValid}>
            {isLoading ? 'Enregistrement...' : time ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

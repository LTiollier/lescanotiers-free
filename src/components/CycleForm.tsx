import {
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParcels } from '../hooks/useParcels';
import { useVegetables } from '../hooks/useVegetables';
import type { Database } from '../types/database.types';

type Cycle = Database['public']['Tables']['cycles']['Row'];

interface CycleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vegetableId: number, parcelId: number, startsAt: string, endsAt: string) => void;
  cycle?: Cycle | null;
  isLoading?: boolean;
}

export function CycleForm({ open, onClose, onSubmit, cycle, isLoading }: CycleFormProps) {
  const [vegetableId, setVegetableId] = useState<number | ''>('');
  const [parcelId, setParcelId] = useState<number | ''>('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const { data: vegetables, isLoading: vegetablesLoading } = useVegetables();
  const { data: parcels, isLoading: parcelsLoading } = useParcels();

  useEffect(() => {
    if (open) {
      if (cycle) {
        setVegetableId(cycle.vegetable_id);
        setParcelId(cycle.parcel_id);
        setStartsAt(cycle.starts_at);
        setEndsAt(cycle.ends_at);
      } else {
        setVegetableId('');
        setParcelId('');
        setStartsAt('');
        setEndsAt('');
      }
    }
  }, [cycle, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vegetableId && parcelId && startsAt && endsAt) {
      onSubmit(Number(vegetableId), Number(parcelId), startsAt, endsAt);
    }
  };

  const isFormValid = vegetableId && parcelId && startsAt && endsAt;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{cycle ? 'Modifier le cycle' : 'Nouveau cycle'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required disabled={isLoading || vegetablesLoading}>
            <InputLabel>Légume</InputLabel>
            <Select
              value={vegetableId}
              onChange={(e) => setVegetableId(e.target.value ? Number(e.target.value) : '')}
              label="Légume"
            >
              {vegetablesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                vegetables?.map((vegetable) => (
                  <MenuItem key={vegetable.id} value={vegetable.id}>
                    {vegetable.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" required disabled={isLoading || parcelsLoading}>
            <InputLabel>Parcelle</InputLabel>
            <Select
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value ? Number(e.target.value) : '')}
              label="Parcelle"
            >
              {parcelsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                parcels?.map((parcel) => (
                  <MenuItem key={parcel.id} value={parcel.id}>
                    {parcel.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Date de début"
            type="date"
            fullWidth
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            disabled={isLoading}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            margin="dense"
            label="Date de fin"
            type="date"
            fullWidth
            required
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            disabled={isLoading}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !isFormValid}>
            {isLoading ? 'Enregistrement...' : cycle ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Database } from '../types/database.types';

type Parcel = Database['public']['Tables']['parcels']['Row'];

interface ParcelFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  parcel?: Parcel | null;
  isLoading?: boolean;
}

export function ParcelForm({ open, onClose, onSubmit, parcel, isLoading }: ParcelFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      if (parcel) {
        setName(parcel.name);
      } else {
        setName('');
      }
    }
  }, [parcel, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{parcel ? 'Modifier la parcelle' : 'Nouvelle parcelle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la parcelle"
            type="text"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !name.trim()}>
            {isLoading ? 'Enregistrement...' : parcel ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

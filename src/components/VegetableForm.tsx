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

type Vegetable = Database['public']['Tables']['vegetables']['Row'];

interface VegetableFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  vegetable?: Vegetable | null;
  isLoading?: boolean;
}

export function VegetableForm({ open, onClose, onSubmit, vegetable, isLoading }: VegetableFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (vegetable) {
      setName(vegetable.name);
    } else {
      setName('');
    }
  }, [vegetable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{vegetable ? 'Modifier le légume' : 'Nouveau légume'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du légume"
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
            {isLoading ? 'Enregistrement...' : vegetable ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

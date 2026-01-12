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

type Activity = Database['public']['Tables']['activities']['Row'];

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  activity?: Activity | null;
  isLoading?: boolean;
}

export function ActivityForm({ open, onClose, onSubmit, activity, isLoading }: ActivityFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (activity) {
      setName(activity.name);
    } else {
      setName('');
    }
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{activity ? 'Modifier l\'activité' : 'Nouvelle activité'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de l'activité"
            type="text"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            placeholder="Ex: Semis, Récolte, Arrosage, Désherbage, Taille..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !name.trim()}>
            {isLoading ? 'Enregistrement...' : activity ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

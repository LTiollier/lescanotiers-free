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
import { useVegetableCategories } from '../hooks/useVegetableCategories';
import type { Database } from '../types/database.types';

type Vegetable = Database['public']['Tables']['vegetables']['Row'];

interface VegetableFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, categoryId: number | null) => void;
  vegetable?: Vegetable | null;
  isLoading?: boolean;
}

export function VegetableForm({
  open,
  onClose,
  onSubmit,
  vegetable,
  isLoading,
}: VegetableFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { data: categories, isLoading: categoriesLoading } = useVegetableCategories();

  useEffect(() => {
    if (vegetable) {
      setName(vegetable.name);
      setCategoryId(vegetable.category_id);
    } else {
      setName('');
      setCategoryId(null);
    }
  }, [vegetable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), categoryId);
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
          <FormControl fullWidth margin="dense" disabled={isLoading || categoriesLoading}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              label="Catégorie"
            >
              <MenuItem value="">
                <em>Aucune catégorie</em>
              </MenuItem>
              {categoriesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
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

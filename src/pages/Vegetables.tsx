import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { VegetableForm } from '../components/VegetableForm';
import { useIsAdmin } from '../hooks/useUserProfile';
import {
  useCreateVegetable,
  useDeleteVegetable,
  useUpdateVegetable,
  useVegetables,
} from '../hooks/useVegetables';
import type { Database } from '../types/database.types';

type Vegetable = Database['public']['Tables']['vegetables']['Row'];

export function Vegetables() {
  const { data: vegetables, isLoading, error } = useVegetables();
  const createVegetable = useCreateVegetable();
  const updateVegetable = useUpdateVegetable();
  const deleteVegetable = useDeleteVegetable();
  const isAdmin = useIsAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState<Vegetable | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAdd = () => {
    setSelectedVegetable(null);
    setFormOpen(true);
  };

  const handleEdit = (vegetable: Vegetable) => {
    setSelectedVegetable(vegetable);
    setFormOpen(true);
  };

  const handleDelete = (vegetable: Vegetable) => {
    setSelectedVegetable(vegetable);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (name: string) => {
    try {
      if (selectedVegetable) {
        await updateVegetable.mutateAsync({ id: selectedVegetable.id, updates: { name } });
        setSnackbar({ open: true, message: 'Légume modifié avec succès', severity: 'success' });
      } else {
        await createVegetable.mutateAsync({ name });
        setSnackbar({ open: true, message: 'Légume ajouté avec succès', severity: 'success' });
      }
      setFormOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        severity: 'error',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedVegetable) return;

    try {
      await deleteVegetable.mutateAsync(selectedVegetable.id);
      setSnackbar({ open: true, message: 'Légume supprimé avec succès', severity: 'success' });
      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        severity: 'error',
      });
    }
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Gestion des Légumes
        </Typography>
        <Alert severity="error">Erreur lors du chargement des légumes: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des Légumes</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter un légume
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell align="right">Date de création</TableCell>
                  {isAdmin && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {vegetables?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucun légume. Cliquez sur "Ajouter un légume" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vegetables?.map((vegetable) => (
                    <TableRow key={vegetable.id}>
                      <TableCell>{vegetable.name}</TableCell>
                      <TableCell align="right">
                        {new Date(vegetable.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(vegetable)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(vegetable)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <VegetableForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        vegetable={selectedVegetable}
        isLoading={createVegetable.isPending || updateVegetable.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le légume"
        message={`Êtes-vous sûr de vouloir supprimer le légume "${selectedVegetable?.name}" ?`}
        confirmText="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteVegetable.isPending}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

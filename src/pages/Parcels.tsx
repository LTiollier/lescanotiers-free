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
import { ParcelForm } from '../components/ParcelForm';
import { useCreateParcel, useDeleteParcel, useParcels, useUpdateParcel } from '../hooks/useParcels';
import { useIsAdmin } from '../hooks/useUserProfile';
import type { Database } from '../types/database.types';

type Parcel = Database['public']['Tables']['parcels']['Row'];

export function Parcels() {
  const { data: parcels, isLoading, error } = useParcels();
  const createParcel = useCreateParcel();
  const updateParcel = useUpdateParcel();
  const deleteParcel = useDeleteParcel();
  const isAdmin = useIsAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
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
    setSelectedParcel(null);
    setFormOpen(true);
  };

  const handleEdit = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setFormOpen(true);
  };

  const handleDelete = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (name: string) => {
    try {
      if (selectedParcel) {
        await updateParcel.mutateAsync({ id: selectedParcel.id, updates: { name } });
        setSnackbar({ open: true, message: 'Parcelle modifiée avec succès', severity: 'success' });
      } else {
        await createParcel.mutateAsync({ name });
        setSnackbar({ open: true, message: 'Parcelle ajoutée avec succès', severity: 'success' });
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
    if (!selectedParcel) return;

    try {
      await deleteParcel.mutateAsync(selectedParcel.id);
      setSnackbar({ open: true, message: 'Parcelle supprimée avec succès', severity: 'success' });
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
          Gestion des Parcelles
        </Typography>
        <Alert severity="error">Erreur lors du chargement des parcelles: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des Parcelles</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter une parcelle
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
                {parcels?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucune parcelle. Cliquez sur "Ajouter une parcelle" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  parcels?.map((parcel) => (
                    <TableRow key={parcel.id}>
                      <TableCell>{parcel.name}</TableCell>
                      <TableCell align="right">
                        {new Date(parcel.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(parcel)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(parcel)}
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

      <ParcelForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        parcel={selectedParcel}
        isLoading={createParcel.isPending || updateParcel.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer la parcelle"
        message={`Êtes-vous sûr de vouloir supprimer la parcelle "${selectedParcel?.name}" ?`}
        confirmText="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteParcel.isPending}
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

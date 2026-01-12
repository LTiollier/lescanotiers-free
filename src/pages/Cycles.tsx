import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
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
import { CycleForm } from '../components/CycleForm';
import type { CycleWithRelations } from '../hooks/useCycles';
import { useCreateCycle, useCycles, useDeleteCycle, useUpdateCycle } from '../hooks/useCycles';
import { useIsAdmin } from '../hooks/useUserProfile';

export function Cycles() {
  const { data: cycles, isLoading, error } = useCycles();
  const createCycle = useCreateCycle();
  const updateCycle = useUpdateCycle();
  const deleteCycle = useDeleteCycle();
  const isAdmin = useIsAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<CycleWithRelations | null>(null);
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
    setSelectedCycle(null);
    setFormOpen(true);
  };

  const handleEdit = (cycle: CycleWithRelations) => {
    setSelectedCycle(cycle);
    setFormOpen(true);
  };

  const handleDelete = (cycle: CycleWithRelations) => {
    setSelectedCycle(cycle);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (
    vegetableId: number,
    parcelId: number,
    startsAt: string,
    endsAt: string,
  ) => {
    try {
      if (selectedCycle) {
        await updateCycle.mutateAsync({
          id: selectedCycle.id,
          updates: {
            vegetable_id: vegetableId,
            parcel_id: parcelId,
            starts_at: startsAt,
            ends_at: endsAt,
          },
        });
        setSnackbar({ open: true, message: 'Cycle modifié avec succès', severity: 'success' });
      } else {
        await createCycle.mutateAsync({
          vegetable_id: vegetableId,
          parcel_id: parcelId,
          starts_at: startsAt,
          ends_at: endsAt,
        });
        setSnackbar({ open: true, message: 'Cycle ajouté avec succès', severity: 'success' });
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
    if (!selectedCycle) return;

    try {
      await deleteCycle.mutateAsync(selectedCycle.id);
      setSnackbar({ open: true, message: 'Cycle supprimé avec succès', severity: 'success' });
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
          Gestion des Cycles
        </Typography>
        <Alert severity="error">Erreur lors du chargement des cycles: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des Cycles</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter un cycle
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
                  <TableCell>Légume</TableCell>
                  <TableCell>Parcelle</TableCell>
                  <TableCell>Date de début</TableCell>
                  <TableCell>Date de fin</TableCell>
                  <TableCell>Statut</TableCell>
                  {isAdmin && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {cycles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucun cycle. Cliquez sur "Ajouter un cycle" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  cycles?.map((cycle) => {
                    const today = new Date();
                    const startsAt = new Date(cycle.starts_at);
                    const endsAt = new Date(cycle.ends_at);
                    const isActive = today >= startsAt && today <= endsAt;
                    const isUpcoming = today < startsAt;
                    const isPast = today > endsAt;

                    return (
                      <TableRow key={cycle.id}>
                        <TableCell>
                          <Chip
                            label={cycle.vegetables?.name || 'N/A'}
                            size="small"
                            color="success"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={cycle.parcels?.name || 'N/A'} size="small" color="default" />
                        </TableCell>
                        <TableCell>
                          {new Date(cycle.starts_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>{new Date(cycle.ends_at).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          {isActive && <Chip label="En cours" size="small" color="success" />}
                          {isUpcoming && <Chip label="À venir" size="small" color="info" />}
                          {isPast && <Chip label="Terminé" size="small" color="default" />}
                        </TableCell>
                        {isAdmin && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(cycle)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(cycle)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <CycleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        cycle={selectedCycle}
        isLoading={createCycle.isPending || updateCycle.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le cycle"
        message={`Êtes-vous sûr de vouloir supprimer ce cycle (${selectedCycle?.vegetables?.name} sur ${selectedCycle?.parcels?.name}) ?`}
        confirmText="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteCycle.isPending}
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

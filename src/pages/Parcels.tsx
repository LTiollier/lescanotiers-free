import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MobileCard } from '../components/MobileCard';
import { ParcelForm } from '../components/ParcelForm';
import { useCreateParcel, useDeleteParcel, useParcels, useUpdateParcel } from '../hooks/useParcels';
import { usePWA } from '../hooks/usePWA';
import { useIsAdmin } from '../hooks/useUserProfile';
import type { Database } from '../types/database.types';

type Parcel = Database['public']['Tables']['parcels']['Row'];

export function Parcels() {
  const { data: parcels, isLoading, error } = useParcels();
  const createParcel = useCreateParcel();
  const updateParcel = useUpdateParcel();
  const deleteParcel = useDeleteParcel();
  const isAdmin = useIsAdmin();
  const { isOffline } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'}>Gestion des Parcelles</Typography>
        {isAdmin && !isMobile && (
          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={isOffline}
              >
                Ajouter une parcelle
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {parcels?.length === 0 ? (
            <Card>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune parcelle. Appuyez sur + pour commencer.
                </Typography>
              </Box>
            </Card>
          ) : (
            parcels?.map((parcel) => (
              <MobileCard
                key={parcel.id}
                fields={[
                  {
                    label: 'Nom',
                    value: parcel.name,
                    emphasized: true,
                  },
                  {
                    label: 'Date de création',
                    value: new Date(parcel.created_at).toLocaleDateString('fr-FR'),
                  },
                ]}
                actions={
                  isAdmin
                    ? [
                        {
                          icon: <EditIcon />,
                          onClick: () => handleEdit(parcel),
                          color: 'primary',
                          disabled: isOffline,
                        },
                        {
                          icon: <DeleteIcon />,
                          onClick: () => handleDelete(parcel),
                          color: 'error',
                          disabled: isOffline,
                        },
                      ]
                    : undefined
                }
              />
            ))
          )}
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
                          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(parcel)}
                                color="primary"
                                disabled={isOffline}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(parcel)}
                                color="error"
                                disabled={isOffline}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
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

      {isMobile && isAdmin && (
        <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
          <Fab
            color="primary"
            aria-label="Ajouter une parcelle"
            onClick={handleAdd}
            disabled={isOffline}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
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

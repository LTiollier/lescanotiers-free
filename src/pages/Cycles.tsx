import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
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
import { CycleForm } from '../components/CycleForm';
import { MobileCard } from '../components/MobileCard';
import {
  type CycleWithRelations,
  useCreateCycle,
  useCycles,
  useDeleteCycle,
  useUpdateCycle,
} from '../hooks/useCycles';
import { usePWA } from '../hooks/usePWA';
import { useIsAdmin } from '../hooks/useUserProfile';

export function Cycles() {
  const { data: cycles, isLoading, error } = useCycles();
  const createCycle = useCreateCycle();
  const updateCycle = useUpdateCycle();
  const deleteCycle = useDeleteCycle();
  const isAdmin = useIsAdmin();
  const { isOffline } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    endsAt: string | null,
    utilityCostsInCents: number | null,
    seedlingCostInCents: number | null,
    quantity: number | null,
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
            utility_costs_in_cents: utilityCostsInCents,
            seedling_cost_in_cents: seedlingCostInCents,
            quantity: quantity,
          },
        });
        setSnackbar({ open: true, message: 'Cycle modifié avec succès', severity: 'success' });
      } else {
        await createCycle.mutateAsync({
          vegetable_id: vegetableId,
          parcel_id: parcelId,
          starts_at: startsAt,
          ends_at: endsAt,
          utility_costs_in_cents: utilityCostsInCents,
          seedling_cost_in_cents: seedlingCostInCents,
          quantity: quantity,
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
        <Typography variant={isMobile ? 'h5' : 'h4'}>Gestion des Cycles</Typography>
        {isAdmin && !isMobile && (
          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={isOffline}
              >
                Ajouter un cycle
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
        // Vue Mobile avec Cards
        <Box>
          {cycles?.length === 0 ? (
            <Card>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucun cycle. Appuyez sur + pour commencer.
                </Typography>
              </Box>
            </Card>
          ) : (
            cycles?.map((cycle) => {
              const today = new Date();
              const startsAt = new Date(cycle.starts_at);
              const endsAt = cycle.ends_at ? new Date(cycle.ends_at) : null;
              const isActive = today >= startsAt && (!endsAt || today <= endsAt);
              const isUpcoming = today < startsAt;

              let statusChip: React.ReactNode;
              if (isActive) {
                statusChip = <Chip label="En cours" size="small" color="success" />;
              } else if (isUpcoming) {
                statusChip = <Chip label="À venir" size="small" color="info" />;
              } else {
                statusChip = <Chip label="Terminé" size="small" color="default" />;
              }

              return (
                <MobileCard
                  key={cycle.id}
                  fields={[
                    {
                      label: 'Légume',
                      value: (
                        <Chip
                          label={cycle.vegetables?.name || 'N/A'}
                          size="small"
                          color="success"
                        />
                      ),
                      emphasized: true,
                    },
                    {
                      label: 'Parcelle',
                      value: (
                        <Chip label={cycle.parcels?.name || 'N/A'} size="small" color="default" />
                      ),
                    },
                    {
                      label: 'Date de début',
                      value: new Date(cycle.starts_at).toLocaleDateString('fr-FR'),
                    },
                    {
                      label: 'Date de fin',
                      value: cycle.ends_at
                        ? new Date(cycle.ends_at).toLocaleDateString('fr-FR')
                        : 'En cours',
                    },
                    {
                      label: 'Statut',
                      value: statusChip,
                    },
                    {
                      label: 'Quantité',
                      value: cycle.quantity ? (
                        <Chip label={`${cycle.quantity} kg`} size="small" color="info" />
                      ) : (
                        '-'
                      ),
                    },
                  ]}
                  actions={
                    isAdmin
                      ? [
                        {
                          icon: <EditIcon />,
                          onClick: () => handleEdit(cycle),
                          color: 'primary',
                          disabled: isOffline,
                        },
                        {
                          icon: <DeleteIcon />,
                          onClick: () => handleDelete(cycle),
                          color: 'error',
                          disabled: isOffline,
                        },
                      ]
                      : undefined
                  }
                />
              );
            })
          )}
        </Box>
      ) : (
        // Vue Desktop avec Table
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
                  <TableCell>Quantité</TableCell>
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
                    const endsAt = cycle.ends_at ? new Date(cycle.ends_at) : null;
                    const isActive = today >= startsAt && (!endsAt || today <= endsAt);
                    const isUpcoming = today < startsAt;
                    const isPast = endsAt ? today > endsAt : false;

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
                        <TableCell>
                          {cycle.ends_at
                            ? new Date(cycle.ends_at).toLocaleDateString('fr-FR')
                            : 'En cours'}
                        </TableCell>
                        <TableCell>
                          {isActive && <Chip label="En cours" size="small" color="success" />}
                          {isUpcoming && <Chip label="À venir" size="small" color="info" />}
                          {isPast && <Chip label="Terminé" size="small" color="default" />}
                        </TableCell>
                        <TableCell>
                          {cycle.quantity ? (
                            <Chip label={`${cycle.quantity} kg`} size="small" color="info" />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        {isAdmin && (
                          <TableCell align="right">
                            <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(cycle)}
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
                                  onClick={() => handleDelete(cycle)}
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* FAB pour mobile */}
      {isMobile && isAdmin && (
        <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
          <span>
            <Fab
              color="primary"
              aria-label="Ajouter un cycle"
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
          </span>
        </Tooltip>
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

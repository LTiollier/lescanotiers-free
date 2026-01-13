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
import { ActivityForm } from '../components/ActivityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MobileCard } from '../components/MobileCard';
import {
  useActivities,
  useCreateActivity,
  useDeleteActivity,
  useUpdateActivity,
} from '../hooks/useActivities';
import { usePWA } from '../hooks/usePWA';
import { useIsAdmin } from '../hooks/useUserProfile';
import type { Database } from '../types/database.types';

type Activity = Database['public']['Tables']['activities']['Row'];

export function Activities() {
  const { data: activities, isLoading, error } = useActivities();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const isAdmin = useIsAdmin();
  const { isOffline } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
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
    setSelectedActivity(null);
    setFormOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setFormOpen(true);
  };

  const handleDelete = (activity: Activity) => {
    setSelectedActivity(activity);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (name: string) => {
    try {
      if (selectedActivity) {
        await updateActivity.mutateAsync({ id: selectedActivity.id, updates: { name } });
        setSnackbar({ open: true, message: 'Activité modifiée avec succès', severity: 'success' });
      } else {
        await createActivity.mutateAsync({ name });
        setSnackbar({ open: true, message: 'Activité ajoutée avec succès', severity: 'success' });
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
    if (!selectedActivity) return;

    try {
      await deleteActivity.mutateAsync(selectedActivity.id);
      setSnackbar({ open: true, message: 'Activité supprimée avec succès', severity: 'success' });
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
          Gestion des Activités
        </Typography>
        <Alert severity="error">Erreur lors du chargement des activités: {error.message}</Alert>
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
        <Typography variant={isMobile ? 'h5' : 'h4'}>Gestion des Activités</Typography>
        {isAdmin && !isMobile && (
          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={isOffline}
              >
                Ajouter une activité
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
          {activities?.length === 0 ? (
            <Card>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucune activité. Appuyez sur + pour commencer.
                </Typography>
              </Box>
            </Card>
          ) : (
            activities?.map((activity) => (
              <MobileCard
                key={activity.id}
                fields={[
                  {
                    label: 'Nom',
                    value: activity.name,
                    emphasized: true,
                  },
                ]}
                actions={
                  isAdmin
                    ? [
                        {
                          icon: <EditIcon />,
                          onClick: () => handleEdit(activity),
                          color: 'primary',
                          disabled: isOffline,
                        },
                        {
                          icon: <DeleteIcon />,
                          onClick: () => handleDelete(activity),
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
                  {isAdmin && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {activities?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 2 : 1} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucune activité. Cliquez sur "Ajouter une activité" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  activities?.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.name}</TableCell>
                      {isAdmin && (
                        <TableCell align="right">
                          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(activity)}
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
                                onClick={() => handleDelete(activity)}
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
          <span>
            <Fab
              color="primary"
              aria-label="Ajouter une activité"
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

      <ActivityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        activity={selectedActivity}
        isLoading={createActivity.isPending || updateActivity.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer l'activité"
        message={`Êtes-vous sûr de vouloir supprimer l'activité "${selectedActivity?.name}" ?`}
        confirmText="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteActivity.isPending}
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

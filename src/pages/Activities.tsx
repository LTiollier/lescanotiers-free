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
import { ActivityForm } from '../components/ActivityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  useActivities,
  useCreateActivity,
  useDeleteActivity,
  useUpdateActivity,
} from '../hooks/useActivities';
import { useIsAdmin } from '../hooks/useUserProfile';
import type { Database } from '../types/database.types';

type Activity = Database['public']['Tables']['activities']['Row'];

export function Activities() {
  const { data: activities, isLoading, error } = useActivities();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();
  const isAdmin = useIsAdmin();

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des Activités</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter une activité
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
                {activities?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucune activité. Cliquez sur "Ajouter une activité" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  activities?.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.name}</TableCell>
                      <TableCell align="right">
                        {new Date(activity.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(activity)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(activity)}
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

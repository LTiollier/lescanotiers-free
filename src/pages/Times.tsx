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
  Stack,
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
import { TimeForm } from '../components/TimeForm';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../hooks/usePWA';
import type { TimeWithRelations } from '../hooks/useTimes';
import { useCreateTime, useDeleteTime, useTimes, useUpdateTime } from '../hooks/useTimes';
import { useIsAdmin } from '../hooks/useUserProfile';

export function Times() {
  const { data: times, isLoading, error } = useTimes();
  const createTime = useCreateTime();
  const updateTime = useUpdateTime();
  const deleteTime = useDeleteTime();
  const isAdmin = useIsAdmin();
  const { user } = useAuth();
  const { isOffline } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeWithRelations | null>(null);
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
    setSelectedTime(null);
    setFormOpen(true);
  };

  const handleEdit = (time: TimeWithRelations) => {
    setSelectedTime(time);
    setFormOpen(true);
  };

  const handleDelete = (time: TimeWithRelations) => {
    setSelectedTime(time);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (
    cycleId: number,
    activityId: number,
    date: string,
    minutes: number,
    quantity: number | null,
  ) => {
    if (!user) return;

    try {
      if (selectedTime) {
        await updateTime.mutateAsync({
          id: selectedTime.id,
          updates: {
            cycle_id: cycleId,
            activity_id: activityId,
            date,
            minutes,
            quantity,
          },
        });
        setSnackbar({ open: true, message: 'Temps modifié avec succès', severity: 'success' });
      } else {
        await createTime.mutateAsync({
          user_id: user.id,
          cycle_id: cycleId,
          activity_id: activityId,
          date,
          minutes,
          quantity,
        });
        setSnackbar({ open: true, message: 'Temps ajouté avec succès', severity: 'success' });
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
    if (!selectedTime) return;

    try {
      await deleteTime.mutateAsync(selectedTime.id);
      setSnackbar({ open: true, message: 'Temps supprimé avec succès', severity: 'success' });
      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        severity: 'error',
      });
    }
  };

  const canEditTime = (time: TimeWithRelations) => {
    return isAdmin || time.user_id === user?.id;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Suivi des Temps Passés
        </Typography>
        <Alert severity="error">Erreur lors du chargement des temps: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header - adapté pour mobile */}
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
        <Typography variant={isMobile ? 'h5' : 'h4'}>Suivi des Temps Passés</Typography>
        {!isMobile && (
          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={isOffline}
              >
                Ajouter un temps
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
          {times?.length === 0 ? (
            <Card>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucun temps enregistré. Appuyez sur + pour commencer.
                </Typography>
              </Box>
            </Card>
          ) : (
            times?.map((time) => (
              <MobileCard
                key={time.id}
                fields={[
                  {
                    label: 'Date',
                    value: new Date(time.date).toLocaleDateString('fr-FR'),
                    emphasized: true,
                  },
                  {
                    label: 'Utilisateur',
                    value: (
                      <Chip label={time.profiles?.username || 'N/A'} size="small" color="default" />
                    ),
                  },
                  {
                    label: 'Cycle',
                    value: (
                      <Stack spacing={0.5}>
                        <Chip
                          label={time.cycles?.vegetables?.name || 'N/A'}
                          size="small"
                          color="success"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {time.cycles?.parcels?.name || 'N/A'}
                        </Typography>
                      </Stack>
                    ),
                  },
                  {
                    label: 'Activité',
                    value: (
                      <Chip label={time.activities?.name || 'N/A'} size="small" color="primary" />
                    ),
                  },
                  {
                    label: 'Durée',
                    value: <Chip label={formatDuration(time.minutes)} size="small" />,
                  },
                  {
                    label: 'Quantité',
                    value: time.quantity ? (
                      <Chip label={time.quantity} size="small" color="info" />
                    ) : (
                      '-'
                    ),
                  },
                ]}
                actions={
                  canEditTime(time)
                    ? [
                        {
                          icon: <EditIcon />,
                          onClick: () => handleEdit(time),
                          color: 'primary',
                          disabled: isOffline,
                        },
                        ...(isAdmin
                          ? [
                              {
                                icon: <DeleteIcon />,
                                onClick: () => handleDelete(time),
                                color: 'error' as const,
                                disabled: isOffline,
                              },
                            ]
                          : []),
                      ]
                    : undefined
                }
              />
            ))
          )}
        </Box>
      ) : (
        // Vue Desktop avec Table
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Cycle</TableCell>
                  <TableCell>Activité</TableCell>
                  <TableCell>Durée</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {times?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucun temps enregistré. Cliquez sur "Ajouter un temps" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  times?.map((time) => (
                    <TableRow key={time.id}>
                      <TableCell>{new Date(time.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Chip
                          label={time.profiles?.username || 'N/A'}
                          size="small"
                          color="default"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            label={time.cycles?.vegetables?.name || 'N/A'}
                            size="small"
                            color="success"
                          />
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            {time.cycles?.parcels?.name || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={time.activities?.name || 'N/A'} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Chip label={formatDuration(time.minutes)} size="small" />
                      </TableCell>
                      <TableCell>
                        {time.quantity ? (
                          <Chip label={time.quantity} size="small" color="info" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {canEditTime(time) && (
                          <>
                            <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(time)}
                                  color="primary"
                                  disabled={isOffline}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            {isAdmin && (
                              <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(time)}
                                    color="error"
                                    disabled={isOffline}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* FAB pour mobile */}
      {isMobile && (
        <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
          <span>
            <Fab
              color="primary"
              aria-label="Ajouter un temps"
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

      <TimeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        time={selectedTime}
        isLoading={createTime.isPending || updateTime.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Supprimer le temps"
        message={`Êtes-vous sûr de vouloir supprimer ce temps passé ?`}
        confirmText="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        isLoading={deleteTime.isPending}
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

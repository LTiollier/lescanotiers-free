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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { MobileCard } from '../components/MobileCard';
import { VegetableForm } from '../components/VegetableForm';
import { useIsAdmin } from '../hooks/useUserProfile';
import { useVegetableCategories } from '../hooks/useVegetableCategories';
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
  const { data: categories } = useVegetableCategories();
  const createVegetable = useCreateVegetable();
  const updateVegetable = useUpdateVegetable();
  const deleteVegetable = useDeleteVegetable();
  const isAdmin = useIsAdmin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleFormSubmit = async (name: string, categoryId: number | null) => {
    try {
      if (selectedVegetable) {
        await updateVegetable.mutateAsync({
          id: selectedVegetable.id,
          updates: { name, category_id: categoryId },
        });
        setSnackbar({ open: true, message: 'Légume modifié avec succès', severity: 'success' });
      } else {
        await createVegetable.mutateAsync({ name, category_id: categoryId });
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
        <Typography variant={isMobile ? 'h5' : 'h4'}>Gestion des Légumes</Typography>
        {isAdmin && !isMobile && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Ajouter un légume
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Box>
          {vegetables?.length === 0 ? (
            <Card>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucun légume. Appuyez sur + pour commencer.
                </Typography>
              </Box>
            </Card>
          ) : (
            vegetables?.map((vegetable) => {
              const category = categories?.find((c) => c.id === vegetable.category_id);
              return (
                <MobileCard
                  key={vegetable.id}
                  fields={[
                    {
                      label: 'Nom',
                      value: vegetable.name,
                      emphasized: true,
                    },
                    {
                      label: 'Catégorie',
                      value: category ? (
                        <Chip
                          label={category.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ) : (
                        '-'
                      ),
                    },
                    {
                      label: 'Date de création',
                      value: new Date(vegetable.created_at).toLocaleDateString('fr-FR'),
                    },
                  ]}
                  actions={
                    isAdmin
                      ? [
                          {
                            icon: <EditIcon />,
                            onClick: () => handleEdit(vegetable),
                            color: 'primary',
                          },
                          {
                            icon: <DeleteIcon />,
                            onClick: () => handleDelete(vegetable),
                            color: 'error',
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
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell align="right">Date de création</TableCell>
                  {isAdmin && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {vegetables?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucun légume. Cliquez sur "Ajouter un légume" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vegetables?.map((vegetable) => {
                    const category = categories?.find((c) => c.id === vegetable.category_id);
                    return (
                      <TableRow key={vegetable.id}>
                        <TableCell>{vegetable.name}</TableCell>
                        <TableCell>
                          {category ? (
                            <Chip
                              label={category.name}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {isMobile && isAdmin && (
        <Fab
          color="primary"
          aria-label="Ajouter un légume"
          onClick={handleAdd}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <AddIcon />
        </Fab>
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

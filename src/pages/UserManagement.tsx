import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { MobileCard } from '../components/MobileCard';
import { useAuth } from '../contexts/AuthContext';
import { usePWA } from '../hooks/usePWA';
import { useCreateUser, useUpdateUserProfile, useUsers } from '../hooks/useUsers';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUserProfile = useUpdateUserProfile();
  const { isOffline } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formOpen, setFormOpen] = useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false); // Renamed from roleDialogOpen
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Form state for creating user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [hourlyRateInCents, setHourlyRateInCents] = useState<number | ''>(''); // New state variable

  // Form state for editing user profile
  const [newRole, setNewRole] = useState<'admin' | 'employee'>('employee');
  const [newHourlyRateInCents, setNewHourlyRateInCents] = useState<number | ''>(''); // New state variable

  const handleAdd = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setRole('employee');
    setHourlyRateInCents(''); // Reset hourly rate
    setFormOpen(true);
  };

  const handleEditProfile = (user: Profile) => {
    setSelectedUser(user);
    setNewRole(user.role as 'admin' | 'employee');
    setNewHourlyRateInCents(user.hourly_rate_in_cents ?? ''); // Populate hourly rate
    setEditProfileDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setSnackbar({
        open: true,
        message: "Le nom d'utilisateur est obligatoire",
        severity: 'error',
      });
      return;
    }

    if (password.length < 6) {
      setSnackbar({
        open: true,
        message: 'Le mot de passe doit contenir au moins 6 caractères',
        severity: 'error',
      });
      return;
    }

    try {
      await createUser.mutateAsync({
        email,
        password,
        username,
        role,
        hourlyRateInCents: hourlyRateInCents === '' ? null : Number(hourlyRateInCents),
      });
      setSnackbar({
        open: true,
        message: 'Utilisateur créé avec succès',
        severity: 'success',
      });
      setFormOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Une erreur est survenue',
        severity: 'error',
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (!selectedUser) return;

    try {
      await updateUserProfile.mutateAsync({
        userId: selectedUser.id,
        role: newRole,
        hourlyRateInCents: newHourlyRateInCents === '' ? null : Number(newHourlyRateInCents),
      });
      setSnackbar({
        open: true,
        message: 'Profil utilisateur modifié avec succès',
        severity: 'success',
      });
      setEditProfileDialogOpen(false);
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
          Gestion des Utilisateurs
        </Typography>
        <Alert severity="error">Erreur lors du chargement des utilisateurs: {error.message}</Alert>
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
        <Typography variant={isMobile ? 'h5' : 'h4'}>Gestion des Utilisateurs</Typography>
        {!isMobile && (
          <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                disabled={isOffline}
              >
                Créer un utilisateur
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
          {users?.length === 0 ? (
            <Card>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Aucun utilisateur. Appuyez sur + pour commencer.
                </Typography>
              </Box>
            </Card>
          ) : (
            users?.map((user) => (
              <MobileCard
                key={user.id}
                fields={[
                  {
                    label: 'Nom',
                    value: (
                      <Stack direction="row" spacing={1} alignItems="center">
                        {user.id === currentUser?.id && (
                          <Chip label="Vous" size="small" color="primary" />
                        )}
                        <Typography variant="body2">{user.username || 'Utilisateur'}</Typography>
                      </Stack>
                    ),
                    emphasized: true,
                  },
                  {
                    label: 'ID',
                    value: (
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {user.id}
                      </Typography>
                    ),
                  },
                  {
                    label: 'Rôle',
                    value: (
                      <Chip
                        label={user.role === 'admin' ? 'Administrateur' : 'Employé'}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    ),
                  },
                  {
                    label: 'Taux horaire',
                    value: user.hourly_rate_in_cents
                      ? `${user.hourly_rate_in_cents / 100} €/h`
                      : 'Non défini',
                  },
                  {
                    label: 'Date de création',
                    value: new Date(user.created_at).toLocaleDateString('fr-FR'),
                  },
                ]}
                actions={[
                  {
                    icon: <EditIcon />,
                    onClick: () => handleEditProfile(user),
                    color: 'primary',
                    disabled: user.id === currentUser?.id || isOffline,
                  },
                ]}
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
                  <TableCell>ID Utilisateur</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Taux horaire</TableCell>
                  <TableCell align="right">Date de création</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        Aucun utilisateur. Cliquez sur "Créer un utilisateur" pour commencer.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {user.id === currentUser?.id && (
                            <Chip label="Vous" size="small" color="primary" />
                          )}
                          <Typography variant="body2">{user.username || '—'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {user.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'admin' ? 'Administrateur' : 'Employé'}
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.hourly_rate_in_cents
                            ? `${user.hourly_rate_in_cents / 100} €/h`
                            : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip
                          title={
                            isOffline
                              ? 'Indisponible hors-ligne'
                              : user.id === currentUser?.id
                                ? 'Vous ne pouvez pas modifier votre propre profil'
                                : ''
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleEditProfile(user)}
                              color="primary"
                              disabled={user.id === currentUser?.id || isOffline}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {isMobile && (
        <Tooltip title={isOffline ? 'Indisponible hors-ligne' : ''}>
          <span>
            <Fab
              color="primary"
              aria-label="Créer un utilisateur"
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

      {/* Create User Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoFocus
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                helperText="Au moins 6 caractères"
              />
              <TextField
                label="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={role}
                  label="Rôle"
                  onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                >
                  <MenuItem value="employee">Employé</MenuItem>
                  <MenuItem value="admin">Administrateur</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Taux horaire (en centimes)"
                type="number"
                value={hourlyRateInCents}
                onChange={(e) => setHourlyRateInCents(e.target.value ? Number(e.target.value) : '')}
                fullWidth
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={createUser.isPending}>
              {createUser.isPending ? 'Création...' : 'Créer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit User Profile Dialog */}
      <Dialog
        open={editProfileDialogOpen}
        onClose={() => setEditProfileDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Modifier le profil utilisateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={newRole}
                label="Rôle"
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'employee')}
              >
                <MenuItem value="employee">Employé</MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Taux horaire (en centimes)"
              type="number"
              value={newHourlyRateInCents}
              onChange={(e) =>
                setNewHourlyRateInCents(e.target.value ? Number(e.target.value) : '')
              }
              fullWidth
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleProfileUpdate}
            disabled={updateUserProfile.isPending}
          >
            {updateUserProfile.isPending ? 'Modification...' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

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

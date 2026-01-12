import { ExitToApp, Person, Spa } from '@mui/icons-material';
import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useUserProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Spa sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" color="primary">
              Les Canotiers
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person />
            <Typography variant="body1">
              {isLoading ? 'Chargement...' : profile?.username || user?.email}
            </Typography>
            <ExitToApp
              sx={{ cursor: 'pointer', '&:hover': { color: 'error.main' } }}
              onClick={handleSignOut}
              titleAccess="Se déconnecter"
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bienvenue ! 🚣
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vous êtes connecté en tant que :{' '}
                  <strong>{profile?.role === 'admin' ? 'Administrateur' : 'Employé'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Email : {user?.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Navigation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Les fonctionnalités de gestion (parcelles, légumes, cycles, activités) seront
                  bientôt disponibles.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

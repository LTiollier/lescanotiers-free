import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useUserProfile();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

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
                Utilisez le menu de gauche pour accéder aux différentes fonctionnalités.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

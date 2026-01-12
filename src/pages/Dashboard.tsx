import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
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

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        <Box sx={{ flex: 1 }}>
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
        </Box>

        <Box sx={{ flex: 1 }}>
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
        </Box>
      </Stack>
    </Box>
  );
}

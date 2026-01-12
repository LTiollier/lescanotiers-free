import { Lock as LockIcon } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function Forbidden() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        gap={3}
      >
        <LockIcon sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h1" component="h1" fontSize={72} fontWeight="bold" color="error.main">
          403
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Accès interdit
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </Button>
      </Box>
    </Container>
  );
}

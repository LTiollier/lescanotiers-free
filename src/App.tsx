import { Spa } from '@mui/icons-material';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Spa sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h1" component="h1" color="primary">
            Les Canotiers
          </Typography>
        </Box>

        <Card sx={{ minWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Hello World 🚣
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bienvenue sur l'application de gestion de maraîchage
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default App;

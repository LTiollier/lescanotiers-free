import { Box, Card, CardContent, Typography } from '@mui/material';

export function Cycles() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Cycles
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            La gestion des cycles de culture sera bientôt disponible.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Fonctionnalités à venir :
          </Typography>
          <ul>
            <li>Liste des cycles en cours</li>
            <li>Historique des cycles</li>
            <li>Créer un nouveau cycle</li>
            <li>Associer légume et parcelle</li>
            <li>Définir dates de début et fin</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}

import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import { usePWA } from '../hooks/usePWA';

export function PWAUpdateNotification() {
  const { offlineReady, needRefresh, updateApp, closeNotification } = usePWA();

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <>
      {/* Notification pour mode hors ligne prêt */}
      <Snackbar
        open={offlineReady}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="success"
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={closeNotification}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          Application prête pour une utilisation hors ligne !
        </Alert>
      </Snackbar>

      {/* Notification pour mise à jour disponible */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="info"
          action={
            <>
              <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={updateApp}>
                Mettre à jour
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeNotification}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          Une nouvelle version est disponible !
        </Alert>
      </Snackbar>
    </>
  );
}

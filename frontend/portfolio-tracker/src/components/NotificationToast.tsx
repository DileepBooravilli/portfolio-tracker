import { Snackbar, Alert } from '@mui/material';
import type { AlertDto } from '../types/portfolio';

interface NotificationToastProps {
  alert: AlertDto | null;
  onClose: () => void;
}

export default function NotificationToast({ alert, onClose }: NotificationToastProps) {
  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={alert?.level === 'Critical' ? 'error' : 'warning'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {alert?.message}
      </Alert>
    </Snackbar>
  );
}

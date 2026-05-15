import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import type { AlertDto } from '../types/portfolio';

interface AlertsPanelProps {
  alerts: AlertDto[];
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No alerts yet. Alerts trigger when prices move 5% or 10% during the day.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
      <List dense disablePadding>
        {alerts.map((alert) => (
          <ListItem
            key={alert.id}
            sx={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              bgcolor: alert.level === 'Critical' ? 'rgba(211,47,47,0.04)' : 'rgba(237,108,2,0.04)',
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {alert.level === 'Critical' ? (
                <ErrorIcon color="error" fontSize="small" />
              ) : (
                <WarningAmberIcon sx={{ color: '#ed6c02' }} fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={alert.symbol}
                    size="small"
                    color={alert.level === 'Critical' ? 'error' : 'warning'}
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {alert.message}
                  </Typography>
                </Box>
              }
              secondary={formatTime(alert.timestamp)}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

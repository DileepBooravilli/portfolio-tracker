import { Box, Typography, List, ListItem, ListItemText, Chip, Paper } from '@mui/material';
import type { TradeNotificationDto } from '../types/portfolio';

interface ActivityFeedProps {
  trades: TradeNotificationDto[];
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function ActivityFeed({ trades }: ActivityFeedProps) {
  if (trades.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No recent trades. Simulated users will start trading shortly.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
      <List dense disablePadding>
        {trades.map((trade) => (
          <ListItem
            key={trade.tradeId}
            sx={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              bgcolor: trade.side === 'Buy' ? 'rgba(46,125,50,0.04)' : 'rgba(211,47,47,0.04)',
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={trade.side}
                    size="small"
                    color={trade.side === 'Buy' ? 'success' : 'error'}
                    sx={{ fontWeight: 700, fontSize: '0.7rem', minWidth: 40 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {trade.symbol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trade.quantity} @ ${trade.price.toFixed(2)}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {trade.userId} • {formatTime(trade.timestamp)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

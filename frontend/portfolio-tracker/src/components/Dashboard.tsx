import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { usePortfolio } from '../hooks/usePortfolio';
import PnLSummary from './PnLSummary';
import HoldingsGrid from './HoldingsGrid';
import ExposureChart from './ExposureChart';
import AlertsPanel from './AlertsPanel';
import ActivityFeed from './ActivityFeed';
import TradeDialog from './TradeDialog';
import NotificationToast from './NotificationToast';

export default function Dashboard() {
  const {
    positions,
    summary,
    exposure,
    alerts,
    tradeNotifications,
    connected,
    latestAlert,
    executeTrade,
    clearLatestAlert,
  } = usePortfolio();

  const [tradeOpen, setTradeOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>();
  const [bottomTab, setBottomTab] = useState(0);

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    setTradeOpen(true);
  };

  const handleTrade = async (symbol: string, side: string, quantity: number) => {
    await executeTrade(symbol, side, quantity);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1a237e' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            Portfolio Tracker
          </Typography>
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />}
            label={connected ? 'Live' : 'Disconnected'}
            size="small"
            color={connected ? 'success' : 'error'}
            sx={{ mr: 2, fontWeight: 600 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedSymbol(undefined);
              setTradeOpen(true);
            }}
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#388e3c' },
              fontWeight: 600,
            }}
          >
            Trade
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {/* Summary Cards */}
        <PnLSummary summary={summary} />

        {/* Holdings Grid */}
        <Paper elevation={1} sx={{ mt: 3, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Holdings
          </Typography>
          <HoldingsGrid positions={positions} onSymbolClick={handleSymbolClick} />
        </Paper>

        {/* Bottom Section: Tabs for Exposure / Alerts / Activity */}
        <Paper elevation={1} sx={{ mt: 3, p: 2 }}>
          <Tabs
            value={bottomTab}
            onChange={(_, v) => setBottomTab(v)}
            sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}
          >
            <Tab label="Exposure" />
            <Tab
              label={
                <Badge badgeContent={alerts.length} color="error" max={99}>
                  <Box sx={{ pr: 1 }}>Alerts</Box>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={tradeNotifications.length} color="primary" max={99}>
                  <Box sx={{ pr: 1 }}>Activity</Box>
                </Badge>
              }
            />
          </Tabs>

          {bottomTab === 0 && <ExposureChart exposure={exposure} />}
          {bottomTab === 1 && <AlertsPanel alerts={alerts} />}
          {bottomTab === 2 && <ActivityFeed trades={tradeNotifications} />}
        </Paper>
      </Box>

      {/* Trade Dialog */}
      <TradeDialog
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        onSubmit={handleTrade}
        positions={positions}
        preselectedSymbol={selectedSymbol}
      />

      {/* Alert Toast Notification */}
      <NotificationToast alert={latestAlert} onClose={clearLatestAlert} />
    </Box>
  );
}

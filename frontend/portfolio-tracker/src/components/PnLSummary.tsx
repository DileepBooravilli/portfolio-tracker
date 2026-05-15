import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import type { PortfolioSummaryDto } from '../types/portfolio';

interface PnLSummaryProps {
  summary: PortfolioSummaryDto | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}

function SummaryCard({ title, value, subtitle, icon, color }: SummaryCardProps) {
  return (
    <Card elevation={1} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: color || 'text.primary' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: color || 'text.secondary', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color || 'primary.main', opacity: 0.7 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function PnLSummary({ summary }: PnLSummaryProps) {
  if (!summary) return null;

  const pnlColor = summary.totalPnL >= 0 ? '#2e7d32' : '#d32f2f';
  const dayColor = summary.dayChange >= 0 ? '#2e7d32' : '#d32f2f';
  const PnLIcon = summary.totalPnL >= 0 ? TrendingUpIcon : TrendingDownIcon;
  const DayIcon = summary.dayChange >= 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Portfolio Value"
          value={formatCurrency(summary.totalValue)}
          subtitle={`${summary.positionCount} positions`}
          icon={<AccountBalanceWalletIcon />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Total Cost"
          value={formatCurrency(summary.totalCost)}
          icon={<ShowChartIcon />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Total P&L"
          value={formatCurrency(summary.totalPnL)}
          subtitle={formatPercent(summary.totalPnLPercent)}
          icon={<PnLIcon />}
          color={pnlColor}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SummaryCard
          title="Day Change"
          value={formatCurrency(summary.dayChange)}
          subtitle={formatPercent(summary.dayChangePercent)}
          icon={<DayIcon />}
          color={dayColor}
        />
      </Grid>
    </Grid>
  );
}

import { useMemo } from 'react';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import type { PositionDto } from '../types/portfolio';

interface HoldingsGridProps {
  positions: PositionDto[];
  onSymbolClick?: (symbol: string) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

function PnLCell({ value }: { value: number }) {
  const color = value >= 0 ? '#2e7d32' : '#d32f2f';
  return (
    <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
      {formatCurrency(value)}
    </Typography>
  );
}

function PercentCell({ value }: { value: number }) {
  const color = value >= 0 ? '#2e7d32' : '#d32f2f';
  const Icon = value >= 0 ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Icon sx={{ fontSize: 16, color }} />
      <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
        {formatPercent(value)}
      </Typography>
    </Box>
  );
}

export default function HoldingsGrid({ positions, onSymbolClick }: HoldingsGridProps) {
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'symbol',
        headerName: 'Symbol',
        width: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => onSymbolClick?.(params.value)}
            sx={{ fontWeight: 700, cursor: 'pointer' }}
          />
        ),
      },
      { field: 'name', headerName: 'Name', width: 180 },
      { field: 'sector', headerName: 'Sector', width: 160 },
      {
        field: 'quantity',
        headerName: 'Qty',
        width: 80,
        type: 'number',
      },
      {
        field: 'averageCost',
        headerName: 'Avg Cost',
        width: 110,
        type: 'number',
        valueFormatter: (value: number) => formatCurrency(value),
      },
      {
        field: 'currentPrice',
        headerName: 'Price',
        width: 110,
        type: 'number',
        valueFormatter: (value: number) => formatCurrency(value),
      },
      {
        field: 'marketValue',
        headerName: 'Mkt Value',
        width: 130,
        type: 'number',
        valueFormatter: (value: number) => formatCurrency(value),
      },
      {
        field: 'unrealizedPnL',
        headerName: 'P&L',
        width: 130,
        type: 'number',
        renderCell: (params: GridRenderCellParams) => <PnLCell value={params.value} />,
      },
      {
        field: 'pnLPercent',
        headerName: 'P&L %',
        width: 120,
        type: 'number',
        renderCell: (params: GridRenderCellParams) => <PercentCell value={params.value} />,
      },
      {
        field: 'dayChangePercent',
        headerName: 'Day %',
        width: 110,
        type: 'number',
        renderCell: (params: GridRenderCellParams) => <PercentCell value={params.value} />,
      },
    ],
    [onSymbolClick]
  );

  return (
    <Box sx={{ width: '100%', height: 500 }}>
      <DataGrid
        rows={positions}
        columns={columns}
        getRowId={(row) => row.symbol}
        density="compact"
        disableRowSelectionOnClick
        initialState={{
          sorting: { sortModel: [{ field: 'marketValue', sort: 'desc' }] },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            fontWeight: 700,
          },
          border: 'none',
        }}
      />
    </Box>
  );
}

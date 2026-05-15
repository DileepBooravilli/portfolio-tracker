import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, type PieLabelRenderProps } from 'recharts';
import type { ExposureDto } from '../types/portfolio';

interface ExposureChartProps {
  exposure: ExposureDto | null;
}

const COLORS = [
  '#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2',
  '#0097a7', '#c2185b', '#455a64', '#afb42b', '#6d4c41',
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { weight: number; marketValue: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant="body2" fontWeight={600}>{data.name}</Typography>
      <Typography variant="caption" color="text.secondary">
        {formatCurrency(data.payload.marketValue)} ({data.payload.weight.toFixed(1)}%)
      </Typography>
    </Box>
  );
}

export default function ExposureChart({ exposure }: ExposureChartProps) {
  if (!exposure) return null;

  const sectorData = exposure.bySector.map((s) => ({
    name: s.sector,
    value: s.weight,
    marketValue: s.marketValue,
    weight: s.weight,
  }));

  const assetClassData = exposure.byAssetClass.map((a) => ({
    name: a.assetClass,
    value: a.weight,
    marketValue: a.marketValue,
    weight: a.weight,
  }));

  const renderLabel = (props: PieLabelRenderProps) => {
    const { name, value } = props;
    return `${name} ${Number(value).toFixed(0)}%`;
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Sector Allocation
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={sectorData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={renderLabel} labelLine={false}>
              {sectorData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Asset Class
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={assetClassData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={renderLabel} labelLine={false}>
              {assetClassData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

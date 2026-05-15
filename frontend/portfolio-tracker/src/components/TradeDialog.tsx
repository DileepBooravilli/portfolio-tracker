import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import type { PositionDto } from '../types/portfolio';

interface TradeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (symbol: string, side: string, quantity: number) => void;
  positions: PositionDto[];
  preselectedSymbol?: string;
}

export default function TradeDialog({ open, onClose, onSubmit, positions, preselectedSymbol }: TradeDialogProps) {
  const [symbol, setSymbol] = useState(preselectedSymbol || '');
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!symbol) {
      setError('Select a symbol');
      return;
    }
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setError('Enter a valid quantity');
      return;
    }

    if (side === 'Sell') {
      const position = positions.find((p) => p.symbol === symbol);
      if (position && qty > position.quantity) {
        setError(`Cannot sell more than ${position.quantity} shares`);
        return;
      }
    }

    onSubmit(symbol, side, qty);
    setSymbol('');
    setQuantity('');
    setSide('Buy');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const selectedPosition = positions.find((p) => p.symbol === symbol);
  const availableSymbols = [...new Set(positions.map((p) => p.symbol))].sort();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Execute Trade</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <ToggleButtonGroup
            value={side}
            exclusive
            onChange={(_, v) => v && setSide(v)}
            fullWidth
            size="small"
          >
            <ToggleButton value="Buy" sx={{ color: '#2e7d32', '&.Mui-selected': { bgcolor: '#2e7d32', color: '#fff', '&:hover': { bgcolor: '#1b5e20' } } }}>
              Buy
            </ToggleButton>
            <ToggleButton value="Sell" sx={{ color: '#d32f2f', '&.Mui-selected': { bgcolor: '#d32f2f', color: '#fff', '&:hover': { bgcolor: '#b71c1c' } } }}>
              Sell
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControl fullWidth size="small">
            <InputLabel>Symbol</InputLabel>
            <Select value={symbol} label="Symbol" onChange={(e) => setSymbol(e.target.value)}>
              {availableSymbols.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            type="number"
            size="small"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError('');
            }}
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
          />

          {selectedPosition && (
            <Typography variant="caption" color="text.secondary">
              Current: {selectedPosition.quantity} shares @ ${selectedPosition.currentPrice.toFixed(2)}
            </Typography>
          )}

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={side === 'Buy' ? 'success' : 'error'}
        >
          {side} {symbol || '...'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

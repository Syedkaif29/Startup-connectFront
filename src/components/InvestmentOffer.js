import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  InputAdornment
} from '@mui/material';
import startupService from '../services/startupService';

const InvestmentOffer = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    equity: '',
    description: '',
    terms: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.amount || !formData.equity || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Convert amount and equity to numbers
      const amount = Number(formData.amount);
      const equity = Number(formData.equity);

      if (isNaN(amount) || isNaN(equity)) {
        throw new Error('Amount and equity must be valid numbers');
      }

      if (amount <= 0 || equity <= 0 || equity > 100) {
        throw new Error('Amount must be positive and equity must be between 0 and 100');
      }

      // Create the investment offer
      const offerData = {
        amount,
        equity,
        description: formData.description,
        terms: formData.terms
      };

      await startupService.createInvestmentOffer(offerData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create investment offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Investment Offer</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Investment Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Equity Offered (%)"
                name="equity"
                type="number"
                value={formData.equity}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Terms & Conditions"
                name="terms"
                multiline
                rows={3}
                value={formData.terms}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Offer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InvestmentOffer; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Business,
  AttachMoney,
  TrendingUp,
  Description
} from '@mui/icons-material';
import startupService from '../services/startupService';
import investorService from '../services/investorService';
import authService from '../services/authService';

const StartupProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [investmentOffers, setInvestmentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [investDialogOpen, setInvestDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvestor, setIsInvestor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Check if user is an investor
        const user = authService.getCurrentUser();
        setIsInvestor(user?.role === 'INVESTOR');

        // Fetch startup details
        const startupData = await startupService.getStartupById(id);
        setStartup(startupData);

        // Fetch investment offers
        const offers = await startupService.getInvestmentOffers(id);
        setInvestmentOffers(offers);
      } catch (err) {
        setError(err.message || 'Failed to fetch startup details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInvest = (offer) => {
    setSelectedOffer(offer);
    setInvestmentAmount('');
    setInvestDialogOpen(true);
  };

  const handleInvestSubmit = async () => {
    try {
      if (!investmentAmount || isNaN(investmentAmount) || Number(investmentAmount) <= 0) {
        throw new Error('Please enter a valid investment amount');
      }

      const amount = Number(investmentAmount);
      if (amount > selectedOffer.amount) {
        throw new Error('Investment amount cannot exceed the offer amount');
      }

      await investorService.invest({
        startupId: id,
        offerId: selectedOffer.id,
        amount
      });

      setInvestDialogOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Failed to process investment');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!startup) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Startup not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Startup Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Business sx={{ mr: 1 }} />
                <Typography variant="h4">{startup.startupName}</Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {startup.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Industry: {startup.industry}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Funding Stage: {startup.fundingStage}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Investment Offers */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Investment Offers
          </Typography>
          <Grid container spacing={3}>
            {investmentOffers.map((offer) => (
              <Grid item xs={12} sm={6} md={4} key={offer.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <AttachMoney sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        ${offer.amount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      Equity Offered: {offer.equity}%
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {offer.description}
                    </Typography>
                    {isInvestor && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleInvest(offer)}
                      >
                        Invest
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Investment Dialog */}
      <Dialog open={investDialogOpen} onClose={() => setInvestDialogOpen(false)}>
        <DialogTitle>Make Investment</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Investment Offer: ${selectedOffer?.amount.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Equity Offered: {selectedOffer?.equity}%
          </Typography>
          <TextField
            fullWidth
            label="Investment Amount"
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInvestSubmit} variant="contained">
            Invest
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StartupProfile; 
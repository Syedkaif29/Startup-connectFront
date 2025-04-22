import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';
import startupService from '../services/startupService';
import transactionService from '../services/transactionService';
import authService from '../services/authService';
import InvestmentOfferList from '../components/InvestmentOfferList';
import DummyPaymentDialog from '../components/DummyPaymentDialog';

const TransactionPage = () => {
  const { startupId } = useParams();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await startupService.getInvestmentOffers(startupId);
      console.log('Fetched offers:', data);
      setOffers(data);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err.message || 'Failed to fetch investment offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [startupId]);

  const handleAccept = (offer) => {
    const user = authService.getCurrentUser();
    if (!user || !user.token) {
      setError('You must be logged in to accept offers');
      return;
    }
    setSelectedOffer(offer);
    setPaymentDialogOpen(true);
  };

  const handlePaymentConfirmed = async () => {
    if (!selectedOffer) return;
    
    try {
      setLoading(true);
      setError('');
      
      const user = authService.getCurrentUser();
      if (!user || !user.token) {
        throw new Error('You must be logged in to complete this transaction');
      }

      console.log('Selected offer:', JSON.stringify(selectedOffer, null, 2));

      // First create the transaction
      const transactionPayload = {
        investorId: user.id,
        startupId: selectedOffer.startupId || selectedOffer.startup?.id,
        amount: selectedOffer.amount,
        status: 'ACCEPTED',
        transactionDate: new Date().toISOString(),
        transactionType: 'ACCEPT',
        description: selectedOffer.description || '',
        offerId: selectedOffer.id
      };

      const transaction = await transactionService.createTransaction(transactionPayload);
      console.log('Transaction created:', transaction);

      // Update the offer status to CLOSED
      await startupService.updateInvestmentOffer(selectedOffer.id, {
        status: 'CLOSED',
        startupId: selectedOffer.startupId || selectedOffer.startup?.id
      });

      // Close the dialog before refreshing to avoid any state conflicts
      setSelectedOffer(null);
      setPaymentDialogOpen(false);

      // Refresh the offers list to show updated status
      console.log('Refreshing offers list...');
      await fetchOffers();
      
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Failed to complete transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNegotiate = async (offer) => {
    try {
      setLoading(true);
      setError('');

      const user = authService.getCurrentUser();
      if (!user || !user.token) {
        throw new Error('You must be logged in to negotiate offers');
      }

      await transactionService.createTransaction({
        investorId: user.id,
        startupId: offer.startupId || offer.startup?.id,
        amount: offer.amount,
        status: 'NEGOTIATING',
        transactionDate: new Date().toISOString(),
        transactionType: 'NEGOTIATE',
        description: offer.description || '',
        offerId: offer.id
      });
      
      // Update offer status to NEGOTIATING
      await startupService.updateInvestmentOffer(offer.id, {
        ...offer,
        status: 'NEGOTIATING',
        startupId: offer.startupId || offer.startup?.id
      });
      
      await fetchOffers(); // Refresh the offers list
    } catch (err) {
      console.error('Negotiation error:', err);
      setError(err.message || 'Failed to negotiate offer');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setSelectedOffer(null);
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Investment Offers
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <InvestmentOfferList
              offers={offers}
              isInvestor={false}
              onAccept={handleAccept}
              onNegotiate={handleNegotiate}
              startupId={startupId}
            />
          )}
        </CardContent>
      </Card>
      <DummyPaymentDialog
        open={paymentDialogOpen}
        amount={selectedOffer?.amount}
        startupId={selectedOffer?.startupId || selectedOffer?.startup?.id}
        description={selectedOffer?.description || ''}
        onClose={handleClosePaymentDialog}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </Container>
  );
};

export default TransactionPage;

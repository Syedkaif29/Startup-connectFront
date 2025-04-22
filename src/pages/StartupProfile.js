import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Link,
  Divider,
  Tooltip,
  Button
} from '@mui/material';
import {
  Business,
  Description,
  People,
  AttachMoney
} from '@mui/icons-material';
import startupService from '../services/startupService';
import authService from '../services/authService';
import pitchDeckService from '../services/pitchDeckService';
import investorService from '../services/investorService';
import PitchDeckList from '../components/PitchDeckList';
import InvestmentOfferList from '../components/InvestmentOfferList';

import PitchDeckViewer from '../components/PitchDeckViewer';
import MessageDialog from '../components/common/MessageDialog';
import DummyPaymentDialog from '../components/DummyPaymentDialog';

const StartupProfile = () => {
  // ...existing state...
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState('');
  const [acceptSuccess, setAcceptSuccess] = useState('');

  // Payment modal state
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Trigger payment modal before accept
  const handleAcceptWithPayment = (offer) => {
    setSelectedOffer(offer);
    setPaymentOpen(true);
  };

  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [receiverId, setReceiverId] = useState(null); // <-- add this state
  const [pitchDecks, setPitchDecks] = useState([]);
  const [investmentOffers, setInvestmentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInvestor, setIsInvestor] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);

  // Handler to navigate to TransactionPage
  const navigateToOffers = () => {
    window.location.href = `/transactions/${id}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        const role = user?.role || user?.user?.role;
        console.log('user.role:', role);
        const investorCheck = role && role.toLowerCase() === 'investor';
        console.log('isInvestor:', investorCheck);
        setIsInvestor(investorCheck);

        // Fetch startup details
        const startupData = await startupService.getStartupById(id);
        setStartup(startupData);
        // Ensure we have the startup's userId for messaging
        if (startupData?.userId) {
          setReceiverId(startupData.userId);
        } else {
          // Fetch the userId from backend if not present
          try {
            const token = authService.getToken();
            const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/messages/user/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const user = await res.json();
              setReceiverId(user.id);
            } else {
              setReceiverId(null);
            }
          } catch {
            setReceiverId(null);
          }
        }

        // Fetch public pitch decks for this startup
        if (startupData?.id) {
          try {
            const decks = await pitchDeckService.getPublicPitchDecksByStartup(startupData.id);
            setPitchDecks(decks);
          } catch {
            setPitchDecks([]);
          }
        }

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
    <>
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        {/* Company Name Card */}
        <Card elevation={4} sx={{
          mb: 5,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          color: 'primary.contrastText',
          boxShadow: 8,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 16,
          },
        }}>
          <CardContent>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              fontWeight: 700,
              letterSpacing: 2,
              fontFamily: 'Montserrat, Roboto, Arial',
              mb: 1,
              transition: 'color 0.3s',
              cursor: 'pointer',
              '&:hover': {
                color: '#ffd600',
                textShadow: '0 4px 24px #fff',
              },
            }}
          >
            {startup.startupName || 'Startup'}
          </Typography>
          {isInvestor && (
            <Box textAlign="center" mt={2}>
              <Button variant="contained" color="primary" onClick={navigateToOffers}>
                View Offers
              </Button>
            </Box>
          )}
          {isInvestor && (
            <Box textAlign="center" mt={2}>
              <Button variant="contained" color="primary" onClick={() => setMessageDialogOpen(true)}>
                Message Startup
              </Button>
            </Box>
          )}
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ opacity: 0.9 }}
          >
            Full Startup Profile
          </Typography>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="The industry this startup operates in" arrow>
            <Card sx={{
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              border: '2px solid transparent',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.06)',
                boxShadow: 8,
                border: '2px solid #1976d2',
              },
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Business fontSize="large" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Industry</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {startup.industry || 'Not specified'}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Current funding stage of the startup" arrow>
            <Card sx={{
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              border: '2px solid transparent',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.06)',
                boxShadow: 8,
                border: '2px solid #43a047',
              },
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoney fontSize="large" color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Funding Stage</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {startup.fundingStage || 'Not specified'}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Number of people in the team" arrow>
            <Card sx={{
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              border: '2px solid transparent',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.06)',
                boxShadow: 8,
                border: '2px solid #0288d1',
              },
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <People fontSize="large" color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Team Size</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {startup.teamSize || 'Not specified'}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Tooltip title="Startup's official website" arrow>
            <Card sx={{
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
              border: '2px solid transparent',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.06)',
                boxShadow: 8,
                border: '2px solid #ffa000',
              },
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Description fontSize="large" color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Website</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {startup.website ? (
                    <Link href={startup.website} target="_blank" rel="noopener noreferrer">
                      {startup.website}
                    </Link>
                  ) : (
                    'No website provided'
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box sx={{ my: 4 }}>
        <Divider />
      </Box>

      {/* Description Section */}
      <Card elevation={2} sx={{ mb: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {startup.description || 'No description provided'}
          </Typography>
        </CardContent>
      </Card>

      {/* Pitch Decks Section */}
      <Card elevation={2} sx={{ mb: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Pitch Decks
          </Typography>
          <PitchDeckList pitchDecks={pitchDecks} onPreview={async (deck) => {
          setSelectedDeck(deck);
          if (deck.fileType === 'application/pdf') {
            try {
              const url = await pitchDeckService.previewPublicPitchDeck(deck.id);
              setSelectedDeck({ ...deck, fileUrl: url });
            } catch (err) {
              setSelectedDeck({ ...deck, fileUrl: '' });
            }
          } else {
            setSelectedDeck(deck);
          }
          setViewerOpen(true);
        }} />
        <PitchDeckViewer
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          url={selectedDeck && selectedDeck.fileType === 'application/pdf' ? selectedDeck.fileUrl : ''}
          fileType={selectedDeck ? selectedDeck.fileType : ''}
        />
      </CardContent>
      </Card>

      {/* Divider */}
      <Box sx={{ my: 4 }}>
        <Divider />
      </Box>

      {/* Investment Offers Section */}
      <Card elevation={2} sx={{ mb: 5, borderRadius: 3 }}>
        <CardContent>
           <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Investment Offers
          </Typography>
          {accepting && (
            <Box mb={2}><CircularProgress size={24} /></Box>
          )}
          {acceptSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>{acceptSuccess}</Alert>
          )}
          {acceptError && (
            <Alert severity="error" sx={{ mb: 2 }}>{acceptError}</Alert>
          )}
            <InvestmentOfferList offers={investmentOffers} isInvestor={isInvestor} startupId={id} />
            <DummyPaymentDialog
              open={paymentOpen}
              amount={selectedOffer?.amount}
              onClose={() => setPaymentOpen(false)}
              onSuccess={async () => {
                setPaymentOpen(false);
                if (selectedOffer && isInvestor) {
                  // Store investment after successful payment
                  setAccepting(true);
                  setAcceptError('');
                  setAcceptSuccess('');
                  try {
                    await investorService.invest({ offerId: selectedOffer.id, amount: selectedOffer.amount });
                    setAcceptSuccess('Investment successful!');
                    // Optionally refresh offers or investments
                    const offers = await startupService.getInvestmentOffers(id);
                    setInvestmentOffers(offers);
                  } catch (err) {
                    setAcceptError(err.message || 'Failed to invest.');
                  } finally {
                    setAccepting(false);
                  }
                }
              }}
            />
        </CardContent>
      </Card>
    </Container>
    <MessageDialog
      open={messageDialogOpen}
      onClose={() => setMessageDialogOpen(false)}
      senderId={authService.getCurrentUser()?.user?.id || authService.getCurrentUser()?.id}
      receiverId={receiverId}
      receiverName={startup?.startupName}
    />
  </>);
};

export default StartupProfile;
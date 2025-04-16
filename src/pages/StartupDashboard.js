import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Link,
} from '@mui/material';
import {
  Business,
  Description,
  People,
  AttachMoney,
  Edit,
  TrendingUp,
  Upload,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import startupService from '../services/startupService';
import authService from '../services/authService';
import PitchDeckManager from '../components/PitchDeckManager';
import InvestmentOfferManager from '../components/InvestmentOfferManager';

// Move styled components outside the component
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: 'white',
}));

const StartupDashboard = () => {
  const [startupProfile, setStartupProfile] = useState(null);
  const [pitchDecks, setPitchDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    startupName: '',
    description: '',
    industry: '',
    fundingStage: '',
    teamSize: '',
    website: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStartupData();
  }, []);

  const fetchStartupData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const user = authService.getCurrentUser();
      if (!user || !user.token) {
        setError('You must be logged in to view this page');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const profile = await startupService.getStartupProfile();
      setStartupProfile(profile);
      setEditProfileData({
        startupName: profile.startupName || '',
        description: profile.description || '',
        industry: profile.industry || '',
        fundingStage: profile.fundingStage || '',
        teamSize: profile.teamSize || '',
        website: profile.website || ''
      });
      
      const decks = await startupService.getPitchDecks();
      setPitchDecks(decks);
    } catch (err) {
      console.error('Error fetching startup data:', err);
      setError(err.message || 'Failed to fetch startup data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleEditProfileClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditProfileSave = async () => {
    try {
      setLoading(true);
      const updatedProfile = await startupService.updateStartupProfile(editProfileData);
      setStartupProfile(updatedProfile);
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePitchDeckUpdate = async (updatedDeck) => {
    try {
      setLoading(true);
      // Check if this is a new deck or an update
      const existingDeckIndex = pitchDecks.findIndex(deck => deck.id === updatedDeck.id);
      let updatedDecks;
      
      if (existingDeckIndex === -1) {
        // New deck
        updatedDecks = [...pitchDecks, updatedDeck];
      } else {
        // Update existing deck
        updatedDecks = pitchDecks.map(deck => 
          deck.id === updatedDeck.id ? updatedDeck : deck
        );
      }
      
      setPitchDecks(updatedDecks);
    } catch (err) {
      console.error('Error updating pitch deck:', err);
      setError(err.message || 'Failed to update pitch deck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome, {startupProfile?.startupName || 'Startup'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your startup profile and pitch decks
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <IconWrapper>
                <Business fontSize="large" />
              </IconWrapper>
              <Typography variant="h6" gutterBottom>
                Industry
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {startupProfile?.industry || 'Not specified'}
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <IconWrapper>
                <Description fontSize="large" />
              </IconWrapper>
              <Typography variant="h6" gutterBottom>
                Pitch Decks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {pitchDecks?.length || 0} uploaded
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <IconWrapper>
                <People fontSize="large" />
              </IconWrapper>
              <Typography variant="h6" gutterBottom>
                Team Size
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {startupProfile?.teamSize || 'Not specified'}
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <StyledCardContent>
              <IconWrapper>
                <AttachMoney fontSize="large" />
              </IconWrapper>
              <Typography variant="h6" gutterBottom>
                Funding Stage
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {startupProfile?.fundingStage || 'Not specified'}
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Startup Profile
          </Typography>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEditProfile}
            sx={{ textTransform: 'none' }}
          >
            Edit Profile
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {startupProfile?.description || 'No description provided'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Website
            </Typography>
            <Typography variant="body1" paragraph>
              {startupProfile?.website ? (
                <Link href={startupProfile.website} target="_blank" rel="noopener noreferrer">
                  {startupProfile.website}
                </Link>
              ) : (
                'No website provided'
              )}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <PitchDeckManager 
        startupId={startupProfile?.id} 
        onUpdate={(updatedDecks) => {
            if (Array.isArray(updatedDecks)) {
                setPitchDecks(updatedDecks);
            } else {
                setPitchDecks(prevDecks => {
                    const existingIndex = prevDecks.findIndex(d => d.id === updatedDecks.id);
                    if (existingIndex >= 0) {
                        const newDecks = [...prevDecks];
                        newDecks[existingIndex] = updatedDecks;
                        return newDecks;
                    }
                    return [...prevDecks, updatedDecks];
                });
            }
        }}
      />

      <Grid item xs={12}>
        <InvestmentOfferManager startupId={startupProfile?.id} />
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditProfileClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Startup Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Startup Name"
                value={editProfileData.startupName}
                onChange={(e) => setEditProfileData({ ...editProfileData, startupName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={editProfileData.description}
                onChange={(e) => setEditProfileData({ ...editProfileData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Industry"
                value={editProfileData.industry}
                onChange={(e) => setEditProfileData({ ...editProfileData, industry: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Funding Stage"
                value={editProfileData.fundingStage}
                onChange={(e) => setEditProfileData({ ...editProfileData, fundingStage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Team Size"
                value={editProfileData.teamSize}
                onChange={(e) => setEditProfileData({ ...editProfileData, teamSize: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={editProfileData.website}
                onChange={(e) => setEditProfileData({ ...editProfileData, website: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditProfileClose}>Cancel</Button>
          <Button onClick={handleEditProfileSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StartupDashboard;

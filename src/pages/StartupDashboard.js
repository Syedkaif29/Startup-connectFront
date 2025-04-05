import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Notifications,
  Assignment,
  Campaign,
  Upload,
  Description,
} from '@mui/icons-material';
import startupService from '../services/startupService';
import authService from '../services/authService';

const StartupDashboard = () => {
  const [startupProfile, setStartupProfile] = useState(null);
  const [pitchDecks, setPitchDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null
  });

  useEffect(() => {
    fetchStartupData();
  }, []);

  const fetchStartupData = async () => {
    try {
      setLoading(true);
      const [profile, decks] = await Promise.all([
        startupService.getStartupProfile(),
        startupService.getPitchDecks()
      ]);
      setStartupProfile(profile);
      setPitchDecks(decks);
    } catch (err) {
      setError(err.message || 'Failed to fetch startup data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setUploadData({
      ...uploadData,
      file: event.target.files[0]
    });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      await startupService.uploadPitchDeck(
        uploadData.file,
        uploadData.title,
        uploadData.description
      );
      setOpenUploadDialog(false);
      fetchStartupData();
    } catch (err) {
      setError(err.message || 'Failed to upload pitch deck');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Welcome Header */}
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {startupProfile?.startupName || 'Startup'}
            </Typography>
          </Grid>

          {/* Quick Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Industry
                    </Typography>
                    <Typography variant="h5">{startupProfile?.industry || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Funding Stage
                    </Typography>
                    <Typography variant="h5">{startupProfile?.fundingStage || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pitch Decks
                    </Typography>
                    <Typography variant="h5">{pitchDecks.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pitch Decks Section */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Pitch Decks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={() => setOpenUploadDialog(true)}
                >
                  Upload New Deck
                </Button>
              </Box>
              <List>
                {pitchDecks.map((deck) => (
                  <ListItem key={deck.id}>
                    <ListItemIcon>
                      <Description color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={deck.title}
                      secondary={`Version ${deck.version} - ${new Date(deck.createdAt).toLocaleDateString()}`}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      href={deck.fileUrl}
                      target="_blank"
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Upload Pitch Deck</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".pdf,.ppt,.pptx"
                onChange={handleFileChange}
              />
            </Button>
            {uploadData.file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {uploadData.file.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!uploadData.file || !uploadData.title}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StartupDashboard;

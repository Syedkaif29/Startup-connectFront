import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MonetizationOn,
  Business,
  TrendingUp,
  AccountBalance,
  Assessment,
  Timeline,
  Group,
} from '@mui/icons-material';
import investorService from '../services/investorService';

const InvestorDashboard = () => {
  const [investorProfile, setInvestorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvestorData();
  }, []);

  const fetchInvestorData = async () => {
    try {
      setLoading(true);
      const profile = await investorService.getInvestorProfile();
      setInvestorProfile(profile);
    } catch (err) {
      setError(err.message || 'Failed to fetch investor data');
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
              Welcome, {investorProfile?.investorName || 'Investor'}
            </Typography>
          </Grid>

          {/* Portfolio Overview Cards */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MonetizationOn sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Investment Focus
                    </Typography>
                    <Typography variant="h5">{investorProfile?.investmentFocus || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Minimum Investment
                    </Typography>
                    <Typography variant="h5">${investorProfile?.minimumInvestment || 'N/A'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Portfolio Size
                    </Typography>
                    <Typography variant="h5">$2.5M</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Investment Description */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                About Your Investment Strategy
              </Typography>
              <Typography variant="body1" paragraph>
                {investorProfile?.description || 'No description available.'}
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {[
                  { title: 'View Portfolio', icon: <AccountBalance /> },
                  { title: 'Performance Reports', icon: <Assessment /> },
                  { title: 'Deal Pipeline', icon: <Timeline /> },
                  { title: 'Network', icon: <Group /> },
                ].map((action, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Card 
                      sx={{ 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <CardContent>
                        {action.icon}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {action.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorDashboard;

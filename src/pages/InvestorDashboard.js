import React, { useState, useEffect, useCallback } from 'react';
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
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  MonetizationOn,
  Business,
  TrendingUp,
  AccountBalance,
  Assessment,
  Timeline,
  Group,
  PieChart,
  Notifications,
  Description,
  CalendarToday,
  Email,
  Edit,
} from '@mui/icons-material';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import investorService from '../services/investorService';
import { useNavigate } from 'react-router-dom';
import EditProfileDialog from '../components/investor/EditProfileDialog';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InvestorDashboard = () => {
  const [investorProfile, setInvestorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectorData, setSectorData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchInvestorData = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await investorService.getInvestorProfile();
      setInvestorProfile(profile);
    } catch (err) {
      setError(err.message || 'Failed to fetch investor data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestorData();
    // Mock data for demonstration - replace with actual API calls
    setSectorData([
      { name: 'Healthcare', value: 35 },
      { name: 'Fintech', value: 25 },
      { name: 'Edtech', value: 20 },
      { name: 'AI/ML', value: 15 },
      { name: 'E-commerce', value: 5 },
    ]);
    setRecentActivities([
      { type: 'meeting', title: 'Meeting with HealthX', date: '2024-04-15', status: 'upcoming' },
      { type: 'investment', title: 'Investment in EduPro', date: '2024-04-14', status: 'completed' },
      { type: 'document', title: 'Term Sheet Review', date: '2024-04-13', status: 'pending' },
      { type: 'communication', title: 'Follow-up with FinQuick', date: '2024-04-12', status: 'completed' },
    ]);
  }, [fetchInvestorData]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <CalendarToday />;
      case 'investment':
        return <MonetizationOn />;
      case 'document':
        return <Description />;
      case 'communication':
        return <Email />;
      default:
        return <Notifications />;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'upcoming':
        return <Chip label="Upcoming" color="info" size="small" />;
      default:
        return null;
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'View Portfolio':
        navigate('/portfolio');
        break;
      case 'Performance Reports':
        // Handle performance reports
        break;
      case 'Deal Pipeline':
        // Handle deal pipeline
        break;
      case 'Network':
        // Handle network
        break;
      default:
        break;
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
          {/* Welcome Header with Company Details */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <IconButton 
                  onClick={() => setEditDialogOpen(true)}
                  color="primary"
                  aria-label="edit profile"
                >
                  <Edit />
                </IconButton>
              </Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome, {investorProfile?.investorName || 'Investor'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Company: {investorProfile?.companyName || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Sector: {investorProfile?.investmentFocus || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Investment Range: ${investorProfile?.minimumInvestment || 'N/A'} - ${investorProfile?.maximumInvestment || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Location: {investorProfile?.location || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
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

          {/* Sector Distribution Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PieChart sx={{ fontSize: 30, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Sector Distribution</Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity Card */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notifications sx={{ fontSize: 30, color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Recent Activity</Typography>
                </Box>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getActivityIcon(activity.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.title}
                          secondary={new Date(activity.date).toLocaleDateString()}
                        />
                        <Box sx={{ ml: 2 }}>
                          {getStatusChip(activity.status)}
                        </Box>
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button variant="outlined" color="primary">
                    View All Activities
                  </Button>
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
                      onClick={() => handleQuickAction(action.title)}
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

        {/* Edit Profile Dialog */}
        <EditProfileDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onUpdate={(updatedProfile) => {
            setInvestorProfile(updatedProfile);
            setEditDialogOpen(false);
          }}
          initialData={investorProfile}
        />
      </Container>
    </Box>
  );
};

export default InvestorDashboard;

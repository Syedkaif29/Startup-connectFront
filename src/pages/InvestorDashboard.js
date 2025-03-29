import React from 'react';
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
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Assessment,
  Notifications,
  Business,
  MonetizationOn,
  Timeline,
  Group,
} from '@mui/icons-material';

const InvestorDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Welcome Header */}
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Investor Dashboard
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
                      Total Investment
                    </Typography>
                    <Typography variant="h5">$2.5M</Typography>
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
                      Active Startups
                    </Typography>
                    <Typography variant="h5">12</Typography>
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
                      Portfolio Growth
                    </Typography>
                    <Typography variant="h5">+18.5%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Investment Opportunities */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Investment Opportunities
              </Typography>
              <List>
                {[
                  { 
                    icon: <Business color="primary" />, 
                    text: 'TechStart AI', 
                    secondary: 'AI/ML Platform - Seeking $500K Seed Round' 
                  },
                  { 
                    icon: <Timeline color="secondary" />, 
                    text: 'GreenEnergy Solutions', 
                    secondary: 'Clean Energy Tech - Pre-Series A' 
                  },
                  { 
                    icon: <Group color="warning" />, 
                    text: 'HealthTech Innovations', 
                    secondary: 'Healthcare Platform - Series A' 
                  },
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} secondary={item.secondary} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Portfolio Performance */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance
              </Typography>
              <Grid container spacing={2}>
                {[
                  { title: 'View Portfolio', icon: <AccountBalance /> },
                  { title: 'Performance Reports', icon: <Assessment /> },
                  { title: 'Deal Pipeline', icon: <Timeline /> },
                  { title: 'Network', icon: <Group /> },
                ].map((action, index) => (
                  <Grid item xs={6} key={index}>
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

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
  People,
  AttachMoney,
  Notifications,
  Assignment,
  Campaign,
} from '@mui/icons-material';

const StartupDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Welcome Header */}
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Your Startup Dashboard
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
                      Monthly Growth
                    </Typography>
                    <Typography variant="h5">25%</Typography>
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
                      Total Users
                    </Typography>
                    <Typography variant="h5">1,234</Typography>
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
                      Revenue
                    </Typography>
                    <Typography variant="h5">$15,350</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {[
                  { icon: <Notifications color="primary" />, text: 'New user registration', secondary: '2 minutes ago' },
                  { icon: <Assignment color="secondary" />, text: 'Task completed', secondary: '1 hour ago' },
                  { icon: <Campaign color="warning" />, text: 'New campaign started', secondary: '3 hours ago' },
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} secondary={item.secondary} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {[
                  { title: 'Create Campaign', icon: <Campaign /> },
                  { title: 'Add User', icon: <People /> },
                  { title: 'View Reports', icon: <Assignment /> },
                  { title: 'Revenue Stats', icon: <AttachMoney /> },
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

export default StartupDashboard;

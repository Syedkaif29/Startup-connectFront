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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Business,
  AccountBalance,
  People,
  TrendingUp,
  Security,
  Assessment,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

const AdminDashboard = () => {
  // Sample data - replace with actual data from your backend
  const recentTransactions = [
    { id: 1, startup: 'TechStart AI', investor: 'VC Fund A', amount: '$500K', status: 'Completed', date: '2024-03-15' },
    { id: 2, startup: 'GreenEnergy', investor: 'Angel Group B', amount: '$250K', status: 'Pending', date: '2024-03-14' },
    { id: 3, startup: 'HealthTech', investor: 'VC Fund C', amount: '$1M', status: 'Completed', date: '2024-03-13' },
  ];

  const platformStats = [
    { title: 'Total Startups', value: '45', icon: <Business />, color: 'primary.main' },
    { title: 'Active Investors', value: '28', icon: <AccountBalance />, color: 'success.main' },
    { title: 'Total Users', value: '1,234', icon: <People />, color: 'info.main' },
    { title: 'Total Investments', value: '$15.2M', icon: <TrendingUp />, color: 'warning.main' },
  ];

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Welcome Header */}
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
          </Grid>

          {/* Platform Statistics */}
          {platformStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 40, color: stat.color, mr: 2 } })}
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5">{stat.value}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Recent Transactions Table */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Startup</TableCell>
                      <TableCell>Investor</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.startup}</TableCell>
                        <TableCell>{transaction.investor}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          {transaction.status === 'Completed' ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Warning color="warning" />
                          )}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                {[
                  { icon: <Security />, text: 'Verify New Users', secondary: '5 pending verifications' },
                  { icon: <Assessment />, text: 'Review Transactions', secondary: '3 transactions need review' },
                  { icon: <Warning />, text: 'Handle Reports', secondary: '2 new reports' },
                ].map((action, index) => (
                  <ListItem key={index} button>
                    <ListItemIcon>{action.icon}</ListItemIcon>
                    <ListItemText primary={action.text} secondary={action.secondary} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* System Status */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <List>
                {[
                  { icon: <CheckCircle color="success" />, text: 'API Status', secondary: 'All systems operational' },
                  { icon: <CheckCircle color="success" />, text: 'Database', secondary: 'Connected and stable' },
                  { icon: <CheckCircle color="success" />, text: 'Payment Gateway', secondary: 'Processing normally' },
                ].map((status, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>{status.icon}</ListItemIcon>
                    <ListItemText primary={status.text} secondary={status.secondary} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

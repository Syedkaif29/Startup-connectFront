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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Badge,
  Fab,
  Tooltip,
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
  Add as AddIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import investorService from '../services/investorService';
import notificationService from '../services/notificationService';
import { useNavigate } from 'react-router-dom';
import EditProfileDialog from '../components/investor/EditProfileDialog';
import MessageDialog from '../components/common/MessageDialog';
import authService from '../services/authService';
import messageService from '../services/messageService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const InvestorDashboard = () => {
  const navigate = useNavigate();

  // New Conversation dialog state
  const [newConversationDialogOpen, setNewConversationDialogOpen] = useState(false);
  const [newReceiverEmail, setNewReceiverEmail] = useState("");
  const [newReceiverError, setNewReceiverError] = useState("");
  const [newReceiverLookupLoading, setNewReceiverLookupLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const lastUnreadIdsRef = React.useRef([]);

  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [receiverName, setReceiverName] = useState(''); // Always set by API, never by user input
  // const [receiverError, setReceiverError] = useState('');
  // const [receiverLookupLoading, setReceiverLookupLoading] = useState(false);
  const [conversationUsers, setConversationUsers] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const currentUser = authService.getCurrentUser();
  const senderId = currentUser?.user?.id || currentUser?.id || '';
  const [investorProfile, setInvestorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectorData, setSectorData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
    setSectorData([
      { name: 'Healthcare', value: 35 },
      { name: 'Fintech', value: 25 },
      { name: 'Edtech', value: 20 },
      { name: 'AI/ML', value: 15 },
      { name: 'E-commerce', value: 5 },
    ]);
    const fetchNotifications = async () => {
      try {
        const notifications = await notificationService.getNotifications(senderId);
        setRecentActivities(notifications);
        // Unread logic
        const unread = notifications.filter(n => n.unread || n.status === 'unread');
        setUnreadCount(unread.length);
        // Remove snackbar logic from here
        const currentUnreadIds = unread.map(n => n.id);
        lastUnreadIdsRef.current = currentUnreadIds;
      } catch (err) {
        setRecentActivities([]);
        setUnreadCount(0);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchInvestorData, senderId]);

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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/my-investments')}>
            View My Investments
          </Button>
        </Box>
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome, {investorProfile?.investorName || 'Investor'}
                </Typography>
              </Box>
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
                  {console.log('Recent Activities:', recentActivities)}
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      {(activity.type === 'communication' && (activity.userId || activity.senderId || activity.receiverId)) ? (
                        <ListItem
                          button
                          sx={{ cursor: 'pointer', bgcolor: 'rgba(255, 23, 68, 0.08)', '&:hover': { bgcolor: 'rgba(255, 23, 68, 0.15)' } }}
                          onClick={async () => {
                            const targetUserId = activity.userId || activity.senderId || activity.receiverId;
                            if (!targetUserId) {
                              alert('No user information found for this notification.');
                              return;
                            }
                            setReceiverId(targetUserId);
                            setReceiverName('');
                            try {
                              const userObj = await require('../services/userService').default.getUserById(targetUserId);
                              setReceiverName(userObj.fullName || userObj.email);
                            } catch {
                              setReceiverName('User');
                            }
                            setMessageDialogOpen(true);
                            // Find all unread notifications for this conversation/user
                            const unreadIds = recentActivities
                              .filter(a =>
                                (a.userId === targetUserId || a.senderId === targetUserId || a.receiverId === targetUserId) &&
                                (a.unread || a.status === 'unread')
                              )
                              .map(a => a.id);
                            if (unreadIds.length > 0) {
                              try {
                                const { markNotificationsAsRead } = require('../services/notificationService');
                                await markNotificationsAsRead(unreadIds);
                                setRecentActivities(prev =>
                                  prev.map(a => unreadIds.includes(a.id) ? { ...a, status: 'read', unread: false } : a)
                                );
                                setUnreadCount(prev => Math.max(0, prev - unreadIds.length));
                              } catch (e) {}
                            }
                          }}
                        >
                          <ListItemIcon>
                            {getActivityIcon(activity.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={(() => {
                              if (activity.senderName) return activity.senderName;
                              if (activity.senderEmail) return activity.senderEmail;
                              if (activity.sender) return activity.sender;
                              return 'New Message Received';
                            })()}
                            secondary={new Date(activity.date).toLocaleDateString()}
                          />
                          <Box sx={{ ml: 2 }}>
                            {getStatusChip(activity.status)}
                          </Box>
                        </ListItem>
                      ) : (
                        <ListItem disabled sx={{ cursor: 'default' }}>
                          <ListItemIcon>
                            {getActivityIcon(activity.type)}
                            {activity.unread && (
                              <Box
                                sx={{
                                  display: 'inline-block',
                                  width: 10,
                                  height: 10,
                                  backgroundColor: '#ff1744',
                                  borderRadius: '50%',
                                  marginLeft: 8
                                }}
                                title="Unread"
                              />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.title}
                            secondary={new Date(activity.date).toLocaleDateString()}
                          />
                          <Box sx={{ ml: 2 }}>
                            {getStatusChip(activity.status)}
                          </Box>
                        </ListItem>
                      )}
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
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

      {/* Floating Action Button for Messages */}
      <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1300 }}>
        {/* New Conversation FAB */}
        <Box sx={{ mb: 2 }}>
          <Fab color="secondary" aria-label="start new conversation" onClick={() => setNewConversationDialogOpen(true)} title="Start New Conversation">
            <AddIcon />
          </Fab>
        </Box>
        {/* Messages FAB */}
        <Badge color="secondary" badgeContent={unreadCount} invisible={unreadCount === 0}>
          <Fab color="primary" aria-label="messages" onClick={async () => {
            setConversationLoading(true);
            try {
              const users = await messageService.getConversationUsers(senderId);
              setConversationUsers(users);
              setStartDialogOpen(true);
            } catch (err) {
              setConversationUsers([]);
              // Optionally show error
            } finally {
              setConversationLoading(false);
            }
          }}>
            <MailIcon />
          </Fab>
        </Badge>
      </Box>

    {/* Message Dialog for Investor */}
    <MessageDialog
      open={messageDialogOpen}
      onClose={() => setMessageDialogOpen(false)}
      senderId={senderId}
      receiverId={receiverId}
      receiverName={receiverName}
    />

    {/* Start New Conversation Dialog */}
    <Dialog open={newConversationDialogOpen} onClose={() => {
      setNewConversationDialogOpen(false);
      setNewReceiverEmail("");
      setNewReceiverError("");
    }} maxWidth="xs" fullWidth>
      <DialogTitle>Start New Conversation:</DialogTitle>
      <DialogContent>
        <TextField
          label="Receiver Email"
          fullWidth
          margin="normal"
          value={newReceiverEmail}
          onChange={e => {
            setNewReceiverEmail(e.target.value);
            setNewReceiverError("");
          }}
          error={!!newReceiverError}
          helperText={newReceiverError || "Enter the receiver's email. The name will be fetched automatically."}
          disabled={newReceiverLookupLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setNewConversationDialogOpen(false);
          setNewReceiverEmail("");
          setNewReceiverError("");
        }} disabled={newReceiverLookupLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            setNewReceiverLookupLoading(true);
            setNewReceiverError("");
            try {
              const userObj = await require('../services/userService').default.getUserByEmail(newReceiverEmail);
              if (!userObj || !userObj.id) {
                setNewReceiverError(`User not found: User not found with email: ${newReceiverEmail}`);
                setNewReceiverLookupLoading(false);
                return;
              }
              setReceiverId(userObj.id);
              setReceiverName(userObj.fullName || userObj.email);
              setNewConversationDialogOpen(false);
              setNewReceiverEmail("");
              setNewReceiverError("");
              setMessageDialogOpen(true);
            } catch {
              setNewReceiverError(`User not found: User not found with email: ${newReceiverEmail}`);
            } finally {
              setNewReceiverLookupLoading(false);
            }
          }}
          disabled={!newReceiverEmail || newReceiverLookupLoading}
        >
          Chat
        </Button>
      </DialogActions>
    </Dialog>

    {/* Start Conversation Dialog and Conversation List */}
    <Dialog open={startDialogOpen} onClose={() => setStartDialogOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle>Messages</DialogTitle>
      <DialogContent>
        {conversationLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {conversationUsers.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">Recent Conversations:</Typography>
                <List>
                  {conversationUsers.map(user => (
                    <ListItem button key={user.id} onClick={async () => {
                      setReceiverId(user.id);
                      try {
                        const userObj = await require('../services/userService').default.getUserByEmail(user.email);
                        setReceiverName(userObj.fullName || userObj.email);
                        setStartDialogOpen(false);
                        setMessageDialogOpen(true);
                      } catch {
                        setReceiverName(user.email); // fallback
                        setStartDialogOpen(false);
                        setMessageDialogOpen(true);
                      }
                    }}>
                      <ListItemText
                        primary={user.fullName || user.email}
                        secondary={user.email}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStartDialogOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default InvestorDashboard;

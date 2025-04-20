import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box
} from '@mui/material';
import authService from '../../services/authService';

const API_BASE = process.env.REACT_APP_API_URL || '';

// Props: open, onClose, senderId, receiverId, receiverName
const MessageDialog = ({ open, onClose, senderId, receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);


  // Fetch messages between sender and receiver
  const fetchMessages = React.useCallback(async () => {
    if (!receiverId) return;
    setLoading(true);
    try {
      const token = authService.getToken();
      const res = await fetch(`${API_BASE}/messages/conversation?user1=${senderId}&user2=${receiverId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        const errorText = await res.text();
        console.error('Failed to fetch messages:', errorText);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [senderId, receiverId]);

  useEffect(() => {
    let interval;
    if (open && receiverId) {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, receiverId, fetchMessages]);

  // Reset newMessage only when dialog closes
  useEffect(() => {
    if (!open) setNewMessage('');
  }, [open]);

  const handleSend = async () => {
    if (!newMessage.trim() || !receiverId) return;
    setSending(true);
    try {
      const token = authService.getToken();
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderId,
          receiverId,
          content: newMessage,
        }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chat with {receiverName || 'User'}</DialogTitle>
      <DialogContent dividers sx={{ minHeight: 300 }}>
        {loading && messages.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {messages.length === 0 && <ListItem><ListItemText primary="No messages yet." /></ListItem>}
            {messages.map((msg) => (
              <ListItem key={msg.id} alignItems={msg.senderId === senderId ? 'right' : 'left'}>
                <ListItemText
                  primary={msg.content}
                  secondary={msg.senderId === senderId ? 'You' : receiverName || 'User'}
                  sx={{ textAlign: msg.senderId === senderId ? 'right' : 'left' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={sending}
          size="small"
        />
        <Button onClick={handleSend} variant="contained" disabled={sending || !newMessage.trim()}>
          Send
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default MessageDialog;

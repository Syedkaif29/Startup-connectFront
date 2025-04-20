import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, Button, Popover, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HandshakeIcon from '@mui/icons-material/Handshake';

const InvestmentOfferList = ({ offers, isInvestor, onAccept, onNegotiate }) => {
  console.log('InvestmentOfferList isInvestor:', isInvestor);
  // Popover state at component level
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverOfferId, setPopoverOfferId] = useState(null);

  const handlePopoverOpen = (event, offerId) => {
    setPopoverAnchor(event.currentTarget);
    setPopoverOfferId(offerId);
  };
  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverOfferId(null);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {offers && offers.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            No investment offers available.
          </Typography>
        )}
        {offers && offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.04)',
                  boxShadow: 8,
                  border: '2px solid #1976d2',
                },
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => handlePopoverOpen(e, offer.id)}
              onMouseLeave={handlePopoverClose}
              aria-owns={popoverAnchor && popoverOfferId === offer.id ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ${offer.amount?.toLocaleString()}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {offer.equityPercentage}% Equity
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {offer.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Terms: {offer.terms}
                </Typography>
                <Chip label={offer.status || 'ACTIVE'} color="success" size="small" sx={{ mt: 1 }} />
                {isInvestor && offer.status !== 'CLOSED' && (
  <Box mt={2} display="flex" gap={1}>
    <Button
      variant="contained"
      color="success"
      startIcon={<CheckCircleIcon />}
      sx={{ fontWeight: 600, fontSize: '1rem', borderRadius: 2, boxShadow: 2, textTransform: 'none' }}
      onClick={() => onAccept && onAccept(offer)}
    >
      Accept
    </Button>
    <Button
      variant="contained"
      color="warning"
      startIcon={<HandshakeIcon />}
      sx={{ fontWeight: 600, fontSize: '1rem', borderRadius: 2, boxShadow: 2, textTransform: 'none', color: '#fff' }}
      onClick={() => onNegotiate && onNegotiate(offer)}
    >
      Negotiate
    </Button>
  </Box>
)}
{isInvestor && offer.status === 'CLOSED' && (
  <Box mt={2}>
    <Chip label="CLOSED" color="default" size="medium" sx={{ fontWeight: 600, fontSize: '1rem', borderRadius: 2 }} />
  </Box>
)}
                <Popover
                  id="mouse-over-popover"
                  sx={{ pointerEvents: 'none' }}
                  open={Boolean(popoverAnchor) && popoverOfferId === offer.id}
                  anchorEl={popoverAnchor}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                  TransitionComponent={Fade}
                  transitionDuration={200}
                >
                  <Box sx={{ p: 2, maxWidth: 260 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Offer Details
                    </Typography>
                    <Typography variant="body2"><b>Amount:</b> ${offer.amount?.toLocaleString()}</Typography>
                    <Typography variant="body2"><b>Equity:</b> {offer.equityPercentage}%</Typography>
                    <Typography variant="body2"><b>Description:</b> {offer.description}</Typography>
                    <Typography variant="body2"><b>Terms:</b> {offer.terms}</Typography>
                    <Typography variant="body2"><b>Status:</b> {offer.status || 'ACTIVE'}</Typography>
                  </Box>
                </Popover>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InvestmentOfferList;

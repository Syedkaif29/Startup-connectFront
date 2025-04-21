import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Chip, Box, Tooltip } from '@mui/material';
import startupService from '../services/startupService';
import investorService from '../services/investorService';

const InvestmentsReceived = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map of investorId to investor name
  const [investorNames, setInvestorNames] = useState({});

  useEffect(() => {
    fetchInvestments();
  }, []);

  useEffect(() => {
    // Fetch missing investor names if needed
    const missingInvestorIds = investments
      .filter(inv => (!inv.investorName && !inv.investor?.name) && inv.investorId && !investorNames[inv.investorId])
      .map(inv => inv.investorId);
    const uniqueIds = Array.from(new Set(missingInvestorIds));
    if (uniqueIds.length > 0) {
      uniqueIds.forEach(async (id) => {
        try {
          const investor = await investorService.getInvestorById(id);
          setInvestorNames(prev => ({ ...prev, [id]: investor.name || investor.fullName || investor.companyName || '-' }));
        } catch {
          setInvestorNames(prev => ({ ...prev, [id]: '-' }));
        }
      });
    }
  }, [investments, investorNames]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const offers = await startupService.getMyInvestmentOffers();
      setInvestments(offers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Investments Received
      </Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Equity (%)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No investments received yet.</TableCell>
                  </TableRow>
                ) : (
                  investments.map((inv) => (
                    <TableRow key={inv.id} hover>
                      <TableCell>{
                        inv.investorCompanyName || inv.investorName || inv.investor?.name || investorNames[inv.investorId] || '-'
                      }</TableCell>
                      <TableCell>${inv.amount?.toLocaleString()}</TableCell>
                      <TableCell>{inv.equityPercentage ?? inv.equity ?? '-'}</TableCell>
                      <TableCell>
                        {(() => {
                          const dateVal = inv.createdAt || inv.updatedAt || inv.date;
                          return dateVal ? (
                            <Tooltip title={new Date(dateVal).toLocaleString()} placement="top">
                              <span>{new Date(dateVal).toLocaleDateString()}</span>
                            </Tooltip>
                          ) : '-';
                        })()}
                      </TableCell>
                      <TableCell>
                        <Chip label={inv.status || 'ACTIVE'} color={inv.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default InvestmentsReceived;

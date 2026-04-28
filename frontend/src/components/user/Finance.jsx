import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Finance() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const userId = localStorage.getItem('userid');

    // Add new state for payment statistics
    const [paymentStats, setPaymentStats] = useState({
        paid: 0,
        pending: 0
    });

    useEffect(() => {       
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${apiUrl}order/user/${userId}`);
                const data = await response.json();
                console.log('Fetched orders:', data);
                setOrders(data.orders || []);
                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);   

    // Updated payment statistics calculation
    useEffect(() => {
        if (orders.length > 0) {
            const stats = orders.reduce((acc, order) => {
                // Check payment status directly from the payment field
                const paymentStatus = order.payment?.toLowerCase() || 'pending';
                acc[paymentStatus] = (acc[paymentStatus] || 0) + 1;
                return acc;
            }, { paid: 0, pending: 0 });
            setPaymentStats(stats);
        }
    }, [orders]);

    const COLORS = ['#4CAF50', '#FFC107']; // Green for paid, Yellow for pending

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Typography variant="h5">Loading...</Typography>
        </Box>
    );

    if (error) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Typography variant="h5" color="error">Error loading data</Typography>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Financial Overview
            </Typography>

            <Grid container spacing={3}>
                {/* Payment Status Chart */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Payment Status Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Paid', value: paymentStats.paid },
                                        { name: 'Pending', value: paymentStats.pending }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[0, 1].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Updated Orders Summary with Table */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '400px', overflow: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Orders Summary
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Total Orders: {orders.length}
                            </Typography>
                            
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order._id}>
                                                <TableCell>
                                                    {order._id.substring(0, 8)}...
                                                </TableCell>
                                                <TableCell>
                                                    ${order.price}
                                                </TableCell>
                                                <TableCell>
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            color: order.payment?.toLowerCase() === 'paid' ? '#4CAF50' : '#FFC107',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {order.payment || 'Pending'}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Additional Statistics Card */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Payment Statistics
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h4">{orders.length}</Typography>
                                    <Typography variant="body1">Total Orders</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, color: '#4CAF50' }}>
                                    <Typography variant="h4">{paymentStats.paid}</Typography>
                                    <Typography variant="body1">Paid Orders</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2, color: '#FFC107' }}>
                                    <Typography variant="h4">{paymentStats.pending}</Typography>
                                    <Typography variant="body1">Pending Orders</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

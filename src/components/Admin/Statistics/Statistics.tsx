import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Grid, Grid2 } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { RevenueData, Statistic } from '../../../models/Statistics';
import axiosClient from '../../../api/axioClient';

const Statistics: React.FC = () => {
    const [statistics, setStatistics] = useState<Statistic[]>([]);
    const [revenueOverview, setRevenueOverview] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        // Fetch all statistics data on component mount
        fetchStatistics().then(() => {
            fetchTotalRevenue();
        });
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axiosClient.get<Statistic[]>('/statistics');
            setStatistics(response.data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const fetchTotalRevenue = async (date?: string) => {
        try {
            const response = await axiosClient.get<{ totalRevenue: number }>('/statistics/overview', {
                params: { date },
            });
            setRevenueOverview(response.data.totalRevenue);
        } catch (error) {
            console.error('Failed to fetch total revenue:', error);
        }
    };

    const handleDateFilter = async () => {
        try {
            const response = await axiosClient.get<Statistic[]>('/statistics/date', {
                params: { startDate, endDate },
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Failed to fetch filtered statistics:', error);
        }
    };

    const revenueData: RevenueData[] = statistics.map((stat) => ({
        date: new Date(stat.date).toLocaleDateString(),
        totalRevenue: stat.revenue,
    }));

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Statistics Overview
            </Typography>

            <Grid2 container spacing={2} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="contained"
                        onClick={handleDateFilter}
                        fullWidth
                        sx={{ height: '100%', backgroundColor: '#008080' }}
                    >
                        Filter by Date
                    </Button>
                </Grid>
            </Grid2>

            <Typography variant="h5" gutterBottom>
                Total Revenue: ${revenueOverview}
            </Typography>

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Detailed Revenue by Date
                </Typography>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalRevenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>


                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default React.memo(Statistics);

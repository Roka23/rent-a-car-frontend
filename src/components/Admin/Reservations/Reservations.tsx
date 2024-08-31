import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import axiosClient from '../../../api/axioClient';
import styles from './Reservations.module.css'
import { AxiosError } from 'axios';

// Define types for the data
interface Reservation {
    _id: string;
    carId: { make: string; carModel: string };
    userId: { username: string };
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

const Reservations: React.FC = () => {
    const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
    const [ongoingReservations, setOngoingReservations] = useState<Reservation[]>([]);

    // Fetch pending reservations
    const fetchPendingReservations = async () => {
        try {
            const response = await axiosClient.get('/reservations');
            const pending = response.data.filter((reservation: Reservation) => reservation.status === 'pending');
            setPendingReservations(pending);
        } catch (error) {
            console.error("Failed to fetch reservations");
        }
    };

    // Fetch ongoing reservations
    const fetchOngoingReservations = async () => {
        try {
            const response = await axiosClient.get('/reservations');
            const onGoing = response.data.filter((reservation: Reservation) => reservation.status === 'confirmed' || reservation.status === 'pending');
            setOngoingReservations(onGoing);
        } catch (error) {
            console.error("Failed to fetch ongoing reservations");
        }
    };

    // Approve a reservation
    const approveReservation = async (id: string) => {
        try {
            await axiosClient.patch(`/reservations/${id}/approve`);
            toast.success("Reservation approved!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            fetchPendingReservations();
            fetchOngoingReservations();
        } catch (error) {
            const axiosError = error as AxiosError
            if (axiosError.response && axiosError.response.data) {
                const errorMessage = (axiosError.response.data as any).error
                toast.error(errorMessage, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
            console.error("Failed to approve reservation ", error);
        }
    };

    // Reject a reservation
    const rejectReservation = async (id: string) => {
        console.log("TOKEN ", localStorage.getItem('token'))
        try {
            await axiosClient.patch(`/reservations/${id}/reject`);
            toast.success("Reservation rejected!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            fetchPendingReservations();
            fetchOngoingReservations();
        } catch (error) {
            console.error("Failed to reject reservation");
        }
    };

    useEffect(() => {
        fetchPendingReservations().then(() => {
            fetchOngoingReservations();
        });
    }, []);

    return (
        <div className={styles.container}>
            <h2>Pending Reservations</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Car</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingReservations.map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{`${reservation.carId.make} ${reservation.carId.carModel}`}</TableCell>
                                <TableCell>{reservation.userId.username}</TableCell>
                                <TableCell>{new Date(reservation.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(reservation.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button style={{ backgroundColor: '#008080' }} variant="contained" onClick={() => approveReservation(reservation._id)}>
                                        Approve
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => rejectReservation(reservation._id)} style={{ marginLeft: '8px' }}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <h2>Ongoing Reservations</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Car</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ongoingReservations.map((reservation) => (
                            <TableRow key={reservation._id}>
                                <TableCell>{`${reservation.carId.make} ${reservation.carId.carModel}`}</TableCell>
                                <TableCell>{reservation.userId.username}</TableCell>
                                <TableCell>{new Date(reservation.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(reservation.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>{reservation.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Reservations;

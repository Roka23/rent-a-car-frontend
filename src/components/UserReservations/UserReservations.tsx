import React, { useEffect, useState } from 'react';
import styles from './UserReservations.module.css';
import { useAuth } from '../../context/AuthContext';
import { Reservation } from '../../models/Reservation';
import axiosClient from '../../api/axioClient';

const UserReservations: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth()

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosClient.get('/reservations/myReservations/' + userId, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setReservations(response.data);
            } catch (err) {
                setError('Failed to fetch reservations');
            } finally {
                setLoading(false);
            }
        };

        if (userId !== '') {
            fetchReservations();
        }
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <h1>Your Reservations</h1>
            <div className={styles.reservationsList}>
                {reservations.length > 0 ? (
                    reservations.map(reservation => (
                        <div key={reservation._id} className={styles.reservationItem}>
                            <h2>Reservation for {reservation.carId.make} {reservation.carId.carModel}</h2>
                            <div className={styles.detailsContainer}>
                                <img src={`http://localhost:5000/uploads/${reservation.carId.imageUrl}`} alt={reservation.carId.carModel} className={styles.carImage} />
                                <div>
                                    <p>Status: <span className={styles[reservation.status]}>{reservation.status}</span></p>
                                    <p>Start Date: {new Date(reservation.startDate).toLocaleDateString()}</p>
                                    <p>End Date: {new Date(reservation.endDate).toLocaleDateString()}</p>
                                    <p>Total Cost: ${reservation.totalCost.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className={styles.detailsContainer}>
                                <div className={styles.carDetails}>
                                    <p><strong>Car Details:</strong></p>
                                    <ul>
                                        <li>Year: {reservation.carId.year}</li>
                                        <li>Fuel Type: {reservation.carId.fuelType}</li>
                                        <li>Transmission: {reservation.carId.transmission}</li>
                                        <li>Mileage: {reservation.carId.mileage}</li>
                                        <li>Vehicle Size: {reservation.carId.vehicleSize}</li>
                                    </ul>
                                </div>
                                <div className={styles.userDetails}>
                                    <p><strong>User Details:</strong></p>
                                    <ul>
                                        <li>Username: {reservation.userId.username}</li>
                                        <li>Email: {reservation.userId.email}</li>
                                        <li>Name: {reservation.userId.profile.firstName} {reservation.userId.profile.lastName}</li>
                                        <li>Phone: {reservation.userId.profile.phone}</li>
                                        <li>Address: {reservation.userId.profile.address}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have no reservations.</p>
                )}
            </div>
        </div>
    );
};

export default UserReservations;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SingleCar.module.css';
import { Car } from '../../models/Car';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCar, faDollarSign, faGasPump, faCogs, faTachometerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import CarCard from '../Cars/CarCard/CarCard';
import ReservationModal from '../ReservationModal/ReservationModal';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axioClient';
import { toast } from 'react-toastify';

const SingleCar = () => {
    const { carId } = useParams<{ carId: string }>();
    const [car, setCar] = useState<Car | null>(null);
    const [similarCars, setSimilarCars] = useState<Car[]>([]);
    const [editingCar, setEditingCar] = useState<Car | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [reviews, setReviews] = useState<{ rating: number; comment: string; userId: { username: string } }[]>([]);
    const [newReview, setNewReview] = useState<{ rating: number; comment: string }>({ rating: 0, comment: '' });

    useEffect(() => {
        axiosClient.get(`/reviews/car/${carId}`)
            .then(response => {
                console.log("RRESESE ", response.data)
                setReviews(response.data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, [carId]);

    const { userId } = useAuth()

    const handleReviewSubmit = async () => {
        try {
            await axiosClient.post('/reviews', {
                userId: userId,
                carId: carId,
                rating: newReview.rating,
                comment: newReview.comment
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            toast.success("Review submitted successfully!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            setNewReview({ rating: 0, comment: '' });
            // Fetch reviews again to update the list
            const response = await axiosClient.get(`/reviews/car/${carId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleStarClick = (rating: number) => {
        setNewReview((prevReview) => ({
            ...prevReview,
            rating,
        }));
    };

    const checkStatus = () => {
        switch (car!.status) {
            case 'available':
                return styles.available
            case 'maintenance':
                return styles.maintenance
            case 'rented':
            case 'reserved':
                return styles.rented
        }
    }

    const handleReserveClick = () => {
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleEditCar = (selectedCar: Car) => {
        setEditingCar(selectedCar)
    }

    const handleDeleteCar = async (carId: string) => {
        await fetch(`http://localhost:5000/api/cars/${carId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
    }

    const handleConfirmReservation = async (startDate: string, endDate: string, totalCost: number) => {
        try {
            await axiosClient.post('/reservations', {
                userId: userId,
                carId: carId,
                startDate: startDate,
                endDate: endDate,
                totalCost: totalCost
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            toast.success("Reservation request sent!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            setModalOpen(false);
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    useEffect(() => {
        axiosClient.get(`/cars/${carId}`)
            .then(response => {
                setCar(response.data);
            })
            .catch(error => {
                console.error('Error fetching car details:', error);
            });
    }, [carId]);

    useEffect(() => {
        if (car) {
            axiosClient.get(`/cars/similar/${car._id}`)
                .then(response => {
                    setSimilarCars(response.data);
                })
                .catch(error => {
                    console.error('Error fetching similar cars:', error);
                });
        }
    }, [car]);

    if (!car) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src={'http://localhost:5000/uploads/' + car.imageUrl} alt={car.carModel} className={styles.carImage} />
            </div>
            <div className={styles.detailsContainer}>
                <h1 className={styles.title}>{car.make} {car.carModel}</h1>
                <p className={styles.description}>{car.description}</p>
                <div className={styles.infoRow}>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faCalendarAlt} size='lg' className={styles.icon} />
                        <span className={styles.infoText}>Year: {car.year}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faDollarSign} size='lg' className={styles.icon} />
                        <span className={styles.infoText}>Daily Rate: ${car.dailyRate}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faCar} size='lg' className={styles.icon} />
                        <span className={styles.infoText}>Vehicle Size: {car.vehicleSize}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faGasPump} size='lg' className={styles.icon} />
                        <span className={styles.infoText}>Fuel Type: {car.fuelType}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faCogs} size='lg' className={styles.icon} />
                        <span className={styles.infoText}>Transmission: {car.transmission}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <FontAwesomeIcon icon={faTachometerAlt} size='lg' className={styles.icon} />
                        <span className={styles.infoText}>Mileage: {car.mileage} km</span>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.reserveButton} onClick={handleReserveClick}>Reserve Now</button>
                    <div className={`${styles.status} ${checkStatus()}`}></div>
                </div>
            </div>
            <div className={styles.reviewsContainer}>
                <h2>Reviews</h2>
                <div className={styles.reviewsList}>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className={styles.review}>
                                <div className={styles.reviewHeader}>
                                    <span className={styles.reviewUsername}>{review.userId.username}</span>
                                    <span className={styles.reviewRating}>
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </span>
                                </div>
                                <p className={styles.reviewComment}>{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
                <h3>Leave a Review</h3>
                <div className={styles.reviewForm}>
                    <div className={styles.starPicker}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                                className={star <= newReview.rating ? styles.activeStar : styles.inactiveStar}
                                onClick={() => handleStarClick(star)}
                            />
                        ))}
                    </div>
                    <label>Comment:</label>
                    <textarea
                        name="comment"
                        value={newReview.comment}
                        onChange={handleReviewChange}
                        className={styles.reviewTextarea}
                    />
                    <button onClick={handleReviewSubmit} className={styles.submitButton}>Submit Review</button>
                </div>
            </div>


            <div className={styles.similarCarsContainer}>
                <h2>Similar Cars</h2>
                <div className={styles.similarCarsGrid}>
                    {similarCars.map(similarCar => (
                        <CarCard key={similarCar._id} car={similarCar} editCar={handleEditCar} deleteCar={handleDeleteCar} />
                    ))}
                </div>
            </div>
            {modalOpen && (
                <ReservationModal
                    car={car}
                    onClose={handleModalClose}
                    onSubmit={handleConfirmReservation}
                />
            )}
        </div>
    );
};

export default React.memo(SingleCar);

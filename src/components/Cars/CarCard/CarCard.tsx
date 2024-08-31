import React, { useEffect, useState } from 'react'
import styles from './CarCard.module.css'
import { Car } from '../../../models/Car'
import { useAuth } from '../../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCar, faDollarSign, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import Modal from '../../Modal/Modal'

interface CarCardProps {
    car: Car;
    editCar: (selectedCar: Car) => void;
    deleteCar: (carId: string) => void;
}

const CarCard = (props: CarCardProps) => {
    const { isAdmin, isAuthenticated } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false)
    const navigate = useNavigate();

    const openSingleCar = () => {
        if (!isAuthenticated) {
            setIsModalOpen(true);
        } else {
            navigate(`/cars/${props.car._id}`);
        }
    };

    const deleteCar = async () => {
        setIsDelete(true)
    }

    useEffect(() => {
        if (isDelete) {
            setIsModalOpen(true)
        }
    }, [isDelete])

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDelete(false)
    };

    const checkStatus = () => {
        switch (props.car.status) {
            case 'available':
                return styles.available
            case 'maintenance':
                return styles.maintenance
            case 'rented':
            case 'reserved':
                return styles.rented
        }
    }

    return (
        <div className={styles.carCard}>
            <div className={`${styles.status} ${checkStatus()}`}></div>
            <img src={'http://localhost:5000/uploads/' + props.car.imageUrl} alt={props.car.carModel} className={styles.carImage} />
            <div className={styles.infoContainer}>
                <div>
                    <h3>{props.car.make} {props.car.carModel}</h3>
                    <p>Year: {props.car.year}</p>
                    <p>Daily Rate: ${props.car.dailyRate}</p>
                </div>
                <button className={styles.reserveButton} onClick={openSingleCar}>Reserve</button>
                {
                    isAdmin &&
                    <div className={styles.adminButtonContainer}>
                        <button className={`${styles.adminButton} ${styles.editButton}`} onClick={() => props.editCar(props.car)}>
                            <FontAwesomeIcon icon={faEdit} size='xl' color='#FFF' />
                        </button>
                        <button className={`${styles.adminButton} ${styles.deleteButton}`} onClick={deleteCar}>
                            <FontAwesomeIcon icon={faTrash} size='xl' color='#FFF' />
                        </button>
                    </div>
                }
            </div>
            {isModalOpen &&
                isDelete ? (
                <>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <div className={styles.modalContainer}>
                            <h2>Are you sure you want to delete this car?</h2>
                            <button className={styles.deleteButton2} onClick={() => {
                                props.deleteCar(props.car._id)
                                closeModal()
                            }
                            }>
                                Yes
                            </button>
                        </div>
                    </Modal>
                </>
            ) : (
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className={styles.modalContainer}>
                        <h2>Ready to reserve a car?</h2>
                        <button className={styles.reserveButton} onClick={() => navigate('/login')}>
                            Sign in
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default React.memo(CarCard)
import React, { useEffect, useState } from 'react';
import styles from './CarsOverview.module.css';
import Cars from '../../Cars/Cars';
import Modal from '../../Modal/Modal';
import axios from 'axios';
import CarForm from '../../CarForm/CarForm';
import { Car } from '../../../models/Car';

interface FormDataState {
    make: string;
    carModel: string;
    description: string;
    year: string;
    dailyRate: string;
    status: string;
    fuelType: string;
    transmission: string;
    mileage: string;
    vehicleSize: string;
    imageUrl: File | null;
}

const CarsOverview = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | undefined>(undefined)

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setEditingCar(undefined)
        setIsModalOpen(false);
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

        window.location.reload()
    }

    useEffect(() => {
        if (editingCar !== undefined) {
            handleOpenModal()
        }
    }, [editingCar])

    const handleSaveCar = async (carData: Car) => {
        try {
            if (carData._id) {
                // Update existing car
                await fetch(`http://localhost:5000/api/cars/${carData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(carData),
                });
            } else {
                const formData = new FormData();

                // Append form fields to formData
                formData.append('make', carData.make);
                formData.append('carModel', carData.carModel);
                formData.append('year', carData.year.toString());
                formData.append('dailyRate', carData.dailyRate.toString());
                formData.append('status', carData.status);
                formData.append('fuelType', carData.fuelType);
                formData.append('transmission', carData.transmission);
                formData.append('mileage', carData.mileage.toString());
                formData.append('vehicleSize', carData.vehicleSize);
                formData.append('description', carData.description);

                // Append the file only if it exists
                if (carData.imageUrl instanceof File) {
                    formData.append('imageUrl', carData.imageUrl);
                }
                // Create new car
                await fetch('http://localhost:5000/api/cars', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: formData,
                });
            }
            // Handle success (e.g., refresh the list of cars or close the modal)
            handleCloseModal()
        } catch (error) {
            // Handle error
            console.error("Error while creating/updating car! ", error)
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.headingWrapper}>
                <h1>Manage Cars</h1>
                <button className={styles.addButton} onClick={handleOpenModal}>Add Car</button>
            </div>

            <Cars key={'cars-' + isModalOpen} editCar={handleEditCar} deleteCar={handleDeleteCar} />

            <CarForm isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} onSave={handleSaveCar} car={editingCar} />
        </div>
    );
};

export default React.memo(CarsOverview);

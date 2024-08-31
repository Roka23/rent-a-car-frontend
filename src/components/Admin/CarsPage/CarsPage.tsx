import React, { useEffect, useState } from 'react';
import CarForm from '../../CarForm/CarForm'
import Cars from '../../Cars/Cars'
import { Car } from '../../../models/Car';

const CarsPage = () => {
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

        window.location.reload();
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

                handleCloseModal()
            }
        } catch (error) {
            // Handle error
            console.error("Error while creating/updating car! ", error)
        }
    };

    return (
        <>
            <Cars key={'cars-' + isModalOpen} editCar={handleEditCar} deleteCar={handleDeleteCar} />

            <CarForm isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} onSave={handleSaveCar} car={editingCar} />
        </>
    )
}

export default React.memo(CarsPage)
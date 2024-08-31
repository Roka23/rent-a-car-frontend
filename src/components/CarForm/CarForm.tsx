import React, { useState, useEffect } from 'react';
import styles from './CarForm.module.css';
import { Car } from '../../models/Car';
import Modal from '../Modal/Modal';

interface CarFormProps {
    isModalOpen: boolean;
    handleCloseModal: () => void;
    car?: Car; // Pass the existing car details if editing
    onSave: (carData: Car) => void;
}

const CarForm: React.FC<CarFormProps> = ({ isModalOpen, handleCloseModal, car, onSave }) => {
    const [formData, setFormData] = useState<Car>({
        _id: '',
        make: '',
        carModel: '',
        year: 0,
        dailyRate: 0,
        imageUrl: '',
        description: '',
        status: 'available',
        fuelType: 'petrol',
        transmission: 'manual',
        mileage: 0,
        vehicleSize: 'small',
    });

    useEffect(() => {
        if (car !== undefined) {
            setFormData(car);
        } else {
            setFormData({
                _id: '',
                make: '',
                carModel: '',
                year: 0,
                dailyRate: 0,
                imageUrl: '',
                description: '',
                status: 'available',
                fuelType: 'petrol',
                transmission: 'manual',
                mileage: 0,
                vehicleSize: 'small',
            })
        }
    }, [car]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            imageUrl: e.target.files ? e.target.files[0] : null,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <h2>{car ? 'Edit Car' : 'Add New Car'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Make</label>
                        <input
                            type="text"
                            name="make"
                            className={styles.input}
                            value={formData.make}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Model</label>
                        <input
                            type="text"
                            name="carModel"
                            className={styles.input}
                            value={formData.carModel}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Year</label>
                        <input
                            type="number"
                            name="year"
                            className={styles.input}
                            value={formData.year}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Daily Rate</label>
                        <input
                            type="number"
                            name="dailyRate"
                            className={styles.input}
                            value={formData.dailyRate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Status</label>
                        <select
                            name="status"
                            className={styles.input}
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="rented">Rented</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Fuel Type</label>
                        <select
                            name="fuelType"
                            className={styles.input}
                            value={formData.fuelType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="diesel">Diesel</option>
                            <option value="petrol">Petrol</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <label>Transmission</label>
                        <select
                            name="transmission"
                            className={styles.input}
                            value={formData.transmission}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Transmission</option>
                            <option value="automatic">Automatic</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Mileage</label>
                        <input
                            type="number"
                            name="mileage"
                            className={styles.input}
                            value={formData.mileage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Vehicle Size</label>
                    <select
                        name="vehicleSize"
                        className={styles.input}
                        value={formData.vehicleSize}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Vehicle Size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                        name="description"
                        className={styles.input}
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {!car && <div className={styles.inputGroup}>
                    <label>Image</label>
                    <input
                        type="file"
                        name="imageUrl"
                        className={styles.input}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>}
                <button type="submit" className={styles.submitButton}>{car ? 'Update Car' : 'Add Car'}</button>
            </form>
        </Modal>
    );
};

export default CarForm;

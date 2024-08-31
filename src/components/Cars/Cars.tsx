import React, { useState, useEffect } from 'react';
import styles from './Cars.module.css';
import CarCard from './CarCard/CarCard';
import { Car } from '../../models/Car';
import axiosClient from '../../api/axioClient';

interface CarsProps {
    editCar?: (selectedCar: Car) => void
    deleteCar: (carId: string) => void;
}

const Cars = (props: CarsProps) => {
    const [cars, setCars] = useState<Car[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [make, setMake] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [makes, setMakes] = useState<string[]>([])
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const fetchCarsByFilter = async () => {
        try {
            const response = await axiosClient.get('/cars/filter', {
                params: {
                    make,
                    priceMin,
                    priceMax,
                },
            });
            setCars(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllCars = async () => {
        axiosClient.get('/cars')
            .then(response => {
                setCars(response.data);
            })
            .catch(error => console.error('Error fetching cars:', error));
    }

    useEffect(() => {
        fetchCarsByFilter();
    }, [make, priceMin, priceMax]);

    useEffect(() => {
        // Fetch all car makes for the dropdown
        const fetchMakes = async () => {
            try {
                const response = await axiosClient.get('/cars/makes');

                setMakes(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMakes();
    }, []);

    useEffect(() => {
        // Fetch all cars
        fetchAllCars();
    }, []);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout); // Clear the previous timeout
        }

        // Set a new timeout
        const timeout = setTimeout(() => {
            // Filter cars based on search term
            if (searchTerm.trim().length > 0) {
                axiosClient.get('/cars/search?query=' + searchTerm)
                    .then(response => {
                        setCars(response.data);
                    })
                    .catch(error => console.error('Error fetching cars:', error));
            } else if (searchTerm.trim() === '') {
                axiosClient.get('/cars')
                    .then(response => {
                        setCars(response.data);
                    })
                    .catch(error => console.error('Error fetching cars:', error));
            }
        }, 300); // Adjust delay as needed (e.g., 300ms)

        setDebounceTimeout(timeout);

    }, [searchTerm]);

    return (
        <div className={styles.carsContainer}>
            <div className={styles.searchFilter}>
                <input
                    type="text"
                    placeholder="Search by make or model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                {/* Add more filters if needed */}
            </div>
            <div className={styles.filterContainer}>
                <select value={make} onChange={(e) => setMake(e.target.value)} className={styles.dropdown}>
                    <option value="">All Makes</option>
                    {makes.map((make) => (
                        <option key={make} value={make}>
                            {make}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Min Price"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className={styles.numberInput}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className={styles.numberInput}
                />
            </div>
            <div className={styles.carsGrid}>
                {cars.map(car => (
                    <CarCard key={car._id} car={car} editCar={(caughtCar: Car) => {
                        if (props.editCar) {
                            props.editCar(caughtCar)
                        }
                    }} 
                    deleteCar={() => props.deleteCar(car._id)}/>
                ))}
            </div>
        </div>
    );
};

export default React.memo(Cars);

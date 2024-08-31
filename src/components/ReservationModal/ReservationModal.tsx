import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ReservationModal.module.css';
import { Car } from '../../models/Car';
import { Reservation } from '../../models/Reservation';
import axiosClient from '../../api/axioClient';

interface ReservationModalProps {
    car: Car;
    onClose: () => void;
    onSubmit: (startDate: string, endDate: string, totalCost: number) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ car, onClose, onSubmit }) => {
    // const [startDate, setStartDate] = useState<Date | undefined>();
    // const [endDate, setEndDate] = useState<Date | undefined>();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [reservedDates, setReservedDates] = useState<{ startDate: Date; endDate: Date }[]>([])

    const fetchReservedDates = async () => {
        try {
            const response = await axiosClient.get('/reservations/getReservedDates/' + car._id)

            console.log("RESPONSE DSATA ", response.data)

            if (response.data.length > 0) {
                setReservedDates(response.data.map((dateRange: any) => ({
                    startDate: new Date(dateRange.startDate),
                    endDate: new Date(dateRange.endDate)
                })));
            }
        } catch (error: any) {
            console.error("Error fetching reserved dates for car! ", error)
        }
    }

    useEffect(() => {
        fetchReservedDates()
    }, [])

    // Generate a list of all dates to be highlighted
    const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
        const date = new Date(startDate.getTime());
        const dates = [];

        while (date <= endDate) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };

    const allReservedDates = reservedDates.flatMap(({ startDate, endDate }) => getDatesInRange(startDate, endDate));

    const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
        setError('')
        setDateRange(dates);
        const [startDate, endDate] = dates;
        if (startDate && endDate) {
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            setTotalCost(days * car.dailyRate);
        } else {
            setTotalCost(0);
        }
    };

    const isOverlapping = (startDate: Date | null, endDate: Date | null): boolean => {
        if (!startDate || !endDate) return false;
        return reservedDates.some(reservation =>
            startDate <= reservation.endDate && endDate >= reservation.startDate
        );
    };

    const handleSubmit = () => {
        const [startDate, endDate] = dateRange;
        if (startDate && endDate && !isOverlapping(startDate, endDate)) {
            onSubmit(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0], totalCost);
        } else {
            setError('Selected dates overlap with an existing reservation.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Reserve {car.make} {car.carModel}</h2>
                <div className={styles.field}>
                    <label>Select Date Range:</label>
                    <DatePicker
                        selected={dateRange[0]}
                        onChange={handleDateRangeChange}
                        startDate={dateRange[0]!}
                        endDate={dateRange[1]!}
                        selectsRange
                        inline
                        highlightDates={allReservedDates}
                    />
                </div>
                {/* <div className={styles.field}>
                    <label>End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        highlightDates={allReservedDates}
                        inline
                    />
                </div> */}
                <div className={styles.field}>
                    <label>Total Cost:</label>
                    <p>${totalCost.toFixed(2)}</p>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.buttons}>
                    <button onClick={handleSubmit} disabled={!dateRange[0] || !dateRange[1] || error !== ''}>Confirm</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;

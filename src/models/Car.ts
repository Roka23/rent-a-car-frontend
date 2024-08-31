export interface Car {
    _id: string;
    make: string;
    carModel: string;
    year: number;
    dailyRate: number;
    imageUrl: string | File | null;
    description: string;
    status: 'available' | 'reserved' | 'maintenance' | 'rented';
    fuelType: 'electric' | 'hybrid' | 'diesel' | 'petrol';
    transmission: 'automatic' | 'manual'
    mileage: number;
    vehicleSize: 'small' | 'medium' | 'large';
}
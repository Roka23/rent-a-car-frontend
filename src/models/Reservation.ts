export interface Reservation {
    _id: string;
    carId: {
        _id: string;
        make: string;
        carModel: string;
        year: string;
        status: string;
        dailyRate: number;
        imageUrl: string;
        description: string;
        fuelType: string;
        transmission: string;
        mileage: string;
        vehicleSize: string;
    };
    userId: {
        _id: string;
        username: string;
        email: string;
        profile: {
            firstName: string;
            lastName: string;
            phone: string;
            address: string;
        };
    };
    startDate: string;
    endDate: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalCost: number;
}

export interface Statistic {
    _id: string;
    date: string;
    revenue: number;
    [key: string]: any; // Allows for additional fields if needed
}

export interface RevenueData {
    date: string;
    totalRevenue: number;
}
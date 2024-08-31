export interface UserProfile {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    profile: UserProfile;
}
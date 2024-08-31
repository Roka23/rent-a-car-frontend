import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Profile.module.css';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axioClient';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface UserProfile {
    username: string;
    email: string;
    profile: {
        firstName: string;
        lastName: string;
        phone: string;
        address: string;
    };
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<UserProfile>({
        username: '',
        email: '',
        profile: {
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
        },
    });
    const [reviews, setReviews] = useState<{ carId: { make: string; carModel: string; _id: string, imageUrl: string }; rating: number; comment: string }[]>([]);

    const { userId } = useAuth()

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await axiosClient.get('/users/profile/' + userId);
            setUser(data);

            // Fetch user's reviews
            const reviewsData = await axiosClient.get('/reviews/user/' + userId);
            console.log("AAAAA ", reviewsData.data)
            setReviews(reviewsData.data);
        };

        if (userId !== '')
            fetchProfile();
    }, [userId, isEditing]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            profile: {
                ...prevUser.profile,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axiosClient.put('/users/profile/' + userId, user.profile);
        setIsEditing(false);
    };

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.title}>Moj Profil</h2>
            <FontAwesomeIcon icon={faUser} size="5x" className={styles.userIcon} />
            {!isEditing ? (
                <div className={styles.profileDetails}>
                    <p><strong>Korisničko ime:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Ime:</strong> {user.profile.firstName}</p>
                    <p><strong>Prezime:</strong> {user.profile.lastName}</p>
                    <p><strong>Telefon:</strong> {user.profile.phone}</p>
                    <p><strong>Adresa:</strong> {user.profile.address}</p>
                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>Uredi profil</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                    <label>
                        Ime:
                        <input type="text" name="firstName" value={user.profile.firstName} onChange={handleChange} />
                    </label>
                    <label>
                        Prezime:
                        <input type="text" name="lastName" value={user.profile.lastName} onChange={handleChange} />
                    </label>
                    <label>
                        Telefon:
                        <input type="text" name="phone" value={user.profile.phone} onChange={handleChange} />
                    </label>
                    <label>
                        Adresa:
                        <input type="text" name="address" value={user.profile.address} onChange={handleChange} />
                    </label>
                    <button type="submit" className={styles.saveButton}>Spremi</button>
                </form>
            )}

            <div className={styles.reviewsContainer}>
                <h2>Moje Recenzije</h2>
                {reviews.length > 0 ? (
                    <div className={styles.reviewsList}>
                        {reviews.map((review, index) => (
                            <div key={index} className={styles.review}>
                                <div className={styles.reviewHeader}>
                                    <img
                                        src={`http://localhost:5000/uploads/${review.carId.imageUrl}`}
                                        alt={review.carId.carModel}
                                        className={styles.carImage}
                                    />
                                    <h3>
                                        <Link to={`/cars/${review.carId._id}`} className={styles.carLink}>
                                            {review.carId.make} {review.carId.carModel}
                                        </Link>
                                    </h3>
                                </div>
                                <p><strong>Ocjena:</strong> {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                                <p><strong>Komentar:</strong> {review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nemate nijednu recenziju.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axioClient';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/users/login', { email, password });
            console.log("RESPONSE ALALALA ", response)
            if (response.status === 404) {
                toast.error("XD LOL", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true)
            navigate('/')
            window.location.reload();
        } catch (error: any) {
            const axiosError = error as AxiosError
            if (axiosError.status === 404) {
                toast.error((axiosError.response!.data! as any).error, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
            console.error('Login failed', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.title}>Login</div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
                <div className={styles.link}>
                    <span>Don't have an account? <a href="/register">Register</a></span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

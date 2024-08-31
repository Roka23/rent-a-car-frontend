import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import styles from './UserOverview.module.css'; // Assuming you're using module.css for custom styling
import { User } from '../../../models/User';
import axiosClient from '../../../api/axioClient';

const UserOverview: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosClient.get('/users', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                const data = response.data
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handlePromoteToAdmin = async (userId: string) => {
        try {
            const response = await axiosClient.put(`/users/grantAdmin/${userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if (response.status === 200) {
                // Update the user's role in the state
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, role: 'admin' } : user
                    )
                );
            } else {
                console.error('Failed to promote user to admin');
            }
        } catch (error) {
            console.error('Error promoting user to admin:', error);
        }
    };

    const handleRevokeAdmin = async (userId: string) => {
        try {
            const response = await axiosClient.put(`/users/revokeAdmin/${userId}`)

            if (response.status === 200) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, role: 'user' } : user
                    ))
            }
        } catch (error) {
            console.error("Error revoking user from admin: ", error)
        }
    }

    return (
        <div className={styles.userOverview}>
            <Typography variant="h4" className={styles.title}>User Overview</Typography>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Promote to Admin</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 && users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.profile.firstName}</TableCell>
                                <TableCell>{user.profile.lastName}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.profile.phone}</TableCell>
                                <TableCell>{user.profile.address}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={user.role === 'admin' ? () => handleRevokeAdmin(user._id) : () => handlePromoteToAdmin(user._id)}
                                        className={user.role === 'admin' ? styles.revokeButton : styles.promoteButton}
                                    >
                                        {user.role === 'admin' ? 'Revoke Admin' : 'Promote'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default React.memo(UserOverview);

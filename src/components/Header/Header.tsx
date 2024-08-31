import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { isAuthenticated, setIsAuthenticated, isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page after logout
        window.location.reload();
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <img src='/car-logo.png' style={{ width: 100, height: 100 }} />
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                </div>
                <ul className={`${styles.navList} ${menuOpen ? styles.open : ''}`}>
                    <li className={styles.navItem}>
                        {isAdmin ?
                            <Link to="/dashboard">Dashboard</Link>
                            :
                            <Link to="/">Home</Link>
                        }
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/cars">Cars</Link>
                    </li>
                    {
                        isAuthenticated && !isAdmin &&
                        <li className={styles.navItem}>
                            <Link to="/my-reservations">My Reservations</Link>
                        </li>
                    }
                    <li className={styles.navItem}>
                        {isAuthenticated ? (
                            <>
                                <div className={styles.profileMenu}>
                                    <img
                                        src='/profile-icon-white.png'
                                        width={64}
                                        onClick={toggleMenu}
                                        className={styles.profileIcon}
                                    />
                                    {menuOpen && (
                                        <div className={styles.dropdownMenu}>
                                            <Link to="/profile" className={styles.menuItem}>
                                                <FontAwesomeIcon icon={faUser} className={styles.icon} /> Profile
                                            </Link>
                                            <button onClick={handleLogout} className={styles.menuItem}>
                                                <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className={styles.mainButton}>Sign in</Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default React.memo(Header);


import React from 'react'
import styles from './Home.module.css'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <div className={styles.landingContainer}>
                <div className={styles.headingWrapper}>
                    <div className={styles.logoContainer}>
                        <img src='/car-logo.png' className={styles.imageLogo} />
                    </div>
                    <h2>Drive Your Dream Car Today!</h2>
                    <p>Discover the freedom of the open road with our wide selection of premium vehicles.
                        Whether you need a reliable car for your business trip, a spacious SUV for your family vacation, or a luxury car for a special occasion,
                        we have the perfect vehicle for you.</p>
                    <Link to={'/cars'} className={styles.mainButton}>
                        See Fleet
                    </Link>
                </div>
                <div className={styles.triangleSeparator}></div>
                <img src='/car-landing.png' className={styles.carImage} />
            </div>
        </div>
    )
}

export default React.memo(Home)

import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import Statistics from '../Statistics/Statistics';
import Reservations from '../Reservations/Reservations';
import UserOverview from '../UserOverview/UserOverview';
import CarsOverview from '../CarsOverview/CarsOverview';

const Dashboard: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState<'Statistics' | 'Reservations' | 'UserOverview' | 'CarsOverview' | null>(null)

    const renderContent = () => {
        switch (selectedComponent) {
            case 'Statistics':
                return <Statistics />
            case 'Reservations':
                return <Reservations />
            case 'UserOverview':
                return <UserOverview />
            case 'CarsOverview':
                return <CarsOverview />
            default:
                return null
        }
    }

    const selectComponent = (component: 'Statistics' | 'Reservations' | 'UserOverview' | 'CarsOverview') => {
        if (component === selectedComponent) {
            setSelectedComponent(null)
            return
        }

        setSelectedComponent(component)
    }

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <div className={styles.sections}>
                <div className={`${styles.section} ${selectedComponent === 'Statistics' && styles.selectedSection}`} onClick={() => selectComponent('Statistics')}>
                    <h2 className={`${styles.sectionTitle} ${selectedComponent === 'Statistics' && styles.selectedSection}`}>Statistics</h2>
                    <p>View detailed statistics of car rentals and revenue.</p>
                </div>
                <div className={`${styles.section} ${selectedComponent === 'Reservations' && styles.selectedSection}`} onClick={() => selectComponent('Reservations')}>
                    <h2 className={`${styles.sectionTitle} ${selectedComponent === 'Reservations' && styles.selectedSection}`}>Reservations</h2>
                    <p>Manage all reservations, approve or reject requests.</p>
                </div>
                <div className={`${styles.section} ${selectedComponent === 'UserOverview' && styles.selectedSection}`} onClick={() => selectComponent('UserOverview')}>
                    <h2 className={`${styles.sectionTitle} ${selectedComponent === 'UserOverview' && styles.selectedSection}`}>User Management</h2>
                    <p>View and manage registered users, grant admin access.</p>
                </div>
                <div className={`${styles.section} ${selectedComponent === 'CarsOverview' && styles.selectedSection}`} onClick={() => selectComponent('CarsOverview')}>
                    <h2 className={`${styles.sectionTitle} ${selectedComponent === 'CarsOverview' && styles.selectedSection}`}>Car Management</h2>
                    <p>Add, edit, or remove cars available for rent.</p>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};

export default React.memo(Dashboard);

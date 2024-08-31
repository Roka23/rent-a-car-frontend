import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Cars from './components/Cars/Cars';
import Profile from './components/Profile/Profile';
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Admin/Dashboard/Dashboard';
import Statistics from './components/Admin/Statistics/Statistics';
import SingleCar from './components/SingleCar/SingleCar';
import CarsPage from './components/Admin/CarsPage/CarsPage';
import UserReservations from './components/UserReservations/UserReservations';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:carId" element={<SingleCar />} />
          {/* <Route path="/reservations" element={<Reservations />} /> */}
          {/* <Route path="/statistics" element={<Statistics />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="my-reservations" element={<UserReservations />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;

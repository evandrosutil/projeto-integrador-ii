import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Login from './components/Login/Login';
import AnimalList from './components/AnimalList/AnimalList';
import AnimalForm from './components/AnimalForm';
import PrivateRoute from './components/PrivateRoute';
import AdoptantRegistration from './components/AdoptantRegistration/AdoptantRegistration';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/admin" element={<Register />} />
          <Route path="/register" element={<AdoptantRegistration />} />
          <Route path="/animals/available" element={<AnimalList />} />
          <Route 
          path="/animals" 
          element={
            <PrivateRoute>
              <AnimalList />
            </PrivateRoute>
          } 
          />
          <Route 
          path="/animals/new" 
          element={
            <PrivateRoute>
              <AnimalForm />
            </PrivateRoute>
            } 
          />
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;
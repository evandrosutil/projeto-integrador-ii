import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, isAuthenticated, getUserData } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const userData = getUserData();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderAuthenticatedMenu = () => {
    if (!userData) return null;

    if (userData.role === 'admin') {
      return (
        <>
          <Link to="/animals" className="default-btn">
            <span>Meus Animais</span>
          </Link>
          <Link to="/animals/new" className="default-btn">
            <span>Cadastrar Animal</span>
          </Link>
        </>
      );
    } else if (userData.role === 'adopter') {
      return (
        <>
          <Link to="/animals" className="default-btn">
            <span>Buscar Animais</span>
          </Link>
          <Link to="/profile" className="default-btn">
            <span>Meu Perfil</span>
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        Adote
      </Link>

      {/* Menu de navegação */}
      <div className="flex items-center space-x-8">
        {isAuthenticated() ? (
          <>
            {renderAuthenticatedMenu()}
            <Link onClick={handleLogout} className="default-btn">
              Sair
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="default-btn">
              Login
            </Link>
            <Link to="/register" className="default-btn">
              Registrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

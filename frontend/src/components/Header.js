import React from 'react';
import { isAuthenticated } from '../services/auth';

const handleLogout = () => {
  logout();
  navigate('/login');
};

const Header = () => {
  return (
    <header className="navbar">
      <div className="logo">Adote</div>
      <div>
        {isAuthenticated() ? (
              <div className="navbar">
                {renderAuthenticatedMenu()}
                <button
                  onClick={handleLogout}
                  className="default-btn"
                >
                  <span>Sair</span>
                </button>
              </div>
        ) : (
        <div>
          <button className="login-btn">Login</button>
          <button className="register-btn">Registre-se</button>
        </div>
      )}
      </div>
    </header>
  );
};

const renderAuthenticatedMenu = () => {
  if (!userData) return null;

  if (userData.role === 'admin') {
    return (
      <>
        <Link 
          to="/animals" 
          className="default-btn"
        >
          <span>Meus Animais</span>
        </Link>
        <Link 
          to="/animals/new" 
          className="default-btn"
        >
          <span>Cadastrar Animal</span>
        </Link>
      </>
    );
  } else if (userData.role === 'adopter') {
    return (
      <>
        <Link 
          to="/animals" 
          className="default-btn"
        >
          {/* <Search size={18} /> */}
          <span>Buscar Animais</span>
        </Link>
        <Link 
          to="/profile" 
          className="default-btn"
        >
          {/* <User size={18} /> */}
          <span>Meu Perfil</span>
        </Link>
      </>
    );
  }
};
export default Header;
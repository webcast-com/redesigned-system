import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ background: '#333', color: '#fff', padding: '1rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          <h1>Blogging CMS</h1>
        </Link>
        <div>
          <Link to="/admin/login" style={{ color: '#fff', marginLeft: '1rem' }}>
            Admin Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

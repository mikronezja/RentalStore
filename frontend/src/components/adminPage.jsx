import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import RentSearch from './rentSearch';
import ReturnSearch from './returnSearch';

const API_BASE = 'http://localhost:3000/api';

const Admin = () => {
  const [movies, setMovies] = useState([]);
  const [isReturnMode, setIsReturnMode] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products`);
        setMovies(res.data);
      } catch {
        console.error('Błąd pobierania danych.');
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Panel Administratora</h1>

      <div style={{ marginBottom: 20 }}>
        <Switch
          checked={isReturnMode}
          onChange={() => setIsReturnMode(!isReturnMode)}
          checkedChildren="Zwroty"
          unCheckedChildren="Wypożyczenia"
        />
      </div>

      {isReturnMode
        ? <ReturnSearch movies={movies.filter(m => m.status === 'rented')} />
        : <RentSearch movies={movies.filter(m => m.status === 'available')} />
      }

      <Link to="/debtors">
        <Button
          type="primary"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          Przejdź do listy dłużników
        </Button>
      </Link>
  
      <Link to="/">
        <Button
          type="primary"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 1000
          }}
        >
          Strona główna
        </Button>
      </Link>
    </div>
  );
};

export default Admin;

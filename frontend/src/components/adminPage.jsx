import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, Modal, message } from 'antd';

const API_BASE = 'http://localhost:3000/api'; // Dopasuj do swojego adresu API

const Admin = () => {
  const [searchId, setSearchId] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [clientId, setClientId] = useState('');

  // Pobierz dane z API po załadowaniu komponentu
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setMovies(res.data);
      setFilteredMovies(res.data);
    } catch (error) {
      message.error('Błąd podczas pobierania danych z serwera.');
    }
  };

  const handleSearch = () => {
    const results = movies.filter(movie => movie.id.includes(searchId));
    setFilteredMovies(results.length > 0 ? results : []);
  };

  const openModal = (type, movie) => {
    setSelectedMovie(movie);
    setActionType(type);
    setModalVisible(true);
  };

  const handleAction = async () => {
    if (!clientId) {
      message.warning("Podaj ID klienta.");
      return;
    }

    try {
      const payload = {
        productId: selectedMovie.id,
        clientId: clientId,
      };

      if (actionType === 'zarezerwuj' || actionType === 'wypożycz') {
        await axios.post(`${API_BASE}/rents/rent`, payload);
      } else if (actionType === 'zwróć') {
        await axios.post(`${API_BASE}/rents/return`, payload);
      }

      message.success(`Akcja "${actionType}" zakończona pomyślnie`);
      setModalVisible(false);
      setClientId('');
      fetchMovies(); // odśwież dane
    } catch (error) {
      message.error('Błąd podczas wykonywania akcji.');
    }

  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Panel Administratora</h1>
      <div className="search-section">
        <Input
          placeholder="Wpisz ID produktu..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <Button type="primary" onClick={handleSearch} className="search-button">Szukaj</Button>
      </div>

      <div className="admin-results">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="admin-card">
            <div className="admin-info">
              <h3>{movie.title}</h3>
              <p className="admin-description">{movie.description}</p>
              <p className="admin-status">Status: {movie.status}</p>
              <p> {movie.id} </p>
            </div>
            <div className="admin-actions">
              <Button onClick={() => openModal("zarezerwuj", movie)}>Zarezerwuj</Button>
              <Button onClick={() => openModal("wypożycz", movie)}>Wypożycz</Button>
              <Button onClick={() => openModal("zwróć", movie)}>Zwróć</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={<span className="register-modal-title">Akcja: {actionType}</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAction}
        okText="Potwierdź"
        cancelText="Anuluj"
        bodyStyle={{ padding: '30px' }}
        className="register-modal"
      >
        <Input
          placeholder="Wprowadź ID klienta"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="register-input"
        />
      </Modal>
    </div>
  );
};

export default Admin;

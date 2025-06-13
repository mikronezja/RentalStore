// Admin.jsx
import React, { useState } from 'react';
import { Input, Button, Modal } from 'antd';

const allMovies = [
  {
    id: '001',
    title: "Incepcja",
    description: "Film o snach w snach, pełen akcji i zaskoczeń.",
    status: "na stanie"
  },
  {
    id: '002',
    title: "Shrek",
    description: "Zabawna bajka o zielonym ogrze.",
    status: "zarezerwowane"
  },
  {
    id: '003',
    title: "Gladiator",
    description: "Rzymski generał staje się gladiatorem.",
    status: "wypożyczone"
  },
    {
    id: '001',
    title: "Incepcja",
    description: "Film o snach w snach, pełen akcji i zaskoczeń.",
    status: "na stanie"
  },
  {
    id: '002',
    title: "Shrek",
    description: "Zabawna bajka o zielonym ogrze.",
    status: "zarezerwowane"
  },
  {
    id: '003',
    title: "Gladiator",
    description: "Rzymski generał staje się gladiatorem.",
    status: "wypożyczone"
  }
];

const Admin = () => {
  const [searchId, setSearchId] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [clientId, setClientId] = useState('');

  const handleSearch = () => {
    const results = allMovies.filter(movie => movie.id.includes(searchId));
    setFilteredMovies(results.length > 0 ? results : []);
  };

  const openModal = (type, movie) => {
    setSelectedMovie(movie);
    setActionType(type);
    setModalVisible(true);
  };

  const handleAction = () => {
    console.log(`Akcja: ${actionType}, Film: ${selectedMovie.title}, Klient ID: ${clientId}`);
    setModalVisible(false);
    setClientId('');
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
        title={`Akcja: ${actionType}`}
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

import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, message } from 'antd';

const API_BASE = 'http://localhost:3000/api';

const ReturnSearch = () => {
  const [searchId, setSearchId] = useState('');
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [clientId, setClientId] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [conditionAfterReturn, setConditionAfterReturn] = useState('');
  const [rentalId, setRentalId] = useState(null); // Potrzebne do zwrotu

  useEffect(() => {
    const fetchRentedMovies = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        const rented = data.filter(movie => movie.status === 'rented');
        setMovies(rented);
        setFiltered(rented);
      } catch (err) {
        console.error("Błąd ładowania produktów:", err);
        message.error("Nie udało się pobrać produktów.");
      } finally {
        setLoading(false);
      }
    };
    fetchRentedMovies();
  }, []);

  const handleSearch = () => {
    const results = movies.filter(movie => movie.id?.includes(searchId));
    setFiltered(results);
  };

  const openModal = async (movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
    setClientId('');
    setEmployeeEmail('');
    setConditionAfterReturn('');
    setRentalId(null);

    try {
      // 1. Pobierz aktywne wypożyczenie dla danego produktu
      const res = await fetch(`${API_BASE}/rents?status=rented&limit=1000&page=1`);
      const data = await res.json();
      const activeRentals = data.rentals || data;

      const activeRental = activeRentals.find(rent =>
        rent.product?._id?.toString() === movie._id?.toString()
      );

      if (!activeRental) {
        message.info("Nie znaleziono aktywnego wypożyczenia.");
        return;
      }

      // 2. Pobierz szczegóły wypożyczenia po ID
      const rentalDetailsRes = await fetch(`${API_BASE}/rents/${activeRental._id}`);
      const rentalDetails = await rentalDetailsRes.json();

      // 3. Wypełnij formularz
      setClientId(rentalDetails.client?._id || '');
      setEmployeeEmail(rentalDetails.worker?.email || '');
      setConditionAfterReturn(rentalDetails.conditionAfterReturn || '');
      setRentalId(rentalDetails._id);
    } catch (err) {
      console.error("Błąd pobierania danych wypożyczenia:", err);
      message.error("Nie udało się załadować danych wypożyczenia.");
    }
  };

  const handleReturn = async () => {
    if (!clientId || !employeeEmail || !rentalId) {
      message.warning("Uzupełnij wszystkie dane.");
      return;
    }

    try {
      await fetch(`${API_BASE}/rents/return/${rentalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, employeeEmail, conditionAfterReturn })
      });

      message.success("Produkt został zwrócony.");
      setModalVisible(false);

      // Odśwież listę bez zwróconego produktu
      setMovies(prev => prev.filter(m => m._id !== selectedMovie._id));
      setFiltered(prev => prev.filter(m => m._id !== selectedMovie._id));
    } catch (err) {
      console.error("Błąd zwrotu:", err);
      message.error("Nie udało się zwrócić produktu.");
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <>
      <div className="search-section" style={{ marginBottom: 20 }}>
        <Input.Search
          placeholder="Wpisz ID produktu..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onSearch={handleSearch}
          className="search-input"
        />
      </div>

      <div className="admin-results">
        {(filtered.length > 0 ? filtered : movies).map(movie => (
          <div className="admin-card" key={movie._id} style={{ border: '1px solid #ccc', marginBottom: 10 }}>
            <div className="admin-info">
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <p><b>Status:</b> {movie.status}</p>
              <p><b>ID:</b> {movie._id}</p>
            </div>
            <div className="admin-actions" style={{ marginTop: 10 }}>
              <Button onClick={() => openModal(movie)}>Zwróć</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="Zwrot produktu"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleReturn}
        okText="Potwierdź"
        cancelText="Anuluj"
      >
        <Input disabled value={selectedMovie?._id || ''} addonBefore="ID produktu" style={{ marginBottom: 10 }} />
        <Input disabled value={clientId} addonBefore="ID klienta" style={{ marginBottom: 10 }} />
        <Input disabled value={employeeEmail} addonBefore="E-mail pracownika" style={{ marginBottom: 10 }} />
        <Input
          placeholder="Stan po zwrocie"
          value={conditionAfterReturn}
          onChange={(e) => setConditionAfterReturn(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default ReturnSearch;

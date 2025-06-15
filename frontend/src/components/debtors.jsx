import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, message, Button } from 'antd';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3000/api';

const Debtors = () => {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        const response = await axios.get(`${API_BASE}/rents/overdue`);
        console.log("Odpowiedź z API:", response.data);
        setDebtors(response.data.rents); // <-- dostosowanie do struktury danych
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
        message.error('Błąd podczas pobierania listy dłużników.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverdue();
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Lista dłużników</h1>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
          <Spin size="large" />
          <p>Ładowanie danych o dłużnikach...</p>
        </div>
      ) : debtors.length === 0 ? (
        <p>Brak przeterminowanych wypożyczeń.</p>
      ) : (
        <div className="admin-results">
          {debtors.map((item) => {
            const dueDate = item.rentalPeriod?.end;
            const rentDate = item.rentalPeriod?.start;
            const productTitle = item.product?.title || 'Nieznany produkt';
            const clientId = item.client?._id || 'Nieznany';
            const clientName = item.client?.name || 'Brak danych klienta';

            return (
              <div key={item._id} className="admin-card">
                <div className="admin-info">
                  <h3>{clientName} (ID: {clientId})</h3>
                  <p className="admin-description">Produkt: {productTitle}</p>
                  <p className="admin-status">
                    Termin zwrotu: {dueDate ? new Date(dueDate).toLocaleDateString() : 'Brak daty'}
                  </p>
                  <p>
                    Wypożyczono: {rentDate ? new Date(rentDate).toLocaleDateString() : 'Brak daty'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link to="/admin">
        <Button
          type="primary"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          Powrót do panelu admina
        </Button>
      </Link>
    </div>
  );
};

export default Debtors;

import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, message } from 'antd';

const API_BASE = 'http://localhost:3000/api';

const RentalSearch = () => {
  const [searchId, setSearchId] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [clientEmail, setClientEmail] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        const available = data.filter(prod => prod.status === 'available');
        setProducts(available);
        setFiltered(available);
      } catch (err) {
        console.error("Błąd ładowania produktów:", err);
        message.error("Nie udało się pobrać produktów.");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableProducts();
  }, []);

  const handleSearch = () => {
    const results = products.filter(product => product._id.includes(searchId));
    setFiltered(results);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
    setClientEmail(''); // wyczyść pola przy otwarciu modalu
    setWorkerEmail('');
  };

const handleRent = async () => {
  if (!clientEmail || !workerEmail) {
    message.warning("Uzupełnij wszystkie dane.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/rents/rent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProduct._id,
        client: clientEmail,
        worker: workerEmail
      })
    });

    // Odczytujemy odpowiedź jako tekst
    const text = await res.text();

    let data;
    try {
      // Próba parsowania tekstu jako JSON
      data = JSON.parse(text);
    } catch {
      // Jeśli nie uda się sparsować, traktujemy odpowiedź jako zwykły tekst
      data = null;
    }

    if (!res.ok) {
      // Jeśli status nie OK, to wyrzucamy błąd z wiadomością albo tekstem
      throw new Error(data?.message || text || "Błąd przy wypożyczaniu");
    }

    message.success("Produkt wypożyczony.");
    setModalVisible(false);
    setProducts(products.filter(p => p._id !== selectedProduct._id));
    setFiltered(filtered.filter(p => p._id !== selectedProduct._id));
  } catch (err) {
    console.error("Błąd wypożyczenia:", err);
    message.error("Nie udało się wypożyczyć produktu: " + err.message);
  }
};


  if (loading) return <p>Ładowanie...</p>;

  return (
    <>
      <div className="search-section" style={{ marginBottom: 20 }}>
        <Input
          placeholder="Wpisz fragment ID produktu..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 300 }}
        />
        <Button onClick={handleSearch} style={{ marginLeft: 10 }}>Szukaj</Button>
      </div>

      <div className="admin-results">
        {(filtered.length > 0 ? filtered : products).map(product => (
          <div key={product._id} style={{ border: '1px solid #ccc', marginBottom: 15, padding: 15, borderRadius: 4 }}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p><b>Status:</b> {product.status}</p>
            <p><b>ID:</b> {product._id}</p>
            <Button type="primary" onClick={() => openModal(product)}>Wypożycz</Button>
          </div>
        ))}
      </div>

      <Modal
        title="Wypożyczenie produktu"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleRent}
        okText="Potwierdź"
        cancelText="Anuluj"
      >
        <Input
          disabled
          value={selectedProduct?._id || ''}
          addonBefore="ID produktu"
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Email klienta"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input
          placeholder="Email pracownika"
          value={workerEmail}
          onChange={(e) => setWorkerEmail(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default RentalSearch;

import React, { useEffect, useState } from 'react';

function Bestsellers() {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/popular');
        const data = await res.json();
        setBestsellers(data);  // zakładam, że API zwraca tablicę produktów
        setLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania bestsellerów:", error);
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  if (loading) return <p>Ładowanie bestsellerów...</p>;

  return (
    <div className="bestsellers-wrapper">
      <h2 className="bestsellers-title">Bestsellery</h2>
      <div className="bestseller-cards">
        {bestsellers.map((movie, index) => (
          <div key={index} className="bestseller-card">
            <h3 className="bestseller-name">{movie.title}</h3>
            <p className="bestseller-description">{movie.description}</p>
            <p className="bestseller-opinion">„jakas super cool opinia hihi”</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bestsellers;

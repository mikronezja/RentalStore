import React, { useEffect, useState } from 'react';

function Bestsellers() {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products/popular?limit=3');
        const data = await res.json();
        setBestsellers(data);
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
        {bestsellers.map((movie, index) => {
          const reviews = movie.reviews || [];

          // Znajdź opinię z najwyższym ratingiem
          const topReview = reviews.reduce((best, current) => {
            return !best || (current.rating > best.rating) ? current : best;
          }, null);

          const reviewText = topReview?.comment || 'Brak opinii';

          return (
            <div key={index} className="bestseller-card">
              <h3 className="bestseller-name">{movie.title}</h3>
              <p className="bestseller-description">{movie.description}</p>
              <p className="bestseller-opinion">„{reviewText}”</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bestsellers;

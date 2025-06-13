import React from 'react';

function Bestsellers({ movies }) {
  return (
    <div className="bestsellers-wrapper">
      <h2 className="bestsellers-title">Bestsellery</h2>
      <div className="bestseller-cards">
        {movies.map((movie, index) => (
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

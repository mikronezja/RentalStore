import { useState } from 'react';

function MovieSearch({ movies }) {
  const [search, setSearch] = useState('');

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="movie-search-wrapper">
      <div className="movie-search-header">
        <h2 style={{ paddingBottom: '30px'}}>Wyszukaj film</h2>
        <input
          type="text"
          placeholder="Szukaj po tytule..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="movie-list">
        {filteredMovies.map((movie, index) => (
          <div className="movie-card" key={index}>
            <h3>{movie.title}</h3>
            <p><strong>Kategoria:</strong> {movie.category}</p>
            <p><strong>Dostępnych sztuk:</strong> {movie.stock}</p>
            <p className="movie-description">{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;

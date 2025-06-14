import { useState, useEffect } from 'react';

function MovieSearch() {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Błąd podczas pobierania filmów:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Ładowanie filmów...</p>;

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
            <p><strong>Dostępność:</strong> {movie.status}</p>
            <p className="movie-description">{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;

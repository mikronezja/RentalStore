import { useState, useEffect } from 'react';
import { Modal, Input, Rate, Button } from 'antd';

const { TextArea } = Input;

function MovieSearch() {
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [newReview, setNewReview] = useState({
    username: '',
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error("Błąd podczas pobierania filmów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [showModal]);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleReviewSubmit = async () => {
    const { username, rating, comment } = newReview;

    if (!username || !rating || !comment) {
      alert("Proszę wypełnić wszystkie pola opinii.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/products/review/${selectedMovie._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, rating, comment })
      });

      if (res.ok) {
        const newReviewData = await res.json();
        setSelectedMovie(prevMovie => ({
        ...prevMovie,
        reviews: [...(prevMovie.reviews || []), newReviewData.review]
        }));
        setNewReview({ username: '', rating: 0, comment: '' });
      } else {
        alert("Błąd przy dodawaniu opinii.");
      }
    } catch (error) {
      console.error("Błąd sieci:", error);
      alert("Błąd sieci podczas dodawania opinii.");
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Ładowanie filmów...</p>;

  return (
    <div className="movie-search-wrapper">
      <div className="movie-search-header">
        <h2 style={{ paddingBottom: "20px", fontSize: "60px" }}>Wyszukaj film</h2>
        <input
          type="text"
          placeholder="Szukaj po tytule..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="movie-list">
        {filteredMovies.map((movie, index) => (
          <div
            className="movie-card"
            key={index}
            onClick={() => handleCardClick(movie)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{movie.title}</h3>
            <p><strong>Kategoria:</strong> {movie.category}</p>
            <p><strong>Dostępność:</strong> {movie.status}</p>
            <p className="movie-description">{movie.description}</p>
          </div>
        ))}
      </div>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        title={<span className="register-modal-title">{selectedMovie?.title}</span>}
        destroyOnClose
      >
        {selectedMovie && (
          <>
            <p><strong>Kategoria:</strong> {selectedMovie.category}</p>
            <p><strong>Status:</strong> {selectedMovie.status}</p>
            <p>{selectedMovie.description}</p>

            <h3>Opinie</h3>
            {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
              <ul>
                {selectedMovie.reviews.map((review, i) => (
                  <p key={i} style={{ marginBottom: '8px' }}>
                    <strong>{review.clientEmail}</strong> - <Rate disabled defaultValue={review.rating} /> <br />
                    {review.comment}
                  </p>
                ))}
              </ul>
            ) : (
              <p>Brak opinii.</p>
            )}

            <h3>Dodaj opinię</h3>
            <Input
              placeholder="Twój adres e-mail"
              value={newReview.username}
              onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            <Rate
              value={newReview.rating}
              onChange={(value) => setNewReview({ ...newReview, rating: value })}
              style={{ marginBottom: 12 }}
            />
            <TextArea
              placeholder="Twoja opinia"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: 15 }}
              onClick={handleReviewSubmit}
            >
              Dodaj opinię
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default MovieSearch;

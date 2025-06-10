function Bestsellers({ movies }) {
  return (
    <div style={{ flex: 1, paddingLeft: '50px', borderLeft: '1px solid #ccc', position: 'sticky', top: '30px', alignSelf: 'flex-start' }}>
      <h2 style={{ fontSize: '50px'}}>Bestsellery</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}><strong>{movie}</strong></li>
        ))}
      </ul>
    </div>
  );
}

export default Bestsellers;
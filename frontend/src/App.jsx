import MovieSearch from './components/movieSearch';
import Bestsellers from './components/bestsellers';
import './movieSearch.css';

const movies = [
  {
    title: "Incepcja",
    stock: 5,
    category: "Sci-Fi",
    description: "Film o snach w snach, pełen akcji i zaskoczeń."
  },
  {
    title: "Shrek",
    stock: 12,
    category: "Animacja",
    description: "Zabawna bajka o zielonym ogrze, który ratuje księżniczkę."
  },
  {
    title: "Gladiator",
    stock: 3,
    category: "Dramat historyczny",
    description: "Opowieść o rzymskim generale, który staje się gladiatorem."
  },
  {
    title: "Titanic",
    stock: 7,
    category: "Romans",
    description: "Historia miłości na pokładzie tonącego statku."
  },
  {
    title: "Matrix",
    stock: 4,
    category: "Akcja",
    description: "Rzeczywistość nie jest tym, czym się wydaje. Neo walczy z maszynami."
  },
  {
    title: "Zielona mila",
    stock: 2,
    category: "Dramat",
    description: "Poruszająca historia więziennego strażnika i niezwykłego więźnia."
  },
  {
    title: "Interstellar",
    stock: 6,
    category: "Sci-Fi",
    description: "Wyprawa przez czarne dziury w poszukiwaniu nowego domu dla ludzkości."
  },
  {
    title: "Toy Story",
    stock: 10,
    category: "Animacja",
    description: "Zabawki mają swoje życie, gdy ludzie nie patrzą."
  }
];


const bestsellers = [
  "Incepcja",
  "Matrix",
  "Pulp Fiction"
];

function App() {
  return (
    <div className="app-container" style={{ display: 'flex', padding: '20px', alignContent: 'space-between' }}>
        <MovieSearch movies={movies} />
        <Bestsellers movies={bestsellers} />
      
    </div>
  );
}

export default App;
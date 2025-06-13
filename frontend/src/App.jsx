import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSearch from './components/movieSearch';
import Bestsellers from './components/bestsellers';
import RegisterModal from './components/registerModal';
import './movieSearch.css';
import './modal.css'
import './bestsellers.css'
import './admin.css'
import { FloatButton} from "antd";
import { DesktopOutlined } from '@ant-design/icons';

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
  }
];

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
      console.log("Zarejestrowano ID:", employeeId);
      setIsModalOpen(false);
      setEmployeeId('');
      navigate('/admin');
  };
  return (
    <>
      <div className="app-container" style={{ display: 'flex', padding: '20px', alignContent: 'space-between' }}>
          <MovieSearch movies={movies} />
          <Bestsellers movies={bestsellers} />
        
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegister}
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
      />

      <FloatButton
        icon={<DesktopOutlined />}
        description="ADMIN PANEL"
        shape="square"
        style={{ insetInlineStart: 20, bottom: 20, whiteSpace: "nowrap", width: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}
        onClick={() => setIsModalOpen(true)}
      />
    </>
  );
}

export default App;
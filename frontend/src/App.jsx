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
          <MovieSearch />
          <Bestsellers />      
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
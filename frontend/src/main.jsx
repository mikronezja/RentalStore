import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './components/adminPage';
import Debtors from './components/debtors';
import { EmployeeProvider } from './context/EmployeeContext';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/debtors" element={<Debtors />} />
        </Routes>
      </BrowserRouter>
    </EmployeeProvider>
  </React.StrictMode>
);

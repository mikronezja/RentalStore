import React from 'react';
import { Modal, Input } from 'antd';
import { useEmployee } from '../context/EmployeeContext';

const RegisterModal = ({ isOpen, onClose, onRegister }) => {
  const { employeeEmail, setEmployeeEmail } = useEmployee();

  return (
    <Modal
      title={<span className="register-modal-title">Rejestracja Pracownika</span>}
      open={isOpen}
      onOk={onRegister}
      onCancel={onClose}
      okText="Zarejestruj"
      cancelText="Anuluj"
      bodyStyle={{ padding: '30px' }}
      style={{ top: '20vh' }}
      className="register-modal"
    >
      <Input
        placeholder="Wprowadź mail pracownika"
        value={employeeEmail}
        onChange={(e) => setEmployeeEmail(e.target.value)}
        className="register-input"
      />
    </Modal>
  );
};

export default RegisterModal;

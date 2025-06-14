// RegisterModal.jsx
import React from 'react';
import { Modal, Input } from 'antd';

const RegisterModal = ({ isOpen, onClose, onRegister, employeeId, setEmployeeId }) => {
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
        placeholder="Wprowadź ID pracownika"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="register-input"
      />
    </Modal>
  );
};

export default RegisterModal;

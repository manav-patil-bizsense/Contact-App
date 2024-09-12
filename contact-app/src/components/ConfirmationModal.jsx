// src/components/ConfirmationModal.jsx
import React from 'react';
import Modal from 'react-modal';
import '../styles/confirmationModal.css';

Modal.setAppElement('#root');

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Deletion"
      className="confirmation-modal"
      overlayClassName="overlay"
    >
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this contact?</p>
      <div className="form-buttons">
        <button onClick={onConfirm} className="form-button delete-button">Yes</button>
        <button onClick={onRequestClose} className="form-button cancel-button">No</button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

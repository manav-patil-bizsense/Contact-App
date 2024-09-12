import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactModal';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from './Features/contacts/contactsSlice';
import './app.css';

Modal.setAppElement('#root');

const App = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.contacts.isModalOpen);

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactList />} />
      </Routes>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModalHandler}
        contentLabel="Contact Form"
        className="modal"
        overlayClassName="overlay"
      >
        <ContactForm />
      </Modal>
    </Router>
  );
};

export default App;

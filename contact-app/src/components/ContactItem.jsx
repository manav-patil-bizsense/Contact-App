import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteContact, openModal } from '../Features/contacts/contactsSlice';
import '../styles/contactItem.css'; 
import ConfirmationModal from './ConfirmationModal';

const ContactItem = ({ contact }) => {
  const dispatch = useDispatch();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteContact(contact.id)).then(() => {
      setIsConfirmationModalOpen(false);
    }).catch(error => {
      console.error('Failed to delete contact:', error);
    });
  };

  const handleEdit = () => {
    dispatch(openModal(contact));
  };

  return (
    <>
      <li className="contact-item">
        <img src={contact.photoUrl || 'default-photo-url'} alt={contact.name} className="contact-photo" />
        <div className="contact-details">
          <p id="contact-name">{contact.name}</p>
          <p><strong>Ph.no.-</strong> {contact.mobile}</p>
          <p><strong>Mob.-</strong> {contact.secondaryMobile}</p>
          <p><strong>Email- </strong>{contact.email}</p>
        </div>
        <div className="contact-actions">
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={() => setIsConfirmationModalOpen(true)}>Delete</button>
        </div>
      </li>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onRequestClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${contact.name}? This action cannot be undone.`}
      />
    </>
  );
};

export default ContactItem;

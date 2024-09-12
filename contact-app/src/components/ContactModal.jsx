// src/components/ContactForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, updateContact, closeModal, fetchContacts } from '../Features/contacts/contactsSlice';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 
import '../app.css';


const ContactForm = () => {
  const dispatch = useDispatch();
  const { modalContact, isModalOpen } = useSelector((state) => state.contacts);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    secondaryMobile: '',
    email: '',
    photoUrl: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    secondaryMobile: '',
    email: '',
  });

  useEffect(() => {
    if (modalContact) {
      setFormData(modalContact);
    } else {
      setFormData({
        name: '',
        mobile: '',
        secondaryMobile: '',
        email: '',
        photoUrl: '',
      });
      setErrors({
        name: '',
        mobile: '',
        secondaryMobile: '',
        email: '',
      });
    }
  }, [modalContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (number) => {
    return number ? true : false;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    else if (!validatePhoneNumber(formData.mobile)) newErrors.mobile = 'Valid mobile number is required.';
    else if (!validatePhoneNumber(formData.secondaryMobile)) newErrors.secondaryMobile = 'Valid secondary mobile number is required.';
    else if (formData.mobile === formData.secondaryMobile) newErrors.secondaryMobile = 'Both mobile numbers cannot be the same.';
    else if (!formData.email) newErrors.email = 'Email is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (modalContact) {
      dispatch(updateContact({ ...formData, id: modalContact.id })).then(() => {
        dispatch(fetchContacts());
       
      });
    } else {
      dispatch(addContact(formData)).then(() => {
        dispatch(fetchContacts());
       
      });
    }
    dispatch(closeModal());
  };

  if (!isModalOpen) return null;

  return (
    <div>
      <button onClick={() => dispatch(closeModal())} className="modal-close-button">X</button>
      <h2>{modalContact ? 'Edit Contact' : 'Add Contact'}</h2>
      <form onSubmit={handleSubmit} className="modal-content">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile:</label>
          <PhoneInput
            id="mobile"
            name="mobile"
            placeholder="Enter phone number"
            value={formData.mobile}
            onChange={(value) => handlePhoneChange(value, 'mobile')}
            international
          />
          {errors.mobile && <p className="error-message">{errors.mobile}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="secondaryMobile">Secondary Mobile:</label>
          <PhoneInput
            id="secondaryMobile"
            name="secondaryMobile"
            placeholder="Enter phone number"
            value={formData.secondaryMobile}
            onChange={(value) => handlePhoneChange(value, 'secondaryMobile')}
            international
          />
          {errors.secondaryMobile && <p className="error-message">{errors.secondaryMobile}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="photoUrl">Photo URL:</label>
          <input
            type="text"
            id="photoUrl"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className={modalContact ? 'form-button update-button' : 'form-button add-button'}>
            {modalContact ? 'Update' : 'Add'} Contact
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

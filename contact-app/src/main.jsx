import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './Features/contacts/contactsSlice';
import App from './App';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/toastContainer.css";

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
  },
});

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer
        transition={Slide}
        autoClose={1000}
        ProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast-Container"
        position= 'bottom-right'
      />
  </Provider>
);

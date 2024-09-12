import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  deleteContact,
  setPageNumber,
  setPageSize,
  setSortBy,
  toggleDescending,
  setSearchQuery,
  openModal
} from "../Features/contacts/contactsSlice";
import ContactItem from "./ContactItem";
import "../styles/contactList.css";
import { FaSortAmountDown } from "react-icons/fa";
import { RiContactsFill } from "react-icons/ri";

const ContactList = () => {
  const dispatch = useDispatch();
  const {
    filteredContacts,
    status,
    searchQuery,
    pageNumber,
    pageSize,
    sortBy,
    descending,
    totalCount
  } = useSelector((state) => state.contacts);

  const [isSortMenuOpen, setSortMenuOpen] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    dispatch(fetchContacts({ pageNumber, pageSize, sortBy, descending }));
  }, [dispatch, pageNumber, pageSize, sortBy, descending]);

  const handleDelete = (id) => {
    dispatch(deleteContact(id));
  };

  const handleAddContact = () => {
    dispatch(openModal());
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handlePageChange = (newPageNumber) => {
    dispatch(setPageNumber(newPageNumber));
    dispatch(fetchContacts({ pageNumber: newPageNumber, pageSize, sortBy, descending }));
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    dispatch(setPageSize(newSize))
    dispatch(fetchContacts({ pageNumber: 1, pageSize: newSize, sortBy, descending }));
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      dispatch(toggleDescending());
    } else {
      dispatch(setSortBy(newSortBy));
      dispatch(fetchContacts({ pageNumber, pageSize, sortBy: newSortBy, descending: false }));
    }
    setSortMenuOpen(false);
  };

  return (
    <div className="contact-list-container">
      <div className="search-bar-container">
        <h2 id="main-heading">  <RiContactsFill  fontSize={30}/>  My Contacts</h2>
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <button className="add-contact-button" onClick={handleAddContact}>
          Add New Contact
        </button>
      </div>
        {/* Floating sort button */}
        <div className="floating-sort-button-container">
        <button
          className="floating-sort-button"
          onClick={() => setSortMenuOpen(!isSortMenuOpen)}
        >
          Sort by <FaSortAmountDown />
        </button>
        {isSortMenuOpen && (
          <div className="sort-dropdown">
            <button onClick={() => handleSortChange("name")}>
              Sort by Name
            </button>
            <button onClick={() => handleSortChange("mobile")}>
              Sort by Mobile
            </button>
          </div>
        )}
      </div>

      <div className="contact-list">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "succeeded" ? (
          filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))
          ) : (
            <p>No contacts found.</p>
          )
        ) : (
          <p>
            {status === "failed"
              ? "Failed to load contacts."
              : "No contacts available."}
          </p>
        )}
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span>Page {pageNumber} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages}
        >
          Next
        </button>
        <select onChange={handlePageSizeChange} value={pageSize}>
        <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default ContactList;

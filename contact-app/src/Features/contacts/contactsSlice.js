import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://localhost:7206/api/Contacts";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({ pageNumber = 1, pageSize = 10, sortBy = 'name', descending = false }) => {
    const response = await axios.get(API_URL, {
      params: { pageNumber, pageSize, sortBy, descending },
    });
    return response.data; 
  }  
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (newContact, { dispatch }) => {
    const response = await axios.post(API_URL, newContact);
    toast.success("Contact added successfully!");
    dispatch(fetchContacts({ pageNumber: 1, pageSize: 10 }));
    return response.data;
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id, { dispatch }) => {
    await axios.delete(`${API_URL}/${id}`);
    toast.error("Contact deleted successfully!");
    dispatch(fetchContacts({ pageNumber: 1, pageSize: 10 }));
    return id;
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async (updatedContact, { dispatch }) => {
    const response = await axios.put(
      `${API_URL}/${updatedContact.id}`,
      updatedContact
    );
    toast.success("Contact updated successfully!");
    dispatch(fetchContacts({ pageNumber: 1, pageSize: 10 }));
    return response.data;
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    filteredContacts: [],
    status: "idle",
    error: null,
    searchQuery: "",
    showFavorites: false,
    isModalOpen: false,
    modalContact: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name', 
    descending: false,
    totalCount: 0, // Add this
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredContacts = state.contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          contact.mobile.includes(action.payload) ||
          contact.secondaryMobile.includes(action.payload)
      );
    },
    openModal: (state, action) => {
      state.modalContact = action.payload || null;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContact = null;
    },
    toggleShowFavorites: (state) => {
      state.showFavorites = !state.showFavorites;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    toggleDescending: (state) => {
      state.descending = !state.descending;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload.contacts;
        
        state.filteredContacts = action.payload.contacts.filter(
          (contact) =>
            contact.name
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            contact.mobile.includes(state.searchQuery) ||
            contact.secondaryMobile.includes(state.searchQuery)
        );
        state.totalCount = action.payload.totalCount; // Set totalCount
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
        state.filteredContacts.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(
          (contact) => contact.id !== action.payload
        );
        state.filteredContacts = state.filteredContacts.filter(
          (contact) => contact.id !== action.payload
        );
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(
          (contact) => contact.id === action.payload.id
        );
        if (index >= 0) {
          state.contacts[index] = action.payload;
          state.filteredContacts[index] = action.payload;
        }
      });
  },
});

export const {
  setSearchQuery,
  openModal,
  closeModal,
  toggleShowFavorites,
  setPageNumber,
  setPageSize,
  setSortBy,
  toggleDescending
} = contactsSlice.actions;

export default contactsSlice.reducer;

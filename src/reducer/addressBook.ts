import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/configure';
import { AddressBookManagementState, AddressBookType, AddressManagementStep } from './type';

const initialState: AddressBookManagementState = {
  currentStep: AddressManagementStep.INIT,
  addresses: [],
  currentEditedWallet: null
};

const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState,
  reducers: {
    setCurrentAddressBookStep: (state, action: PayloadAction<AddressManagementStep>) => {
      state.currentStep = action.payload;
    },
    setAddressBookList: (state, action: PayloadAction<AddressBookType[]>) => {
      state.addresses = action.payload;
    },
    addAddressBookList: (state, action: PayloadAction<AddressBookType>) => {
      const newBook = {
        ...action.payload,
        id: state.addresses?.length
      };
      state.addresses = [...state.addresses, newBook];
    },
    editAddressBookList: (state, action: PayloadAction<AddressBookType>) => {
      const newList = state.addresses?.map((a) => {
        if (a.id === action.payload?.id) {
          return action.payload;
        }
        return a;
      });

      state.addresses = newList;
    },

    removeAddressBookItem: (state, action: PayloadAction<AddressBookType>) => {
      const newList = state.addresses?.filter((a) => a.id !== action.payload?.id);

      state.addresses = newList;
    },
    setEditedWallet: (state, action: PayloadAction<AddressBookType>) => {
      state.currentEditedWallet = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setCurrentAddressBookStep,
  setAddressBookList,
  addAddressBookList,
  editAddressBookList,
  removeAddressBookItem,
  setEditedWallet
} = addressBookSlice.actions;

export const selectCurrentAddressBookStep = (state: RootState): AddressManagementStep => state.addressBook.currentStep;
export const selectAddressBookList = (state: RootState): AddressBookType[] => state.addressBook.addresses;
export const selectEditedWallet = (state: RootState): AddressBookType => state.addressBook.currentEditedWallet;

export default addressBookSlice.reducer;

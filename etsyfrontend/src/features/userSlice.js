import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    shop: null,
    favorites : null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.shop = null;
      state.shopName=null;
     
    },
    delProfile:(state)=>{
      state.user=null;
    },

    updateUser: (state, action) => {
      state.user.shopName = action.payload.shopName;
    },
    updateshopImage:(state,action)=>{
      state.user.shopImage=action.payload.shopImage;
    },
    activeShop: (state, action) => {
      state.shop = action.payload.shopName;
    },
    favorites:(state,action) => {
    
    }
  },
});

export const { login, logout, activeShop, updateUser, updateshopImage,favorites,delProfile } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectShop = (state) => state.user.shop;


export default userSlice.reducer;

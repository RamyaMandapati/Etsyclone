// import { createSlice } from "@reduxjs/toolkit";

// export const productcartSlice = createSlice({
//   name: "cartitems",
//   initialState: {
//     cartproducts: [],
//   },
//   reducers: {
//     cartproductsList: (state, action) => {
//       state.cartproducts = action.payload;
//     },
//     removecartProductsState: (state) => {
//       state.cartproducts = [];
//     },
//     updatecartProducts: (state, action) => {
//        if(state.cartproducts!=null){
//          state.cartproducts.push(action.payload);
//       }
//       else{
//         state.cartproducts=action.payload;
//       }
      
//     },
   
    
   
//   },
// });

// export const {
//   cartproductsList,
//   removecartProductsState,
//   updatecartProducts,

// } = productcartSlice.actions;

// export const getcartProducts = (state) => state.cart.cartproducts;

// export default productcartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export const cartItemsSlice = createSlice({
  name: "cartItems",
  initialState: {
    cartItems: [],
    finalCart: [],
  },
  reducers: {
    // by id
    createCartItem: (state, action) => {  
      const exist = state.cartItems.findIndex(
        (ele) => ele.itemId === action.payload.itemId
      );
      console.log(exist + "----------------------------: exist");
      if (exist !== -1) {
        state.cartItems[exist] = {
          ...state.cartItems[exist],
          ...action.payload,
        };
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removecartProductsState: (state) => {
            state.cartItems = [];
          },
    removeCartItem: (state, action) => {
      console.log("----------------------------: deleted" + action.payload);
      let index = state.cartItems.findIndex(
        ({ id }) => id === action.payload.id
      );
      state.cartItems.splice(index, 1);
      // state.cartItems.splice(action.payload, 1);
      // const item = state.cartItems.filter(
      //   (ele) => ele.itemId === action.payload
      // );
      //   state.cartProducts = null;
      // console.log(item + "----------------------------: deleted");
    },
    updateCartItem: (state, action) => {
      state.cartItems = action.payload;
    },

    createFinalCart: (state, action) => {
      const exist = state.cartItems.findIndex(
        (ele) => ele.itemId === action.payload.itemId
      );
      console.log(exist + "----------------------------: exist");
      if (exist !== -1) {
        state.cartItems[exist] = {
          ...state.cartItems[exist],
          ...action.payload,
        };
      } else {
        state.cartItems.push(action.payload);
      }
    },
  },
});

export const {
  createCartItem,
  removeCartItem,
  updateCartItem,
  createFinalCart,
  removecartProductsState,
} = cartItemsSlice.actions;

export const getCartItems = (state) => state.cart.cartItems;
export const getFinalCart = (state) => state.cart.finalCart;

export default cartItemsSlice.reducer;
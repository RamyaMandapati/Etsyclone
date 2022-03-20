import { createStore, combineReducers } from "redux";
import userReducer from "../features/userSlice";
import productReducer from "../features/productSlice";
import cartproductreducer from "../features/cartItemsSlice";
import {
  persistStore,
  persistCombineReducers,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "persist-key100",
  storage,
};

const reducer = combineReducers({ user: userReducer, product: productReducer,cart:cartproductreducer});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);

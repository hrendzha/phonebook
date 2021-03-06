import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from 'services/api';
import authReducer from './auth/authSlice';
import alertReducer from './alert/alertSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: persistReducer(authPersistConfig, authReducer),
    alert: alertReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    api.middleware,
  ],
});

setupListeners(store.dispatch);

const persistor = persistStore(store);

export { store, persistor };

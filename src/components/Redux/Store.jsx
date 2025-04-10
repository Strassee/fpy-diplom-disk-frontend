import { compose } from "redux";
import userReducer from './userReducer';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import { createStateSyncMiddleware, initMessageListener, withReduxStateSync, initStateWithPrevTab } from "redux-state-sync";


const reduxStateSyncConfig = {
  blacklist: [PERSIST, PURGE],
};

const ReactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const persistConfig = {
  key: 'root',
  storage: storageSession,
  stateReconciler: autoMergeLevel1,
  whitelist: ['user']
}

const rootReducer = withReduxStateSync(combineReducers({
  user: userReducer,
}));

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      createStateSyncMiddleware(reduxStateSyncConfig),
      /* other middlewares */
    )
  },
  undefined,
  compose(
    ReactReduxDevTools,
  ));

export const persistor = persistStore(store);

export default () => {
  return { store, persistor }
}

initStateWithPrevTab(store);

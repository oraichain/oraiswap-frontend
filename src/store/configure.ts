import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import configReducer, { getDefaultNetwork } from '../reducer/config';
import tokenReducer from '../reducer/token';
import { PERSIST_CONFIG_KEY } from './constants';

const migrations = {
  // Migration for version 1: remove filterNetwork, persistVersion key and add fromNetwork key
  2: (state) => {
    const { filterNetwork, persistVersion, ...rest } = state.config;
    return {
      ...state,
      config: {
        ...rest,
        fromNetwork: getDefaultNetwork()
      }
    };
  }
};

const rootPersistConfig = {
  key: PERSIST_CONFIG_KEY,
  storage,
  version: 2,
  migrate: (state, version) => {
    if (version !== state._persist.version) {
      // Perform migration
      return Promise.resolve(migrations[version](state));
    }
    return Promise.resolve(state);
  }
};

const rootReducer = combineReducers({
  config: configReducer,
  token: tokenReducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

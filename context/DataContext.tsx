// context/DataContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

type State = {
  user: any | null;
  liveStreams: any[];
  vodStreams: any[];
  seriesStreams: any[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_LIVE'; payload: any[] }
  | { type: 'SET_VOD'; payload: any[] }
  | { type: 'SET_SERIES'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: State = {
  user: null,
  liveStreams: [],
  vodStreams: [],
  seriesStreams: [],
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LIVE':
      return { ...state, liveStreams: action.payload };
    case 'SET_VOD':
      return { ...state, vodStreams: action.payload };
    case 'SET_SERIES':
      return { ...state, seriesStreams: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const DataContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Charger données stockées localement au démarrage
  useEffect(() => {
    async function loadData() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const savedUser = await AsyncStorage.getItem('@user');
        const savedLive = await AsyncStorage.getItem('@liveStreams');
        const savedVod = await AsyncStorage.getItem('@vodStreams');
        const savedSeries = await AsyncStorage.getItem('@seriesStreams');

        if (savedUser) dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
        if (savedLive) dispatch({ type: 'SET_LIVE', payload: JSON.parse(savedLive) });
        if (savedVod) dispatch({ type: 'SET_VOD', payload: JSON.parse(savedVod) });
        if (savedSeries) dispatch({ type: 'SET_SERIES', payload: JSON.parse(savedSeries) });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: 'Erreur chargement local' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    loadData();
  }, []);

  // Sauvegarder les données en local à chaque update
  useEffect(() => {
    async function saveData() {
      try {
        if(state.user) await AsyncStorage.setItem('@user', JSON.stringify(state.user));
        await AsyncStorage.setItem('@liveStreams', JSON.stringify(state.liveStreams));
        await AsyncStorage.setItem('@vodStreams', JSON.stringify(state.vodStreams));
        await AsyncStorage.setItem('@seriesStreams', JSON.stringify(state.seriesStreams));
      } catch (e) {
        // Ignorer ou logguer
      }
    }
    saveData();
  }, [state.user, state.liveStreams, state.vodStreams, state.seriesStreams]);

  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData doit être utilisé dans DataProvider');
  return context;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

type Credentials = {
  username: string;
  password: string;
} | null;

type State = {
  user: any | null;
  liveStreams: any[];
  vodStreams: any[];
  seriesStreams: any[];
  loading: boolean;
  error: string | null;
  credentials: Credentials;
};

type Action =
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_LIVE'; payload: any[] }
  | { type: 'SET_VOD'; payload: any[] }
  | { type: 'SET_SERIES'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CREDENTIALS'; payload: Credentials }
  | { type: 'RESET' };

const initialState: State = {
  user: null,
  liveStreams: [],
  vodStreams: [],
  seriesStreams: [],
  loading: false,
  error: null,
  credentials: null,
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
    case 'SET_CREDENTIALS':
      return { ...state, credentials: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const DataContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function init() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const portalsStr = await AsyncStorage.getItem('@portals');
        const portals = portalsStr ? JSON.parse(portalsStr) : [];
        if (portals.length === 0) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        const portal = portals[0];
        const { url, username, password } = portal;

        dispatch({ type: 'SET_CREDENTIALS', payload: { username, password } });

        const baseUrl = url.startsWith('http') ? url : `http://${url}`;
        const accountInfoUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_account_info`;
        const accountRes = await fetch(accountInfoUrl);
        if (!accountRes.ok) throw new Error('Erreur réseau');
        const accountData = await accountRes.json();

        if (!accountData?.user_info?.status || accountData.user_info.status.toLowerCase() !== 'active') {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        dispatch({ type: 'SET_USER', payload: accountData.user_info });

        const [
          liveRes,
          vodRes,
          seriesRes,
          liveCatsRes,
          vodCatsRes,
          seriesCatsRes,
        ] = await Promise.all([
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams`),
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_vod_streams`),
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_series`),
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_categories`),
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_vod_categories`),
          fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_series_categories`),
        ]);

        if (
          !liveRes.ok ||
          !vodRes.ok ||
          !seriesRes.ok ||
          !liveCatsRes.ok ||
          !vodCatsRes.ok ||
          !seriesCatsRes.ok
        ) {
          throw new Error('Erreur récupération des flux ou catégories');
        }

        const liveData = await liveRes.json();
        const vodData = await vodRes.json();
        const seriesData = await seriesRes.json();
        const liveCats = await liveCatsRes.json();
        const vodCats = await vodCatsRes.json();
        const seriesCats = await seriesCatsRes.json();

        const mapCategory = (items: any[], categories: any[]) => {
          return items.map(item => {
            const category = categories.find(cat => cat.category_id === item.category_id);
            return {
              ...item,
              category_name: category?.category_name || 'Inconnu',
            };
          });
        };

        dispatch({ type: 'SET_LIVE', payload: mapCategory(liveData, liveCats) });
        dispatch({ type: 'SET_VOD', payload: mapCategory(vodData, vodCats) });
        dispatch({ type: 'SET_SERIES', payload: mapCategory(seriesData, seriesCats) });
      } catch (e) {
        console.error('Erreur init portail:', e);
        dispatch({ type: 'SET_ERROR', payload: 'Erreur chargement initial' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    init();
  }, []);

  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData doit être utilisé dans DataProvider');
  return context;
}

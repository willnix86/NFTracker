import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { StoredItemKey } from '../types';

type AnyObject = { [key: string]: any }
type StoredItem = string | AnyObject | null;

export default function useAsyncStorage(key: StoredItemKey): [StoredItem, (item: StoredItem) => void, string] {
  const [storedItem, setStoredItem] = useState<StoredItem>(null);
  const [storageError, setStorageError] = useState<string>('');

  useEffect(() => {
    getItem();
  }, [])

  const storeItem = async (value: StoredItem) => {
    try {
      if (typeof value === 'string') {
        await AsyncStorage.setItem(`@${key}`, value);
        setStoredItem(value);
      } else {
        await AsyncStorage.setItem(`@${key}`, JSON.stringify(value));
        setStoredItem(value);
      }
    } catch (e) {
      setStorageError(`Error saving ${key}`);
    }
  }

  const getItem = async () => {
    try {
      switch (key) {
        case 'artists':
          const artists = await AsyncStorage.getItem('@artists');
          setStoredItem(artists ? JSON.parse(artists) : []);
          break;
        default:
          setStorageError(`Error getting ${key}`);
          break;
      }
    } catch (e) {
      setStorageError(`Error fetching ${key}`);
    }
  }  

  return [storedItem, storeItem, storageError];
}

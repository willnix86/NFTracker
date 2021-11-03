import * as React from 'react';
import { StyleSheet } from 'react-native';

import AddArtistForm from '../components/forms/AddArtistForm';
import Modal from '../components/Modal';

export default function AddArtistScreen() {
  return (
    <Modal><AddArtistForm /></Modal>
  );
}
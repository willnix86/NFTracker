import * as React from 'react';

import AddArtistForm from '../components/forms/AddArtistForm';
import Modal from '../components/Modal';

export default function AddArtistScreen() {
  return (
    <Modal><AddArtistForm /></Modal>
  );
}
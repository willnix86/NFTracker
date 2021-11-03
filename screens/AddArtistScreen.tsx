import * as React from 'react';

import AddArtistForm from '../components/modals/AddArtistForm';
import Modal from '../components/Modal';

export default function AddArtistScreen() {
  return (
    <Modal><AddArtistForm /></Modal>
  );
}
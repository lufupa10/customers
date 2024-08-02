import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress
} from '@mui/material';
import { updateClient, uploadImage } from '../api/Api';

interface Client {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
}

interface EditClientModalProps {
  open: boolean;
  client: Client;
  onClose: () => void;
  onSave: () => void;
}

const ClientSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const EditClientModal: React.FC<EditClientModalProps> = ({ open, client, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(client.avatar);

  const handleSubmit = async (values: { name: string }) => {
    try {
      await updateClient(client.id, { ...values, avatar });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating client', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const secureUrl = await uploadImage(file, 'lookme', 'dfdv5x011');
      setAvatar(secureUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image', error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Cliente</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ name: client.name }}
          validationSchema={ClientSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <TextField
                label="ID"
                fullWidth
                margin="dense"
                value={client.id}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Data/Hora de Criação"
                fullWidth
                margin="dense"
                value={client.createdAt}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Field
                name="name"
                as={TextField}
                label="Nome"
                fullWidth
                margin="dense"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <Button variant="contained" component="label">
                Upload Avatar
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
              {loading && <CircularProgress size={24} />}
              {avatar && <img src={avatar} alt="Avatar" style={{ width: '100%', marginTop: '10px' }} />}
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancelar
                </Button>
                <Button type="submit" color="primary">
                  Salvar
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
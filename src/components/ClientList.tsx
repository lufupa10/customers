import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Container,
  Typography
} from '@mui/material';
import EditClientModal from './EditClientModal';
import { fetchClients } from '../api/Api';

interface Client {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [open, setOpen] = useState(false);

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients', error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Clientes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data/Hora de criação</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{new Date(client.createdAt).toLocaleString()}</TableCell>
                <TableCell><Avatar src={client.avatar} /></TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(client)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedClient && (
        <EditClientModal
          open={open}
          client={selectedClient}
          onClose={handleClose}
          onSave={loadClients}
        />
      )}
    </Container>
  );
};

export default ClientList;
import axios from 'axios';

// IMPORTANTE: Substitua pelo IP da sua máquina na rede local
// Para descobrir: Windows (ipconfig), Mac/Linux (ifconfig)
// Exemplo: http://192.168.1.100:3000
const API_URL = 'http://192.168.15.179:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registrosAPI = {
  // GET - Listar todos
  listar: async () => {
    const response = await api.get('/registros');
    return response.data;
  },

  // GET - Buscar por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/registros/${id}`);
    return response.data;
  },

  // POST - Criar novo
  criar: async (registro) => {
    const response = await api.post('/registros', registro);
    return response.data;
  },

  // PUT - Atualizar
  atualizar: async (id, registro) => {
    const response = await api.put(`/registros/${id}`, registro);
    return response.data;
  },

  // DELETE - Deletar
  deletar: async (id) => {
    const response = await api.delete(`/registros/${id}`);
    return response.data;
  },
};

export default api;
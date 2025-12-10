import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';


const API_URL = 'http://192.168.15.179:3000/registros';

export default function RegistrosScreen({ navigation }) {
  const [lista, setLista] = useState([]);
  const isFocused = useIsFocused();

  const carregarRegistros = async () => {
    try {
      const response = await axios.get(API_URL);
      setLista(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os registros.');
    }
  };

 
  useEffect(() => {
    if (isFocused) {
      carregarRegistros();
    }
  }, [isFocused]);

  const handleDeletar = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert('Sucesso', 'Registro deletado!');
      carregarRegistros(); // Atualiza a lista
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar.');
    }
  };

  const renderItem = ({ item }) => {
    const formatarEndereco = (end) => {
      if (!end) return 'Localização não identificada';
      
      const partes = end.split(',');
      if (partes.length >= 3) {
        return `${partes[0]} - ${partes[2]}`;
      }
      return partes[0];
    };

    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>{item.nome}, {item.idade} anos</Text>
        <Text style={styles.info}>Temperatura: <Text style={{fontWeight: 'bold'}}>{item.temperatura}°C</Text></Text>

        <Text style={styles.endereco}>
          📍 {item.localizacao && item.localizacao.endereco 
                ? formatarEndereco(item.localizacao.endereco)
                : 'Localização não identificada'}
        </Text>
  
        <Text style={styles.info}>Tomou remédio: {item.tomouRemedio.toUpperCase()}</Text>
  
        <View style={styles.acoes}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnEditar]} 
            onPress={() => navigation.navigate('Editar', { registro: item })}
          >
            <Text style={styles.btnTexto}>EDITAR</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={[styles.btn, styles.btnExcluir]} 
            onPress={() => {
              Alert.alert(
                'Confirmar Exclusão',
                `Deseja apagar o registro de ${item.nome}?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Apagar', onPress: () => handleDeletar(item.id), style: 'destructive' }
                ]
              );
            }}
          >
            <Text style={[styles.btnTexto, { color: '#fff' }]}>EXCLUIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={lista}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum registro encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f0f2f5' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#0d6efd', marginBottom: 5 },
  info: { fontSize: 14, marginBottom: 3, color: '#333' },
  endereco: { fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 8 },
  acoes: { flexDirection: 'row', gap: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  btn: { flex: 1, padding: 10, borderRadius: 6, alignItems: 'center' },
  btnEditar: { backgroundColor: '#ffc107' },
  btnExcluir: { backgroundColor: '#dc3545' },
  btnTexto: { fontWeight: 'bold', fontSize: 12 },
  vazio: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});
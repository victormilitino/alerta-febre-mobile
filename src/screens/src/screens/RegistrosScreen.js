import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { registrosAPI } from '../services/api';

export default function RegistrosScreen({ navigation }) {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const carregarRegistros = async () => {
    try {
      setCarregando(true);
      const dados = await registrosAPI.listar();
      setRegistros(dados);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os registros');
    } finally {
      setCarregando(false);
    }
  };

  const atualizarLista = async () => {
    try {
      setAtualizando(true);
      const dados = await registrosAPI.listar();
      setRegistros(dados);
    } catch (error) {
      console.error('Erro ao atualizar registros:', error);
    } finally {
      setAtualizando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarRegistros();
    }, [])
  );

  const handleDeletar = (id, nome) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja deletar o registro de "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await registrosAPI.deletar(id);
              Alert.alert('Sucesso', 'Registro deletado com sucesso!');
              carregarRegistros();
            } catch (error) {
              console.error('Erro ao deletar:', error);
              Alert.alert('Erro', 'Não foi possível deletar o registro');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.nome}, {item.idade} anos
        </Text>
        <Text style={styles.temperatura}>
          Temperatura: <Text style={styles.temperaturaValor}>{item.temperatura}°C</Text>
        </Text>

        {item.localizacao && (
          <Text style={styles.localizacao}>
            {item.localizacao.endereco
              ? `Local: ${item.localizacao.endereco}`
              : `Coords: ${item.localizacao.latitude.toFixed(4)}, ${item.localizacao.longitude.toFixed(4)}`}
          </Text>
        )}

        <Text style={styles.info}>
          Tomou remédio: <Text style={styles.infoBold}>{item.tomouRemedio.toUpperCase()}</Text>
        </Text>

        {item.tomouRemedio === 'sim' && item.remedio && (
          <View style={styles.remedioContainer}>
            <Text style={styles.remedioTitle}>Detalhes do Remédio</Text>
            <Text style={styles.remedioInfo}>Nome: {item.remedio.nome}</Text>
            <Text style={styles.remedioInfo}>Dosagem: {item.remedio.dosagem}</Text>
            <Text style={styles.remedioInfo}>Horário: {item.remedio.hora}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('Editar', { id: item.id })}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeletar(item.id, item.nome)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text style={styles.loadingText}>Carregando registros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.novoButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.novoButtonText}>+ Novo Registro</Text>
      </TouchableOpacity>

      {registros.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={registros}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={atualizarLista} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  novoButton: {
    backgroundColor: '#0d6efd',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  novoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  temperatura: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  temperaturaValor: {
    fontWeight: 'bold',
    color: '#0d6efd',
  },
  localizacao: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  infoBold: {
    fontWeight: 'bold',
  },
  remedioContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 5,
    marginTop: 12,
  },
  remedioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  remedioInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ffc107',
    borderBottomLeftRadius: 8,
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderBottomRightRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
});
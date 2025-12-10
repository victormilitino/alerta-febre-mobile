import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { registrosAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [tomouRemedio, setTomouRemedio] = useState('');
  const [nomeRemedio, setNomeRemedio] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [hora, setHora] = useState('');
  const [carregando, setCarregando] = useState(false);

  const obterLocalizacao = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à localização');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocoding
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let endereco = null;

      if (geocode && geocode.length > 0) {
        const { street, city, region, country } = geocode[0];
        endereco = `${street || ''}, ${city || ''}, ${region || ''}, ${country || ''}`.trim();
      }

      return {
        latitude,
        longitude,
        endereco,
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!nome || !idade || !temperatura || !tomouRemedio) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setCarregando(true);

    try {
      const localizacao = await obterLocalizacao();

      const novoRegistro = {
        nome,
        idade,
        temperatura,
        tomouRemedio,
        remedio: tomouRemedio === 'sim' ? { nome: nomeRemedio, dosagem, hora } : null,
        localizacao,
      };

      await registrosAPI.criar(novoRegistro);

      Alert.alert('Sucesso', 'Registro salvo com sucesso!');

      // Limpar campos
      setNome('');
      setIdade('');
      setTemperatura('');
      setTomouRemedio('');
      setNomeRemedio('');
      setDosagem('');
      setHora('');
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      Alert.alert('Erro', 'Não foi possível salvar o registro. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Saúde acompanhada com carinho.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do usuário</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          editable={!carregando}
        />

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          placeholder="Idade"
          keyboardType="numeric"
          value={idade}
          onChangeText={setIdade}
          editable={!carregando}
        />

        <Text style={styles.label}>Qual a temperatura?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 37.5"
          keyboardType="decimal-pad"
          value={temperatura}
          onChangeText={setTemperatura}
          editable={!carregando}
        />

        <Text style={styles.label}>Tomou remédio?</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, tomouRemedio === 'sim' && styles.radioSelected]}
            onPress={() => setTomouRemedio('sim')}
            disabled={carregando}
          >
            <Text style={[styles.radioText, tomouRemedio === 'sim' && styles.radioTextSelected]}>
              Sim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton, tomouRemedio === 'nao' && styles.radioSelected]}
            onPress={() => setTomouRemedio('nao')}
            disabled={carregando}
          >
            <Text style={[styles.radioText, tomouRemedio === 'nao' && styles.radioTextSelected]}>
              Não
            </Text>
          </TouchableOpacity>
        </View>

        {tomouRemedio === 'sim' && (
          <>
            <Text style={styles.label}>Qual o nome do remédio?</Text>
            <TextInput
              style={styles.input}
              placeholder="Remédio"
              value={nomeRemedio}
              onChangeText={setNomeRemedio}
              editable={!carregando}
            />

            <Text style={styles.label}>Qual a dosagem?</Text>
            <TextInput
              style={styles.input}
              placeholder="Dosagem"
              value={dosagem}
              onChangeText={setDosagem}
              editable={!carregando}
            />

            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 14:30"
              value={hora}
              onChangeText={setHora}
              editable={!carregando}
            />
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation.navigate('Registros')}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>VER REGISTROS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSubmit}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SUBMETER</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#0d6efd',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
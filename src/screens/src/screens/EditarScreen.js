import React, { useState, useEffect } from 'react';
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
import { registrosAPI } from '../services/api';

export default function EditarScreen({ route, navigation }) {
  const { id } = route.params;

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [tomouRemedio, setTomouRemedio] = useState('');
  const [nomeRemedio, setNomeRemedio] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [hora, setHora] = useState('');
  const [localizacaoOriginal, setLocalizacaoOriginal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarRegistro();
  }, [id]);

  const carregarRegistro = async () => {
    try {
      const registro = await registrosAPI.buscarPorId(id);

      setNome(registro.nome);
      setIdade(registro.idade.toString());
      setTemperatura(registro.temperatura.toString());
      setTomouRemedio(registro.tomouRemedio);
      setLocalizacaoOriginal(registro.localizacao);

      if (registro.tomouRemedio === 'sim' && registro.remedio) {
        setNomeRemedio(registro.remedio.nome);
        setDosagem(registro.remedio.dosagem);
        setHora(registro.remedio.hora);
      }

      setCarregando(false);
    } catch (error) {
      console.error('Erro ao carregar registro:', error);
      Alert.alert('Erro', 'Não foi possível carregar o registro');
      navigation.goBack();
    }
  };

  const handleSalvar = async () => {
    if (!nome || !idade || !temperatura || !tomouRemedio) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setSalvando(true);

    try {
      const registroAtualizado = {
        nome,
        idade,
        temperatura,
        tomouRemedio,
        remedio: tomouRemedio === 'sim' ? { nome: nomeRemedio, dosagem, hora } : null,
        localizacao: localizacaoOriginal,
      };

      await registrosAPI.atualizar(id, registroAtualizado);

      Alert.alert('Sucesso', 'Registro atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o registro');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Editando Registro de: {nome}</Text>

        <Text style={styles.label}>Nome do usuário</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          editable={!salvando}
        />

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={idade}
          onChangeText={setIdade}
          editable={!salvando}
        />

        <Text style={styles.label}>Qual a temperatura?</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={temperatura}
          onChangeText={setTemperatura}
          editable={!salvando}
        />

        <Text style={styles.label}>Tomou remédio?</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, tomouRemedio === 'sim' && styles.radioSelected]}
            onPress={() => setTomouRemedio('sim')}
            disabled={salvando}
          >
            <Text style={[styles.radioText, tomouRemedio === 'sim' && styles.radioTextSelected]}>
              Sim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.radioButton, tomouRemedio === 'nao' && styles.radioSelected]}
            onPress={() => setTomouRemedio('nao')}
            disabled={salvando}
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
              value={nomeRemedio}
              onChangeText={setNomeRemedio}
              editable={!salvando}
            />

            <Text style={styles.label}>Qual a dosagem?</Text>
            <TextInput
              style={styles.input}
              value={dosagem}
              onChangeText={setDosagem}
              editable={!salvando}
            />

            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 14:30"
              value={hora}
              onChangeText={setHora}
              editable={!salvando}
            />
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation.goBack()}
            disabled={salvando}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SALVAR</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
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
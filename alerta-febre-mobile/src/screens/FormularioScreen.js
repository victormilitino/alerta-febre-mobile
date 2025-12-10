import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

// ⚠️ IMPORTANTE: TROQUE PELO SEU IP
const API_URL = 'http://192.168.15.179:3000/registros'; 

export default function FormularioScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [tomouRemedio, setTomouRemedio] = useState(null);
  const [nomeRemedio, setNomeRemedio] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome || !idade || !temperatura || !tomouRemedio) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    // 1. Permissão e Captura de Localização
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // 2. Geocodificação Reversa (Transformar lat/long em endereço)
    let enderecoFormatado = null;
    try {
      const responseGeo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
      const dataGeo = await responseGeo.json();
      if (dataGeo.display_name) enderecoFormatado = dataGeo.display_name;
    } catch (e) {
      console.log("Erro ao buscar endereço:", e);
    }

    // 3. Objeto para salvar
    const novoRegistro = {
      nome,
      idade,
      temperatura,
      tomouRemedio,
      remedio: tomouRemedio === 'sim' ? { nome: nomeRemedio, dosagem, hora } : null,
      localizacao: { latitude, longitude, endereco: enderecoFormatado }
    };

    // 4. Envio para o Backend
    try {
      await axios.post(API_URL, novoRegistro);
      Alert.alert('Sucesso', 'Registro salvo com sucesso!');
      
      // Limpar campos
      setNome(''); setIdade(''); setTemperatura(''); setTomouRemedio(null);
      setNomeRemedio(''); setDosagem(''); setHora('');
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do usuário</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: João Silva" />

      <Text style={styles.label}>Idade</Text>
      <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

      <Text style={styles.label}>Temperatura (°C)</Text>
      <TextInput style={styles.input} value={temperatura} onChangeText={setTemperatura} keyboardType="numeric" placeholder="Ex: 37.5" />

      <Text style={styles.label}>Tomou remédio?</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity 
          style={[styles.radioButton, tomouRemedio === 'sim' && styles.radioSelected]} 
          onPress={() => setTomouRemedio('sim')}>
          <Text style={tomouRemedio === 'sim' ? styles.textSelected : styles.textNormal}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.radioButton, tomouRemedio === 'nao' && styles.radioSelected]} 
          onPress={() => setTomouRemedio('nao')}>
          <Text style={tomouRemedio === 'nao' ? styles.textSelected : styles.textNormal}>Não</Text>
        </TouchableOpacity>
      </View>

      {tomouRemedio === 'sim' && (
        <View style={styles.remedioContainer}>
          <Text style={styles.label}>Nome do remédio</Text>
          <TextInput style={styles.input} value={nomeRemedio} onChangeText={setNomeRemedio} />
          <Text style={styles.label}>Dosagem</Text>
          <TextInput style={styles.input} value={dosagem} onChangeText={setDosagem} />
          <Text style={styles.label}>Horário</Text>
          <TextInput style={styles.input} value={hora} onChangeText={setHora} placeholder="00:00" />
        </View>
      )}

      <View style={styles.btnContainer}>
        <Button title={loading ? "Salvando..." : "ENVIAR REGISTRO"} onPress={handleSubmit} disabled={loading} />
        <Button title="VER REGISTROS" color="#6c757d" onPress={() => navigation.navigate('Registros')} />
      </View>
    </ScrollView>
  );
}

// Reutilize os styles do EditarRegistroScreen ou crie novos aqui
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 12, marginTop: 5, fontSize: 16 },
  radioContainer: { flexDirection: 'row', gap: 15, marginTop: 10 },
  radioButton: { padding: 12, borderWidth: 1, borderColor: '#0d6efd', borderRadius: 5, flex: 1, alignItems: 'center' },
  radioSelected: { backgroundColor: '#0d6efd' },
  textSelected: { color: '#fff', fontWeight: 'bold' },
  textNormal: { color: '#0d6efd' },
  remedioContainer: { marginTop: 10, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 5 },
  btnContainer: { marginTop: 30, gap: 15, marginBottom: 30 }
});
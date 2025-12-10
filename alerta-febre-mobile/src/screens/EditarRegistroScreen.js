import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';


const API_URL = 'http://192.168.15.179:3000/registros'; 

export default function EditarRegistroScreen({ route, navigation }) {

  const { registro } = route.params;

  const [nome, setNome] = useState(registro.nome);
  const [idade, setIdade] = useState(String(registro.idade));
  const [temperatura, setTemperatura] = useState(String(registro.temperatura));
  const [tomouRemedio, setTomouRemedio] = useState(registro.tomouRemedio);
  
  const [nomeRemedio, setNomeRemedio] = useState(registro.remedio ? registro.remedio.nome : '');
  const [dosagem, setDosagem] = useState(registro.remedio ? registro.remedio.dosagem : '');
  const [hora, setHora] = useState(registro.remedio ? registro.remedio.hora : '');

  const handleUpdate = async () => {
    const dadosAtualizados = {
      nome,
      idade,
      temperatura,
      tomouRemedio,
      remedio: tomouRemedio === 'sim' ? { nome: nomeRemedio, dosagem, hora } : null,
      localizacao: registro.localizacao 
    };

    try {
      await axios.put(`${API_URL}/${registro.id}`, dadosAtualizados);
      Alert.alert('Sucesso', 'Registro atualizado!');
      navigation.navigate('Registros', { refresh: true });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao atualizar registro.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Editando: {registro.nome}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Idade</Text>
      <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

      <Text style={styles.label}>Temperatura</Text>
      <TextInput style={styles.input} value={temperatura} onChangeText={setTemperatura} keyboardType="numeric" />

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
          <TextInput style={styles.input} value={hora} onChangeText={setHora} />
        </View>
      )}

      <View style={styles.btnContainer}>
        <Button title="Cancelar" color="#6c757d" onPress={() => navigation.goBack()} />
        <Button title="Salvar Alterações" onPress={handleUpdate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f2f5', flexGrow: 1 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, color: '#555' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 5, padding: 12, marginTop: 5, fontSize: 16 },
  radioContainer: { flexDirection: 'row', gap: 15, marginTop: 10 },
  radioButton: { padding: 12, borderWidth: 1, borderColor: '#0d6efd', borderRadius: 5, flex: 1, alignItems: 'center', backgroundColor: '#fff' },
  radioSelected: { backgroundColor: '#0d6efd' },
  textSelected: { color: '#fff', fontWeight: 'bold' },
  textNormal: { color: '#0d6efd' },
  remedioContainer: { marginTop: 10, padding: 10, backgroundColor: '#e9ecef', borderRadius: 8 },
  btnContainer: { marginTop: 30, flexDirection: 'column', gap: 15, marginBottom: 30 }
});
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addTransaction } from '../services/transactionService';
import { auth } from '../firebaseConfig';

export default function TransactionScreen({ navigation }: any) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('alimentacao');
  const [tipo, setTipo] = useState('saida');

  const handleSalvar = async () => {
    if (!valor || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const transacao = {
      valor: parseFloat(valor.replace(',', '.')) || 0,
      descricao,
      categoria,
      tipo,
      userId: auth.currentUser?.uid,
      date: new Date(),
    };

    try {
      await addTransaction(transacao);
      Alert.alert('Sucesso', 'Transação salva!');

      setValor('');
      setDescricao('');
      setCategoria('alimentacao');
      setTipo('saida');

      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Erro ao salvar transação');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Transação</Text>
      <TextInput
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        style={styles.input}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <Text style={styles.label}>Categoria</Text>
      <Picker selectedValue={categoria} onValueChange={setCategoria} style={styles.input}>
        <Picker.Item label="Alimentação" value="alimentacao" />
        <Picker.Item label="Despesas" value="Despesas" />
        <Picker.Item label="Transporte" value="transporte" />
        <Picker.Item label="Educação" value="educacao" />
        <Picker.Item label="Outros" value="outros" />
      </Picker>
      <Text style={styles.label}>Tipo</Text>
      <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.input}>
        <Picker.Item label="Saída" value="saida" />
        <Picker.Item label="Entrada" value="entrada" />
      </Picker>
      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  label: { fontSize: 16, marginBottom: 5, marginTop: 10 },
});

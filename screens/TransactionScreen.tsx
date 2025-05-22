import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addTransaction } from '../services/transactionService';
import { auth } from '../firebaseConfig';
import ImageUploadComponent from '../components/ImageUploadComponent';
import styles from '../styles/TransactionScreenStyles'; 

interface ErrorMessages {
  valor: string;
  categoria: string;
  tipo: string;
}

export default function TransactionScreen({ navigation }: any) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('alimentacao');
  const [tipo, setTipo] = useState('saida');
  const [comprovanteUrl, setComprovanteUrl] = useState<string | null>(null);

  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    valor: '',
    categoria: '',
    tipo: '',
  });

  const validateFields = () => {
    let valid = true;
    let newErrorMessages: ErrorMessages = {
      valor: '',
      categoria: '',
      tipo: '',
    };

    if (!valor.trim()) {
      newErrorMessages.valor = 'O campo "Valor" é obrigatório.';
      valid = false;
    }

    if (!categoria) {
      newErrorMessages.categoria = 'O campo "Categoria" é obrigatório.';
      valid = false;
    }

    if (!tipo) {
      newErrorMessages.tipo = 'O campo "Tipo" é obrigatório.';
      valid = false;
    }

    setErrorMessages(newErrorMessages);
    return valid;
  };

  const handleSalvar = async () => {
    if (!validateFields()) {
      return; 
    }

    const transacao = {
      valor: parseFloat(valor.replace(',', '.')) || 0,
      descricao,
      categoria,
      tipo,
      comprovanteUrl, 
      userId: auth.currentUser?.uid,
      date: new Date(),
    };

    try {
      await addTransaction(transacao);
      setValor('');
      setDescricao('');
      setCategoria('alimentacao');
      setTipo('saida');
      setComprovanteUrl(null);

      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Transação</Text>

      <TextInput
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        style={styles.input}
      />
      {errorMessages.valor ? (
        <Text style={styles.errorText}>{errorMessages.valor}</Text>
      ) : null}

      <Text style={styles.label}>Categoria</Text>
      <Picker selectedValue={categoria} onValueChange={setCategoria} style={styles.input}>
        <Picker.Item label="Alimentação" value="alimentacao" />
        <Picker.Item label="Despesas" value="Despesas" />
        <Picker.Item label="Transporte" value="transporte" />
        <Picker.Item label="Educação" value="educacao" />
        <Picker.Item label="Outros" value="outros" />
      </Picker>
      {errorMessages.categoria ? (
        <Text style={styles.errorText}>{errorMessages.categoria}</Text>
      ) : null}

      <Text style={styles.label}>Tipo</Text>
      <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.input}>
        <Picker.Item label="Saída" value="saida" />
        <Picker.Item label="Entrada" value="entrada" />
      </Picker>
      {errorMessages.tipo ? (
        <Text style={styles.errorText}>{errorMessages.tipo}</Text>
      ) : null}

      <TextInput
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />

      <ImageUploadComponent onUploadSuccess={setComprovanteUrl} />

      <View style={styles.spacing}></View>

      <Button title="Salvar" onPress={handleSalvar} />
    </ScrollView>
  );
}

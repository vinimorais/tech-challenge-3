import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import ImageUploadComponent from '../components/ImageUploadComponent'; 

const TransactionScreen = ({ navigation }: any) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [comprovanteUrl, setComprovanteUrl] = useState<string | null>(null);

  const fetchTransactions = async () => {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef);
    const querySnapshot = await getDocs(q);
    const transactions: any[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    setTransactions(transactions);
  };

  const handleEditTransaction = async () => {
    if (!descricao || !valor) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const updatedTransaction = {
      descricao,
      valor: parseFloat(valor),
      categoria,
      tipo,
      comprovanteUrl, 
    };

    try {
      const transactionRef = doc(db, 'transactions', selectedTransaction.id);
      await updateDoc(transactionRef, updatedTransaction);
      Alert.alert('Sucesso', 'Transação atualizada!');
      setSelectedTransaction(null); 
      fetchTransactions();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar transação');
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      await deleteDoc(transactionRef);
      Alert.alert('Sucesso', 'Transação excluída!');
      fetchTransactions(); 
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir transação');
    }
  };

  const handleSelectTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDescricao(transaction.descricao);
    setValor(transaction.valor.toString());
    setCategoria(transaction.categoria);
    setTipo(transaction.tipo);
    setComprovanteUrl(transaction.comprovanteUrl || null);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionTextContainer}>
              <Text style={styles.transactionText}>{item.descricao} - R$ {item.valor.toFixed(2)}</Text>
              <Text style={styles.transactionCategory}>{item.categoria}</Text>
            </View>
            <View style={styles.transactionActions}>
              <Button title="Editar" onPress={() => handleSelectTransaction(item)} />
              <Button title="Excluir" onPress={() => handleDeleteTransaction(item.id)} color="#f44336" />
            </View>
          </View>
        )}
      />
      
      {selectedTransaction && (
        <ScrollView style={styles.editContainer}>
          <Text style={styles.editTitle}>Editar Transação</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descrição"
            style={styles.input}
          />
          <TextInput
            value={valor}
            onChangeText={setValor}
            placeholder="Valor"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Categoria"
            style={styles.input}
          />
          <TextInput
            value={tipo}
            onChangeText={setTipo}
            placeholder="Tipo"
            style={styles.input}
          />

          {/* Exibir a imagem, caso exista */}
          {comprovanteUrl && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: comprovanteUrl }} style={styles.image} />
            </View>
          )}

          {/* Componente de Upload de Imagem */}
          <ImageUploadComponent onUploadSuccess={setComprovanteUrl} />

          <Button title="Salvar" onPress={handleEditTransaction} />
          <Button title="Cancelar" onPress={() => setSelectedTransaction(null)} color="#757575" />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3f51b5',
  },
  transactionItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionTextContainer: {
    flex: 1,
  },
  transactionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#757575',
  },
  transactionActions: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  editContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
  },
});

export default TransactionScreen;

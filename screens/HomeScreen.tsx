import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

import PieChartComponent from '../components/PieChartComponent';
import LineChartComponent from '../components/LineChartComponent';
import BarChartComponent from '../components/BarChartComponent'; 
import styles from '../styles/styles'; 

export default function HomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState<'todas' | string>('todas');

  const tipos = ['todos', 'entrada', 'saida'];
  const categorias = ['todas', 'alimentacao', 'Despesas', 'transporte', 'educacao', 'outros'];

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserTransactions();
    }, [])
  );

  const fetchUserTransactions = async () => {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef);
    const querySnapshot = await getDocs(q);
    const transactions: any[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });

    setUserTransactions(transactions);
    calculateLineChartData(transactions);
  };

  const calculateLineChartData = (transactions: any[]) => {
    let accumulatedBalance = 0;
    const labels: string[] = [];
    const dataset: number[] = [];

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date.seconds * 1000);
      const month = transactionDate.toLocaleString('default', { month: 'short' });

      if (!labels.includes(month)) {
        labels.push(month);
      }

      if (transaction.tipo === 'entrada') {
        accumulatedBalance += transaction.valor;
      } else if (transaction.tipo === 'saida') {
        accumulatedBalance -= transaction.valor;
      }

      dataset.push(accumulatedBalance);
    });

    const lineColor = accumulatedBalance >= 0 ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';

    setLineChartData({
      labels,
      datasets: [
        {
          data: dataset,
          strokeWidth: 2,
          color: (opacity = 1) => lineColor,
        },
      ],
    });
  };

  const totalIncome = userTransactions
    .filter((t) => tipoFiltro === 'todos' || t.tipo === 'entrada')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalExpense = userTransactions
    .filter((t) => tipoFiltro === 'todos' || t.tipo === 'saida')
    .reduce((acc, t) => acc + t.valor, 0);

  const transacoesFiltradas = userTransactions.filter((t) => {
    const tipoCond = tipoFiltro === 'todos' || t.tipo === tipoFiltro;
    const categoriaCond = categoriaFiltro === 'todas' || t.categoria === categoriaFiltro;
    return tipoCond && categoriaCond;
  });

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <Text style={styles.title}>Dashboard Financeiro</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PieChartComponent income={totalIncome} expense={totalExpense} />

        {lineChartData && (
          <View style={styles.chartContainer}>
            <LineChartComponent data={lineChartData} />
          </View>
        )}

        <View style={{ marginVertical: 10 }}>
          <Text style={styles.filterTitle}>Filtrar por tipo:</Text>
          <View style={styles.filterRow}>
            {tipos.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                onPress={() => setTipoFiltro(tipo as 'todos' | 'entrada' | 'saida')}
                style={[
                  styles.filterButton,
                  tipoFiltro === tipo && styles.filterActive,
                ]}
              >
                <Text style={styles.filterText}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={styles.filterTitle}>Filtrar por categoria:</Text>
          <View style={styles.filterRow}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategoriaFiltro(cat)}
                style={[
                  styles.filterButton,
                  categoriaFiltro === cat && styles.filterActive,
                ]}
              >
                <Text style={styles.filterText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {transacoesFiltradas.length > 0 ? (
          <View style={styles.chartContainer}>
            <BarChartComponent transactions={transacoesFiltradas} />
          </View>
        ) : (
          <Text style={styles.noDataText}>
            Nenhuma transação encontrada para os filtros aplicados.
          </Text>
        )}
      </ScrollView>
    </Animated.View>
  );
}

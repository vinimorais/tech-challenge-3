import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from '../styles/BarChartComponentStyles'; 

const BarChartComponent = ({ transactions }: any) => {
  const categoryData = transactions.reduce((acc: any, transaction: any) => {
    const { categoria, valor, tipo } = transaction;

    console.log(`Transação: ${JSON.stringify(transaction)}`);

    if (!acc[categoria]) {
      acc[categoria] = { entrada: 0, saida: 0 };
      console.log(`Categoria não encontrada, criando: ${categoria}`);
    }

    if (tipo === 'entrada') {
      acc[categoria].entrada += valor;
      console.log(`Somando entrada para ${categoria}: R$ ${valor}`);
    } else if (tipo === 'saida') {
      acc[categoria].saida += valor;
      console.log(`Somando saída para ${categoria}: R$ ${valor}`);
    }

    return acc;
  }, {});

  console.log('Dados agrupados por categoria:', categoryData);

  const categoryArray = Object.keys(categoryData).map((key) => ({
    category: key,
    total: categoryData[key].entrada - categoryData[key].saida,
    entrada: categoryData[key].entrada,
    saida: categoryData[key].saida,
  }));

  categoryArray.forEach((item) => {
    console.log(`Categoria: ${item.category}, Entrada: R$ ${item.entrada}, Saída: R$ ${item.saida}, Total: R$ ${item.total}`);
  });

  const maxValue = Math.max(...categoryArray.map((item) => Math.abs(item.total))); 

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Gastos por Categoria</Text>

      {categoryArray.length === 0 ? (
        <Text style={styles.noDataText}>Não há dados para exibir</Text>
      ) : (
        <ScrollView horizontal contentContainerStyle={styles.barChart}>
          {categoryArray.map((item, index) => (
            <View
              key={index}
              style={[
                styles.barWrapper,
                {
                  height: (Math.abs(item.total) / maxValue) * 300 + 50, 
                },
              ]}
            >
              <Text style={styles.valueLabel}>R$ {item.total.toFixed(2)}</Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: (Math.abs(item.total) / maxValue) * 300, 
                    backgroundColor: item.total >= 0 ? '#3f51b5' : '#f44336',
                  },
                ]}
              />
              <Text style={styles.barLabel}>{item.category}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default BarChartComponent;

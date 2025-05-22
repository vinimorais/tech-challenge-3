import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import styles from '../styles/PieChartComponentStyles'; 
import { Dimensions } from 'react-native';


const PieChartComponent = ({ income, expense }: any) => {
  const pieChartData = [
    {
      name: 'Renda',
      amount: income,
      color: '#00ff00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Despesas',
      amount: expense,
      color: '#ff0000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Distribuição Financeira</Text>
      <PieChart
        data={pieChartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
};

export default PieChartComponent;

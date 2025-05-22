import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styles from '../styles/LineChartComponentStyles';  
import { Dimensions } from 'react-native';


const LineChartComponent = ({ data }: any) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Crescimento de Saldo</Text>
      <LineChart
        data={data}
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
      />
    </View>
  );
};

export default LineChartComponent;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  barChart: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 12,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 30,
    backgroundColor: '#3f51b5',
    borderRadius: 5,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  valueLabel: {
    marginBottom: 4,
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;

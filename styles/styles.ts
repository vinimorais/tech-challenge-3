import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  logoutButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#f44336',
    alignSelf: 'flex-start',
  },
  logoutText: { color: '#fff', fontSize: 18 },
  scrollContainer: {
    paddingBottom: 40,
    minHeight: Dimensions.get('window').height * 1.1,
  },
  chartContainer: {
    height: 300,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  filterActive: {
    backgroundColor: '#3f51b5',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default styles;

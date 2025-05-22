import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 150,  
    height: 150, 
    resizeMode: 'contain',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '80%',  
    marginTop: 15, 
  },
  buttonContainer: {
    flex: 1,  
    marginHorizontal: 5,  
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  uploadingText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#757575',
  },
});

export default styles;

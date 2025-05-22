import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const addTransaction = async (transactionData: any) => {
  try {
    await addDoc(collection(db, 'transactions'), transactionData);
  } catch (error) {
    throw new Error('Erro ao salvar transação');
  }
};

import React, { useState } from 'react';
import { View, Button, Text, Image } from 'react-native';
import { db } from '../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/ImageUploadComponentStyles'; 

type ImageUploadComponentProps = {
  onUploadSuccess: (url: string | null) => void;
};

const ImageUploadComponent = ({ onUploadSuccess }: ImageUploadComponentProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
      convertToBase64(selectedAsset.uri);
    }
  };

  const convertToBase64 = (uri: string) => {
    fetch(uri)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => setErrorMessage('Erro ao converter a imagem.'));
  };

  const uploadImageToFirestore = async () => {
    if (!imageBase64) {
      setErrorMessage('Por favor, selecione uma imagem.');
      return;
    }

    try {
      setUploading(true);
      await addDoc(collection(db, 'comprovantes'), {
        image: imageBase64,
        createdAt: new Date(),
      });
      setUploading(false);
      setErrorMessage(null);
      onUploadSuccess(imageBase64); 
      alert('Imagem salva com sucesso no Firestore!');
    } catch (e) {
      setUploading(false);
      setErrorMessage('Erro ao salvar imagem no Firestore.');
      console.error('Erro ao salvar imagem', e);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar Imagem" onPress={pickImage} />

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button
            title={uploading ? 'Carregando...' : 'Upload Imagem'}
            onPress={uploadImageToFirestore}
            disabled={uploading || !imageBase64}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancelar"
            onPress={() => setImageUri(null)}
            disabled={uploading}
          />
        </View>
      </View>

      {uploading && <Text style={styles.uploadingText}>Enviando imagem...</Text>}
    </View>
  );
};

export default ImageUploadComponent;

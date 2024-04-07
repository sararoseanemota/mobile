import { useState } from 'react';

import {
  Text,
  View,
  Alert,
  Modal,
  Share,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Redirect } from 'expo-router';

import { MotiView } from 'moti/build';

import { Header } from '@/components/header';
import { QrCode } from '@/components/qrcode';
import { Button } from '@/components/button';
import { Credential } from '@/components/credential';

import { colors } from '@/styles/colors';

import { useBadgeStore } from '@/store/badge-store';

export default function Ticket() {
  const [expandQrCode, setExpandQrCode] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleShare() {
    if (badgeStore.data?.checkInURL) {
      await Share.share({
        message: badgeStore.data.checkInURL,
      });
    }
    try {
    } catch (error) {
      console.log(error);
      Alert.alert('Compartilhar', 'Não foi possível compartilhar!');
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });
      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Foto', 'Não foi possível selecionar a imagem.');
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />;
  }
  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha credencial" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onExpandQrCode={() => setExpandQrCode(true)}
        />

        <MotiView
          from={{ translateY: 0 }}
          animate={{ translateY: 10 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 700,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar Credencial
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do evento{' '}
          {badgeStore.data.eventTitle}!
        </Text>

        <Button title="Compartilhar" onPress={handleShare} />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => badgeStore.remove()}
        >
          <Text className="text-base text-white font-bold text-center mt-10">
            Remover ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={expandQrCode} statusBarTranslucent>
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQrCode(false)}
          >
            <QrCode value="testesarasummit" size={300} />
            <Text className="font-body text-orange-500 text-sm mt-10 text-center">
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

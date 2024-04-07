import { useState } from 'react';
import { View, Image, Alert } from 'react-native';

import { api } from '@/server/api';
import axios from 'axios';

import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useBadgeStore } from '@/store/badge-store';

import { Input } from '@/components/input';
import { Button } from '@/components/button';

import { colors } from '@/styles/colors';

const EVENT_ID = '9e9bd979-9d10-4915-b339-3786b1634f33';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsloading] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert('Inscrição', 'Preencha todos os campos!');
      }

      setIsloading(true);

      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      });

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`
        );

        badgeStore.save(badgeResponse.data.badge);

        Alert.alert('Inscrição', 'Inscrição realizada com sucesso', [
          { text: 'OK', onPress: () => router.push('/ticket') },
        ]);
      }
    } catch (error) {
      console.log(error);

      setIsloading(false);

      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes('already registered')
        ) {
          return Alert.alert('Inscrição', 'Esse e-mail já está cadastrado!');
        }
      }

      Alert.alert('Inscrição', 'Não foi possível fazer a inscrição.');
    }
  }

  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar style="light" />

      <Image
        source={require('@/assets/logo.png')}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <FontAwesome6
            name="user-circle"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field placeholder="Nome Completo" onChangeText={setName} />
        </Input>
        <Input>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>

        <Button
          title="Realizar inscrição"
          onPress={handleRegister}
          isLoading={isLoading}
        />

        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  );
}

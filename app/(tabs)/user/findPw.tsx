import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function FindPwScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/pm-logo.png')} style={styles.logo} />

      <Text style={styles.title}>비밀번호 찾기</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디를 입력하세요"
        placeholderTextColor="#A0A0A0"
      />

      <TextInput
        style={styles.input}
        placeholder="가입 시 사용 한 이메일을 입력하세요"
        placeholderTextColor="#A0A0A0"
      />

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#7D3DCF',
    width: '100%',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#E0E0E0',
    width: '100%',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});

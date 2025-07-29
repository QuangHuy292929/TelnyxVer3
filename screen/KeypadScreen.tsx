//D:\SipCallApp\screen\KeypadScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { saveCallHistory,getContactByPhoneNumber } from '../android/src/services/FireStoreService';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width, height } = Dimensions.get('window');

type KeypadButtonType = {
  number: string;
  letters: string;
};

const KeypadScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [scaleAnim] = useState(new Animated.Value(1));

  useFocusEffect(
    useCallback(() => {
      // Khi vào lại màn hình thì reset
      setPhoneNumber('');
    }, []),
  );

  const keypadData: KeypadButtonType[][] = [
    [
      { number: '1', letters: '' },
      { number: '2', letters: 'ABC' },
      { number: '3', letters: 'DEF' },
    ],
    [
      { number: '4', letters: 'GHI' },
      { number: '5', letters: 'JKL' },
      { number: '6', letters: 'MNO' },
    ],
    [
      { number: '7', letters: 'PQRS' },
      { number: '8', letters: 'TUV' },
      { number: '9', letters: 'WXYZ' },
    ],
    [
      { number: '*', letters: '' },
      { number: '0', letters: '+' },
      { number: '#', letters: '' },
    ],
  ];

  const handleKeyPress = (key: string) => {
    setPhoneNumber(prev => prev + key);
    // Hiệu ứng rung nhẹ khi nhấn
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleLongBackspace = () => {
    setPhoneNumber('');
  };

  const renderKeypadButton = (item: KeypadButtonType) => (
    <TouchableOpacity
      key={item.number}
      style={styles.keypadButton}
      onPress={() => handleKeyPress(item.number)}
      activeOpacity={0.7}
    >
      <Text style={styles.keypadNumber}>{item.number}</Text>
      {item.letters && <Text style={styles.keypadLetters}>{item.letters}</Text>}
    </TouchableOpacity>
  );

  const nav = useNavigation<any>();

  const handleCall = () => {
    if (phoneNumber.trim()) {

      
      getContactByPhoneNumber(phoneNumber).then(contact => {
        if (contact) {
          console.log('Contact found:', contact);
          saveCallHistory(phoneNumber, contact.name, 'outgoing');
          nav.navigate('Call', {
            contactName: contact.name,
            phoneNumber: phoneNumber,
            isConnected: true,
            callStatus: 'Đang gọi...',
          });
        } else {
          console.log('No contact found for:', phoneNumber);
          saveCallHistory(phoneNumber, "",'outgoing');
          nav.navigate('Call', {
            contactName: 'Không xác định',
            phoneNumber: phoneNumber,
            isConnected: false,
            callStatus: 'Đang gọi...',
          });
        }
      });
    }
  };

  const formatPhoneNumber = (number: string) => {
    // Định dạng số điện thoại theo kiểu: 0123 456 789
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3], match[4]]
        .filter(part => part)
        .join(' ');
    }
    return number;
  };

  return (
    <SafeAreaView style={styles.safearea} edges={['top']}>
      <View style={styles.container}>
        {/* Header với tiêu đề */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bàn phím</Text>
        </View>

        {/* Hiển thị số điện thoại */}
        <View style={styles.displayContainer}>
          <Text style={styles.phoneNumberDisplay}>
            {phoneNumber
              ? formatPhoneNumber(phoneNumber)
              : 'Nhập số điện thoại'}
          </Text>
          {phoneNumber.length > 0 && (
            <TouchableOpacity
              style={styles.backspaceButton}
              onPress={handleBackspace}
              onLongPress={handleLongBackspace}
              delayLongPress={500}
            >
              <Icon name="backspace" size={26} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Bàn phím số */}
        <View style={styles.keypadContainer}>
          {keypadData.map((row: KeypadButtonType[], rowIndex: number) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((item: KeypadButtonType) => renderKeypadButton(item))}
            </View>
          ))}
        </View>

        {/* Các nút hành động */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.videoCallButton}>
            <Icon name="videocam" size={28} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.callButton,
              !phoneNumber.trim() && styles.callButtonDisabled,
            ]}
            onPress={handleCall}
            disabled={!phoneNumber.trim()}
          >
            <Icon name="call" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} 
            onPress={() => nav.navigate('AddContact', { phone: phoneNumber })}>
            <Icon name="person-add" size={28} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safearea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e5e9',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  displayContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e5e9',
  },
  phoneNumberDisplay: {
    fontSize: 28,
    fontWeight: '400',
    color: '#1c1c1e',
    letterSpacing: 1,
    textAlign: 'center',
    minHeight: 36,
  },
  backspaceButton: {
    position: 'absolute',
    right: 20,
    top: 32,
    padding: 12,
    borderRadius: 20,
  },
  keypadContainer: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keypadButton: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 0.5,
    borderColor: '#e1e5e9',
  },
  keypadNumber: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1c1c1e',
  },
  keypadLetters: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
    fontWeight: '400',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.15,
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#e1e5e9',
  },
  videoCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#34c759',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  callButtonDisabled: {
    backgroundColor: '#c7c7cc',
    elevation: 1,
    shadowOpacity: 0.1,
  },
  contactButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default KeypadScreen;

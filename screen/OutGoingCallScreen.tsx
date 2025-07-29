import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


type OutgoingCallParams = {
  contactName?: string;
  phoneNumber?: string;
  callStatus?: string;
  duration?: number;
  isMuted?: boolean;
  isSpeakerOn?: boolean;
  isConnected?: boolean;
};

type RootStackParamList = {
  Call: OutgoingCallParams;
};

const { height } = Dimensions.get('window');


const OutgoingCallScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Call'>>();
  const nav = useNavigation<any>();
  // 2. Lấy params từ navigation
  const {
    contactName = 'Người nhận',
    phoneNumber = 'Không xác định',
    callStatus = 'Đang gọi...',
    duration = 0,
    isMuted: initialMuted = false,
    isSpeakerOn: initialSpeaker = false,
    isConnected = false,
  } = route.params || {};

  // 3. Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  // 4. UI states
  const [isMuted, setMuted] = useState(initialMuted);
  const [isSpeakerOn, setSpeaker] = useState(initialSpeaker);

  // 5. Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    if (!isConnected) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }

    if (isConnected) {
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    }
  }, [isConnected, fadeAnim, slideAnim, pulseAnim, rotateAnim]);

  // 6. Helper format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 7. Button handlers
  const handleEndCall = () => {
    nav.goBack();
  };

  const handleMute = () => {
    setMuted(!isMuted);
  };

  const handleSpeaker = () => {
    setSpeaker(!isSpeakerOn);
  };

  const handleAddCall = () => {
    console.log('Add call');
  };

  const handleKeypad = () => {
    console.log('Open keypad');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.statusText}>{callStatus}</Text>
          <View style={styles.connectionIndicator}>
            <View
              style={[
                styles.connectionDot,
                { backgroundColor: isConnected ? '#34C759' : '#FF9500' },
              ]}
            />
            <Text style={styles.connectionText}>
              {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
            </Text>
          </View>
        </View>

        <View style={styles.contactInfo}>
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            {isConnected && (
              <Animated.View
                style={[
                  styles.connectedIndicator,
                  { transform: [{ rotate: spin }] },
                ]}
              >
                <Icon name="call" size={20} color="#FFFFFF" />
              </Animated.View>
            )}
          </Animated.View>

          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>

          {isConnected && duration > 0 && (
            <Text style={styles.duration}>{formatTime(duration)}</Text>
          )}

          {!isConnected && (
            <Text style={styles.callingStatus}>Đang đổ chuông...</Text>
          )}
        </View>

        <View style={styles.functionButtons}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.functionButton, isMuted && styles.activeButton]}
              onPress={handleMute}
              activeOpacity={0.7}
            >
              <Icon
                name={isMuted ? 'mic-off' : 'mic'}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.functionButton}
              onPress={handleKeypad}
              activeOpacity={0.7}
            >
              <Icon name="dialpad" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.functionButton,
                isSpeakerOn && styles.activeButton,
              ]}
              onPress={handleSpeaker}
              activeOpacity={0.7}
            >
              <Icon name="volume-up" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.endCallContainer}>
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
            activeOpacity={0.7}
          >
            <Icon name="call-end" size={35} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.endCallLabel}>Kết thúc</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 10,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
    color: '#999999',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#555555',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 70,
  },
  connectedIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    color: '#999999',
    marginBottom: 10,
    textAlign: 'center',
  },
  duration: {
    fontSize: 20,
    color: '#34C759',
    fontWeight: '600',
    textAlign: 'center',
  },
  callingStatus: {
    fontSize: 16,
    color: '#FF9500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  functionButtons: {
    paddingBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  functionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  buttonLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  buttonLabel: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  endCallContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
  },
  endCallLabel: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default OutgoingCallScreen;

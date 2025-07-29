import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const IncomingCallScreen = () => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [rippleAnim] = useState(new Animated.Value(0));

  const nav = useNavigation<any>();

  useEffect(() => {
    // Animation cho avatar pulse
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    // Animation cho slide indicator
    const slideAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    // Animation cho ripple effect
    const rippleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();
    slideAnimation.start();
    rippleAnimation.start();

    return () => {
      pulseAnimation.stop();
      slideAnimation.stop();
      rippleAnimation.stop();
    };
  }, []);

  const handleAccept = () => {
    console.log('Call accepted');
    // TODO: Logic accept cuộc gọi
  };

  const handleReject = () => {
    nav.goBack();
  };

  const handleMessage = () => {
    console.log('Send message');
    // TODO: Logic gửi tin nhắn
  };

  const handleMute = () => {
    console.log('Mute call');
    // TODO: Logic tắt tiếng
  };

  return (
    <View style={styles.container}>
      {/* Background overlay */}
      <View style={styles.backgroundOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.callingText}>Cuộc gọi đến</Text>
        <View style={styles.statusContainer}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>Đang đổ chuông...</Text>
        </View>
      </View>

      {/* Avatar + Thông tin người gọi */}
      <View style={styles.avatarContainer}>
        {/* Ripple effect */}
        <Animated.View
          style={[
            styles.ripple,
            {
              opacity: rippleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0],
              }),
              transform: [
                {
                  scale: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.avatarWrapper,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        </Animated.View>

        <Text style={styles.nameText}>John Doe</Text>
        <Text style={styles.phoneText}>+84 852 123 456</Text>
        <Text style={styles.locationText}>Việt Nam</Text>
      </View>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleMute}>
          <Icon name="mic-off" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleMessage}
        >
          <Icon name="message" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main action buttons */}
      <View style={styles.actionContainer}>
        {/* Từ chối */}
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
          activeOpacity={0.8}
        >
          <Icon name="call-end" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Chấp nhận */}
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Icon name="call" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Slide indicator */}
      <Animated.View
        style={[
          styles.slideContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.slideIndicator}>
          <Icon name="keyboard-arrow-up" size={24} color="#999" />
        </View>
        <Text style={styles.slideText}>Vuốt lên để trả lời</Text>
      </Animated.View>
    </View>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  callingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.9,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b35',
    marginRight: 8,
  },
  statusText: {
    color: '#bbb',
    fontSize: 14,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 60,
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    top: -50,
  },
  avatarWrapper: {
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 75,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#999',
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.5,
    marginTop: 40,
  },
  quickActionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.6,
    marginTop: 60,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#ff3b30',
  },
  acceptButton: {
    backgroundColor: '#34c759',
  },
  slideContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  slideIndicator: {
    marginBottom: 8,
    opacity: 0.7,
  },
  slideText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '400',
  },
});

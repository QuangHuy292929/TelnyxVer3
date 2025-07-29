// D: \SipCallApp\screen\CallScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getCallHistory,
  CallHistory,
  getContactByPhoneNumber,
  saveCallHistory
} from '../android/src/services/FireStoreService';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type Call = CallHistory & {
  name: string;
  avatar: string;
  time: string;
};

const CallsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'missed'>('all');
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigation<any>();

  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FECA57',
      '#FF9FF3',
      '#54A0FF',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const loadCallHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getCallHistory();
      const mapped = data.map(item => ({
        ...item,
        name: item.name || item.phone,
        avatar: getAvatarColor(item.phone),
        time: new Date(item.calledAt).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setCalls(mapped);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử cuộc gọi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động reload mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadCallHistory();
    }, []),
  );

  const getCallIcon = (type: Call['type']) => {
    switch (type) {
      case 'incoming':
        return { name: 'call-received', color: '#4CAF50' };
      case 'outgoing':
        return { name: 'call-made', color: '#2196F3' };
      case 'missed':
        return { name: 'call-missed', color: '#F44336' };
      default:
        return { name: 'call', color: '#666' };
    }
  };

  const getCallTypeText = (type: Call['type']) => {
    switch (type) {
      case 'incoming':
        return 'Gọi đến';
      case 'outgoing':
        return 'Gọi đi';
      case 'missed':
        return 'Gọi nhỡ';
      default:
        return 'Cuộc gọi';
    }
  };

  const filteredData = calls.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery);
    const matchesFilter = activeFilter === 'all' || item.type === 'missed';
    return matchesSearch && matchesFilter;
  });

  const missedCallsCount = calls.filter(call => call.type === 'missed').length;

  const handleRecall = (item: Call) => {
    const phoneNumber = item.phone;
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
            saveCallHistory(phoneNumber, '', 'outgoing');
            nav.navigate('Call', {
              contactName: 'Không xác định',
              phoneNumber: phoneNumber,
              isConnected: false,
              callStatus: 'Đang gọi...',
            });
          }
        });
      }
  }

  const renderCallItem = ({ item }: { item: Call }) => {
    const iconInfo = getCallIcon(item.type);

    return (
      <TouchableOpacity style={styles.callItem} activeOpacity={0.7}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: getAvatarColor(item.name) },
          ]}
        >
          <Text style={styles.avatarText}>{item.name?.[0]?.toUpperCase()}</Text>
        </View>
        <View style={styles.callInfo}>
          <Text style={styles.callName}>{item.name}</Text>
          <View style={styles.callDetails}>
            <Icon name={iconInfo.name} size={16} color={iconInfo.color} />
            <Text style={[styles.callType, { color: iconInfo.color }]}>
              {getCallTypeText(item.type)}
            </Text>
            <Text style={styles.callTime}>• {item.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton} activeOpacity={0.7} onPress={() => handleRecall(item)}>
          <Icon name="call" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="call" size={80} color="#E0E0E0" />
      <Text style={styles.emptyStateTitle}>
        {activeFilter === 'missed'
          ? 'Không có cuộc gọi nhỡ nào'
          : 'Chưa có cuộc gọi nào'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeFilter === 'missed'
          ? 'Tất cả cuộc gọi đều đã được trả lời'
          : 'Lịch sử cuộc gọi sẽ hiển thị ở đây'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Lịch sử cuộc gọi</Text>
          <Text style={styles.headerSubtitle}>
            {calls.length} cuộc gọi
            {missedCallsCount > 0 && ` • ${missedCallsCount} gọi nhỡ`}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'all' && styles.activeFilterText,
            ]}
          >
            Tất cả ({calls.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'missed' && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter('missed')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'missed' && styles.activeFilterText,
            ]}
          >
            Gọi nhỡ ({missedCallsCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Calls List */}
      <FlatList
        data={filteredData}
        renderItem={renderCallItem}
        keyExtractor={item => item.id}
        contentContainerStyle={
          filteredData.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadCallHistory}
            colors={['#4CAF50']} // Android
            tintColor="#4CAF50" // iOS
            title="Kéo để làm mới..."
            titleColor="#666"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callType: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  callTime: {
    fontSize: 14,
    color: '#999',
    marginLeft: 6,
    fontWeight: '400',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CallsScreen;

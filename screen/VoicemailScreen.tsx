import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

// ✅ Định nghĩa kiểu dữ liệu
type VoicemailItem = {
  id: string;
  name: string;
  time: string;
  avatar: string;
};

const VoicemailScreen = () => {
  const voicemailData: VoicemailItem[] = [
    { id: "1", name: "John Smith", time: "Today at 10:30 AM", avatar: "J" },
    { id: "2", name: "Sarah Johnson", time: "Today at 8:15 AM", avatar: "S" },
    {
      id: "3",
      name: "Mike Wilson",
      time: "July 12th, 2025 at 3:45 PM",
      avatar: "M",
    },
    {
      id: "4",
      name: "+1 (555) 456-7890",
      time: "July 11th, 2025 at 11:20 AM",
      avatar: "+",
    },
  ];

  // ✅ Gán kiểu cho item trong FlatList
  const renderVoicemailItem = ({ item }: { item: VoicemailItem }) => (
    <TouchableOpacity style={styles.voicemailItem}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.voicemailInfo}>
        <Text style={styles.voicemailName}>{item.name}</Text>
        <Text style={styles.voicemailTime}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.expandButton}>
        <Icon name="expand-more" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safearea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          <FlatList
            data={voicemailData.slice(0, 2)}
            renderItem={renderVoicemailItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>July 12th, 2025</Text>
          <FlatList
            data={voicemailData.slice(2)}
            renderItem={renderVoicemailItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {    
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerRight: {
    width: 24,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  voicemailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#e8f5e8",
    borderBottomWidth: 1,
    borderBottomColor: "#d4edda",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  voicemailInfo: {
    flex: 1,
  },
  voicemailName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  voicemailTime: {
    fontSize: 12,
    color: "#666",
  },
  expandButton: {
    padding: 8,
  },
  safearea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  }
});

export default VoicemailScreen;

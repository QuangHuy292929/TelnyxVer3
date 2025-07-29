// D: \SipCallApp\screen\ContactDetailScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ClientsStackParamList } from "./ClientsStack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { deleteContact, getContacts } from "../android/src/services/FireStoreService";
import { Contact } from "../android/src/services/FireStoreService";
import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { saveCallHistory } from '../android/src/services/FireStoreService';


type ContactDetailRouteProp = RouteProp<ClientsStackParamList, "ContactDetail">;
type NavigationProp = NativeStackNavigationProp<ClientsStackParamList>;

export default function ContactDetailScreen() {
    const route = useRoute<ContactDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const [contact, setContact] = useState<Contact>(route.params.contact);

    

    // ✅ Reload lại contact mỗi khi quay lại màn
    useFocusEffect(
        useCallback(() => {
            const fetchContact = async () => {
                const allContacts = await getContacts();
                const updated = allContacts.find(c => c.id === contact.id);
                if (updated) setContact(updated);
            };
            fetchContact();
        }, [contact.id])
    );

    const handleCall = () => {
        console.log("Calling: " + contact.phone);
    };

    const handleVideo = () => {
        console.log("Video call: " + contact.phone);
    };

    const handleEdit = () => {
        navigation.navigate("EditContact", { contact });
    };

    const handleDelete = (id: string, name: string) => {
      console.log('Pressed delete', id, name); // <--- Dòng này
      Alert.alert('Xóa liên hệ', `Bạn có chắc muốn xóa "${name}" khỏi danh bạ?`, [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa liên hệ');
            }
          },
        },
      ]);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>

            {/* Avatar + Tên  */}
            <View style={styles.profileContainer}>
                <View style={styles.avatarWrapper}>
                    <Icon name="photo-camera" size={40} color="#888" />
                </View>
                <Text style={styles.name}>{contact.name}</Text>
                
            </View>

            {/* Hành động: Gọi / Sửa / Video */}
            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <Icon name="call" size={28} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                    <Icon name="edit" size={28} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleVideo}>
                    <Icon name="videocam" size={28} color="#2196F3" />
                </TouchableOpacity>
            </View>

            {/* Thông tin chi tiết */}
            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>📞 Di động</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoPhone}>{contact.phone}</Text>
                </View>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>📧 Email</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoPhone}>{contact.email || "Chưa cập nhật"}</Text>
                </View>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>🏢 Công ty</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoPhone}>{contact.company || "Chưa cập nhật"}</Text>
                </View>
            </View>

            {/* Nút Xóa liên hệ (placeholder) */}
            <TouchableOpacity style={styles.removeButton} onPress={() => handleDelete(contact.id, contact.name)}
                activeOpacity={0.7}>
                <Text style={styles.editButtonText}>Xóa liên hệ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9f9f9",
        flex: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    profileContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    avatarWrapper: {
        backgroundColor: "#e0e0e0",
        borderRadius: 60,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
    },
    phone: {
        fontSize: 16,
        color: "#666",
        marginTop: 4,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 30,
    },
    actionButton: {
        backgroundColor: "#e3f2fd",
        borderRadius: 50,
        padding: 16,
    },
    infoBox: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 14,
        color: "#888",
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoPhone: {
        fontSize: 16,
        fontWeight: "500",
    },
    removeButton: {
        marginTop: 20,
        backgroundColor: "#f35d21",
        paddingVertical: 14,
        borderRadius: 8,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
    },
});

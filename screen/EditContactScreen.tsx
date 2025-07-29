//D: \SipCallApp\screen\EditContactScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { updateContact } from '../android/src/services/FireStoreService';
import { ClientsStackParamList } from './ClientsStack';
import Icon from 'react-native-vector-icons/MaterialIcons';

type EditContactRouteProp = RouteProp<ClientsStackParamList, 'EditContact'>;

const EditContactScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<EditContactRouteProp>();
    const { contact } = route.params;

    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phone);
    const [company, setCompany] = useState(contact.company || '');
    const [email, setEmail] = useState(contact.email || '');

    const validatePhone = (phoneNumber: string): boolean => {
        const phoneRegex = /^[0-9+\-\s\(\)]+$/;
        return phoneRegex.test(phoneNumber) && phoneNumber.length >= 10;
    };

    const validateEmail = (email: string): boolean => {
        if (!email) return true; // Email không bắt buộc
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = async () => {
        if (!name || !phone) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên và số điện thoại.');
            return;
        }
        if (!name.trim()) {
              Alert.alert('Lỗi', 'Vui lòng nhập tên liên hệ');
              return;
            }
        
            if (!phone.trim()) {
              Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
              return;
            }
        
            if (!validatePhone(phone)) {
              Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
              return;
            }
        
            if (email && !validateEmail(email)) {
              Alert.alert('Lỗi', 'Email không hợp lệ');
              return;
            }

        try {
            await updateContact(contact.id, { name, phone, company, email });
            Alert.alert('Thành công', 'Cập nhật liên hệ thành công!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật không thành công.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.header}>Sửa liên hệ</Text>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>👤 Họ tên</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nhập tên..."
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>📞 Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại..."
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>🏢 Công ty</Text>
                <TextInput
                    style={styles.input}
                    value={company}
                    onChangeText={setCompany}
                    placeholder="Nhập tên công ty..."
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>📧 Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Nhập email..."
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>💾 Lưu thay đổi</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        padding: 16,
    },
    backButton: {
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditContactScreen;

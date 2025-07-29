// ClientsStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientsScreen from "./ClientScreen";
import AddContactScreen from "./AddContactScreen";
import ContactDetailScreen from "./ContactDetailScreen";
import EditContactScreen from "./EditContactScreen";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Contact } from "../android/src/services/FireStoreService";

export type ClientsStackParamList = {
  ClientsMain: undefined;
  AddContact: undefined;
  ContactDetail: { contact: Contact };
  EditContact: { contact: Contact };
};


const Stack = createNativeStackNavigator<ClientsStackParamList>();

const ClientsStack = () => {
  return (
    <SafeAreaView style={styles.safearea} edges={['top']}>
      <Stack.Navigator>
        <Stack.Screen
          name="ClientsMain"
          component={ClientsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddContact"
          component={AddContactScreen}
          options={{ title: "Thêm liên hệ" }}
        />
        <Stack.Screen
          name="ContactDetail"
          component={ContactDetailScreen}
          options={{ title: "Chi tiết liên hệ" }}
        />
        <Stack.Screen
          name="EditContact"
          component={EditContactScreen}
          options={{ title: "Sửa liên hệ" }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default ClientsStack;

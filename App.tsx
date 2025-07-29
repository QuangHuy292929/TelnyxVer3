// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Các màn hình
import CallsScreen from './screen/CallScreen';
import ClientScreen from './screen/ClientScreen';
import KeypadScreen from './screen/KeypadScreen';
import VoicemailScreen from './screen/VoicemailScreen';
import IncomingCallScreen from './screen/InComingCallScreen'; // Giao diện khi đang gọi
import OutgoingCallScreen from './screen/OutGoingCallScreen';
import AddContactScreen from './screen/AddContactScreen';
import ContactDetailScreen from "./screen/ContactDetailScreen";
import EditContactScreen from "./screen/EditContactScreen";



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab chính
function MainTabs() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
      })}
    >
      <Tab.Screen name="Calls" component={CallsScreen} />
      <Tab.Screen name="Clients" component={ClientScreen} />
      <Tab.Screen name="Keypad" component={KeypadScreen} />
      <Tab.Screen name="Voicemail" component={VoicemailScreen} />
    </Tab.Navigator>
  );
}

// Hàm icon cho tab
function getTabBarIcon(routeName: string, color: string, size: number) {
  let iconName = '';

  switch (routeName) {
    case 'Calls':
      iconName = 'phone';
      break;
    case 'Clients':
      iconName = 'people';
      break;
    case 'Keypad':
      iconName = 'dialpad';
      break;
    case 'Voicemail':
      iconName = 'voicemail';
      break;
    default:
      iconName = 'phone';
  }

  return <Icon name={iconName} size={size} color={color} />;
}

// App chính
export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <View/>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={MainTabs} />
            <Stack.Screen name="Call" component={OutgoingCallScreen} />
            <Stack.Screen name="AddContact" component={AddContactScreen} />
            <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />
            <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
            <Stack.Screen name="EditContact" component={EditContactScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}

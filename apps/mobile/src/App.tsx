import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Tab Icons (you'll need to install @expo/vector-icons)
// import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Placeholder screens
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>
      <Text style={styles.subtitle}>For You Stream</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Search</Text>
      <Text style={styles.subtitle}>Discover content</Text>
    </View>
  );
}

function UploadScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📤 Upload</Text>
      <Text style={styles.subtitle}>Share your content</Text>
    </View>
  );
}

function InboxScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Inbox</Text>
      <Text style={styles.subtitle}>Messages & notifications</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <Text style={styles.subtitle}>Your profile & settings</Text>
    </View>
  );
}

function KidZoneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ KidZone</Text>
      <Text style={styles.subtitle}>Safe content for kids</Text>
    </View>
  );
}

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopColor: '#374151',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="home" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="search" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen}
        options={{
          tabBarLabel: 'Upload',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="add-circle" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Inbox" 
        component={InboxScreen}
        options={{
          tabBarLabel: 'Inbox',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="chatbubbles" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Ionicons name="person" size={size} color={color} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="KidZone" component={KidZoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

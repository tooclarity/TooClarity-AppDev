import "@/global.css";
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarStyle: {
            backgroundColor: 'white', 
        }
      }}
    >
      <Tabs.Screen 
        name="search"
        options={{ 
          title: "Search", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="home"
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="profile"
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ), 
        }} 
      />
    </Tabs>
  );
}
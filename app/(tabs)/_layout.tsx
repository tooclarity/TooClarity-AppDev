import "@/global.css";
import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#a3a3a3',
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarIconStyle: { width: 24, height: 24 },
      }}
    >
      <Tabs.Screen 
        name="home"
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="home" size={24} color={focused ? '#3b82f6' : '#a3a3a3'} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="explore"
        options={{ 
          title: "Explore", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="search" size={24} color={focused ? '#3b82f6' : '#a3a3a3'} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="wishlist"
        options={{ 
          title: "Wishlist", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="heart-outline" size={24} color={focused ? '#3b82f6' : '#a3a3a3'} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="profile"
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="person" size={24} color={focused ? '#3b82f6' : '#a3a3a3'} />
          ), 
        }} 
      />
      <Tabs.Screen 
        name="search"
        options={{ 
          title: "Search", 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="search" size={24} color={focused ? '#3b82f6' : '#a3a3a3'} />
          ), 
        }} 
      />
    </Tabs>
  );
}
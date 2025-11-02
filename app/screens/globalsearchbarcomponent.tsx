// app/screens/SearchBar.tsx
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
  showFilter = true,
}) => {
  return (
    <View className="flex-row items-center mb-6">
      <View className="flex-1 mr-3">
        <View className="flex-row items-center h-14 bg-white rounded-full px-5 py-3 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search schools or programs"
            className="flex-1 ml-3 font-Montserrat-regular text-[16px] text-black"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={onSearchChange}
            multiline={false}
            numberOfLines={1}
          />
        </View>
      </View>
      {showFilter && (
        <TouchableOpacity
          onPress={onFilterPress}
          className="w-14 h-14 items-center justify-center bg-white rounded-full shadow-sm"
        >
          <Ionicons name="options" size={24} color="#0222D7" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
// app/components/FiltersWithSearch.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '../screens/HeaderComponent';
import SearchBar from '../screens/globalsearchbarcomponent';

interface FiltersProps {
  selectedInstitute?: string;
  selectedLevels?: string[];
  selectedModes?: string[];
  onInstituteChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onModeChange: (value: string) => void;
  onClear?: () => void;
  onShowResults?: () => void;
  onClose?: () => void;
  onSearch?: (query: string) => void;
  user: any; // Add user prop for Header
  profilePic: string | null; // Add profilePic prop for Header
  getInitials: (name: string) => string; // Add getInitials prop for Header
}

const INSTITUTES = [
  'Kindergarten',
  "School's",
  'Intermediate',
  'Graduation',
  'Coaching',
  "Study Hall's",
  "Tuition Center's",
  'Study Abroad',
];

const KINDERGARTEN_LEVELS = ['Play School', 'Lower kindergarten', 'Upper Kindergarten'];
const MODES = ['Offline', 'Online'];

const FiltersWithSearch: React.FC<FiltersProps> = ({
  selectedInstitute,
  selectedLevels = [],
  selectedModes = [],
  onInstituteChange,
  onLevelChange,
  onModeChange,
  onClear,
  onShowResults,
  onClose,
  onSearch,
  user,
  profilePic,
  getInitials,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch && onSearch(text);
  };

  const renderPill = (
    label: string,
    active: boolean,
    onPress: () => void,
    color = '#0222D7'
  ) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      className={`px-4 py-2 rounded-full border ${
        active ? 'bg-[#0222D7] border-[#0222D7]' : 'bg-gray-100 border-gray-300'
      } mr-2 mb-2`}
    >
      <Text className={`${active ? 'text-white' : 'text-gray-700'} font-semibold text-[14px]`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#EEF3FF] rounded-lg p-4">
      {/* Close (X) Button */}
      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow"
        >
          <Ionicons name="close" size={22} color="black" />
        </TouchableOpacity>
      )}

      {/* Header */}
      <Header
        user={user}
        profilePic={profilePic}
        getInitials={getInitials}
        selectedSchool={null}
        showFilters={false}
      />

      {/* SEARCH BAR */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        showFilter={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Institute Type */}
        <Text className="font-semibold text-[16px] mb-2">Institute Type</Text>
        <View className="flex-row flex-wrap mb-4">
          {INSTITUTES.map((item) =>
            renderPill(item, selectedInstitute === item, () => onInstituteChange(item))
          )}
        </View>

        {/* Kindergarten Levels */}
        {selectedInstitute === 'Kindergarten' && (
          <>
            <Text className="font-semibold text-[16px] mb-2">Kindergarten Levels</Text>
            <View className="flex-row flex-wrap mb-4">
              {KINDERGARTEN_LEVELS.map((lvl) =>
                renderPill(lvl, selectedLevels.includes(lvl), () => onLevelChange(lvl))
              )}
            </View>
          </>
        )}

        {/* Mode */}
        <Text className="font-semibold text-[16px] mb-2">Mode</Text>
        <View className="flex-row flex-wrap mb-4">
          {MODES.map((mode) =>
            renderPill(mode, selectedModes.includes(mode), () => onModeChange(mode))
          )}
        </View>

        {/* Footer */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            onPress={onClear}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 flex-1 mr-2"
          >
            <Text className="text-center font-semibold text-gray-700">Clear Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onShowResults}
            className="px-4 py-3 bg-[#0222D7] rounded-lg flex-1 ml-2"
          >
            <Text className="text-center font-semibold text-white">Show Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default FiltersWithSearch;
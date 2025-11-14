// app/screens/FiltersComponent.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './HeaderComponent';
import SearchBar from './globalsearchbarcomponent';

interface ActiveFilters {
  instituteType?: string;
  kindergartenLevels?: string[];
  schoolLevels?: string[];
  modes?: string[];
  ageGroup?: string[];
  programDuration?: string[];
  priceRange?: string[];
  boardType?: string[];
  graduationType?: string[];
  streamType?: string[];
  educationType?: string[];
  classSize?: string[];
  seatingType?: string[];
  operatingHours?: string[];
  duration?: string[];
  subjects?: string[];
}

interface FiltersComponentProps {
  activeFilters: ActiveFilters;
  onFilterChange: (type: string, value: string, checked: boolean) => void;
  onClear: () => void;
  onShowResults: () => void;
  onClose: () => void;
  user: any;
  profilePic: string | null;
  getInitials: (name: string) => string;
}

// Reusable Pill Button
const FilterPill = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
      active
        ? 'bg-[#0222D7] border-[#0222D7]'
        : 'bg-white border-gray-300'
    }`}
  >
    <Text
      className={`font-semibold text-[14px] ${
        active ? 'text-white' : 'text-gray-700'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Institute Types
const INSTITUTE_TYPES = [
  'Kindergarten',
  "School's",
  'Intermediate',
  'Graduation',
  'Coaching',
  "Study Hall's",
  "Tuition Center's",
  'Study Abroad',
];

// Full Filter Config (Same as Web)
const FILTER_CONFIG: Record<
  string,
  {
    levels?: string[];
    boardType?: string[];
    programDuration?: string[];
    ageGroup?: string[];
    modes?: string[];
    priceRange?: string[];
    graduationType?: string[];
    streamType?: string[];
    educationType?: string[];
    classSize?: string[];
    seatingType?: string[];
    operatingHours?: string[];
    duration?: string[];
    subjects?: string[];
  }
> = {
  Kindergarten: {
    levels: ['Play School', 'Lower kindergarten', 'Upper kindergarten'],
    ageGroup: ['2 - 3 Yrs', '3 - 4 Yrs', '4 - 5 Yrs', '5 - 6 Yrs'],
    modes: ['Offline', 'Online'],
    programDuration: ['Summer Camp', 'Academic Year', 'Half-Day Care', 'Full-Day Care'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  "School's": {
    levels: ['Primary', 'Secondary', 'Senior Secondary'],
    boardType: ['State Board', 'CBSE'],
    programDuration: ['Academic Year', 'Semester'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  Intermediate: {
    levels: ['Science', 'Commerce', 'Arts'],
    boardType: ['State Board', 'CBSE'],
    programDuration: ['Academic Year', 'Semester'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  Graduation: {
    graduationType: ['Under Graduation', 'Post Graduation'],
    streamType: [
      'Engineering and Technology (B.E./B.Tech.)',
      'Medical Sciences',
      'Fine Arts (BFA)',
      'Arts and Humanities (B.A.)',
    ],
    educationType: ['Full time', 'Part time', 'Distance learning'],
    modes: ['Offline', 'Online'],
    programDuration: ['2 Yrs', '3 Yrs', '4 Yrs'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  Coaching: {
    levels: ['Upskilling / Skill Development', 'Exam Preparation', 'Vocational Training'],
    modes: ['Offline', 'Online', 'Hybrid'],
    programDuration: ['3 Months', '6 Months', '1 Year+'],
    classSize: ['Small Batch (<20)', 'Medium Batch (20-50)', 'Large Batch'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  "Study Hall's": {
    seatingType: ['Hot Desk', 'Dedicated Desk', 'Private Cabin / Cubicle'],
    priceRange: ['Below ₹2,000', '₹2,000 - ₹3,500', '₹3,500 - ₹5,000', 'Above ₹5,000'],
    operatingHours: ['24/7 Access', 'Day Shift', 'Night Shift', 'Weekends Only'],
    duration: ['Daily Pass', 'Weekly Pass', 'Monthly Plan', 'Quarterly'],
  },
  "Tuition Center's": {
    subjects: [
      'All Subjects',
      'Languages',
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'MPC / BiPC',
    ],
    modes: ['Online', 'Home Tuition'],
    priceRange: ['Below ₹1,000', '₹1,000 - ₹2,500', '₹2,500 - ₹5,000', 'Above ₹5,000'],
    operatingHours: ['Morning', 'Evening', 'Weekdays', 'Weekend tuition'],
    duration: ['Monthly', 'Quarterly', 'Full Academic Year'],
  },
  'Study Abroad': {
    modes: ['Offline', 'Online'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
};

const FiltersComponent: React.FC<FiltersComponentProps> = ({
  activeFilters,
  onFilterChange,
  onClear,
  onShowResults,
  onClose,
  user,
  profilePic,
  getInitials,
}) => {
  const selectedInstitute = activeFilters.instituteType;
  const config = selectedInstitute ? FILTER_CONFIG[selectedInstitute] : null;

  const handleInstituteChange = (value: string) => {
    const isSelected = activeFilters.instituteType === value;
    onFilterChange('instituteType', value, !isSelected);
  };

  const handleMultiSelect = (type: string, value: string) => {
    const current = (activeFilters[type as keyof ActiveFilters] as string[]) || [];
    const isChecked = current.includes(value);
    onFilterChange(type, value, !isChecked);
  };

  const renderSection = (
    title: string,
    type: keyof ActiveFilters,
    options: string[]
  ) => (
    <View className="mb-6">
      <Text className="font-bold text-[16px] text-gray-800 mb-2">{title}</Text>
      <View className="flex-row flex-wrap">
        {options.map((opt) => {
          const current = (activeFilters[type] as string[]) || [];
          const isActive = current.includes(opt);
          return (
            <FilterPill
              key={opt}
              label={opt}
              active={isActive}
              onPress={() => handleMultiSelect(String(type), opt)}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg"
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        {/* Header */}
        <Header
          user={user}
          profilePic={profilePic}
          getInitials={getInitials}
          selectedSchool={null}
          showFilters={false}
        />

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {/* Institute Type */}
          <View className="mb-6">
            <Text className="font-bold text-[16px] text-gray-800 mb-2">Institute Type</Text>
            <View className="flex-row flex-wrap">
              {INSTITUTE_TYPES.map((type) => (
                <FilterPill
                  key={type}
                  label={type}
                  active={activeFilters.instituteType === type}
                  onPress={() => handleInstituteChange(type)}
                />
              ))}
            </View>
          </View>

          {/* Dynamic Filters */}
          {config && (
            <>
              {/* Levels */}
              {config.levels && (
                renderSection(
                  selectedInstitute === 'Kindergarten'
                    ? 'Kindergarten Levels'
                    : selectedInstitute === "School's"
                    ? 'School Levels'
                    : 'Levels',
                  selectedInstitute === 'Kindergarten' ? 'kindergartenLevels' : 'schoolLevels',
                  config.levels
                )
              )}

              {/* Mode */}
              {config.modes && renderSection('Mode', 'modes', config.modes)}

              {/* Board Type */}
              {config.boardType && renderSection('Board Type', 'boardType', config.boardType)}

              {/* Graduation Type */}
              {config.graduationType && renderSection('Graduation Type', 'graduationType', config.graduationType)}

              {/* Stream Type */}
              {config.streamType && renderSection('Stream Type', 'streamType', config.streamType)}

              {/* Education Type */}
              {config.educationType && renderSection('Education Type', 'educationType', config.educationType)}

              {/* Program Duration */}
              {config.programDuration && renderSection('Program Duration', 'programDuration', config.programDuration)}

              {/* Age Group */}
              {config.ageGroup && renderSection('Age Group', 'ageGroup', config.ageGroup)}

              {/* Seating Type */}
              {config.seatingType && renderSection('Seating Type', 'seatingType', config.seatingType)}

              {/* Price Range */}
              {config.priceRange && renderSection('Price Range', 'priceRange', config.priceRange)}

              {/* Operating Hours */}
              {config.operatingHours && renderSection('Operating Hours', 'operatingHours', config.operatingHours)}

              {/* Duration */}
              {config.duration && renderSection('Duration', 'duration', config.duration)}

              {/* Subjects */}
              {config.subjects && renderSection('Subjects', 'subjects', config.subjects)}

              {/* Class Size */}
              {config.classSize && renderSection('Class Size', 'classSize', config.classSize)}
            </>
          )}

          {/* Footer Buttons */}
          <View className="flex-row justify-between mt-8 mb-6">
            <TouchableOpacity
              onPress={onClear}
              className="flex-1 mr-2 py-3 border border-gray-300 rounded-lg bg-gray-100"
            >
              <Text className="text-center font-semibold text-gray-700">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShowResults}
              className="flex-1 ml-2 py-3 bg-[#0222D7] rounded-lg"
            >
              <Text className="text-center font-semibold text-white">Show Results</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FiltersComponent;
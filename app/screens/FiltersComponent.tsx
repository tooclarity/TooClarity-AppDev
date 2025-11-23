import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './HeaderComponent';

// ----------------------------------------------------------------------
// CONFIGURATION (Directly in file)
// ----------------------------------------------------------------------
const FILTER_CONFIG: Record<string, any> = {
  'Kindergarten': {
    levels: ['Play School', 'Lower kindergarten', 'Upper kindergarten'],
    ageGroup: ['2 - 3 Yrs', '3 - 4 Yrs', '4 - 5 Yrs', '5 - 6 Yrs'],
    modes: ['Offline', 'Online'],
    programDuration: ['Summer Camp', 'Academic Year', 'Half-Day Care', 'Full-Day Care'],
    priceRange: ['Below ₹75,000', '₹75,000 - ₹1,50,000', '₹1,50,000 - ₹3,00,000', 'Above ₹3,00,000'],
  },
  "School's": {
    levels: ['Primary', 'Secondary', 'Senior Secondary'],
    boardType: ['State Board', 'CBSE'],
    programDuration: ['Academic Year', 'Semester'],
    priceRange: ['Below ₹75,000', '₹75,000 - ₹1,50,000', '₹1,50,000 - ₹3,00,000', 'Above ₹3,00,000'],
  },
  'Intermediate': {
    levels: ['Science', 'Commerce', 'Arts'],
    boardType: ['State Board', 'CBSE'],
    programDuration: ['Academic Year', 'Semester'],
    priceRange: ['Below ₹75,000', '₹75,000 - ₹1,50,000', '₹1,50,000 - ₹3,00,000', 'Above ₹3,00,000'],
  },
  'Graduation': {
    graduationType: ['Under Graduation', 'Post Graduation'],
    streamType: ['Engineering and Technology (B.E./B.Tech.)', 'Medical Sciences', 'Fine Arts (BFA)', 'Arts and Humanities (B.A.)'],
    educationType: ['Full time', 'Part time', 'Distance learning'],
    modes: ['Offline', 'Online'],
    programDuration: ['2 Yrs', '3 Yrs', '4 Yrs'],
    priceRange: ['Below ₹75,000', '₹75,000 - ₹1,50,000', '₹1,50,000 - ₹3,00,000', 'Above ₹3,00,000'],
  },
  'Coaching': {
    levels: ['Upskilling / Skill Development', 'Exam Preparation', 'Vocational Training'],
    modes: ['Offline', 'Online', 'Hybrid'],
    programDuration: ['3 Months', '6 Months', '1 Year+'],
    classSize: ['Small Batch (<20)', 'Medium Batch (20-50)', 'Large Batch'],
    priceRange: ['Below ₹75,000', '₹75,000 - ₹1,50,000', '₹1,50,000 - ₹3,00,000', 'Above ₹3,00,000'],
  },
  "Study Hall's": {
    seatingType: ['Hot Desk', 'Dedicated Desk', 'Private Cabin / Cubicle'],
    priceRange: ['Below ₹2,000', '₹2,000 - ₹3,500', '₹3,500 - ₹5,000', 'Above ₹5,000'],
    operatingHours: ['24/7 Access', 'Day Shift', 'Night Shift', 'Weekends Only'],
    duration: ['Daily Pass', 'Weekly Pass', 'Monthly Plan', 'Quarterly'],
  },
  "Tuition Center's": {
    subjects: ['All Subjects', 'Languages', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'MPC / BiPC'],
    modes: ['Online', 'Home Tuition'],
    priceRange: ['Below ₹1,000', '₹1,000 - ₹2,500', '₹2,500 - ₹5,000', 'Above ₹5,000'],
    operatingHours: ['Morning', 'Evening', 'Weekdays', 'Weekend tuition'],
    duration: ['Monthly', 'Quarterly', 'Full Academic Year'],
  },
  'Study Abroad': {
    modes: ['Offline', 'Online'],
    priceRange: ['Below ₹75,000', '₹75,000 - ₹1,50,000', '₹1,50,000 - ₹3,00,000', 'Above ₹3,00,000'],
  },
};

const INSTITUTE_TYPES = Object.keys(FILTER_CONFIG);

interface Props {
  activeFilters: any;
  onFilterChange: (type: string, value: string, checked: boolean) => void;
  onClear: () => void;
  onShowResults: () => void;
  onClose: () => void;
  user: any;
  profilePic: string | null;
  getInitials: (name: string) => string;
}

const FilterPill = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
      active ? 'bg-[#0222D7] border-[#0222D7]' : 'bg-white border-gray-300'
    }`}
  >
    <Text className={`font-semibold text-[14px] ${active ? 'text-white' : 'text-gray-700'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FiltersComponent: React.FC<Props> = ({
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

  const renderSection = (title: string, type: string, options: string[]) => (
    <View className="mb-6">
      <Text className="font-bold text-[16px] text-gray-800 mb-2">{title}</Text>
      <View className="flex-row flex-wrap">
        {options.map((opt) => {
          const current = activeFilters[type] || [];
          const isActive = current.includes(opt);
          return (
            <FilterPill
              key={opt}
              label={opt}
              active={isActive}
              onPress={() => onFilterChange(type, opt, !isActive)}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-sm border border-gray-100">
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        <Header user={user} profilePic={profilePic} getInitials={getInitials} selectedSchool={null} showFilters={false} />

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
                  onPress={() => onFilterChange('instituteType', type, activeFilters.instituteType !== type)}
                />
              ))}
            </View>
          </View>

          {/* Dynamic Filters based on Type */}
          {config && (
            <>
              {config.levels && renderSection(
                selectedInstitute === 'Kindergarten' ? 'Kindergarten Levels' : selectedInstitute === "School's" ? 'School Levels' : 'Levels',
                selectedInstitute === 'Kindergarten' ? 'kindergartenLevels' : selectedInstitute === "School's" ? 'schoolLevels' : 'levels',
                config.levels
              )}
              {config.modes && renderSection('Mode', 'modes', config.modes)}
              {config.boardType && renderSection('Board Type', 'boardType', config.boardType)}
              {config.graduationType && renderSection('Graduation Type', 'graduationType', config.graduationType)}
              {config.streamType && renderSection('Stream Type', 'streamType', config.streamType)}
              {config.educationType && renderSection('Education Type', 'educationType', config.educationType)}
              {config.programDuration && renderSection('Program Duration', 'programDuration', config.programDuration)}
              {config.ageGroup && renderSection('Age Group', 'ageGroup', config.ageGroup)}
              {config.seatingType && renderSection('Seating Type', 'seatingType', config.seatingType)}
              {config.operatingHours && renderSection('Operating Hours', 'operatingHours', config.operatingHours)}
              {config.duration && renderSection('Duration', 'duration', config.duration)}
              {config.subjects && renderSection('Subjects', 'subjects', config.subjects)}
              {config.classSize && renderSection('Class Size', 'classSize', config.classSize)}
              {config.priceRange && renderSection('Price Range', 'priceRange', config.priceRange)}
            </>
          )}

          <View className="flex-row justify-between mt-8 mb-6 pb-10">
            <TouchableOpacity onPress={onClear} className="flex-1 mr-2 py-3 border border-gray-300 rounded-lg bg-gray-50">
              <Text className="text-center font-semibold text-gray-700">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShowResults} className="flex-1 ml-2 py-3 bg-[#0222D7] rounded-lg">
              <Text className="text-center font-semibold text-white">Show Results</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FiltersComponent;
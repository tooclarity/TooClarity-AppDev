import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const StudyAbroad = () => {
  const router = useRouter();

  // Academic Profile states
  const [highestEducation, setHighestEducation] = useState(null);
  const highestOptions = ['12th Grade', "Bachelor's", "Master's"];

  const [hasBacklogs, setHasBacklogs] = useState(null);
  const backlogOptions = ['Yes', 'No'];

  const [englishStatus, setEnglishStatus] = useState('Select Test Status');
  const [isEnglishOpen, setIsEnglishOpen] = useState(false);
  const englishOptions = ['Preparing for the exam', 'Already have my exam score'];

  const [selectedTestType, setSelectedTestType] = useState(null);
  const testTypes = ['IELTS', 'PTE', 'TOEFL', 'Duolingo'];

  const [overallScore, setOverallScore] = useState('');
  const [examDate, setExamDate] = useState('');

  // Study Goals states
  const [studyField, setStudyField] = useState('');
  const [budgetRange, setBudgetRange] = useState('Select budget range');
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const budgetOptions = ['< $10,000', '$10,000 - $20,000', '$20,000 - $30,000', '> $30,000'];

  const [preferredCountries, setPreferredCountries] = useState([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [showMoreCountries, setShowMoreCountries] = useState(false);

  const countries = [
    { flag: '🇺🇸', name: 'USA' },
    { flag: '🇦🇺', name: 'Australia' },
    { flag: '🇬🇧', name: 'UK' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🇮🇪', name: 'Ireland' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇳🇿', name: 'New Zealand' },
    { flag: '🇫🇷', name: 'France' },
    { flag: '🇸🇪', name: 'Sweden' },
    { flag: '🇳🇱', name: 'Netherlands' },
    { flag: '🇮🇹', name: 'Italy' },
    { flag: '🇸🇬', name: 'Singapore' },
    { flag: '🇦🇹', name: 'Austria' },
    { flag: '🇪🇸', name: 'Spain' },
    { flag: '🇨🇭', name: 'Switzerland' },
    { flag: '🇱🇹', name: 'Lithuania' },
    { flag: '🇵🇱', name: 'Poland' },
    { flag: '🇲🇾', name: 'Malaysia' },
    { flag: '🇯🇵', name: 'Japan' },
    { flag: '🇦🇪', name: 'UAE' },
    { flag: '🇫🇮', name: 'Finland' },
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const toggleCountry = (country) => {
    if (preferredCountries.find(c => c.name === country.name)) {
      setPreferredCountries(preferredCountries.filter(c => c.name !== country.name));
    } else if (preferredCountries.length < 3) {
      setPreferredCountries([...preferredCountries, country]);
    }
  };

  const [validPassport, setValidPassport] = useState(null);
  const passportOptions = ['Yes', 'No', 'Applied'];

  const showTestDetails = englishStatus === 'Already have my exam score';

  const isContinueEnabled = 
    highestEducation &&
    hasBacklogs &&
    englishStatus !== 'Select Test Status' &&
    (showTestDetails ? (selectedTestType && overallScore && examDate) : true) &&
    studyField.trim() !== '' &&
    budgetRange !== 'Select budget range' &&
    preferredCountries.length > 0 &&
    validPassport;

  const closeAllDropdowns = () => {
    setIsEnglishOpen(false);
    setIsBudgetOpen(false);
  };

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity 
        className="absolute top-14 left-5 w-8 h-8 justify-center items-center z-10"
        onPress={() => router.back()}
        activeOpacity={0.6}
      >
        <Ionicons name="chevron-back" size={24} color="#000000" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="absolute top-14 right-5 flex-row items-center h-8 z-10"
        onPress={() => router.push('/home')}
        activeOpacity={0.6}
      >
        <Text className="font-montserrat font-medium text-[14px] text-black leading-[17px] tracking-normal text-center">SKIP</Text>
        <Ionicons name="chevron-forward" size={11} color="#000000" style={{marginLeft: 2.5, marginTop: 2.5}} />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 56, paddingBottom: 90}}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-[270px] h-[10px] bg-[#EBEEFF] rounded-[5px] mt-11 mb-6 overflow-hidden self-center">
          <View className="w-[50%] h-full bg-primary rounded-[5px]" />
        </View>

        {/* Your Academic Profile Section */}
        <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5 mt-6">Your Academic Profile</Text>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">Highest Level of Education</Text>
        <View className="flex-col mb-6">
          {highestOptions.map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-row items-center py-3"
              onPress={() => setHighestEducation(item)}
              activeOpacity={0.7}
            >
              <View className="h-5 w-5 rounded-[10px] border-[1.5px] border-black mr-3 justify-center items-center">
                {highestEducation === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-black" />}
              </View>
              <Text className="font-montserrat font-normal text-[16px] text-text leading-[20px] tracking-normal">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">Do you have any backlogs?</Text>
        <View className="flex-row justify-between mb-6">
          {backlogOptions.map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-1 flex-row items-center justify-center py-3"
              onPress={() => setHasBacklogs(item)}
              activeOpacity={0.7}
            >
              <View className="h-5 w-5 rounded-[10px] border-[1.5px] border-black mr-3 justify-center items-center">
                {hasBacklogs === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-black" />}
              </View>
              <Text className="font-montserrat font-normal text-[16px] text-text leading-[20px] tracking-normal">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">English Test Status</Text>
        <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
          <TouchableOpacity
            className="h-12 flex-row items-center justify-between px-4"
            onPress={() => {
              setIsEnglishOpen(!isEnglishOpen);
              closeAllDropdowns();
              if (!isEnglishOpen) setIsEnglishOpen(true);
            }}
            activeOpacity={0.7}
          >
            <Text className={`font-montserrat font-normal text-[16px] leading-[20px] tracking-normal flex-1 ${englishStatus === 'Select Test Status' ? 'text-[#A1A1A1]' : 'text-text'}`}>
              {englishStatus}
            </Text>
            <Ionicons 
              name={isEnglishOpen ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#060B13" 
            />
          </TouchableOpacity>

          {isEnglishOpen && (
            <View className="bg-neutral-100">
              {englishOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="flex-row items-center px-4 py-[14px]"
                  onPress={() => {
                    setEnglishStatus(item);
                    setIsEnglishOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="h-5 w-5 rounded-[10px] border-[1.5px] border-black mr-3 justify-center items-center">
                    {englishStatus === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-black" />}
                  </View>
                  <Text className="font-montserrat font-normal text-[16px] text-text leading-[20px] tracking-normal">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {showTestDetails && (
          <>
            <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">Test Type</Text>
            <View className="flex-row flex-wrap mb-6">
              {testTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`px-4 py-2 border border-neutral-300 rounded-[20px] mr-2 mb-2 ${selectedTestType === type ? 'bg-primary border-primary' : ''}`}
                  onPress={() => setSelectedTestType(type)}
                  activeOpacity={0.7}
                >
                  <Text className={`font-montserrat text-[14px] ${selectedTestType === type ? 'text-white' : 'text-text'}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">Overall Score</Text>
            <TextInput
              className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-6 text-[16px] font-montserrat text-text"
              placeholder="e.g. 7.5"
              placeholderTextColor="#A1A1A1"
              value={overallScore}
              onChangeText={setOverallScore}
              keyboardType="decimal-pad"
            />

            <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">Date of Exam</Text>
            <TextInput
              className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-6 text-[16px] font-montserrat text-text"
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#A1A1A1"
              value={examDate}
              onChangeText={setExamDate}
            />
          </>
        )}

        {/* Your Study Goals Section */}
        <Text className="font-montserrat font-medium text-[20px] text-text leading-[20px] tracking-normal mb-5 mt-6">Your Study Goals</Text>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">What do you want to study?</Text>
        <TextInput
          className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-6 text-[16px] font-montserrat text-text"
          placeholder="e.g., Master's in Computer Science"
          placeholderTextColor="#A1A1A1"
          value={studyField}
          onChangeText={setStudyField}
          multiline={false}
        />

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">What is your budget per year?</Text>
        <View className="w-full border border-neutral-300 rounded-[12px] overflow-hidden bg-white mb-6">
          <TouchableOpacity
            className="h-12 flex-row items-center justify-between px-4"
            onPress={() => {
              setIsBudgetOpen(!isBudgetOpen);
              closeAllDropdowns();
              if (!isBudgetOpen) setIsBudgetOpen(true);
            }}
            activeOpacity={0.7}
          >
            <Text className={`font-montserrat font-normal text-[16px] leading-[20px] tracking-normal flex-1 ${budgetRange === 'Select budget range' ? 'text-[#A1A1A1]' : 'text-text'}`}>
              {budgetRange}
            </Text>
            <Ionicons 
              name={isBudgetOpen ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#060B13" 
            />
          </TouchableOpacity>

          {isBudgetOpen && (
            <View className="bg-neutral-100">
              {budgetOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="px-4 py-[14px]"
                  onPress={() => {
                    setBudgetRange(item);
                    setIsBudgetOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="font-montserrat font-normal text-[16px] text-text leading-[20px] tracking-normal">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-6">Preferred Countries</Text>
        <Text className="font-montserrat text-[14px] text-[#A1A1A1] mb-3">You can select up to 3 countries</Text>
        <TextInput
          className="h-12 w-full border border-neutral-300 rounded-[12px] px-4 mb-4 text-[16px] font-montserrat text-text"
          placeholder="Find your country"
          placeholderTextColor="#A1A1A1"
          value={countrySearch}
          onChangeText={setCountrySearch}
        />
        <Text className="font-montserrat font-medium text-[16px] text-text mb-3">Top Destinations</Text>
        <View className="flex-row flex-wrap justify-between mb-4">
          {filteredCountries.slice(0, showMoreCountries ? filteredCountries.length : 9).map((country) => (
            <TouchableOpacity
              key={country.name}
              className={`w-[30%] aspect-square border border-neutral-300 rounded-[8px] justify-center items-center mb-3 ${preferredCountries.find(c => c.name === country.name) ? 'border-primary border-2' : ''}`}
              onPress={() => toggleCountry(country)}
              activeOpacity={0.7}
              disabled={preferredCountries.length >= 3 && !preferredCountries.find(c => c.name === country.name)}
            >
              <Text className="text-[24px] mb-1">{country.flag}</Text>
              <Text className={`font-montserrat text-[12px] text-text text-center ${preferredCountries.find(c => c.name === country.name) ? 'text-primary' : ''}`}>{country.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!showMoreCountries && (
          <TouchableOpacity onPress={() => setShowMoreCountries(true)}>
            <Text className="font-montserrat text-[14px] text-primary text-center mb-3">See all →</Text>
          </TouchableOpacity>
        )}

        <Text className="font-montserrat font-medium text-[18px] text-text leading-[22px] tracking-normal mb-3 mt-3">Do you have a valid passport?</Text>
        <View className="flex-row justify-between mb-6">
          {passportOptions.map((item) => (
            <TouchableOpacity
              key={item}
              className="flex-1 flex-row items-center justify-center py-3"
              onPress={() => setValidPassport(item)}
              activeOpacity={0.7}
            >
              <View className="h-5 w-5 rounded-[10px] border-[1.5px] border-black mr-3 justify-center items-center">
                {validPassport === item && <View className="h-[10px] w-[10px] rounded-[5px] bg-black" />}
              </View>
              <Text className="font-montserrat font-normal text-[16px] text-text leading-[20px] tracking-normal">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-1 min-h-[40px]" />
      </ScrollView>

      <TouchableOpacity
        className={`absolute bottom-[26px] left-[16.5px] w-[361px] h-12 rounded-[12px] justify-center items-center ${isContinueEnabled ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => isContinueEnabled && router.push('/nextScreen')}
        disabled={!isContinueEnabled}
        activeOpacity={0.8}
      >
        <Text className={`font-montserrat font-medium text-[18px] leading-[22px] tracking-normal text-center ${isContinueEnabled ? 'text-white' : 'text-[#C7C7C7]'}`}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudyAbroad;
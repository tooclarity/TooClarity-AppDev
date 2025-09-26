// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import profileSetup from './app/screens/profileSetup';
// import AcademicInterestsScreen from './app/screens/AcademicInterestsScreen';
// import LoginScreen from './app/screens/LoginScreen';
// import OtpVerificationScreen from './app/screens/OtpVerificationScreen';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false, // Hide the default header
//         }}
//         initialRouteName="LoginScreen"
//       >
//         <Stack.Screen name="LoginScreen" component={LoginScreen} />
//         <Stack.Screen name="otp" component={OtpVerificationScreen} />
//         <Stack.Screen name="profileSetup" component={profileSetup} />
//         <Stack.Screen name="AcademicInterestsScreen" component={AcademicInterestsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
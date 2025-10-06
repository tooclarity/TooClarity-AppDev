// types/user.ts - User Type Definitions
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'admin' | 'institution';
  isPaymentDone: boolean;
  isProfileCompleted: boolean;
  // Add other fields as needed (e.g., token if storing client-side)
}
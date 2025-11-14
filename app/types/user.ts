export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  designation?: string;
  linkedin?: string;
  verified: boolean;
  institution?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
  role: 'student' | 'admin' | 'institution';
  googleId?: string;
  address?: string;
  birthday?: string;
  profilePicture?: string;
  gender?: 'male' | 'female' | 'other'; // optional
  nationality?: string;                // optional
  createdAt?: string;                  // account creation date
  updatedAt?: string;                  // last update
  lastLogin?: string;                  // optional last login timestamp
  [key: string]: any;                  // dynamic extra fields
}

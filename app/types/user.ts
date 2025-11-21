// app/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  linkedin?: string;
  verified: boolean;
  institution?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
  role: 'student' | 'admin' | 'institution';
  googleId?: string;
  contactNumber?: string;
  address?: string;
  birthday?: string;
  profilePicture?: string;
}

export default User;
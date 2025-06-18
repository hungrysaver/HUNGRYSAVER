import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'donor' | 'volunteer' | 'admin' | 'community-support';
  profileImage?: string;
  // Volunteer specific fields
  location?: string;
  educationalQualification?: string;
  // Community Support specific fields
  city?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role: string, additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string, role: string, additionalData: any = {}) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role: role as 'donor' | 'volunteer' | 'admin' | 'community-support',
      ...additionalData
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    // Store volunteer-specific data in volunteers collection
    if (role === 'volunteer') {
      await setDoc(doc(db, 'volunteers', user.uid), {
        uid: user.uid,
        displayName,
        email: user.email!,
        location: additionalData.location,
        educationalQualification: additionalData.educationalQualification,
        createdAt: new Date().toISOString(),
        isActive: true
      });
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const fetchUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
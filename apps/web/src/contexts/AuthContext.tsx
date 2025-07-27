import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthUser {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  lastLoginAt: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (data: LoginData) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        };
        setUser(authUser);
      } catch (error) {
        console.error('Failed to get user profile:', error);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (data: LoginData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'Failed to sign in';
      
      switch (errorCode) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Failed to sign in';
      }
      
      throw new Error(errorMessage);
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = 'Failed to create account';
      
      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email address already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Failed to create account';
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const getIdToken = async (): Promise<string> => {
    if (!firebaseUser) {
      throw new Error('No authenticated user');
    }
    return await firebaseUser.getIdToken();
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    logout,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
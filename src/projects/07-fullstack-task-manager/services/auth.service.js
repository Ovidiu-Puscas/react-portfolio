import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';


class AuthService {
  // Register new user
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName });
      
      // Force refresh the user object to get updated profile
      await user.reload();

      // Try to create user document in Firestore (optional - don't fail if it doesn't work)
      try {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now(),
          preferences: {
            theme: 'light',
            notifications: true
          }
        };

        // Only add photoURL if it exists
        if (user.photoURL) {
          userData.photoURL = user.photoURL;
        }

        await setDoc(doc(db, 'users', user.uid), userData);
      } catch (firestoreError) {
        console.log('Firestore write failed (this is okay for demo):', firestoreError.message);
        // Continue anyway - authentication succeeded
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        photoURL: user.photoURL || null
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Try to update last login in Firestore (but don't fail if permissions issue)
      try {
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: Timestamp.now()
        }, { merge: true });
      } catch (firestoreError) {
        console.log('Could not update lastLogin:', firestoreError.message);
        // Continue anyway - authentication succeeded
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || null
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || null
        });
      } else {
        callback(null);
      }
    });
  }

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
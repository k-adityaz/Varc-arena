import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

import { auth, provider, db } from "../firebase.ts";

type HistoryEntry = {
  difficulty: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  correct: number;
  wrong: number;
  skipped: number;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  history: any[];
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  addHistoryEntry: (entry: HistoryEntry) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  history: [],
  setHistory: () => {},
  addHistoryEntry: async () => {},
});
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setHistory([]);
        return;
      }

      const snap = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      setHistory(
        (snap.exists() && snap.data().history) || []
      );
    }
  );

  return () => unsubscribe();
}, []);

  const login = async () => {
  const result = await signInWithPopup(auth, provider);

  const currentUser = result.user;

  await setDoc(
    doc(db, "users", currentUser.uid),
    {
      uid: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      photo: currentUser.photoURL,
      lastLogin: new Date().toISOString(),
    },
    { merge: true }
  );

  const userDoc = await getDoc(
    doc(db, "users", currentUser.uid)
  );

  if (userDoc.exists()) {
    const data = userDoc.data();

    setHistory(data.history || []);
  }
};
  const logout = async () => {
    await signOut(auth);
  };

  const addHistoryEntry = async (
  entry: HistoryEntry
) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  const newEntry = {
    ...entry,
    date: new Date().toISOString(),
  };

  await updateDoc(userRef, {
    history: arrayUnion(newEntry),
  });

  setHistory((prev) => [
    newEntry,
    ...prev,
  ]);
};

  return (
    <AuthContext.Provider
  value={{
    user,
    login,
    logout,
    isAuthenticated: !!user,
    history,
    setHistory,
    addHistoryEntry,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
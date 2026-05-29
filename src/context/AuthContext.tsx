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
  topic?: string;   // add this line
  difficulty: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  correct: number;
  wrong: number;
  skipped: number;
  date?: string;
  createdAt?: string;
};


type AuthContextType = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  history: HistoryEntry[];
  setHistory: React.Dispatch<
  React.SetStateAction<HistoryEntry[]>
>;
   xp: number;
  level: number;

  addHistoryEntry: (entry: HistoryEntry) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  history: [],
  setHistory: () => {},
  xp: 0,
level: 1,
  addHistoryEntry: async () => {},
});
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
const [history, setHistory] = useState<HistoryEntry[]>([]);
const [xp, setXp] = useState(0);
const [level, setLevel] = useState(1);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (currentUser) => {
      setUser(currentUser);

    if (!currentUser) {
  setHistory([]);
  setXp(0);
  setLevel(1);
  return;
}
      const snap = await getDoc(
        doc(db, "users", currentUser.uid)
      );

      setHistory(
        (snap.exists() && snap.data().history) || []
      );
      if (snap.exists()) {
  const data = snap.data();

  setXp(data.xp || 0);
  setLevel(data.level || 1);
}
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
    setXp(data.xp || 0);
setLevel(data.level || 1);
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

  // ===== XP SYSTEM =====

  let earnedXp = 0;

  // Difficulty XP
  if (entry.difficulty === "easy") {
    earnedXp += entry.correct * 8;
  }

  else if (entry.difficulty === "medium") {
    earnedXp += entry.correct * 12;
  }

  else if (entry.difficulty === "hard") {
    earnedXp += entry.correct * 18;
  }

  else {
    earnedXp += entry.correct * 25;
  }

  // Accuracy bonus
  if (entry.percentage >= 90) {
    earnedXp += 50;
  }

  else if (entry.percentage >= 75) {
    earnedXp += 25;
  }

  // Speed bonus
  if (
  entry.timeTaken <
  entry.total * 25
) {
    earnedXp += 20;
  }

  // Final XP + Level
  const currentXp = xp || 0;

const newXp = currentXp + earnedXp;

  const newLevel =
    Math.floor(newXp / 500) + 1;

  // ===== FIREBASE SAVE =====

  await updateDoc(userRef, {
    history: arrayUnion(newEntry),

    xp: newXp,
    level: newLevel,
  });

  // ===== LOCAL UPDATE =====

  setHistory((prev) => [
    newEntry,
    ...prev,
  ]);

  setXp(newXp);
  setLevel(newLevel);
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
    xp,
level,
    addHistoryEntry,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
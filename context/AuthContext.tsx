import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  role: string;
  joinDate: string;
  streak: number;
  points: number;
  level: number;
  badges: Array<{ id: string; name: string; icon: string; description: string; unlocked: boolean }>;
  interests: string[];
}

export interface Activity {
  id: string;
  userId: string;
  title: string;
  category: 'Workout' | 'Coding' | 'Reading' | 'Productivity' | 'Mindfulness' | 'Other';
  duration: number; // in minutes
  points: number;
  date: string;
  notes?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  points: number;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  badges: Badge[];
  activities: Activity[];
  goals: Goal[];
  themeMode: 'dark' | 'light';
  isLoading: boolean;

  toggleTheme: () => void;

  login: (
    email: string,
    pass: string
  ) => {
    success: boolean;
    message: string;
  };

  register: (userData: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    interests?: string[];
    avatar?: string;
  }) => {
    success: boolean;
    message: string;
  };

  logout: () => void;

  updateProfile: (updated: Partial<User>) => void;

  updateBadges: (updatedBadges: Badge[]) => void;

  addActivity: (
    activity: Omit<Activity, 'id' | 'userId'>
  ) => void;

  deleteActivity: (id: string) => void;

  toggleGoal: (id: string) => void;

  addGoal: (
    goal: Omit<Goal, 'id' | 'completed'>
  ) => void;

  quickLogin: (email: string) => void;
}

// AsyncStorage keys — bump these if you ever change the shape of the stored data.
const STORAGE_KEYS = {
  USERS: '@pulsetrack/users',
  CURRENT_USER_ID: '@pulsetrack/currentUserId',
  BADGES: '@pulsetrack/badges',
  ACTIVITIES: '@pulsetrack/activities',
  GOALS: '@pulsetrack/goals',
  THEME: '@pulsetrack/theme',
};

const INITIAL_BADGES: Badge[] = [
  // { id: '1', name: 'Early Bird', icon: 'sunny-outline', description: 'Log an activity before 8 AM', unlocked: true },
  // { id: '2', name: 'Code Ninja', icon: 'code-slash-outline', description: 'Complete 10 hours of coding', unlocked: true },
  // { id: '3', name: 'Streak Master', icon: 'flame-outline', description: 'Maintain a 7-day activity streak', unlocked: true },
  // { id: '4', name: 'Iron Fitness', icon: 'barbell-outline', description: 'Log 5 workout sessions', unlocked: false },
  // { id: '5', name: 'Bookworm', icon: 'book-outline', description: 'Read for over 5 hours', unlocked: false },
];

const INITIAL_USERS: User[] = [];

const INITIAL_ACTIVITIES: Activity[] = [];

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Complete 30-min workout', category: 'Workout', completed: true, points: 50 },
  { id: 'g2', title: 'Read 20 pages of a book', category: 'Reading', completed: false, points: 40 },
  { id: 'g3', title: 'Log activity progress', category: 'Productivity', completed: true, points: 30 },
  { id: 'g4', title: '15-min mindfulness session', category: 'Mindfulness', completed: false, points: 40 },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Small helper so a failed read/write never crashes the app — it just falls back silently.
async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw != null ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.warn(`Failed to load "${key}" from storage`, e);
    return fallback;
  }
}

async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save "${key}" to storage`, e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Guards against writing the (still empty) initial state back to storage
  // before the very first load has finished.
  const hasHydrated = useRef(false);

  const user = allUsers.find(u => u.id === currentUserId) ?? null;

  // ---- Load everything from AsyncStorage once, on app start ----
  useEffect(() => {
    (async () => {
      const [
        storedUsers,
        storedUserId,
        storedBadges,
        storedActivities,
        storedGoals,
        storedTheme,
      ] = await Promise.all([
        loadJSON<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID),
        loadJSON<Badge[]>(STORAGE_KEYS.BADGES, INITIAL_BADGES),
        loadJSON<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
        loadJSON<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      setAllUsers(storedUsers);
      setCurrentUserId(storedUserId ?? null);
      setBadges(storedBadges);
      setActivities(storedActivities);
      setGoals(storedGoals);
      if (storedTheme === 'dark' || storedTheme === 'light') setThemeMode(storedTheme);

      hasHydrated.current = true;
      setIsLoading(false);
    })();
  }, []);

  // ---- Persist back to AsyncStorage whenever data changes ----
  useEffect(() => {
    if (!hasHydrated.current) return;
    saveJSON(STORAGE_KEYS.USERS, allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (currentUserId) {
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId).catch(() => { });
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID).catch(() => { });
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    saveJSON(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    saveJSON(STORAGE_KEYS.GOALS, goals);
  }, [goals]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEYS.THEME, themeMode).catch(() => { });
  }, [themeMode]);

  useEffect(() => {
    if (!hasHydrated.current) return;

    saveJSON(STORAGE_KEYS.BADGES, badges);
  }, [badges]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      return { success: false, message: 'No account found with this email. Please register.' };
    }

    if (existingUser.password !== pass) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setCurrentUserId(existingUser.id);
    return { success: true, message: 'Login successful!' };
  };

  const quickLogin = (email: string) => {
    const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setCurrentUserId(existingUser.id);
    }
  };

  const register = (userData: { name: string; email: string; password: string; bio?: string; interests?: string[]; avatar?: string }) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: userData.bio || 'New active member pursuing goals!',
      role: 'Member',
      joinDate: 'Just now',
      streak: 1,
      points: 100, // Welcome bonus
      level: 1,
      badges: [...INITIAL_BADGES],
      interests: userData.interests || ['Productivity'],
    };

    setAllUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updated };
    setAllUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
  };

  const updateBadges = (updatedBadges: Badge[]) => {
    if (!user) return;
    setBadges(updatedBadges);
    const updatedUser = {
      ...user,
      badges: updatedBadges,
    };
    setAllUsers(prev =>
      prev.map(u =>
        u.id === user.id ? updatedUser : u
      )
    );
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'userId'>) => {
    if (!user) return;
    const newActivity: Activity = {
      ...activityData,
      id: `act_${Date.now()}`,
      userId: user.id,
    };

    setActivities(prev => [newActivity, ...prev]);

    // Update user points and level
    const addedPoints = activityData.points || 50;
    const newTotalPoints = user.points + addedPoints;
    const newLevel = Math.floor(newTotalPoints / 300) + 1;

    updateProfile({
      points: newTotalPoints,
      level: newLevel,
      streak: user.streak + 1,
    });
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  const toggleGoal = (id: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextCompleted = !g.completed;
          if (nextCompleted && user) {
            updateProfile({ points: user.points + g.points });
          }
          return { ...g, completed: nextCompleted };
        }
        return g;
      })
    );
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'completed'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g_${Date.now()}`,
      completed: false,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        badges,
        activities: user
          ? activities.filter(a => a.userId === user.id)
          : [],
        goals,
        themeMode,
        isLoading,
        toggleTheme,
        login,
        register,
        logout,
        updateProfile,
        updateBadges,
        addActivity,
        deleteActivity,
        toggleGoal,
        addGoal,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

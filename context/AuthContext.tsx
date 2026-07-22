import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

export interface User {
  id: string;
  name: string;
  email: string;
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
  activities: Activity[];
  goals: Goal[];
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (userData: { name: string; email: string; password?: string; bio?: string; interests?: string[]; avatar?: string }) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'userId'>) => void;
  deleteActivity: (id: string) => void;
  toggleGoal: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
  quickLogin: (email: string) => void;
}

const INITIAL_BADGES = [
  { id: '1', name: 'Early Bird', icon: 'sunny-outline', description: 'Log an activity before 8 AM', unlocked: true },
  { id: '2', name: 'Code Ninja', icon: 'code-slash-outline', description: 'Complete 10 hours of coding', unlocked: true },
  { id: '3', name: 'Streak Master', icon: 'flame-outline', description: 'Maintain a 7-day activity streak', unlocked: true },
  { id: '4', name: 'Iron Fitness', icon: 'barbell-outline', description: 'Log 5 workout sessions', unlocked: false },
  { id: '5', name: 'Bookworm', icon: 'book-outline', description: 'Read for over 5 hours', unlocked: false },
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer & Tech Enthusiast 🎨 | Daily Fitness Runner 🏃‍♂️',
    role: 'Product Designer',
    joinDate: 'Jan 2026',
    streak: 7,
    points: 1250,
    level: 4,
    badges: INITIAL_BADGES,
    interests: ['Coding', 'Fitness', 'Design', 'Reading'],
  },
  {
    id: 'usr_2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Fullstack Software Engineer 💻 | Open Source Contributor',
    role: 'Lead Developer',
    joinDate: 'Feb 2026',
    streak: 12,
    points: 2100,
    level: 6,
    badges: INITIAL_BADGES.map(b => ({ ...b, unlocked: true })),
    interests: ['Coding', 'Productivity', 'Mindfulness'],
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    userId: 'usr_1',
    title: 'Morning High-Intensity Workout',
    category: 'Workout',
    duration: 45,
    points: 120,
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Pushed hard today! 5km run followed by core strength training.',
  },
  {
    id: 'act_2',
    userId: 'usr_1',
    title: 'React Native & Expo Router Refactoring',
    category: 'Coding',
    duration: 90,
    points: 250,
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: 'Built AuthContext and redesigned app navigation with sleek modern cards.',
  },
  {
    id: 'act_3',
    userId: 'usr_1',
    title: 'Atomic Habits - Chapter 4 & 5',
    category: 'Reading',
    duration: 30,
    points: 80,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: 'Great insights on visual cues and habit stacking.',
  },
  {
    id: 'act_4',
    userId: 'usr_1',
    title: 'Guided Evening Meditation',
    category: 'Mindfulness',
    duration: 20,
    points: 60,
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    notes: 'Calmed the mind after a busy sprint day.',
  },
  {
    id: 'act_5',
    userId: 'usr_2',
    title: 'TypeScript Performance Tuning',
    category: 'Coding',
    duration: 120,
    points: 300,
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: 'Optimized build times and resolved circular dependencies.',
  },
];

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Complete 30-min workout', category: 'Workout', completed: true, points: 50 },
  { id: 'g2', title: 'Read 20 pages of a book', category: 'Reading', completed: false, points: 40 },
  { id: 'g3', title: 'Log activity progress', category: 'Productivity', completed: true, points: 30 },
  { id: 'g4', title: '15-min mindfulness session', category: 'Mindfulness', completed: false, points: 40 },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [user, setUser] = useState<User | null>(INITIAL_USERS[0]); // Default logged in as Alex Morgan for smooth demo testing
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (!existingUser) {
      return { success: false, message: 'No account found with this email. Please register.' };
    }
    
    setUser(existingUser);
    return { success: true, message: 'Login successful!' };
  };

  const quickLogin = (email: string) => {
    const existingUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setUser(existingUser);
    }
  };

  const register = (userData: { name: string; email: string; password?: string; bio?: string; interests?: string[]; avatar?: string }) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: userData.bio || 'New active member pursuing goals!',
      role: 'Member',
      joinDate: 'Just now',
      streak: 1,
      points: 100, // Welcome bonus
      level: 1,
      badges: INITIAL_BADGES,
      interests: userData.interests || ['Productivity'],
    };

    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updated };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
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
        activities: user ? activities.filter(a => a.userId === user.id) : [],
        goals,
        themeMode,
        toggleTheme,
        login,
        register,
        logout,
        updateProfile,
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

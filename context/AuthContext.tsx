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
  badges: Badge[];
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

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  content: string;
  category: string;
  createdAt: string;
  kudos: number;
  fires: number;
  hearts: number;
  userReactions: {
    kudos?: boolean;
    fire?: boolean;
    heart?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  badges: Badge[];
  activities: Activity[];
  goals: Goal[];
  communityPosts: CommunityPost[];
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

  deleteGoal: (id: string) => void;

  addCommunityPost: (post: { content: string; category: string }) => void;

  togglePostReaction: (postId: string, reactionType: 'kudos' | 'fire' | 'heart') => void;

  quickLogin: (email: string) => void;
}

// AsyncStorage keys
const STORAGE_KEYS = {
  USERS: '@pulsetrack/users_v2',
  CURRENT_USER_ID: '@pulsetrack/currentUserId_v2',
  ACTIVITIES: '@pulsetrack/activities_v2',
  GOALS: '@pulsetrack/goals_v2',
  POSTS: '@pulsetrack/posts_v2',
  THEME: '@pulsetrack/theme',
};

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'First Step', icon: 'footsteps-outline', description: 'Log your first activity session', unlocked: true },
  { id: 'b2', name: 'Early Bird', icon: 'sunny-outline', description: 'Complete a morning focus session', unlocked: true },
  { id: 'b3', name: 'Code Ninja', icon: 'code-slash-outline', description: 'Complete over 2 hours of coding', unlocked: true },
  { id: 'b4', name: 'Iron Fitness', icon: 'fitness-outline', description: 'Complete 3+ workout sessions', unlocked: true },
  { id: 'b5', name: 'Streak Master', icon: 'flame-outline', description: 'Maintain a 5-day activity streak', unlocked: true },
  { id: 'b6', name: 'Bookworm', icon: 'book-outline', description: 'Log 60+ minutes of reading', unlocked: false },
  { id: 'b7', name: 'Zen Master', icon: 'heart-outline', description: 'Log 2+ mindfulness sessions', unlocked: false },
  { id: 'b8', name: 'XP Titan', icon: 'trophy-outline', description: 'Accumulate over 500 total XP', unlocked: false },
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr_demo_1',
    name: 'Alex Rivera',
    email: 'alex@pulsetrack.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Fullstack engineer & marathon enthusiast. Passionate about daily continuous growth!',
    role: 'Lead Architect',
    joinDate: '3 months ago',
    streak: 5,
    points: 460,
    level: 2,
    badges: INITIAL_BADGES,
    interests: ['Coding', 'Workout', 'Mindfulness'],
  },
  {
    id: 'usr_demo_2',
    name: 'Sarah Chen',
    email: 'sarah@pulsetrack.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'UI/UX Designer & avid reader. Building elegant product experiences.',
    role: 'Design Director',
    joinDate: '5 months ago',
    streak: 12,
    points: 890,
    level: 3,
    badges: INITIAL_BADGES,
    interests: ['Design', 'Reading', 'Productivity'],
  },
  {
    id: 'usr_demo_3',
    name: 'Marcus Vance',
    email: 'marcus@pulsetrack.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Triathlete & backend engineer. Always pushing boundaries!',
    role: 'Performance Engineer',
    joinDate: '1 month ago',
    streak: 8,
    points: 620,
    level: 3,
    badges: INITIAL_BADGES,
    interests: ['Workout', 'Coding'],
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_demo_1',
    userId: 'usr_demo_1',
    title: 'TypeScript & Reanimated UI Refactoring',
    category: 'Coding',
    duration: 60,
    points: 150,
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Refactored navigation animations and improved theme state handling.',
  },
  {
    id: 'act_demo_2',
    userId: 'usr_demo_1',
    title: '30-Min High Intensity Cardio Session',
    category: 'Workout',
    duration: 30,
    points: 75,
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: 'Completed 5 intervals with 175 average heart rate.',
  },
  {
    id: 'act_demo_3',
    userId: 'usr_demo_1',
    title: 'Atomic Habits - Chapter 4 & 5',
    category: 'Reading',
    duration: 40,
    points: 100,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: 'Key takeaway: Focus on systems instead of goals for sustained success.',
  },
];

const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Complete 30-min Focus Timer session', category: 'Productivity', completed: true, points: 50 },
  { id: 'g2', title: 'Log 45-min Workout or Run', category: 'Workout', completed: false, points: 60 },
  { id: 'g3', title: 'Read 20 pages of a book', category: 'Reading', completed: false, points: 40 },
  { id: 'g4', title: '15-min Evening Mindfulness', category: 'Mindfulness', completed: true, points: 30 },
];

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    userId: 'usr_demo_2',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    userRole: 'Design Director',
    content: 'Just finished reading "Deep Work" by Cal Newport! High performance requires uninterrupted concentration sessions. 📖✨',
    category: 'Reading',
    createdAt: '2 hours ago',
    kudos: 18,
    fires: 9,
    hearts: 14,
    userReactions: { kudos: true },
  },
  {
    id: 'post_2',
    userId: 'usr_demo_3',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    userRole: 'Performance Engineer',
    content: 'Smashed a 12km Morning Trail Run in under 52 mins! New personal record for elevation gain. 🏃‍♂️💨',
    category: 'Workout',
    createdAt: '4 hours ago',
    kudos: 32,
    fires: 24,
    hearts: 8,
    userReactions: { fire: true },
  },
  {
    id: 'post_3',
    userId: 'usr_demo_1',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userRole: 'Lead Architect',
    content: 'Completed 60 mins of React Native animation tuning! App fluid rate feels super responsive now. 🚀💻',
    category: 'Coding',
    createdAt: '6 hours ago',
    kudos: 21,
    fires: 15,
    hearts: 12,
    userReactions: {},
  },
];

export function evaluateBadges(user: User, userActivities: Activity[]): Badge[] {
  const totalMinutes = userActivities.reduce((acc, curr) => acc + curr.duration, 0);
  const codingMins = userActivities.filter(a => a.category === 'Coding').reduce((acc, curr) => acc + curr.duration, 0);
  const workoutCount = userActivities.filter(a => a.category === 'Workout').length;
  const readingMins = userActivities.filter(a => a.category === 'Reading').reduce((acc, curr) => acc + curr.duration, 0);
  const mindfulnessCount = userActivities.filter(a => a.category === 'Mindfulness').length;

  return [
    { id: 'b1', name: 'First Step', icon: 'footsteps-outline', description: 'Log your first activity session', unlocked: userActivities.length >= 1 },
    { id: 'b2', name: 'Early Bird', icon: 'sunny-outline', description: 'Complete a morning focus session', unlocked: userActivities.some(a => new Date(a.date).getHours() < 10) || user.streak >= 1 },
    { id: 'b3', name: 'Code Ninja', icon: 'code-slash-outline', description: 'Complete over 1 hour of coding', unlocked: codingMins >= 60 },
    { id: 'b4', name: 'Iron Fitness', icon: 'fitness-outline', description: 'Complete 2+ workout sessions', unlocked: workoutCount >= 2 },
    { id: 'b5', name: 'Streak Master', icon: 'flame-outline', description: 'Maintain a 3-day activity streak', unlocked: user.streak >= 3 },
    { id: 'b6', name: 'Bookworm', icon: 'book-outline', description: 'Log 30+ minutes of reading', unlocked: readingMins >= 30 },
    { id: 'b7', name: 'Zen Master', icon: 'heart-outline', description: 'Log 1+ mindfulness sessions', unlocked: mindfulnessCount >= 1 },
    { id: 'b8', name: 'XP Titan', icon: 'trophy-outline', description: 'Accumulate over 400 total XP', unlocked: user.points >= 400 },
  ];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [currentUserId, setCurrentUserId] = useState<string | null>('usr_demo_1');
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(true);

  const hasHydrated = useRef(false);

  const user = allUsers.find(u => u.id === currentUserId) ?? null;

  // Sync badges automatically whenever user or activities change
  const userActivities = user ? activities.filter(a => a.userId === user.id) : [];
  const currentBadges = user ? evaluateBadges(user, userActivities) : INITIAL_BADGES;

  // Load from AsyncStorage on startup
  useEffect(() => {
    (async () => {
      const [
        storedUsers,
        storedUserId,
        storedActivities,
        storedGoals,
        storedPosts,
        storedTheme,
      ] = await Promise.all([
        loadJSON<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID),
        loadJSON<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
        loadJSON<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS),
        loadJSON<CommunityPost[]>(STORAGE_KEYS.POSTS, INITIAL_COMMUNITY_POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
      ]);

      setAllUsers(storedUsers && storedUsers.length > 0 ? storedUsers : INITIAL_USERS);
      setCurrentUserId(storedUserId || 'usr_demo_1');
      setActivities(storedActivities && storedActivities.length > 0 ? storedActivities : INITIAL_ACTIVITIES);
      setGoals(storedGoals && storedGoals.length > 0 ? storedGoals : INITIAL_GOALS);
      setCommunityPosts(storedPosts && storedPosts.length > 0 ? storedPosts : INITIAL_COMMUNITY_POSTS);
      if (storedTheme === 'dark' || storedTheme === 'light') setThemeMode(storedTheme);

      hasHydrated.current = true;
      setIsLoading(false);
    })();
  }, []);

  // Persist to storage
  useEffect(() => {
    if (!hasHydrated.current) return;
    saveJSON(STORAGE_KEYS.USERS, allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (currentUserId) {
      AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId).catch(() => {});
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID).catch(() => {});
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
    saveJSON(STORAGE_KEYS.POSTS, communityPosts);
  }, [communityPosts]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEYS.THEME, themeMode).catch(() => {});
  }, [themeMode]);

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
      points: 100,
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
    const updatedUser = { ...user, badges: updatedBadges };
    setAllUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'userId'>) => {
    if (!user) return;
    const newActivity: Activity = {
      ...activityData,
      id: `act_${Date.now()}`,
      userId: user.id,
    };

    const nextActivities = [newActivity, ...activities];
    setActivities(nextActivities);

    const addedPoints = activityData.points || 50;
    const newTotalPoints = user.points + addedPoints;
    const newLevel = Math.floor(newTotalPoints / 300) + 1;
    const newUserActivities = nextActivities.filter(a => a.userId === user.id);
    const newEvaluatedBadges = evaluateBadges({ ...user, points: newTotalPoints, level: newLevel }, newUserActivities);

    updateProfile({
      points: newTotalPoints,
      level: newLevel,
      streak: user.streak > 0 ? user.streak : 1,
      badges: newEvaluatedBadges,
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

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addCommunityPost = (post: { content: string; category: string }) => {
    if (!user) return;
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: user.role || 'Active Achiever',
      content: post.content.trim(),
      category: post.category,
      createdAt: 'Just now',
      kudos: 1,
      fires: 0,
      hearts: 0,
      userReactions: { kudos: true },
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const togglePostReaction = (postId: string, reactionType: 'kudos' | 'fire' | 'heart') => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const reactions = p.userReactions || {};
          const isSelected = !!reactions[reactionType];

          const updatedReactions = {
            ...reactions,
            [reactionType]: !isSelected,
          };

          const kudosDelta = reactionType === 'kudos' ? (isSelected ? -1 : 1) : 0;
          const firesDelta = reactionType === 'fire' ? (isSelected ? -1 : 1) : 0;
          const heartsDelta = reactionType === 'heart' ? (isSelected ? -1 : 1) : 0;

          return {
            ...p,
            kudos: Math.max(0, p.kudos + kudosDelta),
            fires: Math.max(0, p.fires + firesDelta),
            hearts: Math.max(0, p.hearts + heartsDelta),
            userReactions: updatedReactions,
          };
        }
        return p;
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        badges: currentBadges,
        activities: userActivities,
        goals,
        communityPosts,
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
        deleteGoal,
        addCommunityPost,
        togglePostReaction,
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


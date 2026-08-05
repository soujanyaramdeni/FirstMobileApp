import { supabase } from '@/lib/supabase';
import { User, Activity, Goal, CommunityPost, Badge, evaluateBadges } from '@/context/AuthContext';

// Profile types for Supabase
export interface SupabaseProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string;
  join_date?: string;
  streak?: number;
  points?: number;
  level?: number;
  interests?: string[];
  created_at?: string;
}

export interface SupabaseActivity {
  id?: string;
  user_id: string;
  title: string;
  category: 'Workout' | 'Coding' | 'Reading' | 'Productivity' | 'Mindfulness' | 'Other';
  duration: number;
  points: number;
  date?: string;
  notes?: string;
}

export interface SupabaseGoal {
  id?: string;
  user_id: string;
  title: string;
  category: string;
  completed: boolean;
  points: number;
}

export interface SupabasePost {
  id?: string;
  user_id: string;
  content: string;
  category: string;
  kudos?: number;
  fires?: number;
  hearts?: number;
  created_at?: string;
}

const USERS_TABLE = "zenplan_users";

export const SupabaseService = {
  // Profiles
  async getProfiles(): Promise<SupabaseProfile[] | null> {
    try {
      const { data, error } = await supabase.from(USERS_TABLE).select('*');
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch profiles error:', e);
      return null;
    }
  },

  async getProfileById(id: string): Promise<SupabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (e) {
    console.warn('Supabase fetch profile error:', e);
    return null;
  }
},

async createProfile(profile: SupabaseProfile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(USERS_TABLE)
      .upsert(profile, {
        onConflict: 'id',
      });

    if (error) throw error;

    return true;
  } catch (e) {
    console.warn('Supabase create profile error:', e);
    return false;
  }
},

async updateProfile(
  userId: string,
  updates: Partial<SupabaseProfile>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(USERS_TABLE)
      .update(updates)
      .eq('id', userId);

    if (error) throw error;

    return true;
  } catch (e) {
    console.warn('Supabase update profile error:', e);
    return false;
  }
},


  // Activities
  async getActivities(): Promise<SupabaseActivity[] | null> {
    try {
      const { data, error } = await supabase.from('activities').select('*').order('date', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch activities error:', e);
      return null;
    }
  },

  async addActivity(activity: SupabaseActivity): Promise<SupabaseActivity | null> {
    try {
      const { data, error } = await supabase.from('activities').insert([activity]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase add activity error:', e);
      return null;
    }
  },

async deleteActivity(id: string): Promise<boolean> {

  if (id.startsWith('act_')) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (e) {
    console.warn('Supabase delete activity error:', e);
    return false;
  }
},

  // Goals
  async getGoals(): Promise<SupabaseGoal[] | null> {
    try {
      const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch goals error:', e);
      return null;
    }
  },

  async addGoal(goal: SupabaseGoal): Promise<SupabaseGoal | null> {
    try {
      const { data, error } = await supabase.from('goals').insert([goal]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase add goal error:', e);
      return null;
    }
  },

 async updateGoal(
  id: string,
  updates: Partial<SupabaseGoal>
): Promise<boolean> {

  if (
    id.startsWith('g_') ||
    id === 'g1' ||
    id === 'g2' ||
    id === 'g3' ||
    id === 'g4'
  ) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (e) {
    console.warn('Supabase update goal error:', e);
    return false;
  }
},

async deleteGoal(id: string): Promise<boolean> {

  if (
    id.startsWith('g_') ||
    id === 'g1' ||
    id === 'g2' ||
    id === 'g3' ||
    id === 'g4'
  ) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (e) {
    console.warn('Supabase delete goal error:', e);
    return false;
  }
},

  // Community Posts
  async getCommunityPosts(): Promise<SupabasePost[] | null> {
    try {
      const { data, error } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch posts error:', e);
      return null;
    }
  },

  async addCommunityPost(post: SupabasePost): Promise<SupabasePost | null> {
    try {
      const { data, error } = await supabase.from('community_posts').insert([post]).select().single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase add post error:', e);
      return null;
    }
  },

async updatePostReactions(
  id: string,
  counts: {
    kudos?: number;
    fires?: number;
    hearts?: number;
  }
): Promise<boolean> {

  if (id.startsWith('post_')) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('community_posts')
      .update(counts)
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (e) {
    console.warn('Supabase update post reactions error:', e);
    return false;
  }
},
};

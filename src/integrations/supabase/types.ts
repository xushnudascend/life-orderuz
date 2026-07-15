export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          key: string
          tier: Database["public"]["Enums"]["achievement_tier"]
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          key: string
          tier?: Database["public"]["Enums"]["achievement_tier"]
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          key?: string
          tier?: Database["public"]["Enums"]["achievement_tier"]
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      community_channels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          channel_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "community_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_quests: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          difficulty: number
          id: string
          quest_date: string
          status: Database["public"]["Enums"]["quest_status"]
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          quest_date?: string
          status?: Database["public"]["Enums"]["quest_status"]
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty?: number
          id?: string
          quest_date?: string
          status?: Database["public"]["Enums"]["quest_status"]
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          logged_date: string
          user_id: string
          xp_awarded: number
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          logged_date?: string
          user_id: string
          xp_awarded?: number
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          logged_date?: string
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string
          created_at: string
          description: string | null
          frequency: string
          id: string
          is_active: boolean
          scheduled_for: string | null
          sort_order: number
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          scheduled_for?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          scheduled_for?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          entry_date: string
          id: string
          mood: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          kind: string
          logged_date: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          kind: string
          logged_date?: string
          user_id: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          kind?: string
          logged_date?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_answers: {
        Row: {
          answer_value: string
          created_at: string
          id: string
          question_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_value: string
          created_at?: string
          id?: string
          question_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_value?: string
          created_at?: string
          id?: string
          question_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      party_challenges: {
        Row: {
          created_at: string
          goal: string | null
          id: string
          invite_code: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          goal?: string | null
          id?: string
          invite_code?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          goal?: string | null
          id?: string
          invite_code?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      party_members: {
        Row: {
          id: string
          joined_at: string
          party_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          party_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          party_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "party_members_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "party_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"] | null
          age: number | null
          ai_mentor_enabled: boolean
          animations_enabled: boolean
          archetype: string | null
          auto_shrink_on_excuse: boolean
          avatar_url: string | null
          created_at: string
          daily_reminder_time: string
          display_name: string | null
          height_cm: number | null
          id: string
          intizom_completed: boolean
          intizom_start_date: string | null
          is_public: boolean
          locale: string
          notify_daily: boolean
          notify_streak: boolean
          onboarding_completed_at: string | null
          plan_length_days: number | null
          sex: Database["public"]["Enums"]["sex"] | null
          timezone: string
          updated_at: string
          username: string | null
          viloyat: string | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          ai_mentor_enabled?: boolean
          animations_enabled?: boolean
          archetype?: string | null
          auto_shrink_on_excuse?: boolean
          avatar_url?: string | null
          created_at?: string
          daily_reminder_time?: string
          display_name?: string | null
          height_cm?: number | null
          id: string
          intizom_completed?: boolean
          intizom_start_date?: string | null
          is_public?: boolean
          locale?: string
          notify_daily?: boolean
          notify_streak?: boolean
          onboarding_completed_at?: string | null
          plan_length_days?: number | null
          sex?: Database["public"]["Enums"]["sex"] | null
          timezone?: string
          updated_at?: string
          username?: string | null
          viloyat?: string | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          ai_mentor_enabled?: boolean
          animations_enabled?: boolean
          archetype?: string | null
          auto_shrink_on_excuse?: boolean
          avatar_url?: string | null
          created_at?: string
          daily_reminder_time?: string
          display_name?: string | null
          height_cm?: number | null
          id?: string
          intizom_completed?: boolean
          intizom_start_date?: string | null
          is_public?: boolean
          locale?: string
          notify_daily?: boolean
          notify_streak?: boolean
          onboarding_completed_at?: string | null
          plan_length_days?: number | null
          sex?: Database["public"]["Enums"]["sex"] | null
          timezone?: string
          updated_at?: string
          username?: string | null
          viloyat?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      shields: {
        Row: {
          created_at: string
          id: string
          note: string | null
          reason: Database["public"]["Enums"]["shield_reason"]
          used_on: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          reason?: Database["public"]["Enums"]["shield_reason"]
          used_on?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          reason?: Database["public"]["Enums"]["shield_reason"]
          used_on?: string
          user_id?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          created_at: string
          current_days: number
          freeze_active_until: string | null
          last_check_in: string | null
          longest_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_days?: number
          freeze_active_until?: string | null
          last_check_in?: string | null
          longest_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_days?: number
          freeze_active_until?: string | null
          last_check_in?: string | null
          longest_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          created_at: string
          discipline_score: number
          last_action_at: string | null
          level: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discipline_score?: number
          last_action_at?: string | null
          level?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discipline_score?: number
          last_action_at?: string | null
          level?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          duration_min: number
          id: string
          kind: string
          logged_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_min?: number
          id?: string
          kind: string
          logged_date?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_min?: number
          id?: string
          kind?: string
          logged_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          note: string | null
          reference_id: string | null
          source: Database["public"]["Enums"]["xp_source"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          reference_id?: string | null
          source: Database["public"]["Enums"]["xp_source"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          reference_id?: string | null
          source?: Database["public"]["Enums"]["xp_source"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard_public: {
        Row: {
          display_name: string | null
          level: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_achievements: { Args: { _user_id: string }; Returns: undefined }
      ensure_daily_quests: {
        Args: never
        Returns: {
          completed_at: string | null
          created_at: string
          description: string | null
          difficulty: number
          id: string
          quest_date: string
          status: Database["public"]["Enums"]["quest_status"]
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }[]
        SetofOptions: {
          from: "*"
          to: "daily_quests"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      use_shield: {
        Args: { _note?: string }
        Returns: {
          created_at: string
          id: string
          note: string | null
          reason: Database["public"]["Enums"]["shield_reason"]
          used_on: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "shields"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      xp_to_level: { Args: { _xp: number }; Returns: number }
    }
    Enums: {
      achievement_tier: "bronze" | "silver" | "gold" | "platinum"
      activity_level:
        | "sedentary"
        | "light"
        | "moderate"
        | "active"
        | "very_active"
      quest_status: "pending" | "completed" | "skipped" | "failed"
      sex: "male" | "female" | "other" | "prefer_not_say"
      shield_reason: "missed_day" | "manual_freeze" | "sick" | "travel"
      xp_source:
        | "habit"
        | "quest"
        | "journal"
        | "achievement"
        | "streak_bonus"
        | "penalty"
        | "shield_use"
        | "workout"
        | "diet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_tier: ["bronze", "silver", "gold", "platinum"],
      activity_level: [
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ],
      quest_status: ["pending", "completed", "skipped", "failed"],
      sex: ["male", "female", "other", "prefer_not_say"],
      shield_reason: ["missed_day", "manual_freeze", "sick", "travel"],
      xp_source: [
        "habit",
        "quest",
        "journal",
        "achievement",
        "streak_bonus",
        "penalty",
        "shield_use",
        "workout",
        "diet",
      ],
    },
  },
} as const

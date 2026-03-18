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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_email: string
          created_at: string
          id: string
          ip: string | null
          new_value: Json | null
          old_value: Json | null
          target_id: string
          target_table: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_email: string
          created_at?: string
          id?: string
          ip?: string | null
          new_value?: Json | null
          old_value?: Json | null
          target_id: string
          target_table: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_email?: string
          created_at?: string
          id?: string
          ip?: string | null
          new_value?: Json | null
          old_value?: Json | null
          target_id?: string
          target_table?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blueprints: {
        Row: {
          created_at: string | null
          goal: string
          id: string
          is_featured: boolean
          monthly_cost_max: number | null
          monthly_cost_min: number | null
          published_at: string | null
          slug: string
          steps: Json
          subtitle: string | null
          target_audience: string | null
          title: string
          tool_ids: string[]
          updated_at: string | null
          view_count: number
        }
        Insert: {
          created_at?: string | null
          goal: string
          id?: string
          is_featured?: boolean
          monthly_cost_max?: number | null
          monthly_cost_min?: number | null
          published_at?: string | null
          slug: string
          steps?: Json
          subtitle?: string | null
          target_audience?: string | null
          title: string
          tool_ids?: string[]
          updated_at?: string | null
          view_count?: number
        }
        Update: {
          created_at?: string | null
          goal?: string
          id?: string
          is_featured?: boolean
          monthly_cost_max?: number | null
          monthly_cost_min?: number | null
          published_at?: string | null
          slug?: string
          steps?: Json
          subtitle?: string | null
          target_audience?: string | null
          title?: string
          tool_ids?: string[]
          updated_at?: string | null
          view_count?: number
        }
        Relationships: []
      }
      category_momentum: {
        Row: {
          avg_score_prev7d: number | null
          avg_viral_score: number | null
          category: string
          declining_count: number | null
          emerging_count: number | null
          fading_count: number | null
          id: string
          peak_count: number | null
          rising_count: number | null
          score_change_pct: number | null
          snapshot_date: string
          tool_count: number | null
          top_tool_id: string | null
          top_tool_name: string | null
        }
        Insert: {
          avg_score_prev7d?: number | null
          avg_viral_score?: number | null
          category: string
          declining_count?: number | null
          emerging_count?: number | null
          fading_count?: number | null
          id?: string
          peak_count?: number | null
          rising_count?: number | null
          score_change_pct?: number | null
          snapshot_date?: string
          tool_count?: number | null
          top_tool_id?: string | null
          top_tool_name?: string | null
        }
        Update: {
          avg_score_prev7d?: number | null
          avg_viral_score?: number | null
          category?: string
          declining_count?: number | null
          emerging_count?: number | null
          fading_count?: number | null
          id?: string
          peak_count?: number | null
          rising_count?: number | null
          score_change_pct?: number | null
          snapshot_date?: string
          tool_count?: number | null
          top_tool_id?: string | null
          top_tool_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "category_momentum_top_tool_id_fkey"
            columns: ["top_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_momentum_top_tool_id_fkey"
            columns: ["top_tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "category_momentum_top_tool_id_fkey"
            columns: ["top_tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_momentum_top_tool_id_fkey"
            columns: ["top_tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      enrichment_logs: {
        Row: {
          created_at: string | null
          errors: Json | null
          id: string
          logo_attempted: string[] | null
          logo_result: string | null
          pricing_detected: string | null
          run_type: string | null
          tool_id: string | null
          tool_name: string
        }
        Insert: {
          created_at?: string | null
          errors?: Json | null
          id?: string
          logo_attempted?: string[] | null
          logo_result?: string | null
          pricing_detected?: string | null
          run_type?: string | null
          tool_id?: string | null
          tool_name: string
        }
        Update: {
          created_at?: string | null
          errors?: Json | null
          id?: string
          logo_attempted?: string[] | null
          logo_result?: string | null
          pricing_detected?: string | null
          run_type?: string | null
          tool_id?: string | null
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrichment_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrichment_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "enrichment_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrichment_logs_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      github_stats: {
        Row: {
          delta_7d_stars: number | null
          forks: number
          id: string
          open_issues: number
          recorded_at: string
          stars: number
          tool_id: string
        }
        Insert: {
          delta_7d_stars?: number | null
          forks?: number
          id?: string
          open_issues?: number
          recorded_at?: string
          stars?: number
          tool_id: string
        }
        Update: {
          delta_7d_stars?: number | null
          forks?: number
          id?: string
          open_issues?: number
          recorded_at?: string
          stars?: number
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_stats_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "github_stats_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "github_stats_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "github_stats_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_analytics: {
        Row: {
          event_data: Json | null
          event_timestamp: string | null
          event_type: string
          id: string
          ip_address: unknown
          newsletter_id: string | null
          prompt_id: string
          session_id: string | null
          source_platform: string | null
          user_agent: string | null
          user_country: string | null
          user_source: string | null
          variant_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_timestamp?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          newsletter_id?: string | null
          prompt_id: string
          session_id?: string | null
          source_platform?: string | null
          user_agent?: string | null
          user_country?: string | null
          user_source?: string | null
          variant_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_timestamp?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          newsletter_id?: string | null
          prompt_id?: string
          session_id?: string | null
          source_platform?: string | null
          user_agent?: string | null
          user_country?: string | null
          user_source?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_analytics_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_engagement_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_analytics_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_analytics_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "prompt_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          feedback_type: string | null
          id: string
          is_helpful: boolean | null
          prompt_id: string
          rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          is_helpful?: boolean | null
          prompt_id: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          is_helpful?: boolean | null
          prompt_id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_feedback_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_engagement_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_feedback_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_scout_logs: {
        Row: {
          awards: number | null
          comment_author: string | null
          created_at: string | null
          discovered_at: string | null
          extracted_from_comment: boolean | null
          id: string
          matched_prompt_id: string | null
          platform: string
          post_author: string | null
          post_title: string | null
          post_url: string | null
          processed: boolean | null
          prompt_text: string
          replies: number | null
          subreddit_or_community: string | null
          upvotes: number | null
        }
        Insert: {
          awards?: number | null
          comment_author?: string | null
          created_at?: string | null
          discovered_at?: string | null
          extracted_from_comment?: boolean | null
          id?: string
          matched_prompt_id?: string | null
          platform: string
          post_author?: string | null
          post_title?: string | null
          post_url?: string | null
          processed?: boolean | null
          prompt_text: string
          replies?: number | null
          subreddit_or_community?: string | null
          upvotes?: number | null
        }
        Update: {
          awards?: number | null
          comment_author?: string | null
          created_at?: string | null
          discovered_at?: string | null
          extracted_from_comment?: boolean | null
          id?: string
          matched_prompt_id?: string | null
          platform?: string
          post_author?: string | null
          post_title?: string | null
          post_url?: string | null
          processed?: boolean | null
          prompt_text?: string
          replies?: number | null
          subreddit_or_community?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_scout_logs_matched_prompt_id_fkey"
            columns: ["matched_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_engagement_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_scout_logs_matched_prompt_id_fkey"
            columns: ["matched_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          avg_performance_rating: number | null
          category: string
          created_at: string | null
          description: string | null
          example_variables: Json | null
          id: string
          is_active: boolean | null
          name: string
          required_variables: string[] | null
          template_content: string
          tokens_per_execution: number | null
          updated_at: string | null
          usage_count: number | null
          use_case: string | null
          version: number | null
        }
        Insert: {
          avg_performance_rating?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          example_variables?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          required_variables?: string[] | null
          template_content: string
          tokens_per_execution?: number | null
          updated_at?: string | null
          usage_count?: number | null
          use_case?: string | null
          version?: number | null
        }
        Update: {
          avg_performance_rating?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          example_variables?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          required_variables?: string[] | null
          template_content?: string
          tokens_per_execution?: number | null
          updated_at?: string | null
          usage_count?: number | null
          use_case?: string | null
          version?: number | null
        }
        Relationships: []
      }
      prompt_variants: {
        Row: {
          clicks: number | null
          content: string
          conversion_rate: number | null
          conversions: number | null
          cost_per_impression: number | null
          created_at: string | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          is_winner: boolean | null
          prompt_id: string
          significance_score: number | null
          test_end_date: string | null
          test_name: string | null
          test_start_date: string | null
          test_status: string | null
          title: string | null
          traffic_percentage: number | null
          updated_at: string | null
          variant_name: string
        }
        Insert: {
          clicks?: number | null
          content: string
          conversion_rate?: number | null
          conversions?: number | null
          cost_per_impression?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          is_winner?: boolean | null
          prompt_id: string
          significance_score?: number | null
          test_end_date?: string | null
          test_name?: string | null
          test_start_date?: string | null
          test_status?: string | null
          title?: string | null
          traffic_percentage?: number | null
          updated_at?: string | null
          variant_name: string
        }
        Update: {
          clicks?: number | null
          content?: string
          conversion_rate?: number | null
          conversions?: number | null
          cost_per_impression?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          is_winner?: boolean | null
          prompt_id?: string
          significance_score?: number | null
          test_end_date?: string | null
          test_name?: string | null
          test_start_date?: string | null
          test_status?: string | null
          title?: string | null
          traffic_percentage?: number | null
          updated_at?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_variants_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_engagement_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_variants_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          awards: number | null
          bookmarks: number | null
          category: string
          content: string
          cost_estimate: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          engagement_score: number | null
          featured_in_newsletter: boolean | null
          id: string
          is_active: boolean | null
          newsletter_date: string | null
          newsletter_performance: Json | null
          performance_rating: number | null
          replies: number | null
          source: string | null
          source_author: string | null
          source_url: string | null
          tags: string[] | null
          title: string
          token_usage: number | null
          updated_at: string | null
          updated_by: string | null
          upvotes: number | null
          user_rating_count: number | null
          version: number | null
        }
        Insert: {
          awards?: number | null
          bookmarks?: number | null
          category: string
          content: string
          cost_estimate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          engagement_score?: number | null
          featured_in_newsletter?: boolean | null
          id?: string
          is_active?: boolean | null
          newsletter_date?: string | null
          newsletter_performance?: Json | null
          performance_rating?: number | null
          replies?: number | null
          source?: string | null
          source_author?: string | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          token_usage?: number | null
          updated_at?: string | null
          updated_by?: string | null
          upvotes?: number | null
          user_rating_count?: number | null
          version?: number | null
        }
        Update: {
          awards?: number | null
          bookmarks?: number | null
          category?: string
          content?: string
          cost_estimate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          engagement_score?: number | null
          featured_in_newsletter?: boolean | null
          id?: string
          is_active?: boolean | null
          newsletter_date?: string | null
          newsletter_performance?: Json | null
          performance_rating?: number | null
          replies?: number | null
          source?: string | null
          source_author?: string | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          token_usage?: number | null
          updated_at?: string | null
          updated_by?: string | null
          upvotes?: number | null
          user_rating_count?: number | null
          version?: number | null
        }
        Relationships: []
      }
      score_history: {
        Row: {
          community_score: number | null
          creator_buzz_score: number | null
          growth_momentum_score: number | null
          id: string
          recorded_at: string | null
          search_interest_score: number | null
          tool_id: string | null
          viral_score: number
        }
        Insert: {
          community_score?: number | null
          creator_buzz_score?: number | null
          growth_momentum_score?: number | null
          id?: string
          recorded_at?: string | null
          search_interest_score?: number | null
          tool_id?: string | null
          viral_score: number
        }
        Update: {
          community_score?: number | null
          creator_buzz_score?: number | null
          growth_momentum_score?: number | null
          id?: string
          recorded_at?: string | null
          search_interest_score?: number | null
          tool_id?: string | null
          viral_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      scout_logs: {
        Row: {
          author: string | null
          created_at: string | null
          draft_response: string | null
          engagement_count: number | null
          id: string
          keywords: string[] | null
          num_comments: number | null
          platform: string
          post_id: string | null
          post_title: string | null
          post_url: string | null
          query_matched: string
          raw_data: Json | null
          score: number | null
          sent_to_slack: boolean | null
          sentiment: string | null
          source: string | null
          source_url: string
          subreddit: string | null
          tool_name: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          draft_response?: string | null
          engagement_count?: number | null
          id?: string
          keywords?: string[] | null
          num_comments?: number | null
          platform: string
          post_id?: string | null
          post_title?: string | null
          post_url?: string | null
          query_matched: string
          raw_data?: Json | null
          score?: number | null
          sent_to_slack?: boolean | null
          sentiment?: string | null
          source?: string | null
          source_url: string
          subreddit?: string | null
          tool_name?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          draft_response?: string | null
          engagement_count?: number | null
          id?: string
          keywords?: string[] | null
          num_comments?: number | null
          platform?: string
          post_id?: string | null
          post_title?: string | null
          post_url?: string | null
          query_matched?: string
          raw_data?: Json | null
          score?: number | null
          sent_to_slack?: boolean | null
          sentiment?: string | null
          source?: string | null
          source_url?: string
          subreddit?: string | null
          tool_name?: string | null
        }
        Relationships: []
      }
      stack_goals: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          label: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          label: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          label?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stacks: {
        Row: {
          connection_note: string | null
          created_at: string | null
          display_order: number
          goal_id: string
          id: string
          is_optional: boolean
          monthly_cost_override: number | null
          role_in_stack: string
          tool_id: string
          updated_at: string | null
        }
        Insert: {
          connection_note?: string | null
          created_at?: string | null
          display_order?: number
          goal_id: string
          id?: string
          is_optional?: boolean
          monthly_cost_override?: number | null
          role_in_stack: string
          tool_id: string
          updated_at?: string | null
        }
        Update: {
          connection_note?: string | null
          created_at?: string | null
          display_order?: number
          goal_id?: string
          id?: string
          is_optional?: boolean
          monthly_cost_override?: number | null
          role_in_stack?: string
          tool_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stacks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "stack_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stacks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stacks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "stacks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stacks_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      submission_audit: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_status: string | null
          notes: string | null
          old_status: string | null
          submission_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          submission_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_audit_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          best_for: string | null
          category: string | null
          created_at: string | null
          description: string
          email: string
          id: string
          key_features: Json | null
          logo_url: string | null
          not_best_fit: string | null
          onboarding_expectations: string | null
          pricing_info: string | null
          processed_at: string | null
          status: string | null
          stripe_payment_status: string | null
          stripe_session_id: string | null
          tier: string
          tool_name: string
          tool_url: string
          use_example: string | null
        }
        Insert: {
          best_for?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          email: string
          id?: string
          key_features?: Json | null
          logo_url?: string | null
          not_best_fit?: string | null
          onboarding_expectations?: string | null
          pricing_info?: string | null
          processed_at?: string | null
          status?: string | null
          stripe_payment_status?: string | null
          stripe_session_id?: string | null
          tier: string
          tool_name: string
          tool_url: string
          use_example?: string | null
        }
        Update: {
          best_for?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          email?: string
          id?: string
          key_features?: Json | null
          logo_url?: string | null
          not_best_fit?: string | null
          onboarding_expectations?: string | null
          pricing_info?: string | null
          processed_at?: string | null
          status?: string | null
          stripe_payment_status?: string | null
          stripe_session_id?: string | null
          tier?: string
          tool_name?: string
          tool_url?: string
          use_example?: string | null
        }
        Relationships: []
      }
      tool_aliases: {
        Row: {
          alias: string
          canonical_tool_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          alias: string
          canonical_tool_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          alias?: string
          canonical_tool_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_aliases_canonical_tool_id_fkey"
            columns: ["canonical_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_aliases_canonical_tool_id_fkey"
            columns: ["canonical_tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "tool_aliases_canonical_tool_id_fkey"
            columns: ["canonical_tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_aliases_canonical_tool_id_fkey"
            columns: ["canonical_tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_candidates: {
        Row: {
          avg_engagement: number
          created_at: string
          first_seen_at: string
          id: string
          last_seen_at: string
          mention_count_7d: number
          name: string
          platforms: string[]
          reviewed_at: string | null
          reviewed_by: string | null
          sample_posts: string[]
          status: string
          updated_at: string
        }
        Insert: {
          avg_engagement?: number
          created_at?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          mention_count_7d?: number
          name: string
          platforms?: string[]
          reviewed_at?: string | null
          reviewed_by?: string | null
          sample_posts?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          avg_engagement?: number
          created_at?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          mention_count_7d?: number
          name?: string
          platforms?: string[]
          reviewed_at?: string | null
          reviewed_by?: string | null
          sample_posts?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          affiliate_url: string | null
          app_store_id: string | null
          app_store_rank: number | null
          app_store_rank_updated_at: string | null
          archived_at: string | null
          archived_reason: string | null
          best_for: string | null
          category: string | null
          community_score: number | null
          consecutive_low_score_days: number
          created_at: string | null
          creator_buzz_score: number | null
          deleted_at: string | null
          description: string
          enrichment_data: Json | null
          enrichment_status: string | null
          forecast_data: Json | null
          github_url: string | null
          growth_momentum_score: number | null
          has_free_tier: boolean | null
          id: string
          is_archived: boolean
          is_dev_submitted: boolean
          is_featured: boolean | null
          key_features: Json | null
          last_enriched_at: string | null
          last_score_update: string | null
          listing_tier: string | null
          logo_source: string | null
          logo_url: string | null
          monthly_cost_usd: number | null
          name: string
          not_best_fit: string | null
          onboarding_expectations: string | null
          pricing_info: string | null
          pricing_model: string | null
          pricing_tiers: Json | null
          product_hunt_slug: string | null
          score_delta_24h: number | null
          score_delta_30d: number | null
          score_delta_7d: number | null
          search_interest_score: number | null
          search_keyword: string | null
          slug: string | null
          sparkline_data: Json | null
          trend_phase: string | null
          trend_phase_updated_at: string | null
          updated_at: string | null
          url: string
          use_example: string | null
          viral_score: number | null
        }
        Insert: {
          affiliate_url?: string | null
          app_store_id?: string | null
          app_store_rank?: number | null
          app_store_rank_updated_at?: string | null
          archived_at?: string | null
          archived_reason?: string | null
          best_for?: string | null
          category?: string | null
          community_score?: number | null
          consecutive_low_score_days?: number
          created_at?: string | null
          creator_buzz_score?: number | null
          deleted_at?: string | null
          description: string
          enrichment_data?: Json | null
          enrichment_status?: string | null
          forecast_data?: Json | null
          github_url?: string | null
          growth_momentum_score?: number | null
          has_free_tier?: boolean | null
          id?: string
          is_archived?: boolean
          is_dev_submitted?: boolean
          is_featured?: boolean | null
          key_features?: Json | null
          last_enriched_at?: string | null
          last_score_update?: string | null
          listing_tier?: string | null
          logo_source?: string | null
          logo_url?: string | null
          monthly_cost_usd?: number | null
          name: string
          not_best_fit?: string | null
          onboarding_expectations?: string | null
          pricing_info?: string | null
          pricing_model?: string | null
          pricing_tiers?: Json | null
          product_hunt_slug?: string | null
          score_delta_24h?: number | null
          score_delta_30d?: number | null
          score_delta_7d?: number | null
          search_interest_score?: number | null
          search_keyword?: string | null
          slug?: string | null
          sparkline_data?: Json | null
          trend_phase?: string | null
          trend_phase_updated_at?: string | null
          updated_at?: string | null
          url: string
          use_example?: string | null
          viral_score?: number | null
        }
        Update: {
          affiliate_url?: string | null
          app_store_id?: string | null
          app_store_rank?: number | null
          app_store_rank_updated_at?: string | null
          archived_at?: string | null
          archived_reason?: string | null
          best_for?: string | null
          category?: string | null
          community_score?: number | null
          consecutive_low_score_days?: number
          created_at?: string | null
          creator_buzz_score?: number | null
          deleted_at?: string | null
          description?: string
          enrichment_data?: Json | null
          enrichment_status?: string | null
          forecast_data?: Json | null
          github_url?: string | null
          growth_momentum_score?: number | null
          has_free_tier?: boolean | null
          id?: string
          is_archived?: boolean
          is_dev_submitted?: boolean
          is_featured?: boolean | null
          key_features?: Json | null
          last_enriched_at?: string | null
          last_score_update?: string | null
          listing_tier?: string | null
          logo_source?: string | null
          logo_url?: string | null
          monthly_cost_usd?: number | null
          name?: string
          not_best_fit?: string | null
          onboarding_expectations?: string | null
          pricing_info?: string | null
          pricing_model?: string | null
          pricing_tiers?: Json | null
          product_hunt_slug?: string | null
          score_delta_24h?: number | null
          score_delta_30d?: number | null
          score_delta_7d?: number | null
          search_interest_score?: number | null
          search_keyword?: string | null
          slug?: string | null
          sparkline_data?: Json | null
          trend_phase?: string | null
          trend_phase_updated_at?: string | null
          updated_at?: string | null
          url?: string
          use_example?: string | null
          viral_score?: number | null
        }
        Relationships: []
      }
      trend_signals: {
        Row: {
          created_at: string | null
          github_spike: boolean | null
          hn_spike: boolean | null
          id: string
          reddit_spike: boolean | null
          score_3d_ago: number | null
          score_today: number | null
          signal_date: string
          signal_strength: number | null
          signal_type: string
          tool_id: string
          velocity_3d: number | null
        }
        Insert: {
          created_at?: string | null
          github_spike?: boolean | null
          hn_spike?: boolean | null
          id?: string
          reddit_spike?: boolean | null
          score_3d_ago?: number | null
          score_today?: number | null
          signal_date?: string
          signal_strength?: number | null
          signal_type: string
          tool_id: string
          velocity_3d?: number | null
        }
        Update: {
          created_at?: string | null
          github_spike?: boolean | null
          hn_spike?: boolean | null
          id?: string
          reddit_spike?: boolean | null
          score_3d_ago?: number | null
          score_today?: number | null
          signal_date?: string
          signal_strength?: number | null
          signal_type?: string
          tool_id?: string
          velocity_3d?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_definitions: {
        Row: {
          created_at: string | null
          cron_schedule: string | null
          dependencies: string[] | null
          description: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          name: string
          timeout_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cron_schedule?: string | null
          dependencies?: string[] | null
          description?: string | null
          endpoint: string
          id: string
          is_active?: boolean | null
          name: string
          timeout_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cron_schedule?: string | null
          dependencies?: string[] | null
          description?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          name?: string
          timeout_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          metadata: Json | null
          started_at: string
          status: string
          triggered_by: string | null
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status: string
          triggered_by?: string | null
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          started_at?: string
          status?: string
          triggered_by?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_health_summary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      prompt_engagement_summary: {
        Row: {
          avg_rating: number | null
          category: string | null
          click_count: number | null
          created_at: string | null
          id: string | null
          last_engagement: string | null
          save_count: number | null
          share_count: number | null
          title: string | null
          total_ratings: number | null
          updated_at: string | null
          view_count: number | null
        }
        Relationships: []
      }
      recent_scout_prompts: {
        Row: {
          awards: number | null
          created_at: string | null
          id: string | null
          platform: string | null
          post_url: string | null
          processed: boolean | null
          prompt_text: string | null
          replies: number | null
          upvotes: number | null
        }
        Relationships: []
      }
      top_prompts_by_category: {
        Row: {
          category: string | null
          created_at: string | null
          engagement_score: number | null
          featured_in_newsletter: boolean | null
          newsletter_performance: Json | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          engagement_score?: number | null
          featured_in_newsletter?: boolean | null
          newsletter_performance?: Json | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          engagement_score?: number | null
          featured_in_newsletter?: boolean | null
          newsletter_performance?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      v_category_momentum_latest: {
        Row: {
          avg_score_prev7d: number | null
          avg_viral_score: number | null
          category: string | null
          declining_count: number | null
          emerging_count: number | null
          fading_count: number | null
          peak_count: number | null
          rising_count: number | null
          score_change_pct: number | null
          snapshot_date: string | null
          tool_count: number | null
          top_tool_name: string | null
        }
        Relationships: []
      }
      v_category_performance: {
        Row: {
          avg_buzz: number | null
          avg_community: number | null
          avg_dev_momentum: number | null
          avg_growth: number | null
          avg_viral_score: number | null
          category: string | null
          featured_count: number | null
          max_viral_score: number | null
          tool_count: number | null
        }
        Relationships: []
      }
      v_enrichment_health: {
        Row: {
          day: string | null
          run_type: string | null
          success_rate_pct: number | null
          successful_runs: number | null
          total_runs: number | null
        }
        Relationships: []
      }
      v_platform_lead_lag: {
        Row: {
          avg_days_before_spike: number | null
          platform: string | null
          sample_count: number | null
        }
        Relationships: []
      }
      v_platform_trends_daily: {
        Row: {
          avg_score: number | null
          day: string | null
          mention_count: number | null
          negative_count: number | null
          neutral_count: number | null
          platform: string | null
          positive_count: number | null
        }
        Relationships: []
      }
      v_score_distribution: {
        Row: {
          avg_score: number | null
          score_bucket: string | null
          tool_count: number | null
        }
        Relationships: []
      }
      v_similar_trajectories: {
        Row: {
          category: string | null
          emerging_tool_id: string | null
          emerging_tool_name: string | null
          first_seen: string | null
          historical_tool_id: string | null
          historical_tool_name: string | null
          historical_tool_slug: string | null
          peak_score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["historical_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["historical_tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["historical_tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "score_history_tool_id_fkey"
            columns: ["historical_tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      v_submission_funnel: {
        Row: {
          approved: number | null
          avg_review_hours: number | null
          month: string | null
          paid_to_approved_pct: number | null
          reached_paid: number | null
          rejected: number | null
          submission_tier: string | null
          submit_to_paid_pct: number | null
          total_submitted: number | null
        }
        Relationships: []
      }
      v_subreddit_performance: {
        Row: {
          avg_comments: number | null
          avg_upvotes: number | null
          latest_post_at: string | null
          positive_pct: number | null
          subreddit: string | null
          total_posts: number | null
        }
        Relationships: []
      }
      v_top_velocity: {
        Row: {
          category: string | null
          id: string | null
          listing_tier: string | null
          name: string | null
          score_delta_24h: number | null
          score_delta_7d: number | null
          slug: string | null
          velocity_rank: number | null
          viral_score: number | null
        }
        Relationships: []
      }
      v_trend_lifecycle: {
        Row: {
          category: string | null
          id: string | null
          is_featured: boolean | null
          last_score_update: string | null
          listing_tier: string | null
          name: string | null
          score_delta_24h: number | null
          score_delta_30d: number | null
          score_delta_7d: number | null
          slug: string | null
          trend_phase: string | null
          trend_phase_updated_at: string | null
          velocity_per_day: number | null
          viral_score: number | null
        }
        Insert: {
          category?: string | null
          id?: string | null
          is_featured?: boolean | null
          last_score_update?: string | null
          listing_tier?: string | null
          name?: string | null
          score_delta_24h?: number | null
          score_delta_30d?: number | null
          score_delta_7d?: number | null
          slug?: string | null
          trend_phase?: string | null
          trend_phase_updated_at?: string | null
          velocity_per_day?: never
          viral_score?: number | null
        }
        Update: {
          category?: string | null
          id?: string | null
          is_featured?: boolean | null
          last_score_update?: string | null
          listing_tier?: string | null
          name?: string | null
          score_delta_24h?: number | null
          score_delta_30d?: number | null
          score_delta_7d?: number | null
          slug?: string | null
          trend_phase?: string | null
          trend_phase_updated_at?: string | null
          velocity_per_day?: never
          viral_score?: number | null
        }
        Relationships: []
      }
      v_weak_signals: {
        Row: {
          category: string | null
          github_spike: boolean | null
          hn_spike: boolean | null
          name: string | null
          reddit_spike: boolean | null
          score_delta_7d: number | null
          signal_date: string | null
          signal_strength: number | null
          signal_type: string | null
          slug: string | null
          tool_id: string | null
          velocity_3d: number | null
          viral_score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_similar_trajectories"
            referencedColumns: ["emerging_tool_id"]
          },
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_top_velocity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_signals_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "v_trend_lifecycle"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_health_summary: {
        Row: {
          avg_duration_ms: number | null
          cron_schedule: string | null
          failed_runs: number | null
          id: string | null
          is_active: boolean | null
          last_run_at: string | null
          last_success_at: string | null
          name: string | null
          stale_runs: number | null
          success_rate: number | null
          successful_runs: number | null
          total_runs: number | null
        }
        Relationships: []
      }
      workflow_latest_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          cron_schedule: string | null
          dependencies: string[] | null
          duration_ms: number | null
          error_message: string | null
          id: string | null
          is_active: boolean | null
          metadata: Json | null
          started_at: string | null
          status: string | null
          timeout_minutes: number | null
          triggered_by: string | null
          workflow_id: string | null
          workflow_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_health_summary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_prompt_engagement_score: {
        Args: { prompt_id: string }
        Returns: number
      }
      cleanup_old_score_history: { Args: never; Returns: number }
      cleanup_old_scout_logs: { Args: never; Returns: number }
      refresh_sparkline_data: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

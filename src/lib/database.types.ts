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
      bundles: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          items: Json
          margin_percentage: number | null
          name: string
        }
        Insert: {
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          items: Json
          margin_percentage?: number | null
          name: string
        }
        Update: {
          base_price?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          items?: Json
          margin_percentage?: number | null
          name?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          start_time: string
          title: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          title: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      clientes_cctv: {
        Row: {
          email_notificaciones: string | null
          id: string
          nombre_cliente: string
          pass_dvr: string | null
          sitio_hik_id: string | null
          status_actual: string | null
          ultimo_chequeo: string | null
          usuario_dvr: string | null
        }
        Insert: {
          email_notificaciones?: string | null
          id?: string
          nombre_cliente: string
          pass_dvr?: string | null
          sitio_hik_id?: string | null
          status_actual?: string | null
          ultimo_chequeo?: string | null
          usuario_dvr?: string | null
        }
        Update: {
          email_notificaciones?: string | null
          id?: string
          nombre_cliente?: string
          pass_dvr?: string | null
          sitio_hik_id?: string | null
          status_actual?: string | null
          ultimo_chequeo?: string | null
          usuario_dvr?: string | null
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          client_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          estimated_value: number | null
          id: string
          notes: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          client_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          client_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      crm_measurements: {
        Row: {
          created_at: string | null
          distance: number
          from_point: Json
          id: string
          label: string | null
          lead_id: string | null
          to_point: Json
        }
        Insert: {
          created_at?: string | null
          distance: number
          from_point: Json
          id?: string
          label?: string | null
          lead_id?: string | null
          to_point: Json
        }
        Update: {
          created_at?: string | null
          distance?: number
          from_point?: Json
          id?: string
          label?: string | null
          lead_id?: string | null
          to_point?: Json
        }
        Relationships: [
          {
            foreignKeyName: "crm_measurements_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      dispositivos_hik: {
        Row: {
          canales_activos: number | null
          cliente_id: string | null
          id: string
          modelo_equipo: string | null
          numero_serie: string | null
          ubicacion_lat_long: unknown
        }
        Insert: {
          canales_activos?: number | null
          cliente_id?: string | null
          id?: string
          modelo_equipo?: string | null
          numero_serie?: string | null
          ubicacion_lat_long?: unknown
        }
        Update: {
          canales_activos?: number | null
          cliente_id?: string | null
          id?: string
          modelo_equipo?: string | null
          numero_serie?: string | null
          ubicacion_lat_long?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "dispositivos_hik_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_cctv"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          details: string | null
          email: string
          estimate: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          email: string
          estimate?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          details?: string | null
          email?: string
          estimate?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          items: Json
          lead_id: string | null
          status: string | null
          total: number
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items: Json
          lead_id?: string | null
          status?: string | null
          total: number
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items?: Json
          lead_id?: string | null
          status?: string | null
          total?: number
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          reminder_sent: boolean | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

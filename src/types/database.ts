export type UserRole = "customer" | "staff" | "administrator";

export type ProductStatus = "draft" | "active" | "archived";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          mobile_number: string;
          region: string;
          province: string;
          city: string;
          barangay: string;
          postal_code: string;
          street_address: string;
          delivery_notes: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["addresses"]["Row"]> & {
          user_id: string;
          full_name: string;
          mobile_number: string;
          region: string;
          province: string;
          city: string;
          barangay: string;
          postal_code: string;
          street_address: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          brand_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          specifications: Json;
          keywords: string[];
          status: ProductStatus;
          price_cents: number;
          sale_price_cents: number | null;
          badge: string | null;
          is_featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          brand_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          specifications?: Json;
          keywords?: string[];
          status?: ProductStatus;
          price_cents: number;
          sale_price_cents?: number | null;
          badge?: string | null;
          is_featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["brands"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          storage_path: string;
          alt_text: string;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["product_images"]["Row"]> & {
          product_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_cents: number | null;
          sale_price_cents: number | null;
          attributes: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["product_variants"]["Row"]> & {
          product_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
        Relationships: [];
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          reserved_quantity: number;
          low_stock_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inventory"]["Row"]> & {
          product_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
        Relationships: [];
      };
      homepage_banners: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          image_url: string;
          href: string | null;
          is_active: boolean;
          starts_at: string | null;
          ends_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["homepage_banners"]["Row"]> & {
          title: string;
          image_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_banners"]["Insert"]>;
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          title: string;
          section_key: string;
          config: Json;
          is_visible: boolean;
          sort_order: number;
          starts_at: string | null;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["homepage_sections"]["Row"]> & {
          title: string;
          section_key: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_sections"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status:
            | "awaiting_payment"
            | "for_verification"
            | "paid"
            | "processing"
            | "packed"
            | "shipped"
            | "completed"
            | "cancelled"
            | "refunded";
          payment_status:
            | "awaiting_payment"
            | "proof_submitted"
            | "under_review"
            | "paid"
            | "rejected"
            | "expired"
            | "refunded";
          subtotal_cents: number;
          discount_cents: number;
          shipping_cents: number;
          total_cents: number;
          shipping_address: Json;
          customer_notes: string | null;
          internal_notes: string | null;
          expires_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          user_id: string;
          order_number: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          sku: string | null;
          quantity: number;
          unit_price_cents: number;
          subtotal_cents: number;
          snapshot: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & {
          order_id: string;
          product_name: string;
          quantity: number;
          unit_price_cents: number;
          subtotal_cents: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      payment_proofs: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          sender_name: string;
          sender_mobile_number: string;
          amount_paid_cents: number;
          gcash_reference_number: string;
          paid_at: string;
          storage_path: string;
          mime_type: string;
          file_size_bytes: number;
          status:
            | "awaiting_payment"
            | "proof_submitted"
            | "under_review"
            | "paid"
            | "rejected"
            | "expired"
            | "refunded";
          review_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payment_proofs"]["Row"]> & {
          order_id: string;
          user_id: string;
          sender_name: string;
          sender_mobile_number: string;
          amount_paid_cents: number;
          gcash_reference_number: string;
          paid_at: string;
          storage_path: string;
          mime_type: string;
          file_size_bytes: number;
        };
        Update: Partial<Database["public"]["Tables"]["payment_proofs"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]> & {
          action: string;
          entity_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      product_status: ProductStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      product_status: ProductStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

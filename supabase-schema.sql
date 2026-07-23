-- MIInfotech Supabase Relational Database Schema
-- Run this in your Supabase SQL Editor to provision all tables & secure RLS policies.

-- 1. Services Table (Dynamic Services Page and Landing Pages)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    iconName TEXT DEFAULT 'Monitor',
    startingPrice TEXT,
    timeframe TEXT,
    seoKeywords TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    symptoms TEXT[] DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    "order" INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can view active services
CREATE POLICY "Allow public read access to services" ON public.services
    FOR SELECT USING (enabled = true OR auth.role() = 'authenticated');

-- Write policy: Authenticated admins can do anything
CREATE POLICY "Allow authenticated full write to services" ON public.services
    FOR ALL USING (auth.role() = 'authenticated');


-- 2. Blog CMS Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
    featured BOOLEAN DEFAULT false,
    date TEXT,
    readTime TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can view published blogs
CREATE POLICY "Allow public read access to published blogs" ON public.blogs
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

-- Write policy: Admin write access
CREATE POLICY "Allow authenticated full write to blogs" ON public.blogs
    FOR ALL USING (auth.role() = 'authenticated');


-- 3. Affiliate Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    description TEXT,
    specifications TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    price NUMERIC(10, 2),
    image TEXT,
    affiliateLink TEXT,
    featured BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    "order" INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can view enabled products
CREATE POLICY "Allow public read access to enabled products" ON public.products
    FOR SELECT USING (enabled = true OR auth.role() = 'authenticated');

-- Write policy: Admin write access
CREATE POLICY "Allow authenticated full write to products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');


-- 4. Gallery / Project Images Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT NOT NULL,
    album TEXT DEFAULT 'General',
    isProject BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Select policy: Public read access
CREATE POLICY "Allow public read access to gallery" ON public.gallery
    FOR SELECT USING (true);

-- Write policy: Admin write access
CREATE POLICY "Allow authenticated full write to gallery" ON public.gallery
    FOR ALL USING (auth.role() = 'authenticated');


-- 5. Testimonials (Customer Reviews) Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Customer',
    location TEXT DEFAULT 'Hassan',
    rating INT DEFAULT 5,
    date TEXT,
    comment TEXT,
    verified BOOLEAN DEFAULT true,
    approved BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can view approved testimonials
CREATE POLICY "Allow public read access to approved testimonials" ON public.testimonials
    FOR SELECT USING (approved = true OR auth.role() = 'authenticated');

-- Write policy: Admin full access, Public can INSERT (submit review)
CREATE POLICY "Allow public insert of testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated full write to testimonials" ON public.testimonials
    FOR ALL USING (auth.role() = 'authenticated');


-- 6. Contact Enquiries Table
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for contact enquiries
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Read policy: ONLY authenticated admins can read enquiries (protects user privacy)
CREATE POLICY "Allow authenticated users to read enquiries" ON public.contact_enquiries
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert policy: Anyone can submit a contact enquiry
CREATE POLICY "Allow public insert of enquiries" ON public.contact_enquiries
    FOR INSERT WITH CHECK (true);

-- Update/delete policy: Admin only
CREATE POLICY "Allow authenticated write to enquiries" ON public.contact_enquiries
    FOR ALL USING (auth.role() = 'authenticated');


-- 7. FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can view FAQs
CREATE POLICY "Allow public read access to faqs" ON public.faqs
    FOR SELECT USING (true);

-- Write policy: Admin write access
CREATE POLICY "Allow authenticated full write to faqs" ON public.faqs
    FOR ALL USING (auth.role() = 'authenticated');


-- 8. Website Settings Table (Single Row Settings Storage)
CREATE TABLE IF NOT EXISTS public.website_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_settings',
    business_name TEXT NOT NULL DEFAULT 'MIINFOTECH',
    logo_url TEXT,
    phone_primary TEXT NOT NULL DEFAULT '+91 9964761624',
    phone_secondary TEXT,
    whatsapp_number TEXT NOT NULL DEFAULT '+91 9964761624',
    email_support TEXT DEFAULT 'miinfotech.support@gmail.com',
    address_physical TEXT DEFAULT 'Hassan, Karnataka, India',
    opening_hours_mon_sat TEXT DEFAULT '09:30 AM - 08:00 PM',
    opening_hours_sun TEXT DEFAULT '10:00 AM - 03:00 PM',
    social_facebook TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    social_youtube TEXT,
    google_maps_iframe TEXT,
    footer_about TEXT,
    copyright_text TEXT DEFAULT '© 2026 MIInfotech. All Rights Reserved.',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for website settings
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone can read website settings
CREATE POLICY "Allow public read access to settings" ON public.website_settings
    FOR SELECT USING (true);

-- Write policy: Admin only
CREATE POLICY "Allow authenticated write to settings" ON public.website_settings
    FOR ALL USING (auth.role() = 'authenticated');


-- 9. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_seo',
    homepage_title TEXT NOT NULL,
    homepage_description TEXT,
    homepage_keywords TEXT,
    og_image TEXT,
    twitter_card TEXT DEFAULT 'summary_large_image',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for SEO settings
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Select policy: Public read
CREATE POLICY "Allow public read access to seo_settings" ON public.seo_settings
    FOR SELECT USING (true);

-- Write policy: Admin only
CREATE POLICY "Allow authenticated write to seo_settings" ON public.seo_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Seed primary rows if they do not exist
INSERT INTO public.website_settings (id) VALUES ('primary_settings') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.seo_settings (id, homepage_title) VALUES ('primary_seo', 'MIInfotech | Doorstep IT Support & CCTV Camera Installation in Hassan') ON CONFLICT (id) DO NOTHING;

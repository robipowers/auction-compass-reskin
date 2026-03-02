-- Create auction_items table
CREATE TABLE IF NOT EXISTS public.auction_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  starting_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  current_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  buy_now_price NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'ended', 'cancelled')),
  seller_id UUID REFERENCES auth.users(id),
  winner_id UUID REFERENCES auth.users(id),
  auction_end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_item_id UUID NOT NULL REFERENCES public.auction_items(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES auth.users(id),
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for auction_items
CREATE POLICY "Anyone can view auction items" ON public.auction_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create auction items" ON public.auction_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Sellers can update their own items" ON public.auction_items FOR UPDATE USING (auth.uid() = seller_id);

-- RLS Policies for bids
CREATE POLICY "Anyone can view bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_auction_items_updated_at
  BEFORE UPDATE ON public.auction_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

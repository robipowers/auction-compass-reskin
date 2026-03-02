import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { JournalEntry, JournalEntryWithDetails, JournalFilters, JournalEntryFormData, JournalStats } from '@/types/journal';

const JOURNAL_QUERY_KEY = 'journal-entries';
const JOURNAL_STATS_KEY = 'journal-stats';

// Fetch journal entries with optional filters
export function useJournalEntries(filters?: JournalFilters) {
  return useQuery({
    queryKey: [JOURNAL_QUERY_KEY, filters],
    queryFn: async (): Promise<JournalEntryWithDetails[]> => {
      let query = supabase
        .from('journal_entries')
        .select(`
          *,
          pre_emotions:journal_entry_emotions!inner(emotion)
        `)
        .order('trade_date', { ascending: false });

      // Apply filters
      if (filters?.dateFrom) query = query.gte('trade_date', filters.dateFrom);
      if (filters?.dateTo) query = query.lte('trade_date', filters.dateTo);
      if (filters?.instrument) query = query.eq('instrument', filters.instrument);
      if (filters?.direction) query = query.eq('direction', filters.direction);
      if (filters?.minPnl !== undefined) query = query.gte('pnl_dollars', filters.minPnl);
      if (filters?.maxPnl !== undefined) query = query.lte('pnl_dollars', filters.maxPnl);
      if (filters?.followedPlan !== undefined) query = query.eq('followed_plan', filters.followedPlan);

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      // Re-fetch with full emotion details since nested join is complex
      if (!data || data.length === 0) return [];

      const entryIds = data.map(e => e.id);
      const { data: emotionsData } = await supabase
        .from('journal_entry_emotions')
        .select('*')
        .in('entry_id', entryIds);

      return data.map(entry => {
        const emotions = (emotionsData || []).filter(e => e.entry_id === entry.id);
        return {
          ...entry,
          pre_trade_emotion: emotions.filter(e => e.phase === 'pre').map(e => e.emotion),
          during_trade_emotion: emotions.filter(e => e.phase === 'during').map(e => e.emotion),
          post_trade_emotion: emotions.filter(e => e.phase === 'post').map(e => e.emotion),
        } as JournalEntryWithDetails;
      });
    },
  });
}

// Fetch journal stats
export function useJournalStats(filters?: Pick<JournalFilters, 'dateFrom' | 'dateTo'>) {
  return useQuery({
    queryKey: [JOURNAL_STATS_KEY, filters],
    queryFn: async (): Promise<JournalStats> => {
      let query = supabase
        .from('journal_entries')
        .select('pnl_dollars, pnl_pips, direction, followed_plan, instrument');

      if (filters?.dateFrom) query = query.gte('trade_date', filters.dateFrom);
      if (filters?.dateTo) query = query.lte('trade_date', filters.dateTo);

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      const entries = data || [];

      // Emotion correlations
      const { data: emotionsData } = await supabase
        .from('journal_entry_emotions')
        .select('entry_id, emotion, phase');

      const entryMap = new Map(entries.map(e => [e.id, e]));

      // Build emotion correlation map
      const emotionPnlMap = new Map<string, number[]>();
      (emotionsData || []).forEach(({ entry_id, emotion }) => {
        const entry = entries.find(e => e.id === entry_id);
        if (entry?.pnl_dollars !== null && entry?.pnl_dollars !== undefined) {
          if (!emotionPnlMap.has(emotion)) emotionPnlMap.set(emotion, []);
          emotionPnlMap.get(emotion)!.push(entry.pnl_dollars);
        }
      });

      const emotionCorrelations = Array.from(emotionPnlMap.entries()).map(([emotion, pnls]) => ({
        emotion,
        avgPnl: pnls.reduce((a, b) => a + b, 0) / pnls.length,
        frequency: pnls.length,
      }));

      const withPnl = entries.filter(e => e.pnl_dollars !== null);
      const totalPnl = withPnl.reduce((sum, e) => sum + (e.pnl_dollars || 0), 0);
      const wins = withPnl.filter(e => (e.pnl_dollars || 0) > 0);
      const losses = withPnl.filter(e => (e.pnl_dollars || 0) < 0);

      return {
        totalEntries: entries.length,
        totalPnl,
        avgPnl: withPnl.length > 0 ? totalPnl / withPnl.length : 0,
        winRate: withPnl.length > 0 ? wins.length / withPnl.length : 0,
        avgWin: wins.length > 0 ? wins.reduce((s, e) => s + (e.pnl_dollars || 0), 0) / wins.length : 0,
        avgLoss: losses.length > 0 ? losses.reduce((s, e) => s + (e.pnl_dollars || 0), 0) / losses.length : 0,
        followedPlanRate: entries.filter(e => e.followed_plan !== null).length > 0
          ? entries.filter(e => e.followed_plan === true).length / entries.filter(e => e.followed_plan !== null).length
          : 0,
        emotionCorrelations,
      };
    },
  });
}

// Fetch unique instruments
export function useJournalInstruments() {
  return useQuery({
    queryKey: ['journal-instruments'],
    queryFn: async (): Promise<string[]> => {
      const { data } = await supabase
        .from('journal_entries')
        .select('instrument')
        .not('instrument', 'is', null);

      const instruments = [...new Set((data || []).map(d => d.instrument).filter(Boolean))];
      return instruments as string[];
    },
  });
}

// Create a journal entry
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: JournalEntryFormData) => {
      // Create the main entry
      const entryData = {
        trade_date: formData.trade_date,
        instrument: formData.instrument,
        direction: formData.direction,
        entry_price: formData.entry_price,
        exit_price: formData.exit_price,
        pnl_dollars: formData.pnl_dollars,
        pnl_pips: formData.pnl_pips,
        followed_plan: formData.followed_plan,
        setup_type: formData.setup_type,
        what_went_well: formData.what_went_well,
        what_to_improve: formData.what_to_improve,
        lesson_learned: formData.lesson_learned,
        auction_plan_id: formData.auction_plan_id,
      };

      const { data: entry, error } = await supabase
        .from('journal_entries')
        .insert(entryData)
        .select()
        .single();

      if (error) throw new Error(error.message);

      // Create emotion records
      const emotionRecords = [
        ...(formData.pre_trade_emotion || []).map(e => ({ entry_id: entry.id, emotion: e, phase: 'pre' })),
        ...(formData.during_trade_emotion || []).map(e => ({ entry_id: entry.id, emotion: e, phase: 'during' })),
        ...(formData.post_trade_emotion || []).map(e => ({ entry_id: entry.id, emotion: e, phase: 'post' })),
      ];

      if (emotionRecords.length > 0) {
        const { error: emotionsError } = await supabase
          .from('journal_entry_emotions')
          .insert(emotionRecords);

        if (emotionsError) console.error('Failed to save emotions:', emotionsError);
      }

      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNAL_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [JOURNAL_STATS_KEY] });
    },
  });
}

// Update a journal entry
export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: formData }: { id: string; data: JournalEntryFormData }) => {
      // Update main entry
      const entryData = {
        trade_date: formData.trade_date,
        instrument: formData.instrument,
        direction: formData.direction,
        entry_price: formData.entry_price,
        exit_price: formData.exit_price,
        pnl_dollars: formData.pnl_dollars,
        pnl_pips: formData.pnl_pips,
        followed_plan: formData.followed_plan,
        setup_type: formData.setup_type,
        what_went_well: formData.what_went_well,
        what_to_improve: formData.what_to_improve,
        lesson_learned: formData.lesson_learned,
        auction_plan_id: formData.auction_plan_id,
      };

      const { error } = await supabase
        .from('journal_entries')
        .update(entryData)
        .eq('id', id);

      if (error) throw new Error(error.message);

      // Delete and re-create emotions
      await supabase.from('journal_entry_emotions').delete().eq('entry_id', id);

      const emotionRecords = [
        ...(formData.pre_trade_emotion || []).map(e => ({ entry_id: id, emotion: e, phase: 'pre' })),
        ...(formData.during_trade_emotion || []).map(e => ({ entry_id: id, emotion: e, phase: 'during' })),
        ...(formData.post_trade_emotion || []).map(e => ({ entry_id: id, emotion: e, phase: 'post' })),
      ];

      if (emotionRecords.length > 0) {
        await supabase.from('journal_entry_emotions').insert(emotionRecords);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNAL_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [JOURNAL_STATS_KEY] });
    },
  });
}

// Delete a journal entry
export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete emotions first
      await supabase.from('journal_entry_emotions').delete().eq('entry_id', id);

      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOURNAL_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [JOURNAL_STATS_KEY] });
    },
  });
}

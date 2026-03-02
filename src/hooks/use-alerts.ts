import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Alert, AlertFormData } from '@/types/alerts';

const ALERTS_QUERY_KEY = 'alerts';

// Fetch all alerts
export function useAlerts(filter?: 'active' | 'all') {
  return useQuery({
    queryKey: [ALERTS_QUERY_KEY, filter],
    queryFn: async (): Promise<Alert[]> => {
      let query = supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'active') {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      // Cast the data to our expected type with proper enum types
      return (data || []).map(item => ({
        ...item,
        priority: item.priority as Alert['priority'],
        behavior: item.behavior as Alert['behavior'],
        condition_direction: item.condition_direction as Alert['condition_direction'],
      }));
    },
    refetchInterval: 10000, // Refetch every 10 seconds to simulate real-time
  });
}

// Create a new alert
export function useCreateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AlertFormData): Promise<Alert> => {
      const { data: newAlert, error } = await supabase
        .from('alerts')
        .insert({
          name: data.name,
          instrument: data.instrument,
          condition_direction: data.condition_direction,
          condition_value: data.condition_value,
          priority: data.priority,
          behavior: data.behavior,
          persist_after_session: data.persist_after_session,
          is_active: true,
          fire_count: 0,
        })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return {
        ...newAlert,
        priority: newAlert.priority as Alert['priority'],
        behavior: newAlert.behavior as Alert['behavior'],
        condition_direction: newAlert.condition_direction as Alert['condition_direction'],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
    },
  });
}

// Update an alert
export function useUpdateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AlertFormData> }): Promise<Alert> => {
      const { data: updatedAlert, error } = await supabase
        .from('alerts')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return {
        ...updatedAlert,
        priority: updatedAlert.priority as Alert['priority'],
        behavior: updatedAlert.behavior as Alert['behavior'],
        condition_direction: updatedAlert.condition_direction as Alert['condition_direction'],
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
    },
  });
}

// Toggle alert active state
export function useToggleAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('alerts')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
    },
  });
}

// Delete an alert
export function useDeleteAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
    },
  });
}

// Simulate alert firing (for demo)
export function useFireAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: alert } = await supabase
        .from('alerts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!alert) throw new Error('Alert not found');
      
      const updates: Partial<Alert> = {
        fire_count: (alert.fire_count || 0) + 1,
        last_fired_at: new Date().toISOString(),
      };
      
      // Handle behavior
      if (alert.behavior === 'fire_once_disable') {
        updates.is_active = false;
      } else if (alert.behavior === 'fire_once_delete') {
        const { error } = await supabase.from('alerts').delete().eq('id', id);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
        return;
      }
      
      const { error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
    },
  });
}

// Clear session alerts
export function useClearSessionAlerts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Disable non-persistent alerts
      const { error } = await supabase
        .from('alerts')
        .update({ is_active: false })
        .eq('persist_after_session', false)
        .eq('is_active', true);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALERTS_QUERY_KEY] });
    },
  });
}

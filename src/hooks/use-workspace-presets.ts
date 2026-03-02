import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WorkspacePanel {
  id: string;
  type: "chart" | "volume-profile" | "order-flow" | "internals" | "scenarios" | "notes";
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings?: Record<string, any>;
}

export interface WorkspacePreset {
  id: string;
  name: string;
  description?: string;
  layout: WorkspacePanel[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PRESETS: Omit<WorkspacePreset, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Standard",
    description: "Balanced layout with chart, volume profile, and scenarios",
    layout: [
      { id: "1", type: "chart", position: { x: 0, y: 0 }, size: { width: 60, height: 100 } },
      { id: "2", type: "volume-profile", position: { x: 60, y: 0 }, size: { width: 20, height: 50 } },
      { id: "3", type: "scenarios", position: { x: 60, y: 50 }, size: { width: 20, height: 50 } },
      { id: "4", type: "order-flow", position: { x: 80, y: 0 }, size: { width: 20, height: 100 } },
    ],
    isDefault: true,
  },
  {
    name: "Order Flow Focus",
    description: "Emphasis on order flow and market internals",
    layout: [
      { id: "1", type: "chart", position: { x: 0, y: 0 }, size: { width: 50, height: 100 } },
      { id: "2", type: "order-flow", position: { x: 50, y: 0 }, size: { width: 25, height: 60 } },
      { id: "3", type: "internals", position: { x: 50, y: 60 }, size: { width: 25, height: 40 } },
      { id: "4", type: "volume-profile", position: { x: 75, y: 0 }, size: { width: 25, height: 100 } },
    ],
    isDefault: false,
  },
  {
    name: "Minimal",
    description: "Clean view with just chart and scenarios",
    layout: [
      { id: "1", type: "chart", position: { x: 0, y: 0 }, size: { width: 75, height: 100 } },
      { id: "2", type: "scenarios", position: { x: 75, y: 0 }, size: { width: 25, height: 60 } },
      { id: "3", type: "notes", position: { x: 75, y: 60 }, size: { width: 25, height: 40 } },
    ],
    isDefault: false,
  },
];

export function useWorkspacePresets() {
  const [presets, setPresets] = useState<WorkspacePreset[]>([]);
  const [currentPreset, setCurrentPreset] = useState<WorkspacePreset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPresets = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("workspace_presets")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: WorkspacePreset[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          layout: p.layout as WorkspacePanel[],
          isDefault: p.is_default,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }));
        setPresets(mapped);
        const defaultPreset = mapped.find((p) => p.isDefault) || mapped[0];
        setCurrentPreset(defaultPreset);
      } else {
        const builtIn: WorkspacePreset[] = DEFAULT_PRESETS.map((p, i) => ({
          ...p,
          id: `builtin-${i}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setPresets(builtIn);
        setCurrentPreset(builtIn[0]);
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error);
      const builtIn: WorkspacePreset[] = DEFAULT_PRESETS.map((p, i) => ({
        ...p,
        id: `builtin-${i}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setPresets(builtIn);
      setCurrentPreset(builtIn[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePreset = useCallback(async (preset: Omit<WorkspacePreset, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({ title: "Error", description: "Please log in to save presets", variant: "destructive" });
        return null;
      }

      const { data, error } = await supabase
        .from("workspace_presets")
        .insert({
          user_id: userData.user.id,
          name: preset.name,
          description: preset.description,
          layout: preset.layout,
          is_default: preset.isDefault,
        })
        .select()
        .single();

      if (error) throw error;

      const newPreset: WorkspacePreset = {
        id: data.id,
        name: data.name,
        description: data.description,
        layout: data.layout as WorkspacePanel[],
        isDefault: data.is_default,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setPresets((prev) => [...prev, newPreset]);
      toast({ title: "Preset saved", description: `"${preset.name}" has been saved` });
      return newPreset;
    } catch (error) {
      console.error("Failed to save preset:", error);
      toast({ title: "Error", description: "Failed to save preset", variant: "destructive" });
      return null;
    }
  }, [toast]);

  const deletePreset = useCallback(async (id: string) => {
    if (id.startsWith("builtin-")) {
      toast({ title: "Info", description: "Built-in presets cannot be deleted" });
      return false;
    }

    try {
      const { error } = await supabase.from("workspace_presets").delete().eq("id", id);
      if (error) throw error;

      setPresets((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Deleted", description: "Preset has been deleted" });
      return true;
    } catch (error) {
      console.error("Failed to delete preset:", error);
      toast({ title: "Error", description: "Failed to delete preset", variant: "destructive" });
      return false;
    }
  }, [toast]);

  const selectPreset = useCallback((preset: WorkspacePreset) => {
    setCurrentPreset(preset);
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return {
    presets,
    currentPreset,
    isLoading,
    savePreset,
    deletePreset,
    selectPreset,
    refetch: fetchPresets,
  };
}

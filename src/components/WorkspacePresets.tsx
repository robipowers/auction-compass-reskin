import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout, Save, Trash2, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface WorkspaceLayout {
  id: string;
  name: string;
  panels: Array<{
    id: string;
    type: string;
    title: string;
    size?: number;
  }>;
  isDefault?: boolean;
  createdAt: Date;
}

interface WorkspacePresetsProps {
  currentPanels: Array<{ id: string; type: string; title: string }>;
  onLoadPreset: (layout: WorkspaceLayout) => void;
  className?: string;
}

const STORAGE_KEY = "workspace-presets";
const DEFAULT_PRESET_KEY = "workspace-default-preset";

const DEFAULT_PRESETS: WorkspaceLayout[] = [
  {
    id: "default-simple",
    name: "Simple",
    panels: [
      { id: "chart", type: "chart", title: "Price Chart" },
      { id: "scenarios", type: "scenarios", title: "Scenarios" },
    ],
    createdAt: new Date(),
  },
  {
    id: "default-full",
    name: "Full Analysis",
    panels: [
      { id: "chart", type: "chart", title: "Price Chart" },
      { id: "profile", type: "profile", title: "Volume Profile" },
      { id: "scenarios", type: "scenarios", title: "Scenarios" },
    ],
    createdAt: new Date(),
  },
  {
    id: "default-orderflow",
    name: "Order Flow Focus",
    panels: [
      { id: "chart", type: "chart", title: "Price Chart" },
      { id: "orderflow", type: "orderflow", title: "Order Flow" },
      { id: "price", type: "price", title: "Price Widget" },
    ],
    createdAt: new Date(),
  },
];

export function WorkspacePresets({
  currentPanels,
  onLoadPreset,
  className,
}: WorkspacePresetsProps) {
  const [presets, setPresets] = useState<WorkspaceLayout[]>([]);
  const [defaultPresetId, setDefaultPresetId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  // Load presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPresets([...DEFAULT_PRESETS, ...parsed]);
      } catch {
        setPresets(DEFAULT_PRESETS);
      }
    } else {
      setPresets(DEFAULT_PRESETS);
    }

    const defaultId = localStorage.getItem(DEFAULT_PRESET_KEY);
    if (defaultId) {
      setDefaultPresetId(defaultId);
    }
  }, []);

  // Save custom presets to localStorage
  const savePresets = (customPresets: WorkspaceLayout[]) => {
    const toStore = customPresets.filter((p) => !p.id.startsWith("default-"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    setPresets([...DEFAULT_PRESETS, ...toStore]);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: WorkspaceLayout = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      panels: currentPanels,
      createdAt: new Date(),
    };

    const customPresets = presets.filter((p) => !p.id.startsWith("default-"));
    savePresets([...customPresets, newPreset]);
    
    setNewPresetName("");
    setSaveDialogOpen(false);
    toast.success(`Workspace "${newPresetName}" saved`);
  };

  const handleDeletePreset = (presetId: string) => {
    if (presetId.startsWith("default-")) return;
    
    const customPresets = presets.filter(
      (p) => !p.id.startsWith("default-") && p.id !== presetId
    );
    savePresets(customPresets);
    
    if (defaultPresetId === presetId) {
      localStorage.removeItem(DEFAULT_PRESET_KEY);
      setDefaultPresetId(null);
    }
    
    toast.success("Preset deleted");
  };

  const handleSetDefault = (presetId: string) => {
    localStorage.setItem(DEFAULT_PRESET_KEY, presetId);
    setDefaultPresetId(presetId);
    toast.success("Default workspace updated");
  };

  const handleLoadPreset = (preset: WorkspaceLayout) => {
    onLoadPreset(preset);
    toast.success(`Loaded "${preset.name}" workspace`);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Layout className="h-4 w-4 mr-2" />
            Presets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {preset.name}
                {defaultPresetId === preset.id && (
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                )}
              </span>
              <div className="flex items-center gap-1">
                {!preset.id.startsWith("default-") && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(preset.id);
                      }}
                    >
                      <Star className={cn(
                        "h-3 w-3",
                        defaultPresetId === preset.id && "fill-yellow-500 text-yellow-500"
                      )} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(preset.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Save className="h-4 w-4 mr-2" />
                Save Current Layout
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Workspace</DialogTitle>
                <DialogDescription>
                  Save the current panel layout as a preset.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  placeholder="e.g., Morning Setup"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePreset}>
                  <Check className="h-4 w-4 mr-2" />
                  Save Preset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

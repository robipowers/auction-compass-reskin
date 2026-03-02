import { useState, useCallback } from 'react';
import { Plus, Save, Layout, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkspacePanel, PanelConfig, PanelType } from './WorkspacePanel';
import { VolumeProfile, OrderFlowPanel, MarketInternals } from '@/components/charts';
import { cn } from '@/lib/utils';

const PANEL_TYPES: { value: PanelType; label: string }[] = [
  { value: 'chart', label: 'Price Chart' },
  { value: 'volume-profile', label: 'Volume Profile' },
  { value: 'order-flow', label: 'Order Flow' },
  { value: 'internals', label: 'Market Internals' },
  { value: 'scenarios', label: 'Scenarios' },
];

const INSTRUMENTS = ['NQ', 'ES', 'YM', 'RTY'];

const DEFAULT_PANELS: PanelConfig[] = [
  { id: '1', type: 'chart', title: 'NQ Chart', instrument: 'NQ', gridColumn: '1 / 2', gridRow: '1 / 2' },
  { id: '2', type: 'volume-profile', title: 'Volume Profile', instrument: 'NQ', gridColumn: '2 / 3', gridRow: '1 / 2' },
  { id: '3', type: 'order-flow', title: 'Order Flow', instrument: 'NQ', gridColumn: '1 / 2', gridRow: '2 / 3' },
  { id: '4', type: 'internals', title: 'Market Internals', gridColumn: '2 / 3', gridRow: '2 / 3' },
];

interface WorkspaceBuilderProps {
  className?: string;
}

export function WorkspaceBuilder({ className }: WorkspaceBuilderProps) {
  const [panels, setPanels] = useState<PanelConfig[]>(DEFAULT_PANELS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addingPanel, setAddingPanel] = useState(false);
  const [newPanelType, setNewPanelType] = useState<PanelType>('chart');
  const [newPanelInstrument, setNewPanelInstrument] = useState('NQ');

  const handleAddPanel = useCallback(() => {
    const newPanel: PanelConfig = {
      id: Date.now().toString(),
      type: newPanelType,
      title: newPanelType === 'internals' 
        ? 'Market Internals' 
        : `${newPanelInstrument} ${PANEL_TYPES.find(p => p.value === newPanelType)?.label}`,
      instrument: newPanelType !== 'internals' ? newPanelInstrument : undefined,
      gridColumn: 'auto',
      gridRow: 'auto',
    };
    setPanels(prev => [...prev, newPanel]);
    setAddingPanel(false);
  }, [newPanelType, newPanelInstrument]);

  const handleRemovePanel = useCallback((id: string) => {
    setPanels(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleSaveWorkspace = useCallback(() => {
    localStorage.setItem('workspace_panels', JSON.stringify(panels));
    setIsEditMode(false);
  }, [panels]);

  const renderPanelContent = (panel: PanelConfig) => {
    switch (panel.type) {
      case 'chart':
        return (
          <div className="h-full flex items-center justify-center bg-background/50 rounded text-muted-foreground">
            <div className="text-center">
              <Grid3X3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <div>Price Chart</div>
              <div className="text-xs">{panel.instrument}</div>
            </div>
          </div>
        );
      case 'volume-profile':
        return <VolumeProfile className="border-0" />;
      case 'order-flow':
        return <OrderFlowPanel className="border-0" />;
      case 'internals':
        return <MarketInternals className="border-0" />;
      case 'scenarios':
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Scenario Monitor
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          <span className="font-semibold">Workspace</span>
        </div>
        
        <div className="flex items-center gap-2">
          {addingPanel ? (
            <div className="flex items-center gap-2 bg-background rounded-lg p-2">
              <Select value={newPanelType} onValueChange={(v: PanelType) => setNewPanelType(v)}>
                <SelectTrigger className="w-36 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PANEL_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newPanelType !== 'internals' && (
                <Select value={newPanelInstrument} onValueChange={setNewPanelInstrument}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTRUMENTS.map(i => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button size="sm" onClick={handleAddPanel}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setAddingPanel(false)}>Cancel</Button>
            </div>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setAddingPanel(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Panel
              </Button>
              <Button 
                size="sm" 
                variant={isEditMode ? "default" : "outline"} 
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? 'Done' : 'Customize'}
              </Button>
              {isEditMode && (
                <Button size="sm" onClick={handleSaveWorkspace} className="gap-1">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 p-4 overflow-auto">
        <div 
          className="grid gap-4 h-full"
          style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            minHeight: '600px',
          }}
        >
          {panels.map(panel => (
            <WorkspacePanel
              key={panel.id}
              config={panel}
              isEditMode={isEditMode}
              onClose={handleRemovePanel}
            >
              {renderPanelContent(panel)}
            </WorkspacePanel>
          ))}
        </div>
      </div>
    </div>
  );
}

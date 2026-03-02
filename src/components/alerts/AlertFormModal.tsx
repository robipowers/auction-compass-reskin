import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Alert,
  AlertFormData,
  AlertPriority,
  AlertBehavior,
  AlertConditionDirection,
  INSTRUMENTS,
  PRIORITY_OPTIONS,
  BEHAVIOR_OPTIONS,
  DIRECTION_OPTIONS,
} from '@/types/alerts';
import { useCreateAlert, useUpdateAlert } from '@/hooks/use-alerts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AlertFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAlert?: Alert | null;
}

export function AlertFormModal({ isOpen, onClose, editingAlert }: AlertFormModalProps) {
  const createAlert = useCreateAlert();
  const updateAlert = useUpdateAlert();
  
  const [formData, setFormData] = useState<AlertFormData>({
    name: '',
    instrument: 'NQ',
    condition_direction: 'above',
    condition_value: 0,
    priority: 'important',
    behavior: 'fire_once_disable',
    persist_after_session: false,
  });

  // Reset form when modal opens/closes or editing alert changes
  useEffect(() => {
    if (editingAlert) {
      setFormData({
        name: editingAlert.name,
        instrument: editingAlert.instrument,
        condition_direction: editingAlert.condition_direction,
        condition_value: editingAlert.condition_value,
        priority: editingAlert.priority,
        behavior: editingAlert.behavior,
        persist_after_session: editingAlert.persist_after_session,
      });
    } else {
      setFormData({
        name: '',
        instrument: 'NQ',
        condition_direction: 'above',
        condition_value: 0,
        priority: 'important',
        behavior: 'fire_once_disable',
        persist_after_session: false,
      });
    }
  }, [editingAlert, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter an alert name');
      return;
    }
    if (!formData.condition_value) {
      toast.error('Please enter a price level');
      return;
    }

    try {
      if (editingAlert) {
        await updateAlert.mutateAsync({ id: editingAlert.id, data: formData });
        toast.success('Alert updated successfully');
      } else {
        await createAlert.mutateAsync(formData);
        toast.success('Alert created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save alert');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {editingAlert ? 'Edit Alert' : 'Create Alert'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Alert Name */}
          <div className="space-y-2">
            <Label>Alert Name</Label>
            <Input
              placeholder="e.g., NQ Break Above 18,450"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Instrument */}
          <div className="space-y-2">
            <Label>Instrument</Label>
            <Select 
              value={formData.instrument}
              onValueChange={(v) => setFormData(prev => ({ ...prev, instrument: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSTRUMENTS.map(i => (
                  <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>Condition</Label>
            <div className="flex gap-3">
              <Select 
                value={formData.condition_direction}
                onValueChange={(v) => setFormData(prev => ({ ...prev, condition_direction: v as AlertConditionDirection }))}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTION_OPTIONS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Price level"
                value={formData.condition_value || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, condition_value: parseFloat(e.target.value) || 0 }))}
                className="flex-1"
              />
            </div>
            {/* Preview */}
            <div className="bg-secondary/50 rounded-md p-3 text-sm text-muted-foreground">
              Preview: This alert would have fired <span className="text-primary font-medium">2 times</span> in the last session
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITY_OPTIONS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                  className={cn(
                    "p-4 rounded-lg border-2 text-center transition-colors",
                    formData.priority === p.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  )}
                >
                  <div className="font-medium text-sm">{p.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Behavior */}
          <div className="space-y-2">
            <Label>Behavior</Label>
            <Select 
              value={formData.behavior}
              onValueChange={(v) => setFormData(prev => ({ ...prev, behavior: v as AlertBehavior }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BEHAVIOR_OPTIONS.map(b => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Persistence */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="persist"
              checked={formData.persist_after_session}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, persist_after_session: !!checked }))
              }
            />
            <Label htmlFor="persist" className="cursor-pointer">
              Keep active after session ends
            </Label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={createAlert.isPending || updateAlert.isPending}
          >
            {editingAlert ? 'Save Changes' : 'Create Alert'}
          </Button>
        </div>
      </div>
    </div>
  );
}

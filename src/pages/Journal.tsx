import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Lightbulb, CalendarDays, Brain, BarChart3, Target, Sparkles } from "lucide-react";
import { useJournalEntries, useJournalStats, useJournalInstruments, useCreateJournalEntry, useUpdateJournalEntry, useDeleteJournalEntry } from "@/hooks/use-journal";
import { JournalStatsCards } from "@/components/journal/JournalStatsCards";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { JournalEntryDrawer } from "@/components/journal/JournalEntryDrawer";
import { JournalFilters as JournalFiltersBar } from "@/components/journal/JournalFilters";
import { JournalInsights } from "@/components/journal/JournalInsights";
import { DeleteConfirmDialog } from "@/components/journal/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import type { JournalFilters, JournalEntryFormData, JournalEntryWithDetails } from "@/types/journal";

export default function Journal() {
  const [filters, setFilters] = useState<JournalFilters>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryWithDetails | null>(null);
  const [activeTab, setActiveTab] = useState("entries");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: entries, isLoading: entriesLoading } = useJournalEntries(filters);
  const { data: stats, isLoading: statsLoading } = useJournalStats({
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  const { data: instruments = [] } = useJournalInstruments();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const handleAddEntry = () => {
    setEditingEntry(null);
    setDrawerOpen(true);
  };

  const handleEditEntry = (entry: JournalEntryWithDetails) => {
    setEditingEntry(entry);
    setDrawerOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    setPendingDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteEntry.mutate(pendingDeleteId, {
      onSuccess: () => {
        toast({ title: "Entry deleted", description: "Journal entry has been removed." });
        setPendingDeleteId(null);
        setDeleteConfirmOpen(false);
      },
    });
  };

  const handleSaveEntry = (data: JournalEntryFormData) => {
    if (editingEntry) {
      updateEntry.mutate(
        { id: editingEntry.id, data },
        {
          onSuccess: () => {
            toast({ title: "Entry updated", description: "Your journal entry has been updated." });
            setDrawerOpen(false);
          },
        }
      );
    } else {
      createEntry.mutate(data, {
        onSuccess: () => {
          toast({ title: "Entry saved", description: "New journal entry has been created." });
          setDrawerOpen(false);
        },
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Trading Journal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your trades, emotions, and performance
          </p>
        </div>
        <Button onClick={handleAddEntry} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <JournalStatsCards stats={stats} isLoading={statsLoading} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="entries" className="gap-2">
            <BookOpen className="h-4 w-4" /> Entries
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Lightbulb className="h-4 w-4" /> Insights
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <CalendarDays className="h-4 w-4" /> Weekly
          </TabsTrigger>
        </TabsList>

        {/* Entries Tab */}
        <TabsContent value="entries" className="space-y-4">
          <JournalFiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            instruments={instruments}
          />

          {entriesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-secondary/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <BookOpen className="h-14 w-14 text-primary/40 mx-auto" />
              <h3 className="text-xl font-bold">Start Your Trading Journal</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Track your trades, emotions, and progress. Build the discipline that separates winning traders from the rest.
              </p>
              <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-400" /> Track performance and identify patterns</div>
                <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-purple-400" /> Understand emotional triggers</div>
                <div className="flex items-center gap-2"><Target className="h-4 w-4 text-green-400" /> Measure improvement over time</div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-400" /> Get AI-powered insights and coaching</div>
              </div>
              <Button onClick={handleAddEntry} className="gap-2" size="lg">
                <Plus className="h-4 w-4" /> Add Your First Entry
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <JournalInsights stats={stats} isLoading={statsLoading} />
        </TabsContent>

        {/* Weekly Summaries Tab */}
        <TabsContent value="weekly">
          <div className="text-center py-16 space-y-3">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-lg font-semibold">Weekly Summaries</h3>
            <p className="text-sm text-muted-foreground">
              Weekly performance reports are generated every Monday at 6 AM based on your journal entries.
            </p>
            <p className="text-xs text-muted-foreground">
              Keep journaling consistently to receive AI-generated insights and coaching.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Journal Entry Drawer */}
      <JournalEntryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        editingEntry={editingEntry}
        onSave={handleSaveEntry}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </main>
  );
}

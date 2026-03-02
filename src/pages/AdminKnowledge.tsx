import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Upload, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';

interface Document {
  id: string;
  title: string;
  filename: string;
  total_chunks: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error_message: string | null;
  created_at: string;
}

export default function AdminKnowledge() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [pdfContent, setPdfContent] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('amt_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Cast the status to our expected type
      setDocuments((data || []).map(doc => ({
        ...doc,
        status: doc.status as Document['status']
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !pdfContent.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please provide both a title and content',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      toast({
        title: 'Processing',
        description: 'Creating document and generating embeddings...',
      });

      // Process the document via edge function (handles document creation with service role)
      const { data, error: processError } = await supabase.functions.invoke('amt-document-process', {
        body: {
          content: pdfContent,
          title: title.trim(),
        },
      });

      if (processError) throw processError;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Success',
        description: 'Document processed and added to knowledge base',
      });

      setTitle('');
      setPdfContent('');
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('amt_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Document removed from knowledge base',
      });
      
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AMT Knowledge Base
            </h1>
            <p className="text-muted-foreground">
              Upload AMT reference materials to enhance AI analysis
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Add Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., AMT Reference - Chapter 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="content">
                  Content (paste text from PDF)
                </Label>
                <textarea
                  id="content"
                  className="w-full h-48 p-3 border rounded-md bg-background text-foreground resize-y"
                  placeholder="Paste the text content from your AMT reference book here..."
                  value={pdfContent}
                  onChange={(e) => setPdfContent(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Copy text from your PDF reader and paste it here. The content will be chunked and embedded for semantic search.
                </p>
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Add to Knowledge Base
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Uploaded Documents ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No documents uploaded yet. Add your AMT reference books above.
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.total_chunks} chunks • {doc.status}
                            {doc.error_message && ` • ${doc.error_message}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

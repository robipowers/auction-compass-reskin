import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Clipboard, ImageIcon, AlertTriangle, RefreshCw } from "lucide-react";

interface Screenshot {
  id: string;
  dataUrl: string;
  caption: string;
  file?: File;
  status: "ready" | "uploading" | "uploaded" | "error";
  errorMessage?: string;
}

interface ScreenshotUploadProps {
  screenshots: Screenshot[];
  onScreenshotsChange: (screenshots: Screenshot[]) => void;
}

export type { Screenshot };

export function ScreenshotUpload({ screenshots, onScreenshotsChange }: ScreenshotUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          if (file.size > 5 * 1024 * 1024) {
            alert("Image too large. Please use an image under 5MB.");
            continue;
          }

          const reader = new FileReader();
          reader.onload = () => {
            const newScreenshot: Screenshot = {
              id: `ss-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              dataUrl: reader.result as string,
              caption: "",
              file,
              status: "ready",
            };
            onScreenshotsChange([...screenshots, newScreenshot]);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [screenshots, onScreenshotsChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      files.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) return;
        const reader = new FileReader();
        reader.onload = () => {
          const newScreenshot: Screenshot = {
            id: `ss-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            dataUrl: reader.result as string,
            caption: "",
            file,
            status: "ready",
          };
          onScreenshotsChange([...screenshots, newScreenshot]);
        };
        reader.readAsDataURL(file);
      });
    },
    [screenshots, onScreenshotsChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = () => {
        const newScreenshot: Screenshot = {
          id: `ss-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          dataUrl: reader.result as string,
          caption: "",
          file,
          status: "ready",
        };
        onScreenshotsChange([...screenshots, newScreenshot]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeScreenshot = (id: string) => {
    onScreenshotsChange(screenshots.filter((s) => s.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    onScreenshotsChange(
      screenshots.map((s) => (s.id === id ? { ...s, caption } : s))
    );
  };

  const retryUpload = (id: string) => {
    onScreenshotsChange(
      screenshots.map((s) => (s.id === id ? { ...s, status: "ready" as const, errorMessage: undefined } : s))
    );
  };

  return (
    <div className="space-y-3" onPaste={handlePaste}>
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Clipboard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Paste Screenshot (Ctrl+V)</p>
        <p className="text-xs text-muted-foreground mt-1">Or click to browse files • Max 5MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Screenshot Previews */}
      {screenshots.map((ss) => (
        <div
          key={ss.id}
          className="relative border border-border/50 rounded-lg overflow-hidden bg-secondary/30"
        >
          <div className="relative">
            <img
              src={ss.dataUrl}
              alt={ss.caption || "Screenshot"}
              className="w-full h-32 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeScreenshot(ss.id)}
            >
              <X className="h-3 w-3" />
            </Button>

            {ss.status === "uploading" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              </div>
            )}
            {ss.status === "error" && (
              <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
                  <p className="text-xs">{ss.errorMessage || "Upload failed"}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="mt-2 h-6 text-xs"
                    onClick={(e) => { e.stopPropagation(); retryUpload(ss.id); }}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Retry
                  </Button>
                </div>
              </div>
            )}
            {ss.status === "uploaded" && (
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
                ✓ Uploaded
              </div>
            )}
          </div>
          <div className="p-2">
            <Input
              placeholder="Add caption..."
              value={ss.caption}
              onChange={(e) => updateCaption(ss.id, e.target.value)}
              className="text-xs h-7"
            />
          </div>
        </div>
      ))}
    </div>
  );
}


import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PdfViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
}

const PdfViewerDialog: React.FC<PdfViewerDialogProps> = ({ 
  open, 
  onOpenChange, 
  pdfUrl 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full max-w-[100vw] max-h-[100vh] p-0">
        <DialogHeader>
          <DialogTitle>PDF Viewer</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-[calc(100vh-4rem)]">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              title="PDF Viewer"
              className="border-0"
            />
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Loading PDF...
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerDialog;

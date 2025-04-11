
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { MspoOverViewItem } from "../MspoOverView";
import PaginationControls from "../pagination/PaginationControls";

interface MspoDetailTableProps {
  selectedItem: MspoOverViewItem | null;
  onViewPdf: (pdfPath: string) => void;
  loadingPdf: boolean;
}

const MspoDetailTable: React.FC<MspoDetailTableProps> = ({ 
  selectedItem, 
  onViewPdf,
  loadingPdf
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const paginatedData = selectedItem?.details ? selectedItem.details.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];
  
  const totalPages = selectedItem?.details ? Math.ceil(selectedItem.details.length / itemsPerPage) : 0;

  if (!selectedItem) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Select an item from the summary to view details
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/20 hover:bg-secondary/30">
            <TableHead>PO Number</TableHead>
            <TableHead>Main Line Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData && paginatedData.length > 0 ? (
            paginatedData.map((detail, index) => (
              <TableRow 
                key={index} 
                className="transition-colors hover:bg-muted/40 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>{detail.poNumber}</TableCell>
                <TableCell>{detail.mainLineDescription}</TableCell>
                <TableCell>{detail.type}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewPdf(detail.pdfFilePath)}
                    className="flex items-center gap-2"
                    disabled={loadingPdf}
                  >
                    <FileText className="h-4 w-4" />
                    {loadingPdf ? "Loading..." : "View PDF"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No details available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
};

export default MspoDetailTable;

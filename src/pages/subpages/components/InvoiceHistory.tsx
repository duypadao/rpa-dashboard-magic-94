
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProcessFlow from "@/components/ProcessFlow";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface InvoiceHistoryItem {
  supplierName: string;
  invoiceNo: string;
  resultType: "success" | "warning" | "failure";
  result: string,
  date: string;
  duration: string;
}

interface InvoiceHistoryProps {
  invoiceData: InvoiceHistoryItem[];
  isLoading: boolean;
}

const InvoiceHistory = ({ invoiceData, isLoading }: InvoiceHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(invoiceData.length / itemsPerPage);
  
  // Get current page data
  const currentInvoices = invoiceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Fetch process flow data when an invoice is selected
  const { 
    data: processFlowData = [], 
    isLoading: processFlowLoading 
  } = useQuery({
    queryKey: ['invoiceFlow', selectedInvoice],
    queryFn: () => apiService.getProcessNodes(selectedInvoice || ""),
    enabled: !!selectedInvoice,
  });
  
  const handleCheckProcess = (invoiceNo: string) => {
    setSelectedInvoice(invoiceNo);
    setProcessDialogOpen(true);
  };
  
  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Invoice Processing History This Month</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice, index) => (
                    <TableRow 
                      key={index} 
                      className="transition-colors hover:bg-muted/40 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-medium">{invoice.supplierName}</TableCell>
                      <TableCell>{invoice.invoiceNo}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.resultType === "success"
                            ? "bg-success/10 text-success"
                            : invoice.resultType === "warning"
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error"
                        }`}>
                          {invoice.result.charAt(0).toUpperCase() + invoice.result.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.duration}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-primary/10 transition-colors"
                          onClick={() => handleCheckProcess(invoice.invoiceNo)}
                        >
                          <List className="h-4 w-4 mr-1" />
                          Check Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No invoice history available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Process Flow Dialog */}
      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Process Flow for Invoice {selectedInvoice}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {processFlowLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ) : (
              <ProcessFlow nodes={processFlowData} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InvoiceHistory;

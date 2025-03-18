
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, List, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type SortField = 'supplierName' | 'invoiceNo' | 'result' | 'date' | 'duration';
type SortOrder = 'asc' | 'desc';

const InvoiceHistory = ({ invoiceData, isLoading }: InvoiceHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'warning' | 'failure'>('all');
  
  const itemsPerPage = 10;
  
  // Filter data based on search term and result filter
  const filteredData = useMemo(() => {
    return invoiceData.filter(invoice => {
      const matchesSearch = 
        invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesResult = resultFilter === 'all' || invoice.resultType === resultFilter;
      
      return matchesSearch && matchesResult;
    });
  }, [invoiceData, searchTerm, resultFilter]);
  
  // Sort the filtered data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle string comparison for lexicographic ordering
      return sortOrder === 'asc' 
        ? String(aValue).localeCompare(String(bValue)) 
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortField, sortOrder]);
  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  // Get current page data
  const currentInvoices = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Function to handle sort toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
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
  
  // Function to render pagination items with ellipsis for large number of pages
  const renderPaginationItems = () => {
    // Always show first page, last page, current page, and pages adjacent to current
    const pagesToShow = new Set<number>();
    
    // Always include first and last page
    pagesToShow.add(1);
    pagesToShow.add(totalPages);
    
    // Include current page and 1 page before and after
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pagesToShow.add(i);
    }
    
    // Convert to array and sort
    const pagesArray = Array.from(pagesToShow).sort((a, b) => a - b);
    
    // Render pages with ellipsis when there's a gap
    return pagesArray.map((page, index) => {
      // If there's a gap of more than 1 page, show ellipsis
      if (index > 0 && page - pagesArray[index - 1] > 1) {
        return (
          <React.Fragment key={`ellipsis-${index}`}>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink 
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          </React.Fragment>
        );
      }
      
      return (
        <PaginationItem key={page}>
          <PaginationLink 
            isActive={currentPage === page}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
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
          <div className="space-y-4">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoice or supplier..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 mr-1" />
                      Result: {resultFilter === 'all' ? 'All' : resultFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setResultFilter('all')}>
                      All Results
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setResultFilter('success')}>
                      Success
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setResultFilter('warning')}>
                      Warning
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setResultFilter('failure')}>
                      Failure
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                    <TableHead onClick={() => handleSort('supplierName')} className="cursor-pointer">
                      <div className="flex items-center">
                        Supplier Name
                        {sortField === 'supplierName' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('invoiceNo')} className="cursor-pointer">
                      <div className="flex items-center">
                        Invoice No
                        {sortField === 'invoiceNo' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('result')} className="cursor-pointer">
                      <div className="flex items-center">
                        Result
                        {sortField === 'result' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                      <div className="flex items-center">
                        Date
                        {sortField === 'date' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('duration')} className="cursor-pointer">
                      <div className="flex items-center">
                        Duration
                        {sortField === 'duration' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
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
                    
                    {renderPaginationItems()}
                    
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

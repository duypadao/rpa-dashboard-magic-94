import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
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

export interface InvoiceOverViewItem {
  id: number;
  supplierId: string;
  supplierName: string;
  inLineDate: string,
  accumulatedInvoice: number,
  status: "running" | "idle";
  invoiceInqueueQuantity: number;
  lastRunTime: string;
}

interface InvoiceOverViewProps {
  invoiceData: InvoiceOverViewItem[];
  isLoading: boolean;
}

type SortField = 'id' | 'supplierName' | 'inLineDate' | 'accumulatedInvoice' | 'invoiceInqueueQuantity' | 'lastRunTime';
type SortOrder = 'asc' | 'desc';

const InvoiceOverView = ({ invoiceData, isLoading }: InvoiceOverViewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'idle'>('all');
  
  const itemsPerPage = 10;
  
  const filteredData = useMemo(() => {
    return invoiceData.filter(invoice => {
      const matchesSearch = 
        invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplierId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoiceData, searchTerm, statusFilter]);
  
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? (aValue > bValue ? 1 : -1) 
        : (aValue < bValue ? 1 : -1);
    });
  }, [filteredData, sortField, sortOrder]);
  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  const currentInvoices = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-200 text-red-800",
      "bg-green-200 text-green-800",
      "bg-blue-200 text-blue-800",
      "bg-yellow-200 text-yellow-800",
      "bg-purple-200 text-purple-800",
      "bg-pink-200 text-pink-800",
      "bg-indigo-200 text-indigo-800",
      "bg-teal-200 text-teal-800"
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };
  
  const renderPaginationItems = () => {
    const pagesToShow = new Set<number>();
    
    pagesToShow.add(1);
    pagesToShow.add(totalPages);
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pagesToShow.add(i);
    }
    
    const pagesArray = Array.from(pagesToShow).sort((a, b) => a - b);
    
    return pagesArray.map((page, index) => {
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
        <CardTitle>Invoice Over View</CardTitle>
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
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search supplier..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 mr-1" />
                      Status: {statusFilter === 'all' ? 'All' : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('running')}>
                      Running
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('idle')}>
                      Idle
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                    <TableHead onClick={() => handleSort('id')} className="cursor-pointer">
                      <div className="flex items-center">
                        Id
                        {sortField === 'id' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>SAPID</TableHead>
                    <TableHead onClick={() => handleSort('supplierName')} className="cursor-pointer">
                      <div className="flex items-center">
                        Supplier Name
                        {sortField === 'supplierName' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('inLineDate')} className="cursor-pointer">
                      <div className="flex items-center">
                        InLine Date
                        {sortField === 'inLineDate' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('accumulatedInvoice')} className="cursor-pointer">
                      <div className="flex items-center">
                        Invoice Created
                        {sortField === 'accumulatedInvoice' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead onClick={() => handleSort('invoiceInqueueQuantity')} className="cursor-pointer">
                      <div className="flex items-center">
                        In Queue
                        {sortField === 'invoiceInqueueQuantity' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('lastRunTime')} className="cursor-pointer">
                      <div className="flex items-center">
                        Last Run Time
                        {sortField === 'lastRunTime' && (
                          sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
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
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.supplierId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${invoice.supplierName}`} alt={invoice.supplierName} />
                              <AvatarFallback className={getAvatarColor(invoice.supplierName)}>
                                {getInitials(invoice.supplierName)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{invoice.supplierName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.inLineDate}</TableCell>
                        <TableCell>{invoice.accumulatedInvoice}</TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
                        </TableCell>
                        <TableCell>{invoice.invoiceInqueueQuantity}</TableCell>
                        <TableCell>{invoice.lastRunTime}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No invoice overview available</TableCell>
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
    </Card>
  );
};

export default InvoiceOverView;


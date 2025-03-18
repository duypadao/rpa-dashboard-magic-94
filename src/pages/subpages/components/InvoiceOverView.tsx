
import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const InvoiceOverView = ({ invoiceData, isLoading }: InvoiceOverViewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(invoiceData.length / itemsPerPage);
  
  // Get current page data
  const currentInvoices = invoiceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Generate avatar initials from supplier name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Generate random pastel background color for avatars
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
    
    // Use supplier name to deterministically pick a color
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                  <TableHead>Id</TableHead>
                  <TableHead>SAPID</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>InLine Date</TableHead>
                  <TableHead>Invoice Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>In Queue</TableHead>
                  <TableHead>Last Run Time</TableHead>
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
    </Card>
  );
};

export default InvoiceOverView;

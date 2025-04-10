
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { mspoApiService } from "@/services/mspoApi";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MspoOverViewItem {
  date: string;
  orderCount: number;
  orderChangeCount: number;
  lastRunTime: string;
  details: MspoDetailItem[];
}

interface MspoDetailItem {
  type: string;
  pdfFilePath: string;
  poNumber: string;
  mainLineDescription: string;
}

interface MspoOverViewProps {
  mspoData: MspoOverViewItem[];
  isLoading: boolean;
}

const MspoOverView: React.FC<MspoOverViewProps> = ({ mspoData, isLoading }) => {
  const [selectedItem, setSelectedItem] = useState<MspoOverViewItem | null>(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  
  // Pagination states
  const [summaryCurrentPage, setSummaryCurrentPage] = useState(1);
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Date filter
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleViewDetail = (item: MspoOverViewItem) => {
    setSelectedItem(item);
    setDetailCurrentPage(1); // Reset detail pagination when selecting a new item
  };

  const handleViewPdf = async (pdfPath: string) => {
    setLoadingPdf(true);
    setPdfUrl(null);
    try {
      const url = await mspoApiService.getMspoPdf(pdfPath);
      setPdfUrl(url);
      setPdfDialogOpen(true);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("Failed to load PDF: " + (error as Error).message);
    } finally {
      setLoadingPdf(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate pagination for summary data
  const summaryPaginatedData = mspoData ? mspoData.slice(
    (summaryCurrentPage - 1) * itemsPerPage,
    summaryCurrentPage * itemsPerPage
  ) : [];
  
  const summaryTotalPages = mspoData ? Math.ceil(mspoData.length / itemsPerPage) : 0;
  
  // Calculate pagination for detail data
  const detailPaginatedData = selectedItem?.details ? selectedItem.details.slice(
    (detailCurrentPage - 1) * itemsPerPage,
    detailCurrentPage * itemsPerPage
  ) : [];
  
  const detailTotalPages = selectedItem?.details ? Math.ceil(selectedItem.details.length / itemsPerPage) : 0;
  
  // Generate pagination numbers
  const generatePaginationItems = (currentPage: number, totalPages: number, setPage: (page: number) => void) => {
    const items = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => setPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };
  
  const handleDateFilter = () => {
    // This would be handled by the parent component via a refetch with the new date
    if (date) {
      console.log(`Filtering by date: ${date.toISOString()}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
      {/* Left part - Summary Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>MSPO Summary</CardTitle>
          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-4 w-4" />
                  {date ? format(date, "MMMM yyyy") : "Filter by Month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="p-3 pointer-events-auto"
                  initialFocus
                />
                <div className="flex items-center justify-between p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDate(undefined);
                      setIsCalendarOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button size="sm" onClick={handleDateFilter}>
                    Apply Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/30">
                    <TableHead>Date</TableHead>
                    <TableHead>Order /<br/>Order Change</TableHead>
                    <TableHead>Last Run Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryPaginatedData && summaryPaginatedData.length > 0 ? (
                    summaryPaginatedData.map((item, index) => (
                      <TableRow 
                        key={index} 
                        className={`transition-colors hover:bg-muted/40 animate-fade-in ${selectedItem === item ? 'bg-muted/60' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{item.orderCount} / {item.orderChangeCount}</TableCell>
                        <TableCell>{formatDateTime(item.lastRunTime)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetail(item)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No MSPO data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Summary Pagination */}
              {summaryTotalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setSummaryCurrentPage(prev => Math.max(prev - 1, 1))}
                        aria-disabled={summaryCurrentPage === 1}
                        className={summaryCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {generatePaginationItems(summaryCurrentPage, summaryTotalPages, setSummaryCurrentPage)}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setSummaryCurrentPage(prev => Math.min(prev + 1, summaryTotalPages))}
                        aria-disabled={summaryCurrentPage === summaryTotalPages}
                        className={summaryCurrentPage === summaryTotalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right part - Detail Grid */}
      <Card>
        <CardHeader>
          <CardTitle>MSPO Details {selectedItem && `(${formatDate(selectedItem.date)})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedItem ? (
            <div className="text-center py-12 text-muted-foreground">
              Select an item from the summary to view details
            </div>
          ) : (
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
                  {detailPaginatedData && detailPaginatedData.length > 0 ? (
                    detailPaginatedData.map((detail, index) => (
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
                            onClick={() => handleViewPdf(detail.pdfFilePath)}
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
              
              {/* Detail Pagination */}
              {detailTotalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setDetailCurrentPage(prev => Math.max(prev - 1, 1))}
                        aria-disabled={detailCurrentPage === 1}
                        className={detailCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {generatePaginationItems(detailCurrentPage, detailTotalPages, setDetailCurrentPage)}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setDetailCurrentPage(prev => Math.min(prev + 1, detailTotalPages))}
                        aria-disabled={detailCurrentPage === detailTotalPages}
                        className={detailCurrentPage === detailTotalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
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
    </div>
  );
};

export default MspoOverView;

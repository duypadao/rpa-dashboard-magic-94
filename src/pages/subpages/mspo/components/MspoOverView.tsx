
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mspoApiService } from "@/services/mspoApi";

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

  const handleViewDetail = (item: MspoOverViewItem) => {
    setSelectedItem(item);
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
      alert("Failed to load PDF: " + error.message);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
      {/* Left part - Summary Grid */}
      <Card>
        <CardHeader>
          <CardTitle>MSPO Summary</CardTitle>
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
                    {/* <TableHead>Order Change Count</TableHead> */}
                    <TableHead>Last Run Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mspoData && mspoData.length > 0 ? (
                    mspoData.map((item, index) => (
                      <TableRow 
                        key={index} 
                        className={`transition-colors hover:bg-muted/40 animate-fade-in ${selectedItem === item ? 'bg-muted/60' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{item.orderCount} / {item.orderChangeCount}</TableCell>
                        {/* <TableCell>{item.orderChangeCount}</TableCell> */}
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
                  {selectedItem.details && selectedItem.details.length > 0 ? (
                    selectedItem.details.map((detail, index) => (
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
          <div className="overflow-auto w-full h-[calc(100vh-4rem)]">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MspoOverView;
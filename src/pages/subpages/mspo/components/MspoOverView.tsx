
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mspoApiService } from "@/services/mspoApi";
import MonthYearFilter from "./date-filter/MonthYearFilter";
import MspoSummaryTable from "./summary/MspoSummaryTable";
import MspoDetailTable from "./detail/MspoDetailTable";
import PdfViewerDialog from "./pdf-viewer/PdfViewerDialog";
import { formatDate } from "@/ultis/datetime";

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
  
  // Month-Year filter
  const [date, setDate] = useState<Date | undefined>(undefined);

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
      alert("Failed to load PDF: " + (error as Error).message);
    } finally {
      setLoadingPdf(false);
    }
  };
  
  // Apply date filter - This would typically trigger a refetch from the parent component
  const handleDateFilter = () => {
    if (!date) return;
    console.log(`Filtering by date: ${formatDate(date.toDateString())}`);
    // This would be handled by the parent component via a refetch with the new date
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
      {/* Left part - Summary Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>MSPO Summary</CardTitle>
          {/* <div className="flex items-center gap-2">
            <MonthYearFilter 
              date={date} 
              setDate={setDate} 
              onFilter={handleDateFilter} 
            />
          </div> */}
        </CardHeader>
        <CardContent>
          <MspoSummaryTable 
            data={mspoData} 
            selectedItem={selectedItem}
            onViewDetail={handleViewDetail}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Right part - Detail Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            MSPO Details {selectedItem && `(${new Date(selectedItem.date).toISOString().split('T')[0]})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MspoDetailTable 
            selectedItem={selectedItem}
            onViewPdf={handleViewPdf}
            loadingPdf={loadingPdf}
          />
        </CardContent>
      </Card>

      {/* PDF Dialog */}
      <PdfViewerDialog 
        open={pdfDialogOpen} 
        onOpenChange={setPdfDialogOpen} 
        pdfUrl={pdfUrl} 
      />
    </div>
  );
};

export default MspoOverView;

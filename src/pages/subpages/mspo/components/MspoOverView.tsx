
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mspoApiService } from "@/services/mspoApi";
import MonthYearFilter from "./date-filter/MonthYearFilter";
import MspoSummaryTable from "./summary/MspoSummaryTable";
import MspoDetailTable from "./detail/MspoDetailTable";
import PdfViewerDialog from "./pdf-viewer/PdfViewerDialog";
import { formatDateStr } from "@/ultis/datetime";

export interface MspoOverViewItem {
  date: string;
  orderCount: number;
  orderChangeCount: number;
  lastRunTime: string;
  duration: string;
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
  filterDate: Date | undefined;
  setFilterDate: (date: Date | undefined) => void;
}

const MspoOverView: React.FC<MspoOverViewProps> = ({
  mspoData,
  isLoading,
  filterDate,
  setFilterDate,
}) => {
  const [selectedItem, setSelectedItem] = useState<MspoOverViewItem | null>(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
          <div className="flex items-center gap-2">
            <MonthYearFilter date={filterDate} setDate={setFilterDate} />
          </div>

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
      {/* Left part - Summary Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>MSPO Summary</CardTitle>
          <div className="flex items-center gap-2">
            <MonthYearFilter date={filterDate} setDate={setFilterDate} />
          </div>
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
            MSPO Details {selectedItem && `(${formatDateStr(selectedItem.date)})`}
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

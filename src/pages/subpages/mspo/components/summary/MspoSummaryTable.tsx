
import React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { MspoOverViewItem } from "../MspoOverView";
import PaginationControls from "../pagination/PaginationControls";
import { formatDate, formatDateTime } from "@/ultis/datetime";

interface MspoSummaryTableProps {
  data: MspoOverViewItem[];
  selectedItem: MspoOverViewItem | null;
  onViewDetail: (item: MspoOverViewItem) => void;
  isLoading: boolean;
}

const MspoSummaryTable: React.FC<MspoSummaryTableProps> = ({ 
  data, 
  selectedItem, 
  onViewDetail,
  isLoading
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const paginatedData = data ? data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];
  
  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

  return (
    <>
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
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
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
                        onClick={() => onViewDetail(item)}
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
          
          <PaginationControls 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}
    </>
  );
};

export default MspoSummaryTable;

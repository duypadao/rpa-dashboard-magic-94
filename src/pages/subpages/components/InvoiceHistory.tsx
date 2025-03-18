
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Processing History</CardTitle>
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
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.length > 0 ? (
                  invoiceData.map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell>{invoice.supplierName}</TableCell>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No invoice history available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceHistory;

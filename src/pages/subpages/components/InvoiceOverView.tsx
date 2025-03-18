
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <Card>
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
                <TableRow>
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
                {invoiceData.length > 0 ? (
                  invoiceData.map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.supplierId}</TableCell>
                      <TableCell>{invoice.supplierName}</TableCell>
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
                    <TableCell colSpan={5} className="text-center">No invoice overview available</TableCell>
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

export default InvoiceOverView;

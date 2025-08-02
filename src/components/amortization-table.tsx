import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AmortizationRow } from '@/lib/types';

interface AmortizationTableProps {
  data: AmortizationRow[];
}

const AmortizationTable = ({ data }: AmortizationTableProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amortization Schedule</CardTitle>
        <CardDescription>
          A detailed breakdown of each payment over the life of the loan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead className="w-[100px]">Month</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                {data.some(row => row.extraPayment > 0) && <TableHead>Extra Payment</TableHead>}
                <TableHead>Total Payment</TableHead>
                <TableHead>Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>${row.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>${row.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  {data.some(r => r.extraPayment > 0) && <TableCell>${row.extraPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>}
                  <TableCell>${row.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>${row.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AmortizationTable;

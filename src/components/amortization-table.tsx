
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
  currency: 'USD' | 'INR';
}

const AmortizationTable = ({ data, currency }: AmortizationTableProps) => {
  if (!data || data.length === 0) {
    return null;
  }
  const showExtraPayment = data.some(row => row.extraPayment > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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
                {showExtraPayment && <TableHead>Extra Payment</TableHead>}
                <TableHead>Total Payment</TableHead>
                <TableHead>Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{formatCurrency(row.principal)}</TableCell>
                  <TableCell>{formatCurrency(row.interest)}</TableCell>
                  {showExtraPayment && <TableCell>{formatCurrency(row.extraPayment)}</TableCell>}
                  <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                  <TableCell>{formatCurrency(row.remainingBalance)}</TableCell>
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

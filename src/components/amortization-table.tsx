
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
import { useCurrency } from '@/context/currency-context';
import { AmortizationRow } from '@/lib/types';

interface AmortizationTableProps {
  data: AmortizationRow[];
}

const AmortizationTable = ({ data }: AmortizationTableProps) => {
  const { formatCurrency } = useCurrency();
  if (!data || data.length === 0) {
    return null;
  }
  const showExtraPayment = data.some(row => row.extraPayment > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amortization Schedule</CardTitle>
        <CardDescription>
          A detailed breakdown of each payment over the life of the loan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AmortizationTable;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PricingTier } from "@/lib/types";

interface PricingTableProps {
  tiers: PricingTier[];
}

export function PricingTable({ tiers }: PricingTableProps) {
  if (!tiers || tiers.length === 0) return null;

  const sortedTiers = [...tiers].sort((a, b) => a.minQty - b.minQty);

  return (
    <div className="rounded-md border border-neutral-200 overflow-hidden shadow-sm">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-neutral-50 border-b border-neutral-200">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-1/3 text-left text-[10px] sm:text-sm font-semibold h-8 sm:h-10 px-2 sm:px-4">Tier</TableHead>
            <TableHead className="w-1/3 text-center text-[10px] sm:text-sm font-semibold h-8 sm:h-10 px-2 sm:px-4">Quantity</TableHead>
            <TableHead className="w-1/3 text-right text-[10px] sm:text-sm font-semibold h-8 sm:h-10 px-2 sm:px-4">
              Price/Unit
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTiers.map((tier, index) => {
            const isBase = index === 0;
            const isBestValue =
              index === sortedTiers.length - 1 && sortedTiers.length > 1;

            return (
              <TableRow
                key={tier.id}
                className="border-b border-neutral-100 last:border-none transition-colors hover:bg-neutral-50/50 animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="w-1/3 text-left text-[11px] sm:text-sm font-medium px-2 sm:px-4 py-3 sm:py-4 align-top">
                  <div className="flex flex-row items-center gap-1.5 flex-wrap sm:flex-nowrap">
                    <span className="leading-none mt-[2px]">{index === 0 ? "BasicPrice" : index === 1 ? "SmartPrice" : "BestPrice"}</span>
                    {isBestValue && (
                      <span className="bg-[#D4AF37]/10 text-[#B8860B] rounded-[3px] px-1.5 py-1 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider whitespace-nowrap leading-none border border-[#D4AF37]/20">
                        <span className="sm:hidden">Best</span>
                        <span className="hidden sm:inline">Best Value</span>
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="w-1/3 text-center text-[11px] sm:text-sm text-neutral-600 px-2 sm:px-4 py-3 sm:py-4 align-top">
                  <span className="leading-none mt-[2px] block">
                    {index === sortedTiers.length - 1
                      ? `${tier.minQty}+ units`
                      : `${tier.minQty} - ${sortedTiers[index + 1].minQty - 1} units`}
                  </span>
                </TableCell>
                <TableCell className="w-1/3 text-right text-[11px] sm:text-sm font-bold tabular-nums px-2 sm:px-4 py-3 sm:py-4 align-top">
                  <span className="leading-none mt-[2px] block">
                    ${tier.unitPrice.toFixed(2)}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

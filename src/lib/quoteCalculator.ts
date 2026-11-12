import {
  DASHBOARD_ACCESS_PACKAGES,
  APPROVED_PER_MEDIA_RATES,
  ApprovedMediaRate,
  DashboardPackage,
} from '../config/pricingConfig';
import { MEDIA_CATALOG } from '../config/mediaAuditCatalog';
import { QuoteMediaRow } from '../types/mooviq';

export interface QuoteRowCalculation {
  rowId: string;
  mediaTypeId: string;
  mediaName: string;
  units: number;
  rounds: number;
  auditEvents: number;
  cityScope: string;
  approvedRate?: ApprovedMediaRate;
  lineSubtotalInr: number | null; // null => Custom quote required
}

export interface QuoteCalculationResult {
  dashboardPlan: DashboardPackage | null;
  dashboardMonthlyInr: number | null; // null => Custom Enterprise, 0 => None selected
  totalMediaUnits: number;
  totalAuditEvents: number;
  rows: QuoteRowCalculation[];
  pricedRowsCount: number;
  unpricedRowsCount: number;
  partialServiceSubtotalInr: number;
  hasUnpricedItems: boolean;
}

export function clampQuantity(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

export function calculateQuoteBreakdown(
  selectedDashboardId: string,
  mediaRows: QuoteMediaRow[],
  rateRegistry: Record<string, ApprovedMediaRate | undefined> = APPROVED_PER_MEDIA_RATES
): QuoteCalculationResult {
  const dashboardPlan =
    selectedDashboardId === 'none'
      ? null
      : DASHBOARD_ACCESS_PACKAGES.find((p) => p.id === selectedDashboardId) || null;

  const dashboardMonthlyInr =
    selectedDashboardId === 'none' ? 0 : dashboardPlan ? dashboardPlan.monthlyPriceInr : 0;

  let totalMediaUnits = 0;
  let totalAuditEvents = 0;
  let pricedRowsCount = 0;
  let unpricedRowsCount = 0;
  let partialServiceSubtotalInr = 0;

  const rows: QuoteRowCalculation[] = mediaRows.map((row) => {
    const safeUnits = clampQuantity(row.units, 0, 50000);
    const safeRounds = clampQuantity(row.rounds, 1, 52);
    const auditEvents = safeUnits * safeRounds;

    totalMediaUnits += safeUnits;
    totalAuditEvents += auditEvents;

    const mediaMeta = MEDIA_CATALOG.find((m) => m.id === row.mediaTypeId);
    const rate = rateRegistry[row.mediaTypeId];

    let lineSubtotalInr: number | null = null;
    if (rate && typeof rate.unitPriceInr === 'number') {
      lineSubtotalInr = auditEvents * rate.unitPriceInr;
      partialServiceSubtotalInr += lineSubtotalInr;
      pricedRowsCount += 1;
    } else {
      unpricedRowsCount += 1;
    }

    return {
      rowId: row.id,
      mediaTypeId: row.mediaTypeId,
      mediaName: mediaMeta?.name || row.mediaTypeId,
      units: safeUnits,
      rounds: safeRounds,
      auditEvents,
      cityScope: row.cityScope.trim() || 'Unspecified cities',
      approvedRate: rate,
      lineSubtotalInr,
    };
  });

  return {
    dashboardPlan,
    dashboardMonthlyInr,
    totalMediaUnits,
    totalAuditEvents,
    rows,
    pricedRowsCount,
    unpricedRowsCount,
    partialServiceSubtotalInr,
    hasUnpricedItems: unpricedRowsCount > 0,
  };
}

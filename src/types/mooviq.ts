import { MediaFamilyId, AuditWorkflowStatus } from '../config/mediaAuditCatalog';

export type CampaignStatus = 'Ongoing' | 'Completed';

export type ProofStatus = 'Verified' | 'Pending' | 'Flagged';

export type AlertRisk = 'Needs review' | 'Resolved';

export type AlertType =
  | 'Creative mismatch'
  | 'Damaged wrap / peeling'
  | 'Billboard obstruction / garbage'
  | 'Missing proof'
  | 'Screen playback missing'
  | 'Location mismatch';

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  agency: string;
  city: string;
  mediaFamilyId: MediaFamilyId;
  mediaType: string;
  workflowStatus: AuditWorkflowStatus;
  status: CampaignStatus;
  targetUnits: number;
  submittedUnits: number;
  verifiedUnits: number;
  flaggedUnits: number;
  pendingUnits: number;
  completionRate: number; // Math.round((submittedUnits / targetUnits) * 100)
  verifiedRate: number; // Math.round((verifiedUnits / targetUnits) * 100)
  startDate: string;
  endDate: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface MediaProof {
  id: string;
  taskId: string;
  mediaUnitId: string;
  campaignId: string;
  campaignName: string;
  mediaFamilyId: MediaFamilyId;
  mediaType: string;
  city: string;
  locationString: string;
  timestamp: string;
  status: ProofStatus;
  evidenceType: string;
  isLogBased?: boolean;
  notes: string;
  reviewerNotes: string;
  aspectRatio: string;
}

export interface FraudAlert {
  id: string;
  alertType: AlertType;
  campaignId: string;
  campaignName: string;
  agency: string;
  mediaFamilyId: MediaFamilyId;
  mediaType: string;
  city: string;
  taskId: string;
  timestamp: string;
  riskLevel: AlertRisk;
  severity: 'High' | 'Medium' | 'Low';
  suggestedSteps: string[];
  detailNotes: string;
}

export interface MonthlyAuditPoint {
  month: string;
  fullName: string;
  tasks: number;
  verified: number;
  flagged: number;
  campaignsActive: number;
}

export interface CityCoverageItem {
  city: string;
  tasksExecuted: number;
  completionRate: number;
  activeCampaigns: number;
}

export interface DemoStats {
  activeCampaigns: number;
  auditsCompleted: number;
  pendingReviews: number;
  flaggedIssues: number;
  tasksExecutedTotal: number;
  avgCompletionRate: number;
}

export type ReportFormatKey = 'auto' | 'cab' | 'billboard' | 'mall-screen' | 'cinema-playback';

export interface SampleReportEntry {
  unitId: string;
  locationOrScreen: string;
  checkpointTime: string;
  primaryCheck: string;
  secondaryCheck: string;
  status: ProofStatus;
  note: string;
}

export interface SampleAuditReportTemplate {
  key: ReportFormatKey;
  label: string;
  mediaFamily: string;
  verificationMode: string;
  caveat: string;
  columns: [string, string, string, string, string, string];
  summaryMetrics: { label: string; value: string }[];
  rows: SampleReportEntry[];
}

export type EnquiryType =
  | 'Book a demo'
  | 'Request media-wise quote'
  | 'Discuss pilot'
  | 'Product question';

export interface QuoteMediaRow {
  id: string;
  familyId: MediaFamilyId;
  mediaTypeId: string;
  units: number;
  rounds: number;
  cityScope: string;
}

export interface QuotePrefillPayload {
  enquiryType: EnquiryType;
  dashboardPlanId?: string;
  dashboardPlanLabel?: string;
  selectedMediaNames?: string[];
  totalAuditEvents?: number;
  cityScope?: string;
  summaryText?: string;
}

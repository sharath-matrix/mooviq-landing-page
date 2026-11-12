export type CampaignStatus = 'Ongoing' | 'Completed';

export type ProofStatus = 'Verified' | 'Pending' | 'Flagged';

export type AlertRisk = 'Needs review' | 'Resolved';

export type AlertType = 
  | 'Possible duplicate image'
  | 'Location mismatch'
  | 'Evidence submitted late'
  | 'Perspective occlusion';

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  agency: string;
  city: string;
  mediaType: string;
  status: CampaignStatus;
  targetUnits: number;
  submittedUnits: number;
  verifiedUnits: number;
  flaggedUnits: number;
  pendingUnits: number;
  completionRate: number; // percentage (submitted / target)
  verifiedRate: number; // percentage (verified / target)
  budgetLabel: string; // Illustrative tag
  startDate: string;
  endDate: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface MediaProof {
  id: string;
  taskId: string;
  campaignId: string;
  campaignName: string;
  mediaType: string;
  city: string;
  locationString: string;
  timestamp: string;
  status: ProofStatus;
  evidenceType: string;
  notes: string;
  aspectRatio: string;
  badgeTone: 'emerald' | 'amber' | 'rose';
  accentColor: string;
}

export interface FraudAlert {
  id: string;
  alertType: AlertType;
  campaignId: string;
  campaignName: string;
  agency: string;
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


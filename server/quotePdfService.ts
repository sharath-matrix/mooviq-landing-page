/**
 * Server-Side PDF Quotation Generator for Mooviq
 *
 * Generates an official, publication-quality A4 PDF quotation for verified clients.
 */

import { jsPDF } from 'jspdf';
import { CalculatedQuotation } from './pricingService';

export function generateQuotationPdf(quotation: CalculatedQuotation): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm

  // Colors
  const navy = [15, 23, 42]; // #0f172a
  const brandRed = [225, 29, 72]; // #e11d48
  const slateDark = [51, 65, 85]; // #334155
  const slateLight = [100, 116, 139]; // #64748b
  const bgLight = [248, 250, 252]; // #f8fafc

  let y = margin;

  // 1. Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MOOVIQ', margin + 8, y + 11);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('Multi-Media Advertising Audit & Proof of Performance', margin + 8, y + 17);

  // Quote Ref & Date on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(quotation.quotationRef, pageWidth - margin - 8, y + 10, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  const formattedDate = new Date(quotation.generatedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Date: ${formattedDate}`, pageWidth - margin - 8, y + 16, { align: 'right' });

  y += 29;

  // 2. Client Details & High-level Metrics Card
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PREPARED FOR:', margin + 6, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`${quotation.client.fullName} · ${quotation.client.companyName}`, margin + 6, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateLight[0], slateLight[1], slateLight[2]);
  doc.text(
    `Mobile: ${quotation.client.mobileNumber} (Verified)  |  Email: ${quotation.client.workEmail} (Verified)`,
    margin + 6,
    y + 19
  );

  // Summary chips on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.text(
    `${quotation.totals.totalMediaUnits} Units · ${quotation.totals.totalBillableEvents} Audits · ${quotation.dashboard.users} Dashboard Seats`,
    pageWidth - margin - 6,
    y + 13,
    { align: 'right' }
  );

  y += 30;

  // 3. Media Items Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('MEDIA FORMAT', margin + 3, y + 5);
  doc.text('CATEGORY', margin + 55, y + 5);
  doc.text('BILLABLE QUANTITY', margin + 92, y + 5);
  doc.text('CREDITS', margin + 130, y + 5);
  doc.text('EST. COST (INR)', pageWidth - margin - 3, y + 5, { align: 'right' });

  y += 8;

  // 4. Media Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  quotation.items.forEach((item) => {
    // Row background toggle or underline
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 7, pageWidth - margin, y + 7);

    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(item.mediaName.slice(0, 28), margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateLight[0], slateLight[1], slateLight[2]);
    doc.text(`Scope: ${item.cityScope.slice(0, 24)}`, margin + 3, y + 8);

    doc.setFontSize(7.5);
    doc.text(item.category.slice(0, 20), margin + 55, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(`${item.billableQuantity} ${item.billingUnit.slice(0, 16)}`, margin + 92, y + 5);

    if (item.isCustomQuote) {
      doc.setTextColor(217, 119, 6); // amber-600
      doc.text('Custom Quote', margin + 130, y + 5);
      doc.text('Quote Required', pageWidth - margin - 3, y + 5, { align: 'right' });
    } else {
      doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.text(`${item.totalCredits?.toLocaleString('en-IN')} cr`, margin + 130, y + 5);

      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.text(`₹${(item.lineCostInr || 0).toLocaleString('en-IN')}`, pageWidth - margin - 3, y + 5, {
        align: 'right',
      });
    }

    y += 10;
  });

  y += 6;

  // 5. Commercial Totals & Financial Box
  const totalsBoxHeight = 36;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - margin - 90, y, 90, totalsBoxHeight, 2, 2, 'FD');

  const rightMargin = pageWidth - margin - 5;
  const leftCol = pageWidth - margin - 85;

  doc.setFontSize(7.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('Audit Services Subtotal:', leftCol, y + 7);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${quotation.totals.auditSubtotalInr.toLocaleString('en-IN')}`, rightMargin, y + 7, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text(`Dashboard (${quotation.dashboard.users} seat${quotation.dashboard.users > 1 ? 's' : ''}/mo):`, leftCol, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${quotation.totals.dashboardMonthlyInr.toLocaleString('en-IN')}`, rightMargin, y + 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Applicable GST (18%):', leftCol, y + 21);
  doc.setFont('helvetica', 'bold');
  doc.text(`₹${quotation.totals.gstInr.toLocaleString('en-IN')}`, rightMargin, y + 21, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(leftCol, y + 25, rightMargin, y + 25);

  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Estimated Total (with GST):', leftCol, y + 31);
  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.text(`₹${quotation.totals.totalEstimateWithGstInr.toLocaleString('en-IN')}`, rightMargin, y + 31, { align: 'right' });

  // On the left of totals box: Wallet recommendation & onboarding highlight
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, 78, totalsBoxHeight, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text('₹0 Standard Onboarding Included', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Wallet Recommendation: ${quotation.walletRecommendation.packageName} (${quotation.walletRecommendation.packageCredits.toLocaleString()} credits / ₹${quotation.walletRecommendation.packagePriceInr.toLocaleString('en-IN')}).`,
    margin + 5,
    y + 14,
    { maxWidth: 68 }
  );

  doc.setFontSize(7);
  doc.setTextColor(slateLight[0], slateLight[1], slateLight[2]);
  doc.text('Prepaid wallet covers audit tasks directly.', margin + 5, y + 28);

  y += totalsBoxHeight + 8;

  // 6. Policy & Scope Terms
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('COMMERCIAL TERMS & AUDIT POLICIES', margin, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateLight[0], slateLight[1], slateLight[2]);

  quotation.termsNotes.forEach((term) => {
    doc.text(`• ${term}`, margin + 2, y, { maxWidth: contentWidth - 4 });
    y += 3.8;
  });

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 282, pageWidth - margin, 282);

  doc.setFontSize(6.5);
  doc.text(
    'Mooviq by EraZero AI · Confirmed commercial terms upon onboarding agreement · https://erazero.ai/mooviq',
    pageWidth / 2,
    286,
    { align: 'center' }
  );

  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}


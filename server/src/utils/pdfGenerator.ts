import PDFDocument from 'pdfkit';

const formatAmount = (value: unknown) => {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
};

const formatDate = (value: unknown) => {
    if (!value) return 'N/A';
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export const generatePDFBuffer = async (templateData: any): Promise<Buffer> => {
    const user = templateData?.user ?? {};
    const invoice = templateData?.invoice ?? {};
    const items = Array.isArray(invoice.items) ? invoice.items : [];

    // Pre-fetch QR code buffer if payment_url is present
    let qrBuffer: Buffer | null = null;
    if (invoice.payment_url) {
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(invoice.payment_url)}`;
            const response = await fetch(qrUrl);
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                qrBuffer = Buffer.from(arrayBuffer);
            }
        } catch (err) {
            console.error("Failed to generate QR Code for PDF:", err);
        }
    }

    return await new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ 
            size: 'A4', 
            margin: 40,
            bufferPages: true 
        });
        const chunks: Buffer[] = [];
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const pageMargin = 40;
        const contentWidth = pageWidth - pageMargin * 2;

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // --- 1. WATERMARK ---
        const status = (invoice.status || 'Draft').toUpperCase();
        if (status === 'PAID' || status === 'OVERDUE') {
            doc.save();
            doc.opacity(0.04);
            doc.fontSize(110).font('Helvetica-Bold');
            doc.fillColor(status === 'PAID' ? '#16A34A' : '#DC2626');
            doc.translate(pageWidth / 2, pageHeight / 2);
            doc.rotate(-30);
            doc.text(status, -250, -50, { width: 500, align: 'center' });
            doc.restore();
        }

        // --- 2. HEADER BRANDING & METADATA ---
        const brandColor = '#F97316'; // Premium brand orange accent
        const darkColor = '#111827';
        const grayColor = '#6B7280';
        const borderColor = '#E5E7EB';

        // Draw accent colored top border line
        doc.rect(pageMargin, pageMargin, contentWidth, 3).fill(brandColor);

        let currentY = pageMargin + 25;

        // Left Header: Creator / Seller info
        doc.font('Helvetica-Bold').fontSize(16).fillColor(darkColor).text(user.business_name || user.name || 'NanoBill Workspace', pageMargin, currentY);
        doc.font('Helvetica').fontSize(9).fillColor(grayColor);
        
        let sellerInfoText = "";
        if (user.business_address) sellerInfoText += `${user.business_address}\n`;
        sellerInfoText += `Email: ${user.email || 'billing@nanobill.com'}`;
        if (user.phone) sellerInfoText += `  |  Phone: ${user.phone}`;
        
        doc.text(sellerInfoText, pageMargin, doc.y + 4, { width: 300, lineGap: 2 });
        const leftHeaderEndY = doc.y;

        // Right Header: Title and Status Badge
        doc.font('Helvetica-Bold').fontSize(22).fillColor(darkColor).text('INVOICE', pageWidth - pageMargin - 200, currentY, {
            width: 200,
            align: 'right'
        });

        // Dynamic Status Badge drawing
        let badgeBg = '#F3F4F6';
        let badgeText = '#4B5563';
        if (status === 'PAID') {
            badgeBg = '#DCFCE7';
            badgeText = '#15803D';
        } else if (status === 'OVERDUE') {
            badgeBg = '#FEE2E2';
            badgeText = '#B91C1C';
        } else if (status === 'SENT' || status === 'PENDING') {
            badgeBg = '#FFEDD5';
            badgeText = '#C2410C';
        }

        const badgeWidth = 70;
        const badgeHeight = 16;
        const badgeX = pageWidth - pageMargin - badgeWidth;
        const badgeY = doc.y + 3;

        doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 3).fill(badgeBg);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(badgeText).text(status, badgeX, badgeY + 4, {
            width: badgeWidth,
            align: 'center'
        });

        doc.font('Helvetica').fontSize(9).fillColor(grayColor).text(`Invoice #: ${invoice.invoice_number || 'N/A'}`, pageWidth - pageMargin - 200, badgeY + badgeHeight + 8, {
            width: 200,
            align: 'right'
        });
        doc.text(`Issued: ${formatDate(invoice.created_at)}`, pageWidth - pageMargin - 200, doc.y + 3, {
            width: 200,
            align: 'right'
        });
        doc.text(`Due Date: ${formatDate(invoice.due_date)}`, pageWidth - pageMargin - 200, doc.y + 3, {
            width: 200,
            align: 'right'
        });

        currentY = Math.max(leftHeaderEndY, doc.y) + 20;

        // Divider
        doc.moveTo(pageMargin, currentY).lineTo(pageWidth - pageMargin, currentY).strokeColor(borderColor).lineWidth(1).stroke();
        currentY += 15;

        // --- 3. CLIENT SECTION (BILL TO) & TIMELINE ---
        // Client details card
        const clientCardWidth = 240;
        doc.roundedRect(pageMargin, currentY, clientCardWidth, 88, 6).fill('#FAFAFA').stroke(borderColor);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(grayColor).text('BILL TO', pageMargin + 12, currentY + 10);
        doc.font('Helvetica-Bold').fontSize(11).fillColor(darkColor).text(invoice.client_name || 'Valued Client', pageMargin + 12, currentY + 22);
        
        let clientDetails = "";
        if (invoice.client_address) clientDetails += `${invoice.client_address}\n`;
        if (invoice.client_email) clientDetails += `${invoice.client_email}\n`;
        if (invoice.client_phone) clientDetails += `Phone: ${invoice.client_phone}`;

        doc.font('Helvetica').fontSize(9).fillColor(grayColor).text(clientDetails.trim(), pageMargin + 12, currentY + 36, {
            width: clientCardWidth - 24,
            lineGap: 1
        });

        // Payment Timeline widget on the right
        const timelineX = pageMargin + clientCardWidth + 20;
        const timelineWidth = contentWidth - clientCardWidth - 20;
        
        doc.roundedRect(timelineX, currentY, timelineWidth, 88, 6).fill('#FAFAFA').stroke(borderColor);
        doc.font('Helvetica-Bold').fontSize(8).fillColor(grayColor).text('INVOICE LIFECYCLE', timelineX + 12, currentY + 10);

        // Timeline Node plotting
        const nodeY = currentY + 45;
        const startX = timelineX + 25;
        const endX = timelineX + timelineWidth - 25;
        const interval = (endX - startX) / 3;

        const isPaid = status === 'PAID';
        const isOverdue = status === 'OVERDUE';

        const stages = [
            { label: 'Created', active: true, date: formatDate(invoice.created_at) },
            { label: 'Sent', active: true, date: formatDate(invoice.created_at) },
            { label: 'Due Date', active: !isPaid, date: formatDate(invoice.due_date), warning: isOverdue },
            { label: 'Paid', active: isPaid, date: isPaid ? 'Completed' : 'Pending' }
        ];

        // Draw horizontal line
        doc.moveTo(startX, nodeY).lineTo(endX, nodeY).strokeColor('#E5E7EB').lineWidth(2).stroke();

        stages.forEach((stage, index) => {
            const nodeX = startX + index * interval;
            // Draw node circle
            let color = '#D1D5DB';
            if (stage.active) {
                color = brandColor;
            }
            if (index === 3 && isPaid) {
                color = '#10B981';
            }
            if (stage.warning) {
                color = '#EF4444';
            }

            doc.circle(nodeX, nodeY, 4).fill(color);

            // Label
            doc.font('Helvetica-Bold').fontSize(7).fillColor(stage.active ? darkColor : grayColor)
                .text(stage.label, nodeX - 30, nodeY - 14, { width: 60, align: 'center' });

            // Subtext/Date
            doc.font('Helvetica').fontSize(6.5).fillColor(grayColor)
                .text(stage.date, nodeX - 35, nodeY + 8, { width: 70, align: 'center' });
        });

        currentY += 105;

        // --- 4. BILLING ITEMS TABLE ---
        const tableHeaderY = currentY;
        const colDescX = pageMargin;
        const colDescWidth = 250;
        const colQtyX = pageMargin + colDescWidth;
        const colQtyWidth = 50;
        const colPriceX = colQtyX + colQtyWidth;
        const colPriceWidth = 100;
        const colAmountX = colPriceX + colPriceWidth;
        const colAmountWidth = contentWidth - colDescWidth - colQtyWidth - colPriceWidth;

        // Draw Header background
        doc.rect(pageMargin, tableHeaderY, contentWidth, 22).fill('#FAFAFA');
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(grayColor);
        doc.text('DESCRIPTION', colDescX + 8, tableHeaderY + 7);
        doc.text('QTY', colQtyX, tableHeaderY + 7, { width: colQtyWidth, align: 'center' });
        doc.text('UNIT PRICE', colPriceX, tableHeaderY + 7, { width: colPriceWidth, align: 'right' });
        doc.text('AMOUNT', colAmountX - 8, tableHeaderY + 7, { width: colAmountWidth, align: 'right' });

        doc.moveTo(pageMargin, tableHeaderY + 22).lineTo(pageWidth - pageMargin, tableHeaderY + 22).strokeColor(borderColor).lineWidth(1).stroke();

        let rowY = tableHeaderY + 22;
        doc.font('Helvetica').fontSize(9);

        items.forEach((item: any, index: number) => {
            const qty = Number(item.quantity || 1);
            const price = Number(item.price || 0);
            const total = qty * price;
            const desc = item.name || item.description || 'Service/Item Details';

            // Zebra striping
            if (index % 2 === 1) {
                doc.rect(pageMargin, rowY, contentWidth, 24).fill('#FBFBFB');
            }

            doc.fillColor(darkColor).text(desc, colDescX + 8, rowY + 7, { width: colDescWidth - 16, ellipsis: true });
            doc.text(String(qty), colQtyX, rowY + 7, { width: colQtyWidth, align: 'center' });
            doc.text(`INR ${formatAmount(price)}`, colPriceX, rowY + 7, { width: colPriceWidth, align: 'right' });
            doc.text(`INR ${formatAmount(total)}`, colAmountX - 8, rowY + 7, { width: colAmountWidth, align: 'right' });

            rowY += 24;

            // Draw thin divider line
            doc.moveTo(pageMargin, rowY).lineTo(pageWidth - pageMargin, rowY).strokeColor('#F3F4F6').lineWidth(0.5).stroke();
        });

        // Draw final table bottom border
        doc.moveTo(pageMargin, rowY).lineTo(pageWidth - pageMargin, rowY).strokeColor(borderColor).lineWidth(1).stroke();

        // --- 5. PAYMENT MODULES & SUMMARY DETAILS ---
        currentY = rowY + 20;

        // Draw dynamic Payment card (UPI / QR / Bank details) on the left
        const paymentCardWidth = 240;
        doc.roundedRect(pageMargin, currentY, paymentCardWidth, 125, 6).fill('#FAFAFA').stroke(borderColor);
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(grayColor).text('PAYMENT OPTIONS', pageMargin + 12, currentY + 10);

        if (qrBuffer) {
            // Render QR Code
            doc.image(qrBuffer, pageMargin + 12, currentY + 24, { width: 85, height: 85 });
            
            // Payment instructions next to QR code
            const qrTextX = pageMargin + 108;
            doc.font('Helvetica-Bold').fontSize(8).fillColor(darkColor).text('Scan to Pay Instantly', qrTextX, currentY + 34);
            doc.font('Helvetica').fontSize(7.5).fillColor(grayColor).text('Scan this QR code using any UPI app (GPay, PhonePe, Paytm) to complete payment.', qrTextX, currentY + 46, {
                width: paymentCardWidth - 120,
                lineGap: 2
            });
            if (invoice.payment_url) {
                doc.font('Helvetica-Bold').fontSize(7).fillColor(brandColor).text('Click to Pay Online >', qrTextX, currentY + 92, {
                    link: invoice.payment_url
                });
            }
        } else {
            // Standard Bank details fallback
            doc.font('Helvetica-Bold').fontSize(8).fillColor(darkColor).text('Direct Bank Transfer', pageMargin + 12, currentY + 28);
            
            let bankText = "";
            if (user.bank_account_number) bankText += `A/C Number: ${user.bank_account_number}\n`;
            if (user.bank_ifsc) bankText += `IFSC Code: ${user.bank_ifsc}\n`;
            bankText += `Account Name: ${user.business_name || user.name || 'Merchant'}`;

            doc.font('Helvetica').fontSize(8).fillColor(grayColor).text(bankText, pageMargin + 12, currentY + 40, {
                width: paymentCardWidth - 24,
                lineGap: 3
            });
        }

        // Summary details card on the right
        const summaryCardWidth = 220;
        const summaryCardX = pageWidth - pageMargin - summaryCardWidth;

        doc.roundedRect(summaryCardX, currentY, summaryCardWidth, 125, 6).fill('#FAFAFA').stroke(borderColor);

        const totalAmountNum = Number(invoice.total_amount || 0);
        const taxAmountNum = Number(invoice.tax_amount || 0);
        const subtotalNum = totalAmountNum - taxAmountNum;

        let gstPercentage = 0;
        if (subtotalNum > 0) {
            gstPercentage = Math.round((taxAmountNum / subtotalNum) * 100);
        }

        let summaryTextY = currentY + 12;
        doc.font('Helvetica').fontSize(9.5).fillColor(grayColor);
        
        // Subtotal row
        doc.text('Subtotal:', summaryCardX + 12, summaryTextY);
        doc.font('Helvetica-Bold').fillColor(darkColor).text(`INR ${formatAmount(subtotalNum)}`, summaryCardX + 120, summaryTextY, { width: 88, align: 'right' });

        // Tax details row
        if (taxAmountNum > 0) {
            summaryTextY += 18;
            doc.font('Helvetica').fillColor(grayColor).text(`GST (${gstPercentage}%):`, summaryCardX + 12, summaryTextY);
            doc.font('Helvetica-Bold').fillColor(darkColor).text(`INR ${formatAmount(taxAmountNum)}`, summaryCardX + 120, summaryTextY, { width: 88, align: 'right' });
        }

        // Late fee row (if invoice has late fee applied)
        let isLateFeeApplied = false;
        if (invoice.notes && invoice.notes.includes('late fee')) {
            isLateFeeApplied = true;
            summaryTextY += 18;
            doc.font('Helvetica').fillColor('#DC2626').text('Late Fee (1.5%):', summaryCardX + 12, summaryTextY);
            // 1.5% interest was applied, calculate original amount
            const originalAmount = totalAmountNum / 1.015;
            const lateFeeAmt = totalAmountNum - originalAmount;
            doc.font('Helvetica-Bold').fillColor('#DC2626').text(`INR ${formatAmount(lateFeeAmt)}`, summaryCardX + 120, summaryTextY, { width: 88, align: 'right' });
        }

        // Bottom divider
        const divY = currentY + 86;
        doc.moveTo(summaryCardX + 10, divY).lineTo(summaryCardX + summaryCardWidth - 10, divY).strokeColor(borderColor).lineWidth(1).stroke();

        // Grand Total row
        const grandTotalY = divY + 10;
        doc.font('Helvetica-Bold').fontSize(12).fillColor(darkColor).text('Grand Total:', summaryCardX + 12, grandTotalY);
        doc.font('Helvetica-Bold').fontSize(13).fillColor(brandColor).text(`INR ${formatAmount(totalAmountNum)}`, summaryCardX + 120, grandTotalY, { width: 88, align: 'right' });

        currentY += 140;

        // --- 6. TERMS, NOTES & DISCLAIMERS ---
        if (invoice.notes) {
            doc.font('Helvetica-Bold').fontSize(8.5).fillColor(grayColor).text('NOTES & TERMS', pageMargin, currentY);
            
            // Clean up internal system notes from public display if needed, but display beautifully
            const publicNotes = String(invoice.notes).trim();
            doc.font('Helvetica').fontSize(8).fillColor(grayColor).text(publicNotes, pageMargin, currentY + 12, {
                width: contentWidth,
                lineGap: 3
            });
        }

        // --- 7. MODERNE FOOTER ---
        const footerY = pageHeight - pageMargin - 30;
        doc.moveTo(pageMargin, footerY).lineTo(pageWidth - pageMargin, footerY).strokeColor(borderColor).lineWidth(0.5).stroke();

        doc.font('Helvetica').fontSize(7.5).fillColor(grayColor).text('This is a computer-generated document requiring no signature.', pageMargin, footerY + 8);
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor(grayColor).text('Powered by NanoBill 2.0', pageWidth - pageMargin - 150, footerY + 8, {
            width: 150,
            align: 'right'
        });

        doc.end();
    });
};

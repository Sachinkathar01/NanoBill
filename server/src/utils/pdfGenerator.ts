import PDFDocument from 'pdfkit';

const formatAmount = (value: unknown) => {
    const num = Number(value || 0);
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
};

const formatDate = (value: unknown) => {
    if (!value) return 'N/A';
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN');
};

export const generatePDFBuffer = async (templateData: any): Promise<Buffer> => {
    const user = templateData?.user ?? {};
    const invoice = templateData?.invoice ?? {};
    const items = Array.isArray(invoice.items) ? invoice.items : [];

    return await new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks: Buffer[] = [];
        const pageWidth = doc.page.width;
        const pageMargin = 50;
        const contentWidth = pageWidth - pageMargin * 2;

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const leftColX = pageMargin;
        const rightColX = pageWidth - pageMargin - 220;

        doc.font('Helvetica-Bold').fontSize(24).fillColor('#111').text(user.name || 'NanoBill', leftColX, 50);
        doc.font('Helvetica').fontSize(10).fillColor('#666').text(user.email || '', leftColX, 80);

        doc.font('Helvetica-Bold').fontSize(22).fillColor('#111').text(`INVOICE`, rightColX, 50, {
            width: 220,
            align: 'right'
        });
        doc.font('Helvetica').fontSize(11).fillColor('#222').text(`#${invoice.invoice_number || ''}`, rightColX, 78, {
            width: 220,
            align: 'right'
        });
        doc.font('Helvetica').fontSize(10).fillColor('#666').text(`Status: ${invoice.status || 'Draft'}`, rightColX, 96, {
            width: 220,
            align: 'right'
        });
        doc.text(`Issued: ${formatDate(invoice.created_at)}`, rightColX, 111, {
            width: 220,
            align: 'right'
        });
        doc.text(`Due: ${formatDate(invoice.due_date)}`, rightColX, 126, {
            width: 220,
            align: 'right'
        });

        doc.moveTo(pageMargin, 155).lineTo(pageWidth - pageMargin, 155).strokeColor('#E6E6E6').stroke();

        doc.font('Helvetica-Bold').fontSize(12).fillColor('#111').text('Bill To', pageMargin, 172);
        doc.font('Helvetica').fontSize(11).fillColor('#222').text(invoice.client_name || 'Client', pageMargin, 192);
        if (invoice.client_email) doc.text(invoice.client_email, pageMargin, doc.y + 3);
        if (invoice.client_phone) doc.text(invoice.client_phone, pageMargin, doc.y + 3);
        if (invoice.client_address) doc.text(invoice.client_address, pageMargin, doc.y + 3, { width: 280 });

        const tableStartY = Math.max(doc.y + 25, 270);
        const descriptionX = pageMargin;
        const qtyX = pageMargin + 300;
        const priceX = pageMargin + 360;
        const amountX = pageMargin + 450;

        doc.rect(pageMargin, tableStartY, contentWidth, 28).fill('#F6F7F9');
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#4A4A4A');
        doc.text('Description', descriptionX + 8, tableStartY + 9);
        doc.text('Qty', qtyX + 8, tableStartY + 9);
        doc.text('Price', priceX + 8, tableStartY + 9);
        doc.text('Amount', amountX + 8, tableStartY + 9);

        let rowY = tableStartY + 28;
        doc.font('Helvetica').fontSize(10).fillColor('#111');

        for (const item of items) {
            const quantity = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const amount = quantity * price;
            const itemName = item.name || item.description || 'Item';

            doc.rect(pageMargin, rowY, contentWidth, 26).fillAndStroke('#FFFFFF', '#EFEFEF');
            doc.fillColor('#111').text(itemName, descriptionX + 8, rowY + 8, { width: 285, ellipsis: true });
            doc.text(String(quantity), qtyX + 8, rowY + 8);
            doc.text(`INR ${formatAmount(price)}`, priceX + 8, rowY + 8);
            doc.text(`INR ${formatAmount(amount)}`, amountX + 8, rowY + 8);

            rowY += 26;
        }

        const summaryY = rowY + 16;
        const summaryWidth = 210;
        const summaryX = pageWidth - pageMargin - summaryWidth;

        doc.rect(summaryX, summaryY, summaryWidth, 70).fill('#FAFAFA').stroke('#EAEAEA');
        doc.font('Helvetica').fontSize(11).fillColor('#333').text(`Tax: INR ${formatAmount(invoice.tax_amount)}`, summaryX + 12, summaryY + 14);
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#111').text(`Total: INR ${formatAmount(invoice.total_amount)}`, summaryX + 12, summaryY + 38);

        if (invoice.notes) {
            const notesY = summaryY + 95;
            doc.font('Helvetica-Bold').fontSize(11).fillColor('#333').text('Notes', pageMargin, notesY);
            doc.font('Helvetica').fontSize(10).fillColor('#111').text(String(invoice.notes), pageMargin, notesY + 18, {
                width: contentWidth
            });
        }

        doc.end();
    });
};

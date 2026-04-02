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

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(22).text(user.name || 'NanoBill', { align: 'left' });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#666').text(user.email || '');
        doc.fillColor('#000');

        doc.moveDown(1.5);
        doc.fontSize(18).text(`Invoice ${invoice.invoice_number || ''}`, { align: 'right' });
        doc.moveDown(0.5);
        doc.fontSize(11).text(`Status: ${invoice.status || 'Draft'}`, { align: 'right' });
        doc.text(`Created: ${formatDate(invoice.created_at)}`, { align: 'right' });
        doc.text(`Due: ${formatDate(invoice.due_date)}`, { align: 'right' });

        doc.moveDown(1.2);
        doc.fontSize(12).fillColor('#333').text('Bill To');
        doc.fillColor('#000').fontSize(11);
        doc.text(invoice.client_name || 'Client');
        if (invoice.client_email) doc.text(invoice.client_email);
        if (invoice.client_phone) doc.text(invoice.client_phone);
        if (invoice.client_address) doc.text(invoice.client_address);

        doc.moveDown(1.2);
        doc.fontSize(12).text('Items');
        doc.moveDown(0.5);

        const startX = 50;
        const qtyX = 360;
        const priceX = 430;
        const amountX = 510;

        doc.fontSize(10).fillColor('#666');
        doc.text('Description', startX);
        doc.text('Qty', qtyX);
        doc.text('Price', priceX);
        doc.text('Amount', amountX);
        doc.fillColor('#000');

        doc.moveDown(0.4);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ddd').stroke();
        doc.moveDown(0.5);

        for (const item of items) {
            const quantity = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const amount = quantity * price;

            doc.fontSize(10).text(item.name || 'Item', startX, doc.y, { width: 290 });
            doc.text(String(quantity), qtyX, doc.y);
            doc.text(`INR ${formatAmount(price)}`, priceX, doc.y);
            doc.text(`INR ${formatAmount(amount)}`, amountX, doc.y);
            doc.moveDown(0.7);
        }

        doc.moveDown(0.6);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ddd').stroke();

        doc.moveDown(0.8);
        doc.fontSize(11).text(`Tax: INR ${formatAmount(invoice.tax_amount)}`, { align: 'right' });
        doc.fontSize(14).text(`Total: INR ${formatAmount(invoice.total_amount)}`, { align: 'right' });

        if (invoice.notes) {
            doc.moveDown(1.5);
            doc.fontSize(11).fillColor('#333').text('Notes');
            doc.fillColor('#000').fontSize(10).text(String(invoice.notes));
        }

        doc.end();
    });
};

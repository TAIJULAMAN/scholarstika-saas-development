import { BranchEarnings } from "@/components/institution/earnings/earnings-table"

export function generateInvoiceHTML(earning: BranchEarnings): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const invoiceNumber = `INV-${earning.branchId}-${Date.now().toString().slice(-6)}`
    const totalAmount = earning.totalPaid + earning.totalUnpaid
    const collectionRate = totalAmount > 0 ? ((earning.totalPaid / totalAmount) * 100).toFixed(1) : "0.0"

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${earning.branchName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 40px;
        }
        
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 30px;
        }
        
        .company-info h1 {
            font-size: 32px;
            margin-bottom: 5px;
        }
        
        .company-info p {
            opacity: 0.9;
            font-size: 14px;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-meta h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .invoice-meta p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .branch-details {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 8px;
        }
        
        .branch-details h3 {
            font-size: 18px;
            margin-bottom: 10px;
        }
        
        .branch-details p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section-title {
            font-size: 18px;
            color: #10b981;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #10b981;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        
        .summary-card.warning {
            border-left-color: #f59e0b;
        }
        
        .summary-card.info {
            border-left-color: #3b82f6;
        }
        
        .summary-card.success {
            border-left-color: #10b981;
        }
        
        .summary-card label {
            display: block;
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .summary-card .value {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
        }
        
        .breakdown-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .breakdown-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
        }
        
        .breakdown-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .breakdown-table tr:last-child td {
            border-bottom: none;
        }
        
        .breakdown-table .amount {
            text-align: right;
            font-weight: 600;
        }
        
        .total-row {
            background: #f9fafb;
            font-weight: bold;
        }
        
        .total-row td {
            padding: 20px 12px;
            font-size: 18px;
            color: #10b981;
        }
        
        .collection-rate {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .collection-rate-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .collection-rate-header span {
            font-size: 14px;
            color: #6b7280;
        }
        
        .collection-rate-header .percentage {
            font-size: 24px;
            font-weight: bold;
            color: #10b981;
        }
        
        .progress-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .footer {
            background: #f9fafb;
            padding: 30px 40px;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .footer-info {
            font-size: 12px;
            color: #6b7280;
        }
        
        .footer-info p {
            margin-bottom: 5px;
        }
        
        .generated-date {
            font-size: 12px;
            color: #9ca3af;
            text-align: right;
        }
        
        @media print {
            body {
                background: #ffffff;
                padding: 0;
            }
            
            .invoice-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="header-top">
                <div class="company-info">
                    <h1>Scholastika</h1>
                    <p>Educational Institution Management</p>
                </div>
                <div class="invoice-meta">
                    <h2>INVOICE</h2>
                    <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                    <p><strong>Date:</strong> ${currentDate}</p>
                </div>
            </div>
            
            <div class="branch-details">
                <h3>${earning.branchName}</h3>
                <p><strong>Branch ID:</strong> ${earning.branchId}</p>
            </div>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Summary Cards -->
            <h2 class="section-title">Financial Summary</h2>
            <div class="summary-grid">
                <div class="summary-card info">
                    <label>Total Students</label>
                    <div class="value">${earning.totalStudents.toLocaleString()}</div>
                </div>
                <div class="summary-card success">
                    <label>Fees Collected</label>
                    <div class="value">$${earning.totalPaid.toLocaleString()}</div>
                </div>
                <div class="summary-card warning">
                    <label>Outstanding Fees</label>
                    <div class="value">$${earning.totalUnpaid.toLocaleString()}</div>
                </div>
                <div class="summary-card">
                    <label>Total Amount</label>
                    <div class="value">$${totalAmount.toLocaleString()}</div>
                </div>
            </div>
            
            <!-- Collection Rate -->
            <div class="collection-rate">
                <div class="collection-rate-header">
                    <span>Collection Rate</span>
                    <span class="percentage">${collectionRate}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${collectionRate}%"></div>
                </div>
            </div>
            
            <!-- Breakdown Table -->
            <h2 class="section-title">Fee Breakdown</h2>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tuition Fees Collected</td>
                        <td class="amount">$${earning.totalPaid.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Outstanding Fees</td>
                        <td class="amount">$${earning.totalUnpaid.toLocaleString()}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Amount</td>
                        <td class="amount">$${totalAmount.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="footer-info">
                    <p><strong>Scholastika Educational Management</strong></p>
                    <p>Email: billing@scholastika.edu | Phone: +1 (555) 123-4567</p>
                    <p>Website: www.scholastika.edu</p>
                </div>
                <div class="generated-date">
                    <p>Generated on:</p>
                    <p>${new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim()
}

export function downloadInvoiceAsPDF(earning: BranchEarnings) {
    const htmlContent = generateInvoiceHTML(earning)

    // Create a temporary container
    const container = document.createElement('div')
    container.innerHTML = htmlContent
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    document.body.appendChild(container)

    // Find the invoice container
    const invoiceElement = container.querySelector('.invoice-container')

    if (invoiceElement) {
        // Import html2pdf dynamically
        import('html2pdf.js').then((html2pdf) => {
            const opt = {
                margin: 0,
                filename: `Invoice_${earning.branchId}_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait' as const
                }
            }

            // Suppress html2canvas unsupported color function warnings temporarily
            const originalConsoleError = console.error;
            const originalConsoleWarn = console.warn;
            
            const suppressWarning = (...args: any[]) => {
                if (typeof args[0] === 'string' && args[0].includes('unsupported color function')) {
                    return true;
                }
                return false;
            };

            console.error = (...args: any[]) => {
                if (!suppressWarning(...args)) originalConsoleError(...args);
            };
            
            console.warn = (...args: any[]) => {
                if (!suppressWarning(...args)) originalConsoleWarn(...args);
            };

            // Generate PDF
            html2pdf.default()
                .set(opt)
                .from(invoiceElement as HTMLElement)
                .save()
                .then(() => {
                    // Clean up
                    document.body.removeChild(container)
                    console.error = originalConsoleError;
                    console.warn = originalConsoleWarn;
                })
                .catch((error: Error) => {
                    originalConsoleError('Error generating PDF:', error)
                    document.body.removeChild(container)
                    console.error = originalConsoleError;
                    console.warn = originalConsoleWarn;
                })
        })
    } else {
        document.body.removeChild(container)
    }
}

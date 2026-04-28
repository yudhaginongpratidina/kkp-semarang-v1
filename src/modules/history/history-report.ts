import type { UserActivity } from './store';

const formatDisplayDate = (value?: string | number) => {
    if (!value) return '-';

    const date = typeof value === 'number' ? new Date(value) : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(date);
};

const getGroupLabel = (activity: UserActivity) => {
    if (activity.sourceCollection === 'historyLabUmum') {
        return 'Laboratorium Umum';
    }

    if (activity.sourceCollection === 'historyLabOfficial') {
        return 'Laboratorium C';
    }

    if (activity.sourceCollection === 'historyOC') {
        return 'Laboratorium C';
    }

    if (activity.sourceCollection === 'historySMKHPOnline') {
        return 'SMKHP Online';
    }

    if (activity.sourceCollection === 'historyCSOnline') {
        return 'Customer Service Online';
    }

    if (activity.sourceCollection === 'history') {
        if ((activity.type || '').toLowerCase().includes('smkhp')) {
            return 'SMKHP Offline';
        }

        if ((activity.type || '').toLowerCase().includes('customer')) {
            return 'Customer Service Offline';
        }
    }

    return activity.serviceLabel || 'Lainnya';
};

export const openHistoryReportPrint = (activities: UserActivity[]) => {
    const groups = activities.reduce<Record<string, UserActivity[]>>(
        (acc, activity) => {
            const label = getGroupLabel(activity);
            acc[label] = [...(acc[label] || []), activity];
            return acc;
        },
        {},
    );

    const orderedGroups = Object.entries(groups).sort(([left], [right]) =>
        left.localeCompare(right),
    );

    const sectionsHtml = orderedGroups
        .map(([label, items]) => {
            const rowsHtml = items
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(
                    (item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.title || '-'}</td>
                            <td>${item.userName || '-'}</td>
                            <td>${item.npwp || '-'}</td>
                            <td>${item.status || '-'}</td>
                            <td>${item.subStatus || '-'}</td>
                            <td>${item.description || '-'}</td>
                            <td>${formatDisplayDate(item.timestamp || item.dateLabel)}</td>
                        </tr>
                    `,
                )
                .join('');

            return `
                <section>
                    <div class="section-head">
                        <h2>${label}</h2>
                        <span>${items.length} history</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Judul</th>
                                <th>User</th>
                                <th>NPWP</th>
                                <th>Status</th>
                                <th>Sub Status</th>
                                <th>Ringkasan</th>
                                <th>Waktu</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </section>
            `;
        })
        .join('');

    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) return;

    printWindow.document.write(`
        <html>
            <head>
                <title>Laporan History KKP Semarang</title>
                <style>
                    @page { size: A4 landscape; margin: 16mm; }
                    body {
                        font-family: Arial, sans-serif;
                        color: #0f172a;
                        margin: 0;
                        padding: 24px;
                    }
                    h1 {
                        margin: 0 0 8px;
                        font-size: 24px;
                    }
                    p {
                        margin: 0;
                        color: #475569;
                    }
                    section {
                        margin-top: 24px;
                        page-break-inside: avoid;
                    }
                    .section-head {
                        display: flex;
                        justify-content: space-between;
                        align-items: baseline;
                        margin-bottom: 8px;
                    }
                    .section-head h2 {
                        margin: 0;
                        font-size: 18px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #0f172a;
                        padding: 6px 8px;
                        vertical-align: top;
                        text-align: left;
                    }
                    th {
                        background: #e2e8f0;
                    }
                </style>
            </head>
            <body>
                <h1>Laporan Keseluruhan History</h1>
                <p>Dicetak ${formatDisplayDate(Date.now())}</p>
                ${sectionsHtml || '<p>Belum ada data history.</p>'}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
};

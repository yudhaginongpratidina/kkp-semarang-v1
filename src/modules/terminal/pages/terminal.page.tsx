import QueueMonitor from '../../../shared/components/queue-monitor';

export default function TerminalPage() {
    return (
        <>
            <QueueMonitor
                data={{
                    'smkhp-offline': [
                        {
                            id: '1',
                            queueNo: 1,
                            userName: 'Yudha',
                            serviceType: 'smkhp-offline',
                            status: 'Diproses',
                        },
                    ],
                    'laboratorium-umum': [
                        {
                            id: '2',
                            queueNo: 2,
                            userName: 'Budi',
                            serviceType: 'laboratorium-umum',
                            status: 'Menunggu',
                        },
                    ],
                }}
                onItemClick={(item) => {
                    console.log(item);
                }}
            />
        </>
    );
}

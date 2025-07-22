import React from "react";

const sampleData = [
  {
    eventId: "675cd7d4",
    user: "91.150.240.160",
    operationDuration: 3.56,
    totalDuration: 3.56,
    traceId: "6427c65f",
    timestamp: "Jul 16, 2025 8:34:55 PM UTC",
    replay: "(no value)",
  },
  {
    eventId: "854a3ae1",
    user: "46.53.181.27",
    operationDuration: 3.55,
    totalDuration: 3.55,
    traceId: "5a619f8af",
    timestamp: "Jul 16, 2025 4:42:42 PM UTC",
    replay: "(no value)",
  },
  {
    eventId: "55f33473",
    user: "180.190.220.124",
    operationDuration: 3.44,
    totalDuration: 3.44,
    traceId: "1c560103",
    timestamp: "Jul 16, 2025 7:19:07 PM UTC",
    replay: "(no value)",
  },
  {
    eventId: "cda70ffc",
    user: "212.58.114.114",
    operationDuration: 3.44,
    totalDuration: 3.44,
    traceId: "991b37c6",
    timestamp: "Jul 16, 2025 1:02:14 PM UTC",
    replay: "(no value)",
  },
  {
    eventId: "b90bc3e7",
    user: "123.144.10",
    operationDuration: 3.39,
    totalDuration: 3.39,
    traceId: "2eeb9dd4",
    timestamp: "Jul 17, 2025 7:53:02 AM UTC",
    replay: "(no value)",
  },
];

export default function Standings() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Standings</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Operation Duration</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Duration</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trace ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Replay</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sampleData.map((row) => (
              <tr key={row.eventId}>
                <td className="px-4 py-2 text-blue-600 font-medium">
                  <a href="#" className="hover:underline">{row.eventId}</a>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center">
                    <span className="inline-block w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    {row.user}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <div className="h-3 w-24 bg-red-300 rounded mr-1">
                      <div className="h-3 bg-purple-400 rounded" style={{ width: `${(row.operationDuration / row.totalDuration) * 100}%` }}></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{row.operationDuration.toFixed(2)}s</span>
                  </div>
                </td>
                <td className="px-4 py-2 font-semibold text-gray-800">{row.totalDuration.toFixed(2)}s</td>
                <td className="px-4 py-2">
                  <a href="#" className="text-blue-600 hover:underline">{row.traceId}</a>
                </td>
                <td className="px-4 py-2 text-gray-700">{row.timestamp}</td>
                <td className="px-4 py-2 text-gray-400">{row.replay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
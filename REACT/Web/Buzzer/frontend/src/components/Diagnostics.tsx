import React from 'react';
import { useDiagnostics } from '@/hooks/useDiagnostics';

export function Diagnostics(): React.ReactElement {
  const diagnostics = useDiagnostics();

  const getStatusIcon = (status: boolean): string => (status ? '✅' : '❌');
  const getStatusColor = (status: boolean): string =>
    status ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-sm">
      <h3 className="font-bold text-gray-800 mb-3">🔧 Diagnostics</h3>

      <div className="space-y-2">
        {/* Backend Health */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Backend Health:</span>
          <span className={getStatusColor(diagnostics.backendHealth)}>
            {getStatusIcon(diagnostics.backendHealth)}
          </span>
        </div>

        {/* API Reachability */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">API Reachable:</span>
          <span className={getStatusColor(diagnostics.apiReachable)}>
            {getStatusIcon(diagnostics.apiReachable)}
          </span>
        </div>

        {/* Response Time */}
        {diagnostics.responseTime > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Response Time:</span>
            <span className="text-blue-600 font-mono">{diagnostics.responseTime}ms</span>
          </div>
        )}

        {/* WebSocket Connection */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">WebSocket:</span>
          <span className={getStatusColor(diagnostics.websocketConnected)}>
            {getStatusIcon(diagnostics.websocketConnected)}
          </span>
        </div>

        {/* Errors */}
        {diagnostics.errors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="font-semibold text-red-600 mb-2">⚠️ Issues:</p>
            <ul className="space-y-1 text-red-500 text-xs">
              {diagnostics.errors.map((error, index) => (
                <li key={index} className="break-words">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Summary */}
        {diagnostics.backendHealth &&
          diagnostics.apiReachable &&
          diagnostics.websocketConnected && (
            <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
              <p className="text-green-700 font-semibold">✨ All systems operational!</p>
            </div>
          )}
      </div>
    </div>
  );
}

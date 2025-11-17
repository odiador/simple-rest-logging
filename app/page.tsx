"use client";

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Clock, User, Database, Activity } from 'lucide-react';

type Log = {
  _id?: string;
  level?: string;
  message?: string;
  meta?: Record<string, unknown>;
  timestamp?: string | number | Date;
  usuario_accion?: string | number;
  tabla_afectada?: string;
  accion?: string;
  detalle?: string;
  ip_origen?: string;
  sesion_id?: string;
  fecha_accion_db?: string;
  [k: string]: unknown;
};

const SAMPLE_LOGS: Log[] = [
  { _id: "691b743cbbb2c7ac602e6807", level: "INFO", message: "LOGIN EXITOSO para CARLOS@UQ.EDU.CO IP: 181.53.99.137", meta: {}, timestamp: "2025-11-17T19:15:08.066Z" },
  { _id: "691b73ebbbb2c7ac602e6806", level: "INFO", message: "LOGIN EXITOSO para CARLOS@UQ.EDU.CO IP: 181.53.99.137", meta: {}, timestamp: "2025-11-17T19:13:47.262Z" },
  { _id: "691b727d1c66667a5126126f", level: "INFO", message: "LOGIN EXITOSO para CARLOS@UQ.EDU.CO IP: 181.53.99.137", meta: {}, timestamp: "2025-11-17T19:07:41.694Z" },
  { _id: "691b6bfbb067660bdfd9fc01", level: "WARN", message: "LOGIN FALLIDO para CARLOS@UQ.EDU.CO IP: 181.53.99.137", meta: {}, timestamp: "2025-11-17T18:39:55.806Z" },
  { _id: "691b8eed2fe6d1d2ae06f3b5", level: "INFO", message: "LOGIN EXITOSO", meta: {}, usuario_accion: 1, tabla_afectada: "USUARIO", accion: "LOGIN", detalle: "Usuario CARLOS@UQ.EDU.CO autenticado exitosamente", ip_origen: "181.53.99.137", sesion_id: "10564127843295", timestamp: "2025-11-17T21:09:01.525Z" }
];

export default function LogsViewer() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [level, setLevel] = useState('');
  const [limit, setLimit] = useState('100');
  const [logs, setLogs] = useState<Log[]>(SAMPLE_LOGS);
  const [count, setCount] = useState<number>(SAMPLE_LOGS.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  async function fetchLogs() {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (start) params.set('start', start);
      if (end) params.set('end', end);
      if (level) params.set('level', level);
      if (limit) params.set('limit', limit);

      const url = '/api/logs' + (params.toString() ? ('?' + params.toString()) : '');
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error((await res.json()).error || 'Error al obtener logs');
      }
      
      const data = await res.json();
      if (Array.isArray(data?.logs)) {
        setLogs(data.logs);
        setCount(typeof data.count === 'number' ? data.count : data.logs.length);
      } else {
        setLogs([]);
        setCount(0);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg + ' — mostrando datos de ejemplo');
      setLogs(SAMPLE_LOGS);
      setCount(SAMPLE_LOGS.length);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  function formatDate(v?: unknown): string {
    if (!v) return '';
    const d = (typeof v === 'string' || typeof v === 'number') ? new Date(v) : v instanceof Date ? v : null;
    return d ? d.toLocaleString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : String(v);
  }

  function getLevelStyle(level?: string) {
    const l = (level || '').toUpperCase();
    switch (l) {
      case 'ERROR': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INFO': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DEBUG': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                Sistema de Logs
              </h1>
              <p className="text-slate-500 mt-1">Monitoreo y auditoría de eventos</p>
            </div>
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha inicio</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha fin</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nivel</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="DEBUG">DEBUG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Límite</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="1000"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:bg-slate-400 transition-colors"
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
              <p className="text-sm text-orange-800">{error}</p>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">
              Mostrando <span className="font-semibold text-slate-800">{logs.length}</span> de{' '}
              <span className="font-semibold text-slate-800">{count}</span> registros
            </span>
            {loading && <span className="text-sm text-blue-600">Cargando...</span>}
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Fecha/Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Mensaje
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log, i) => {
                  const isExpanded = expandedRow === String(log._id ?? i);
                  return (
                    <React.Fragment key={String(log._id ?? i)}>
                      <tr 
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedRow(isExpanded ? null : String(log._id ?? i))}
                      >
                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                          {formatDate(log.timestamp || log.fecha_accion_db)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelStyle(log.level)}`}>
                            {String(log.level || 'N/A').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-800">
                          {String(log.message || '')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            {isExpanded ? '▼ Ocultar' : '▶ Ver más'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={4} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-slate-500 w-20">ID:</span>
                                  <span className="text-xs text-slate-700 font-mono">{String(log._id ?? '')}</span>
                                </div>
                                {log.usuario_accion !== undefined && (
                                  <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <span className="text-xs font-semibold text-slate-500 w-20">Usuario:</span>
                                    <span className="text-xs text-slate-700">{String(log.usuario_accion)}</span>
                                  </div>
                                )}
                                {log.tabla_afectada !== undefined && (
                                  <div className="flex items-start gap-2">
                                    <Database className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <span className="text-xs font-semibold text-slate-500 w-20">Tabla:</span>
                                    <span className="text-xs text-slate-700">{String(log.tabla_afectada)}</span>
                                  </div>
                                )}
                                {log.accion !== undefined && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-slate-500 w-20">Acción:</span>
                                    <span className="text-xs text-slate-700">{String(log.accion)}</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                {log.ip_origen !== undefined && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-slate-500 w-20">IP:</span>
                                    <span className="text-xs text-slate-700 font-mono">{String(log.ip_origen)}</span>
                                  </div>
                                )}
                                {log.sesion_id !== undefined && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-slate-500 w-20">Sesión:</span>
                                    <span className="text-xs text-slate-700 font-mono">{String(log.sesion_id)}</span>
                                  </div>
                                )}
                                {log.detalle !== undefined && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-slate-500 w-20">Detalle:</span>
                                    <span className="text-xs text-slate-700">{String(log.detalle)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {log.meta && Object.keys(log.meta).length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-200">
                                <span className="text-xs font-semibold text-slate-500 block mb-2">Metadata:</span>
                                <pre className="text-xs bg-slate-800 text-slate-100 p-3 rounded overflow-x-auto">
                                  {JSON.stringify(log.meta, null, 2)}
                                </pre>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {logs.length === 0 && !loading && (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p>No se encontraron logs con los filtros aplicados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState } from 'react';
import { compliancePreviewData } from '../lib/preview-data';

export const dynamic = 'force-dynamic';

interface Company {
  id: string;
  name: string;
  industry?: string;
  entityType?: string;
}

interface Summary {
  total: number;
  pending: number;
  mandatory: number;
  overdue: number;
  byType?: Array<{ type: string; count: number }>;
  byPriority?: Array<{ priority: string; count: number }>;
}

interface Obligation {
  id: string;
  title: string;
  description?: string;
  obligationType?: string;
  priority: string;
  mandatory: boolean;
  frequency?: string;
  status: string;
  regulation: string;
  regulator: string;
  sectionNumber?: string;
  sectionTitle?: string;
  deadlines?: Array<{ type?: string; condition?: string; description?: string }>;
  reportingRequirements?: Array<{ authority?: string; reportType?: string; frequency?: string }>;
  penalties?: Array<{ description?: string; type?: string; severity?: string }>;
}

interface ApplicabilityResult {
  applicable: boolean | null;
  confidence?: string;
  reasons?: string[];
  matchingApplicabilities?: Array<{
    sectionNumber: string;
    sectionTitle?: string;
    description?: string;
    operator: string;
    matchedFields: string[];
  }>;
}

interface WidgetData {
  company?: Company;
  summary?: Summary;
  obligations?: Obligation[];
  total?: number;
  limit?: number;
  offset?: number;
  applicable?: boolean;
  confidence?: string;
  reasons?: string[];
  matchingApplicabilities?: Array<unknown>;
  error?: string;
}

export default function ComplianceDashboard() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const [tab, setTab] = useState<'overview' | 'obligations'>('overview');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRegulator, setFilterRegulator] = useState('all');

  const data = getToolOutput<WidgetData>() || compliancePreviewData as WidgetData;
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  if (!isReady || !theme) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#000' }}>Initializing...</div>;
  }

  if (!data || data.error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: textColor }}>
        {data?.error || 'No data available. Run a compliance tool first.'}
      </div>
    );
  }

  const obligations = data.obligations || [];
  const summary = data.summary || {
    total: obligations.length,
    pending: obligations.filter(o => o.status === 'pending').length,
    mandatory: obligations.filter(o => o.mandatory).length,
    overdue: 0,
    byType: [],
    byPriority: [],
  };

  const filtered = obligations.filter(o => {
    if (filterPriority !== 'all' && o.priority !== filterPriority) return false;
    if (filterRegulator !== 'all' && o.regulator !== filterRegulator) return false;
    return true;
  });

  const priorityColor = (p: string) => ({ high: '#ef4444', medium: '#f59e0b', low: '#10b981' }[p] || '#6b7280');
  const regColor = (r: string) => ({ RBI: '#0066b3', SEBI: '#0066b3', MCA: '#dc2626', 'CERT_IN': '#f59e0b', 'CERT-In': '#f59e0b' }[r] || '#6b7280');

  const regulatorBreakdown = obligations.reduce((acc, o) => {
    acc[o.regulator] = (acc[o.regulator] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ padding: 24, background: isDark ? '#1a202c' : '#f7fafc', borderRadius: 16, minHeight: 400, color: textColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>Compliance Dashboard</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: mutedColor }}>{data.company?.name || 'Company'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, padding: 4, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 8, width: 'fit-content' }}>
        {(['overview', 'obligations'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: tab === t ? bgColor : 'transparent', color: textColor, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {t === 'overview' ? 'Overview' : 'Obligations'}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Total', value: summary.total, color: '#3b82f6' },
              { label: 'Mandatory', value: summary.mandatory, color: '#8b5cf6' },
              { label: 'Pending', value: summary.pending, color: '#f59e0b' },
              { label: 'Overdue', value: summary.overdue, color: '#ef4444' },
            ].map((c, i) => (
              <div key={i} style={{ padding: 16, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}`, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: 12, color: mutedColor }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: 16, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>By Regulator</h3>
            {Object.entries(regulatorBreakdown).map(([r, count]) => (
              <div key={r} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span>{r}</span><span style={{ color: mutedColor }}>{count}</span>
                </div>
                <div style={{ height: 6, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${(count / obligations.length) * 100}%`, background: regColor(r), borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${borderColor}`, background: bgColor, color: textColor, fontSize: 13 }}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={filterRegulator} onChange={e => setFilterRegulator(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${borderColor}`, background: bgColor, color: textColor, fontSize: 13 }}>
              <option value="all">All Regulators</option>
              <option value="RBI">RBI</option>
              <option value="SEBI">SEBI</option>
              <option value="MCA">MCA</option>
              <option value="CERT_IN">CERT-In</option>
            </select>
            <span style={{ fontSize: 12, color: mutedColor, alignSelf: 'center' }}>{filtered.length} items</span>
          </div>

          {filtered.map(o => (
            <div key={o.id} style={{ padding: 14, background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 10, borderLeft: `4px solid ${priorityColor(o.priority)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.title}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: `${regColor(o.regulator)}20`, color: regColor(o.regulator) }}>{o.regulator}</span>
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: `${priorityColor(o.priority)}20`, color: priorityColor(o.priority), textTransform: 'capitalize' }}>{o.priority}</span>
                    {o.mandatory && <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Mandatory</span>}
                  </div>
                </div>
                {o.deadlines && o.deadlines.length > 0 && o.deadlines[0].description && (
                  <div style={{ fontSize: 12, color: mutedColor, textAlign: 'right' }}>Due: {o.deadlines[0].description}</div>
                )}
              </div>
              <div style={{ fontSize: 12, color: mutedColor }}>{o.regulation}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

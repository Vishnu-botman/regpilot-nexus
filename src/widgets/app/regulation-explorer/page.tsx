'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState, useEffect } from 'react';
import { regulationPreviewData } from '../lib/preview-data';

export const dynamic = 'force-dynamic';

interface Regulation {
  id: string;
  title: string;
  regulationNumber?: string;
  documentType?: string;
  status: string;
  effectiveDate?: string;
  regulator: string;
  latestVersion?: string;
  sections?: Array<{ sectionNumber: string; title: string; content: string }>;
  versions?: Array<{ versionNumber: string; effectiveDate: string; status: string }>;
}

interface WidgetData {
  regulations?: Regulation[];
  regulation?: Regulation;
  total?: number;
  id?: string;
  title?: string;
  sections?: Array<{ sectionNumber: string; title: string; content: string }>;
  versions?: Array<{ versionNumber: string; effectiveDate: string; status: string }>;
  error?: string;
}

export default function RegulationExplorer() {
  const themeHook = useTheme();
  const sdk = useWidgetSDK();
  const [isStandalone, setIsStandalone] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sdk.isReady) {
        setIsStandalone(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [sdk.isReady]);

  const isReady = sdk.isReady || isStandalone;
  const theme = themeHook || 'light';
  const data = sdk.getToolOutput<WidgetData>() || regulationPreviewData as WidgetData;
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  if (!isReady) {
    return <div style={{ padding: 24, textAlign: 'center', color: textColor }}>Initializing...</div>;
  }

  if (!data || data.error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: textColor }}>
        {data?.error || 'No data available. Run a regulation tool first.'}
      </div>
    );
  }

  // Single regulation view (from get_regulation)
  if (data.regulation || data.title) {
    const reg = data.regulation || data as Regulation;
    return (
      <div style={{ padding: 24, background: isDark ? '#1a202c' : '#f7fafc', borderRadius: 16, color: textColor }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{reg.title}</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, fontSize: 13, color: mutedColor }}>
          {reg.regulationNumber && <span>{reg.regulationNumber}</span>}
          <span style={{ padding: '2px 8px', borderRadius: 4, background: reg.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: reg.status === 'active' ? '#10b981' : '#ef4444' }}>{reg.status}</span>
          {reg.effectiveDate && <span>Effective: {reg.effectiveDate}</span>}
        </div>

        {reg.versions && reg.versions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Versions</h3>
            {reg.versions.map((v, i) => (
              <div key={i} style={{ padding: '8px 12px', background: bgColor, borderRadius: 8, border: `1px solid ${borderColor}`, marginBottom: 6, fontSize: 13 }}>
                v{v.versionNumber} — {v.effectiveDate} — <span style={{ color: v.status === 'active' ? '#10b981' : '#ef4444' }}>{v.status}</span>
              </div>
            ))}
          </div>
        )}

        {reg.sections && reg.sections.length > 0 && (
          <div>
            <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Sections</h3>
            {reg.sections.map((s, i) => (
              <div key={i} style={{ padding: '12px 16px', background: bgColor, borderRadius: 8, border: `1px solid ${borderColor}`, marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>§{s.sectionNumber} — {s.title}</div>
                <div style={{ fontSize: 13, color: mutedColor, lineHeight: 1.5 }}>{s.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Search results view
  const regulations = data.regulations || [];
  return (
    <div style={{ padding: 24, background: isDark ? '#1a202c' : '#f7fafc', borderRadius: 16, color: textColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Regulations</h2>
        <span style={{ fontSize: 13, color: mutedColor }}>{data.total || regulations.length} results</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {regulations.map((reg, i) => (
          <div
            key={reg.id}
            onClick={() => setSelected(selected === i ? null : i)}
            style={{ padding: 16, background: bgColor, borderRadius: 10, border: `1px solid ${selected === i ? '#3b82f6' : borderColor}`, cursor: 'pointer', transition: 'border-color 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{reg.title}</div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12, color: mutedColor }}>
                  <span style={{ padding: '2px 6px', borderRadius: 4, background: '#3b82f620', color: '#3b82f6' }}>{typeof reg.regulator === 'string' ? reg.regulator : (reg.regulator as any)?.abbreviation || (reg.regulator as any)?.name || ''}</span>
                  {reg.documentType && <span>{reg.documentType.replace(/_/g, ' ')}</span>}
                  {reg.regulationNumber && <span>{reg.regulationNumber}</span>}
                </div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: reg.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: reg.status === 'active' ? '#10b981' : '#ef4444' }}>
                {reg.status}
              </span>
            </div>

            {selected === i && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${borderColor}`, fontSize: 13 }}>
                {reg.effectiveDate && <div style={{ marginBottom: 4 }}>Effective: {reg.effectiveDate}</div>}
                {reg.latestVersion && <div>Latest Version: {reg.latestVersion}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

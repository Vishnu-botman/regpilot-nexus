'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState, useEffect } from 'react';
import { applicabilityPreviewData } from '../lib/preview-data';

export const dynamic = 'force-dynamic';

interface MatchingApplicability {
  sectionNumber: string;
  sectionTitle?: string;
  description?: string;
  operator: string;
  matchedFields: string[];
}

interface WidgetData {
  applicable?: boolean | null;
  confidence?: string;
  reasons?: string[];
  matchingApplicabilities?: MatchingApplicability[];
  error?: string;
}

export default function ApplicabilityMatrix() {
  const themeHook = useTheme();
  const sdk = useWidgetSDK();
  const [isStandalone, setIsStandalone] = useState(false);

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
  const data = sdk.getToolOutput<WidgetData>() || applicabilityPreviewData as WidgetData;
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  if (!isReady) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#000' }}>Initializing...</div>;
  }

  if (!data || data.error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: textColor }}>
        {data?.error || 'No applicability data. Run evaluate_applicability first.'}
      </div>
    );
  }

  const statusColor = data.applicable === true ? '#10b981' : data.applicable === false ? '#ef4444' : '#f59e0b';
  const statusText = data.applicable === true ? 'Applicable' : data.applicable === false ? 'Not Applicable' : 'Uncertain';

  return (
    <div style={{ padding: 24, background: isDark ? '#1a202c' : '#f7fafc', borderRadius: 16, color: textColor }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>Applicability Result</h2>

      <div style={{ padding: 16, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}`, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: statusColor }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>{statusText}</span>
          {data.confidence && <span style={{ fontSize: 12, color: mutedColor }}>({data.confidence} confidence)</span>}
        </div>
      </div>

      {data.reasons && data.reasons.length > 0 && (
        <div style={{ padding: 16, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}`, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Reasons</h3>
          {data.reasons.map((r, i) => (
            <div key={i} style={{ fontSize: 13, color: mutedColor, padding: '4px 0', borderBottom: i < data.reasons!.length - 1 ? `1px solid ${borderColor}` : 'none' }}>{r}</div>
          ))}
        </div>
      )}

      {data.matchingApplicabilities && data.matchingApplicabilities.length > 0 && (
        <div style={{ padding: 16, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}` }}>
          <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Matching Applicabilities</h3>
          {data.matchingApplicabilities.map((app, i) => (
            <div key={i} style={{ padding: 12, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 8, marginBottom: 8, border: `1px solid ${borderColor}` }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Section {app.sectionNumber}</div>
              {app.sectionTitle && <div style={{ fontSize: 12, color: mutedColor, marginBottom: 4 }}>{app.sectionTitle}</div>}
              {app.description && <div style={{ fontSize: 12, color: mutedColor, marginBottom: 4 }}>{app.description}</div>}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: '#3b82f620', color: '#3b82f6' }}>{app.operator}</span>
                {app.matchedFields.map((field, j) => (
                  <span key={j} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState, useEffect } from 'react';
import { actionPlanPreviewData } from '../lib/preview-data';

export const dynamic = 'force-dynamic';

interface ActionItem {
  obligationId?: string;
  id?: string;
  title: string;
  description?: string;
  priority: string;
  mandatory: boolean;
  frequency?: string;
  regulation?: string;
  regulator?: string;
  sectionNumber?: string;
  sectionTitle?: string;
  deadlines?: Array<{ description?: string; type?: string; condition?: string }>;
  reportingRequirements?: Array<{ authority?: string; reportType?: string; frequency?: string }>;
}

interface GroupedPlan {
  immediate: ActionItem[];
  scheduled: ActionItem[];
  monitored: ActionItem[];
}

interface ActionPlanData {
  regulation?: string;
  grouped: GroupedPlan;
  summary: {
    total: number;
    mandatory: number;
    highPriority: number;
    immediate: number;
    scheduled: number;
    monitored: number;
  };
}

interface WidgetData {
  actionPlan?: ActionPlanData;
  error?: string;
}

export default function ActionPlanBoard() {
  const themeHook = useTheme();
  const sdk = useWidgetSDK();
  const [isStandalone, setIsStandalone] = useState(false);
  const [filter, setFilter] = useState('all');

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
  const data = sdk.getToolOutput<WidgetData>() || actionPlanPreviewData as unknown as WidgetData;
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
        {data?.error || 'No action plan data. Run generate_action_plan first.'}
      </div>
    );
  }

  const plan = data.actionPlan;
  if (!plan || !plan.grouped) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: textColor }}>
        No action plan data. Run generate_action_plan first.
      </div>
    );
  }

  const priorityColor = (p: string) => ({ high: '#ef4444', medium: '#f59e0b', low: '#10b981' }[p] || '#6b7280');

  const allItems: ActionItem[] = [
    ...plan.grouped.immediate,
    ...plan.grouped.scheduled,
    ...plan.grouped.monitored,
  ];

  const filtered = allItems.filter(i => filter === 'all' || i.priority === filter);

  const filteredImmediate = filtered.filter(i => plan.grouped.immediate.includes(i));
  const filteredScheduled = filtered.filter(i => plan.grouped.scheduled.includes(i));
  const filteredMonitored = filtered.filter(i => plan.grouped.monitored.includes(i));

  const columns = [
    { key: 'immediate', label: 'Immediate', color: '#ef4444', items: filteredImmediate },
    { key: 'scheduled', label: 'Scheduled', color: '#f59e0b', items: filteredScheduled },
    { key: 'monitored', label: 'Monitored', color: '#10b981', items: filteredMonitored },
  ];

  return (
    <div style={{ padding: 24, background: isDark ? '#1a202c' : '#f7fafc', borderRadius: 16, color: textColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>Action Plan</h2>
          {plan.regulation && <p style={{ margin: '4px 0 0', fontSize: 13, color: mutedColor }}>{plan.regulation}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
          <span style={{ color: '#ef4444' }}>{plan.summary.immediate} immediate</span>
          <span style={{ color: '#f59e0b' }}>{plan.summary.scheduled} scheduled</span>
          <span style={{ color: '#10b981' }}>{plan.summary.monitored} monitored</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, padding: 4, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 8, width: 'fit-content' }}>
        {['all', 'high', 'medium', 'low'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: filter === f ? bgColor : 'transparent', color: textColor, fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {columns.map(col => (
          <div key={col.key}>
            <div style={{ fontSize: 12, fontWeight: 600, color: col.color, marginBottom: 8, textTransform: 'uppercase' }}>{col.label} ({col.items.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.items.map((item, idx) => (
                <div key={item.obligationId || item.id || idx} style={{ padding: 14, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}`, borderLeft: `3px solid ${priorityColor(item.priority)}` }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                  {item.description && <div style={{ fontSize: 12, color: mutedColor, marginBottom: 6 }}>{item.description}</div>}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {item.regulator && <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: '#3b82f620', color: '#3b82f6' }}>{item.regulator}</span>}
                    {item.frequency && <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: mutedColor }}>{item.frequency}</span>}
                    {item.mandatory && <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Mandatory</span>}
                  </div>
                  {item.deadlines && item.deadlines.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: mutedColor }}>
                      Next: {item.deadlines[0].description}
                    </div>
                  )}
                </div>
              ))}
              {col.items.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: mutedColor, background: bgColor, borderRadius: 10, border: `1px dashed ${borderColor}` }}>No items</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: bgColor, borderRadius: 10, border: `1px solid ${borderColor}`, display: 'flex', gap: 16, fontSize: 12, color: mutedColor }}>
        <span>Total: {plan.summary.total}</span>
        <span>Mandatory: {plan.summary.mandatory}</span>
        <span>High Priority: {plan.summary.highPriority}</span>
      </div>
    </div>
  );
}

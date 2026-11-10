'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeLinksFromFirestore } from '@/lib/firestore';
import { LoginPrompt } from '@/components/common/LoginPrompt';
import { LinkItem } from '@/types';
import { Loader2, BarChart2, MousePointerClick, Link2, TrendingUp, Trophy } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

// 차트 색상 팔레트 (다크 테마 최적화)
const CHART_COLORS = [
  '#818cf8', // indigo-400
  '#f472b6', // pink-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#60a5fa', // blue-400
  '#a78bfa', // violet-400
  '#fb7185', // rose-400
  '#4ade80', // green-400
];

// 링크 제목 줄임
function shortenLabel(title: string, maxLen = 12): string {
  if (!title) return '(무제)';
  return title.length > maxLen ? title.slice(0, maxLen) + '…' : title;
}

// KPI 카드 컴포넌트
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm">
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${gradient}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-extrabold text-white tabular-nums">{value}</p>
          {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${gradient} bg-opacity-20`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}


// 커스텀 파이 차트 레이블
function PieLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (
    typeof cx !== 'number' ||
    typeof cy !== 'number' ||
    typeof midAngle !== 'number' ||
    typeof innerRadius !== 'number' ||
    typeof outerRadius !== 'number' ||
    typeof percent !== 'number'
  ) return null;
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);

  // 실시간 링크 구독
  useEffect(() => {
    if (!user) {
      setLinksLoading(false);
      return;
    }
    setLinksLoading(true);
    const unsub = subscribeLinksFromFirestore(
      user.uid,
      (data) => {
        setLinks(data);
        setLinksLoading(false);
      },
      () => setLinksLoading(false)
    );
    return () => unsub();
  }, [user]);

  // 집계 데이터
  const stats = useMemo(() => {
    const active = links.filter((l) => l.isActive !== false);
    const totalClicks = links.reduce((s, l) => s + (l.clicks ?? 0), 0);
    const sorted = [...links].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
    const topLink = sorted[0] ?? null;
    const avgClicks = active.length > 0 ? Math.round(totalClicks / active.length) : 0;
    return { totalClicks, linkCount: links.length, activeLinkCount: active.length, topLink, avgClicks, sorted };
  }, [links]);

  // 차트 데이터
  const barData = useMemo(
    () =>
      stats.sorted.slice(0, 8).map((l, i) => ({
        name: shortenLabel(l.title, 10),
        clicks: l.clicks ?? 0,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      })),
    [stats.sorted]
  );

  const pieData = useMemo(
    () =>
      stats.sorted
        .filter((l) => (l.clicks ?? 0) > 0)
        .slice(0, 8)
        .map((l, i) => ({
          name: shortenLabel(l.title, 14),
          value: l.clicks ?? 0,
          fill: CHART_COLORS[i % CHART_COLORS.length],
        })),
    [stats.sorted]
  );

  const barChartConfig: ChartConfig = useMemo(
    () =>
      Object.fromEntries(
        barData.map((d, i) => [
          d.name,
          { label: d.name, color: CHART_COLORS[i % CHART_COLORS.length] },
        ])
      ),
    [barData]
  );

  // 로딩/인증 처리
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-50px)] flex items-center justify-center bg-slate-950">
        <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPrompt />;
  }

  if (linksLoading) {
    return (
      <div className="min-h-[calc(100vh-50px)] flex flex-col items-center justify-center gap-3 bg-slate-950 text-white">
        <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
        <p className="text-sm text-slate-400">링크 데이터 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-50px)] bg-slate-950 text-white">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* 헤더 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              링크 통계
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            내 링크들의 클릭 현황을 한눈에 확인하세요.
          </p>
        </div>

        {/* KPI 카드 그리드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={MousePointerClick}
            label="총 클릭 수"
            value={stats.totalClicks.toLocaleString()}
            sub="전체 링크 합산"
            gradient="bg-indigo-500"
          />
          <KpiCard
            icon={Link2}
            label="등록된 링크"
            value={stats.linkCount}
            sub={`활성: ${stats.activeLinkCount}개`}
            gradient="bg-pink-500"
          />
          <KpiCard
            icon={Trophy}
            label="인기 링크"
            value={stats.topLink ? shortenLabel(stats.topLink.title, 10) : '—'}
            sub={stats.topLink ? `${(stats.topLink.clicks ?? 0).toLocaleString()}회 클릭` : '링크 없음'}
            gradient="bg-amber-500"
          />
          <KpiCard
            icon={TrendingUp}
            label="평균 클릭 수"
            value={stats.avgClicks.toLocaleString()}
            sub="활성 링크 기준"
            gradient="bg-emerald-500"
          />
        </div>

        {/* 링크가 없을 때 */}
        {stats.linkCount === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Link2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">아직 등록된 링크가 없어요.</p>
            <p className="text-xs mt-1">링크를 추가하고 클릭 통계를 확인해보세요!</p>
          </div>
        )}

        {stats.linkCount > 0 && (
          <>
            {/* 차트 2열 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* 바 차트 (3열) */}
              <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-slate-200 mb-1">링크별 클릭 수</h2>
                <p className="text-xs text-slate-500 mb-4">클릭이 많은 순서 (최대 8개)</p>
                <ChartContainer config={barChartConfig} className="h-[260px] w-full aspect-auto">
                  <BarChart data={barData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="clicks" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {barData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>

              {/* 파이 차트 (2열) */}
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-slate-200 mb-1">클릭 점유율</h2>
                <p className="text-xs text-slate-500 mb-4">전체 클릭 대비 비율</p>
                {pieData.length === 0 ? (
                  <div className="h-[260px] flex items-center justify-center text-slate-600 text-sm">
                    클릭 데이터 없음
                  </div>
                ) : (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="45%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          labelLine={false}
                          label={PieLabel}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`pie-${index}`} fill={entry.fill} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10,
                            color: '#e2e8f0',
                            fontSize: 12,
                          }}
                          formatter={(value, name) => [
                            `${Number(value ?? 0).toLocaleString()}회`,
                            String(name ?? ''),
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {/* 범례 */}
                <div className="mt-2 flex flex-col gap-1 max-h-[80px] overflow-y-auto">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="truncate">{d.name}</span>
                      <span className="ml-auto font-mono text-slate-300">{d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 순위 테이블 */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-slate-200 mb-1">링크 순위</h2>
              <p className="text-xs text-slate-500 mb-4">클릭 수 기준 전체 링크 순위</p>
              <div className="space-y-3">
                {stats.sorted.map((link, i) => {
                  const clicks = link.clicks ?? 0;
                  const maxClicks = stats.sorted[0]?.clicks ?? 1;
                  const pct = maxClicks > 0 ? Math.round((clicks / maxClicks) * 100) : 0;

                  return (
                    <div key={link.id} className="flex items-center gap-3">
                      {/* 순위 배지 */}
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          i === 0
                            ? 'bg-amber-500 text-amber-950'
                            : i === 1
                            ? 'bg-slate-400 text-slate-950'
                            : i === 2
                            ? 'bg-orange-700 text-orange-100'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {i + 1}
                      </span>

                      {/* 링크 정보 + 프로그레스 바 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-xs text-slate-200 truncate max-w-[70%] font-medium">
                            {link.title || '(무제)'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono tabular-nums shrink-0">
                            {clicks.toLocaleString()}회
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: CHART_COLORS[i % CHART_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

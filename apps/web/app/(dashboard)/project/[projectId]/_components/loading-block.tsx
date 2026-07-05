'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { WorkStatus } from '@/lib/contracts';
import { WorkingStatus } from './working-indicator';

const CARD = 'rounded-2xl border border-white/10 bg-[#161619] p-4';

function NameSkeletons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {['a', 'b', 'c', 'd'].map((k) => (
        <div key={k} className={`flex flex-col gap-2.5 ${CARD}`}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoSkeletons() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {['a', 'b', 'c'].map((k) => (
        <div key={k} className={`flex flex-col gap-3 ${CARD}`}>
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function SystemSkeleton() {
  return (
    <div className={`flex flex-col gap-4 ${CARD}`}>
      <div className="flex gap-2">
        {['a', 'b', 'c', 'd', 'e'].map((k) => (
          <Skeleton key={k} className="h-14 flex-1 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function LoadingBlock({ status }: { status: WorkStatus }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-7 items-center" role="status" aria-live="polite">
        <WorkingStatus status={status} />
      </div>
      {status === 'generating_names' && <NameSkeletons />}
      {status === 'generating_logo' && <LogoSkeletons />}
      {status === 'generating_system' && <SystemSkeleton />}
    </div>
  );
}

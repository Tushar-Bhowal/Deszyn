'use client';

import Image from 'next/image';
import { useState } from 'react';
import CountUp from '@/components/ui/count-up';

export interface AvatarGroupProps {
  avatars?: { src: string; alt?: string; label?: string }[];
  totalCount?: number;
  maxVisible?: number;
  size?: number;
  overlap?: number;
}

const DEFAULT_AVATARS = [
  { src: 'https://i.pravatar.cc/150?u=1', label: 'Alex' },
  { src: 'https://i.pravatar.cc/150?u=2', label: 'Priya' },
  { src: 'https://i.pravatar.cc/150?u=3', label: 'Jordan' },
  { src: 'https://i.pravatar.cc/150?u=4', label: 'Mia' },
  { src: 'https://i.pravatar.cc/150?u=5', label: 'Luca' },
];

export default function AvatarGroup({
  avatars = DEFAULT_AVATARS,
  totalCount = 2400,
  maxVisible = 5,
  size = 36,
  overlap = 12,
}: AvatarGroupProps) {
  const [hoveredSrc, setHoveredSrc] = useState<string | null>(null);
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = totalCount;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center">
        {visibleAvatars.map((avatar, idx) => {
          const isHovered = hoveredSrc === avatar.src;
          return (
            <button
              type="button"
              key={avatar.src}
              aria-label={avatar.label ?? avatar.alt ?? `Avatar ${idx + 1}`}
              className="rounded-full relative p-0 bg-transparent border-0"
              style={{
                width: size,
                height: size,
                zIndex: isHovered ? 100 : visibleAvatars.length - idx,
                marginLeft: idx === 0 ? 0 : -overlap,
                transition:
                  'margin-left 0.3s cubic-bezier(0.4,0,0.2,1), z-index 0s, box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredSrc(avatar.src)}
              onMouseLeave={() => setHoveredSrc(null)}
              onFocus={() => setHoveredSrc(avatar.src)}
              onBlur={() => setHoveredSrc(null)}
            >
              <Image
                src={avatar.src}
                alt={avatar.alt || `Avatar ${idx + 1}`}
                width={size}
                height={size}
                className="rounded-full object-cover w-full h-full outline outline-[#0d0d12]"
                draggable={false}
                unoptimized
              />
            </button>
          );
        })}
        {extraCount > 0 && (
          <div
            className="flex items-center justify-center text-white/90 font-semibold"
            style={{
              height: size,
              marginLeft: 8,
              zIndex: 0,
              fontSize: '0.85rem',
            }}
          >
            <CountUp
              from={0}
              to={extraCount}
              direction="up"
              duration={10}
              className="count-up-text"
            />
            +
          </div>
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-widest text-white/40 mt-1">
        Join designers &amp; developers on the waitlist
      </p>
    </div>
  );
}

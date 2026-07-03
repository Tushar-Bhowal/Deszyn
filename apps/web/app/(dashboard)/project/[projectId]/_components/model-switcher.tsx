'use client';

import { Check, ChevronDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MODEL_OPTIONS } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { useStudio } from './studio-provider';

export function ModelSwitcher() {
  const { selectedModel, setSelectedModel } = useStudio();
  const current = MODEL_OPTIONS.find((m) => m.id === selectedModel) ?? MODEL_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-200"
        >
          {current.name}
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {MODEL_OPTIONS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => setSelectedModel(model.id)}
            className="flex items-start gap-2"
          >
            <Check
              className={cn(
                'mt-0.5 size-4 shrink-0',
                model.id === selectedModel ? 'opacity-100' : 'opacity-0',
              )}
            />
            <div className="grid gap-0.5">
              <span className="text-sm font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

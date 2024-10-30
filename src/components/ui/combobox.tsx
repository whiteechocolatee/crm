'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ProjectsAvatar from '@/features/projects/components/projects-avatar';
import { cn } from '@/lib/utils';

type ComboboxProps = {
  projectOptions: { id: string; name: string; imageUrl?: string }[];
  onChange: (value: string) => void;
  initialValue?: string;
};

export function Combobox({
  projectOptions,
  onChange,
  initialValue = '',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <ProjectsAvatar
                image={
                  projectOptions.find(project => project.id === value)?.imageUrl
                }
                name={
                  projectOptions.find(project => project.id === value)!.name!
                }
              />
              {projectOptions.find(project => project.id === value)?.name}
            </div>
          ) : (
            'Выберите проект...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]">
        <Command>
          <CommandInput placeholder="Выберите проект..." />
          <CommandList className="overflow-y-scroll">
            <CommandEmpty>Проектов не найдено.</CommandEmpty>
            <CommandGroup>
              {projectOptions.map(project => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    setValue(project.id);
                    onChange(project.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === project.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <ProjectsAvatar
                    name={project.name}
                    image={project.imageUrl}
                  />
                  {project.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

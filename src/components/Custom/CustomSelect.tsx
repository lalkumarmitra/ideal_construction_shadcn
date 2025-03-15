import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SelectOptionType = {
  label: string | number | undefined;
  value: string | number | boolean | null;
};

interface CustomSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  options?: SelectOptionType[];
  placeholder?: string;
  id?: string;
  className?: string;
  searchable?: boolean;
  dropdownClassName?:string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options = [],
  placeholder = "Select An Option",
  id = "select",
  className,
  dropdownClassName,
  searchable = false,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options if searchable is enabled.
  const filteredOptions = searchable
    ? options.filter(o => String(o.label).toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  return (
    <Select {...props}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={dropdownClassName}>
        {searchable && (
          <div className="px-2 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {filteredOptions.map((o, i) => (
          <SelectItem key={i} id={id} value={o.value?.toString() as string}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


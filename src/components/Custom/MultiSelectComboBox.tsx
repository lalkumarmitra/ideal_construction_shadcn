import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Select } from "../ui/select"

export type ComboboxOptionType = {
    label: string
    value: string | number
    icon?: React.ReactNode
}

interface MultiselectComboboxProps extends React.ComponentPropsWithoutRef<typeof Select>{
    options?: ComboboxOptionType[]
    placeholder?: string
    onSelect?: (selectedValues: (string | number)[]) => void
    defaultValues?:string[]|number[]
}

export function MultiselectCombobox({ options = [], placeholder = "Select items...", onSelect,name,disabled,defaultValues,...props }: MultiselectComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedValues, setSelectedValues] = React.useState<(string | number)[]>(defaultValues || [])

    const handleSelect = (currentValue: string | number) => {
        const newSelectedValues = selectedValues.includes(currentValue)
        ? selectedValues.filter((value) => value !== currentValue)
        : [...selectedValues, currentValue]

        setSelectedValues(newSelectedValues)
        onSelect?.(newSelectedValues)
    }
    const handleRemove = (valueToRemove: string | number) => {
        setSelectedValues(selectedValues.filter((value) => value !== valueToRemove))
    }

  return (
    <>
        {selectedValues && selectedValues.map((v,i)=>(
            <input key={i} type="hidden" value={v} name={name+'[]'} {...props} />
        ))}
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between min-h-6 h-auto">
                    <div className="flex flex-wrap gap-1 py-1">
                        {selectedValues.length > 0 ? (
                            selectedValues.map((value) => (
                                <Badge variant="secondary" key={String(value)} className="mr-1">
                                    {options.find((option) => option.value === value)?.label || String(value)}
                                    <button
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleRemove(value)
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={() => handleRemove(value)}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))
                        ) : (<span className="text-muted-foreground">{placeholder}</span>)}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No item found .</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem key={String(option.value)} onSelect={() => handleSelect(option.value)} className="cursor-pointer">
                                    <Check className={cn("mr-2 h-4 w-4", selectedValues.includes(option.value) ? "opacity-100" : "opacity-0")}/>
                                    {option.icon && <span className="mr-2">{option.icon}</span>}
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    </>
  )
}


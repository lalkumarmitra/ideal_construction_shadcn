import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "../ui/input"

type ComboBoxOptionType = {
    value: string
    label: string
}

interface ComboBoxProps extends React.ComponentPropsWithoutRef<typeof Input> {
    options?: ComboBoxOptionType[],
    placeholder?: string,
    id?: string,
    onValueChange?: (data: string) => void
}

const ComboBox: React.FC<ComboBoxProps> = ({
    options = [],
    placeholder = "Select an item ...",
    id = "select",
    onValueChange = () => null,
    className,
    defaultValue = "",
    disabled,
    ...props
}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(defaultValue)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        if (value && value !== defaultValue) {
            onValueChange(String(value));
        }
    }, [value, defaultValue, onValueChange]); 
    
    React.useEffect(() => {
        if(defaultValue && defaultValue !== value)
        setValue(defaultValue);
    },[defaultValue]);
    
    const handleSelect = (currentValue: string) => {
        setValue(currentValue === value ? "" : currentValue)
        setOpen(false)
    }

    return (
        <>
            <input type="hidden" value={value} {...props} />
            <Popover modal={true} open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button ref={buttonRef} disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between", className)}>
                        {value
                            ? options.find((option) => option.value === value)?.label
                            : <span className="text-muted-foreground">{placeholder}</span>}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" style={{ width: buttonRef.current?.offsetWidth }} align="start">
                    <Command className="w-full">
                        <CommandInput placeholder="Search ..." />
                        <CommandList className="max-h-60 overflow-y-auto">
                            <CommandEmpty>No Items found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label} // Changed to option.label for filtering
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <span>{option.label}</span>
                                        <Check className={cn("ml-auto", value === option.value ? "opacity-100" : "opacity-0")} />
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

export default ComboBox;
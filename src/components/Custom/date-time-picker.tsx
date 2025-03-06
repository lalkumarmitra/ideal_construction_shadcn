

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format as formatDateFns } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";

interface DateTimePickerProps {
    name: string;
    dateFormat?: string;
    onChange?: (value: string) => void;
    triggerButton?: React.ReactNode;
    isDialog?: boolean;
    disabled?: boolean;
    defaultValue?: Date;
    value?: Date; // Explicitly typed as optional Date
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    name,
    dateFormat = "yyyy-MM-dd-HH:mm:ss",
    onChange,
    triggerButton,
    isDialog = false,
    disabled = false,
    defaultValue,
    value, // Controlled value
}) => {
    // Prioritize the controlled value if provided, otherwise use defaultValue or undefined
    const [date, setDate] = useState<Date | undefined>(value || defaultValue || undefined);
    const [isOpen, setIsOpen] = useState(false);

    // Effect to update internal state when value prop changes
    useEffect(() => {
        if (value) {
            console.log(value);
            // setDate(value);
        }
    }, [value]);

    const handleFormatDate = useCallback(
        (date: Date | undefined, format: string) => {
            if (!date) return "";
            const dateWithTime = new Date(date);
            return formatDateFns(dateWithTime, format);
        },
        []
    );

    const formattedDate = useMemo(() => handleFormatDate(date, dateFormat), [date, dateFormat, handleFormatDate]);
    const debouncedFormattedDate = useDebounce(formattedDate, 300);

    useEffect(() => {
        if (onChange) {
            onChange(debouncedFormattedDate);
        }
    }, [debouncedFormattedDate, onChange]);

    const handleSelectDate = useCallback(
        (newDate: Date | undefined) => {
            setDate(newDate);
            if (!isDialog) {
                setIsOpen(false);
            }
        },
        [isDialog]
    );

    const DateTimePickerContent = useMemo(
        () => (
            <div className="p-4">
                <Calendar mode="single" selected={date} onSelect={handleSelectDate} initialFocus />
            </div>
        ),
        [date, handleSelectDate]
    );

    if (isDialog) {
        return (
            <>
                {DateTimePickerContent}
                <input type="hidden" name={name} value={debouncedFormattedDate} />
            </>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {triggerButton || (
                    <Button disabled={disabled} variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        {date ? debouncedFormattedDate : "Pick a date"}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                {DateTimePickerContent}
            </PopoverContent>
            <input type="hidden" name={name} value={debouncedFormattedDate} />
        </Popover>
    );
};

export default React.memo(DateTimePicker);
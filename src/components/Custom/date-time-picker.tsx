"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format as formatDateFns } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";


interface DateTimePickerProps {
    name: string;
    dateFormat?: string;
    onChange?: (value: string) => void;
    triggerButton?: React.ReactNode;
    isDialog?: boolean;
    disabled?:boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    name,
    dateFormat = "yyyy-MM-dd-HH:mm:ss",
    onChange,
    triggerButton,
    isDialog = false,
    disabled = false
}) => {
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>("12:00");
    const [isOpen, setIsOpen] = useState(false);

    const handleFormatDate = useCallback(
        (date: Date | undefined, time: string, format: string) => {
            if (!date) return "";
            const [hours, minutes] = time.split(":");
            const dateWithTime = new Date(date);
            dateWithTime.setHours(parseInt(hours), parseInt(minutes));
            return formatDateFns(dateWithTime, format); // Use date-fns for formatting
        },
        []
    );

    const formattedDate = useMemo(() => handleFormatDate(date, time, dateFormat), [date, time, dateFormat, handleFormatDate]);
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

    const timeOptions = useMemo(() => {
        return Array.from({ length: 24 * 4 }, (_, index) => {
            const hours = Math.floor(index / 4);
            const minutes = (index % 4) * 15;
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
        });
    }, []);

    const DateTimePickerContent = useMemo(
        () => (
            <div className="p-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelectDate}
                    initialFocus
                />
                <div className="flex items-center mt-4">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    <Select value={time} onValueChange={setTime}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                            {timeOptions.map((timeString) => (
                                <SelectItem key={timeString} value={timeString}>
                                    {timeString}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        ),
        [date, time, handleSelectDate, timeOptions]
    );

    if (isDialog) {
        return (
            <>
                {DateTimePickerContent}
                <input
                    type="hidden"
                    name={name}
                    value={debouncedFormattedDate}
                />
            </>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {triggerButton || (
                    <Button
                        disabled={disabled}
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date
                            ? debouncedFormattedDate
                            : "Pick a date"}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                {DateTimePickerContent}
            </PopoverContent>
            <input
                type="hidden"
                name={name}
                value={debouncedFormattedDate}
            />
        </Popover>
    );
};

export default React.memo(DateTimePicker);

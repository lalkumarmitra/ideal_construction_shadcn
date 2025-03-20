import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
	onDateChange?:(range:DateRange | undefined)=>void;
	disabled?:boolean;
	defaultDate?:DateRange | undefined;
	placeholder?:string;
	name?:string
	isModal?:boolean
}

const DatePickerWithRange: React.FC<DatePickerWithRangeProps>=({ onDateChange=()=>null,className,disabled=false,defaultDate,placeholder="Pick a date",name="date",isModal=true}) => {
	const [date, setDate] = React.useState<DateRange | undefined>(defaultDate)
	const handleDateSelect: SelectRangeEventHandler = (e: DateRange | undefined) => {
		if (e) setDate(e);
		onDateChange(e);
	}
	return (
		<div className={cn("grid gap-2", className)}>
			<input type="hidden" name={name+'_from'} value={date?.from?format(date?.from,'yyyy-MM-dd'):''} />
			<input type="hidden" name={name+'_to'} value={date?.to?format(date?.to,'yyyy-MM-dd'):''} />
			<Popover modal={isModal} >
				<PopoverTrigger asChild>
					<Button disabled={disabled} id="date" variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !date && "text-muted-foreground")} >
						<CalendarIcon />
						{date?.from ? (
							date.to ? (
							<>
								{format(date.from, "dd LLL, y")} -{" "}
								{format(date.to, "dd LLL, y")}
							</>
							) : ( format(date.from, "dd LLL, y") )
						) : (<span>{placeholder}</span> )}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={handleDateSelect} numberOfMonths={2} />
				</PopoverContent>
			</Popover>
		</div>
	)
}
export default DatePickerWithRange

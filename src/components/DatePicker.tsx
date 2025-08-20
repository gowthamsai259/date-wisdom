import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ selected, onSelect, placeholder = "Pick a date", className }: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState(selected || new Date());

  React.useEffect(() => {
    if (selected) {
      setInputValue(format(selected, "MM/dd/yyyy"));
      setMonth(selected);
    }
  }, [selected]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Try to parse the input value
    const parsedDate = parse(value, "MM/dd/yyyy", new Date());
    if (isValid(parsedDate) && parsedDate <= new Date()) {
      onSelect(parsedDate);
      setMonth(parsedDate);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const parsedDate = parse(inputValue, "MM/dd/yyyy", new Date());
      if (isValid(parsedDate) && parsedDate <= new Date()) {
        onSelect(parsedDate);
        setIsOpen(false);
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal transition-all duration-[2s]",
              !selected && "text-muted-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse",
              selected && "shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] ring-2 ring-blue-500/30 animate-pulse",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-2 border-b">
            <div className="flex gap-2">
              <Select
                value={months[month.getMonth()]}
                onValueChange={(value) => {
                  const monthIndex = months.indexOf(value);
                  const newDate = new Date(month.getFullYear(), monthIndex, 1);
                  setMonth(newDate);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthName) => (
                    <SelectItem key={monthName} value={monthName}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={month.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(parseInt(value), month.getMonth(), 1);
                  setMonth(newDate);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onSelect(date);
              if (date) {
                setInputValue(format(date, "MM/dd/yyyy"));
              }
              setIsOpen(false);
            }}
            month={month}
            onMonthChange={setMonth}
            initialFocus
            className="p-3 pointer-events-auto"
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
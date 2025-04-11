
import React from "react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

interface MonthYearFilterProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const MonthYearFilter: React.FC<MonthYearFilterProps> = ({ 
  date,
  setDate,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date());
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 1 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  // Handle month selection
  const handleMonthSelect = (month: string) => {
    const monthIndex = months.findIndex(m => m === month);
    if (monthIndex !== -1) {
      const newDate = new Date(currentMonth);
      newDate.setMonth(monthIndex);
      setCurrentMonth(newDate);
    }
  };
  
  // Handle year selection
  const handleYearSelect = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };
  
  // Apply date filter
  const handleDateFilter = () => {
    setDate(currentMonth);
    setIsCalendarOpen(false);
  };
  
  // Clear date filter
  const handleClearFilter = () => {
    setDate(undefined);
    setCurrentMonth(new Date());
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Calendar className="h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : "Filter by Month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 bg-background" align="end">
        <div className="flex flex-col space-y-4">
          {/* Month-Year Selector Header */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Month Selector */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Month:</label>
              <Select 
                value={format(currentMonth, "MMMM")}
                onValueChange={handleMonthSelect}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-background">
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Year Selector */}
            <div>
              <label className="text-sm font-medium">Year:</label>
              <Select 
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearSelect}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-background">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilter}
            >
              Clear
            </Button>
            <Button size="sm" onClick={handleDateFilter}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthYearFilter;

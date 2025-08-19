import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
interface DatePickerDropdownProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function DatePickerDropdown({
  value,
  onChange
}: DatePickerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? value.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(value ? value.getFullYear() : new Date().getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onChange(selectedDate);
    setIsOpen(false);
  };
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: React.ReactNode[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value && value.getDate() === day && value.getMonth() === currentMonth && value.getFullYear() === currentYear;
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
      days.push(<motion.button key={day} whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.9
      }} onClick={() => handleDateSelect(day)} className={`
            w-8 h-8 rounded-full text-sm font-medium transition-colors
            ${isSelected ? 'bg-primary text-primary-foreground' : isToday ? 'bg-accent text-accent-foreground border border-primary' : 'hover:bg-accent hover:text-accent-foreground'}
          `}>
          {day}
        </motion.button>);
    }
    return days;
  };
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="relative" ref={dropdownRef}>
      <motion.button type="button" whileHover={{
      scale: 1.01
    }} whileTap={{
      scale: 0.99
    }} onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {value ? formatDisplayDate(value) : 'Select due date'}
        </span>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </motion.button>

      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        y: -10,
        scale: 0.95
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: -10,
        scale: 0.95
      }} transition={{
        duration: 0.15
      }} className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} onClick={handlePrevMonth} className="p-1 hover:bg-accent rounded-md transition-colors">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </motion.button>
              
              <h3 className="text-sm font-semibold text-popover-foreground">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
              
              <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} onClick={handleNextMonth} className="p-1 hover:bg-accent rounded-md transition-colors">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>)}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
              <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={() => {
            onChange(new Date());
            setIsOpen(false);
          }} className="text-xs text-primary hover:text-primary/80 transition-colors">
                Today
              </motion.button>
              
              <motion.button whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }} onClick={() => {
            onChange(null);
            setIsOpen(false);
          }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Clear
              </motion.button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}
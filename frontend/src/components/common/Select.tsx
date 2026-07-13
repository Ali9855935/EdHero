import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';

export interface SelectOption<T> {
  label: string;
  value: T;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  clearable?: boolean;
  error?: string;
}

export function Select<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  searchable = true,
  clearable = true,
  error,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const shouldReduceMotion = useReducedMotion();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Measure portal coordinate values on render updates
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updateCoords = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updateCoords();
    
    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, true);
    
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && 
        !containerRef.current.contains(target) &&
        (!portalRef.current || !portalRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset focus index when dropdown changes open status or query changes
  useEffect(() => {
    setFocusedIndex(-1);
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const isInput = (e.target as HTMLElement).tagName === 'INPUT';
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex((prev) => (prev + 1 < filteredOptions.length ? prev + 1 : 0));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredOptions.length - 1));
        e.preventDefault();
        break;
      case 'Enter':
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          onChange(filteredOptions[focusedIndex].value);
          setIsOpen(false);
        }
        e.preventDefault();
        break;
      case ' ':
        if (!isInput) {
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            onChange(filteredOptions[focusedIndex].value);
            setIsOpen(false);
          }
          e.preventDefault();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        e.preventDefault();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className="w-full text-left space-y-1.5 relative">
      {label && (
        <label className="block text-xs font-semibold text-neutralDark-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-neutralDark-950 border text-sm text-white cursor-pointer select-none transition-all focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 focus:outline-none ${
          isOpen ? 'border-brand-500 ring-2 ring-brand-500/20' : error ? 'border-accent-500' : 'border-neutralDark-800'
        }`}
      >
        <span className={selectedOption ? 'text-white' : 'text-neutralDark-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <div className="flex items-center gap-1.5">
          {clearable && selectedOption && (
            <button
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-neutralDark-800 text-neutralDark-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`text-neutralDark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Error state display */}
      {error && (
        <p className="text-xs text-accent-500 font-medium">
          {error}
        </p>
      )}

      {/* Dropdown Options List */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={portalRef}
              key="select-dropdown-list"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 4 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, y: 4 }}
              transition={shouldReduceMotion ? {} : { duration: 0.15 }}
              className="absolute z-[9999] bg-neutralDark-900 border border-neutralDark-800 rounded-lg shadow-xl overflow-hidden"
              style={{
                top: coords.top,
                left: coords.left,
                width: coords.width,
              }}
            >
              {/* Search Input Box */}
              {searchable && (
                <div className="flex items-center gap-2 px-3 py-2 border-b border-neutralDark-800 bg-neutralDark-950/40">
                  <Search size={14} className="text-neutralDark-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 text-white placeholder-neutralDark-500 text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* List options */}
              <div
                ref={listRef}
                className="max-h-56 overflow-y-auto py-1 divide-y divide-neutralDark-850/30"
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-neutralDark-500 text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((opt, index) => {
                    const isSelected = opt.value === value;
                    const isFocused = index === focusedIndex;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-brand-500 text-white' 
                            : isFocused 
                              ? 'bg-neutralDark-800 text-white' 
                              : 'text-neutralDark-300 hover:bg-neutralDark-800/60 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

export default Select;

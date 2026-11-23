import { useEffect, useId, useRef, useState } from "react";
import "./dropdown.css";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface DropdownProps<T extends string = string> {
  options: readonly DropdownOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Dropdown<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  className = "",
}: DropdownProps<T>) {
  const labelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(
    value ?? defaultValue ?? options.find((o) => !o.disabled)?.value,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const commitSelection = (nextValue: T) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange(nextValue);
    setIsOpen(false);
  };

  const enabledOptions = options.filter((opt) => !opt.disabled);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || enabledOptions.length === 0) return;

    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const currentIndex = enabledOptions.findIndex(
        (opt) => opt.value === selectedValue,
      );
      const nextIndex =
        e.key === "ArrowDown"
          ? (currentIndex + 1) % enabledOptions.length
          : (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;

      const nextValue = enabledOptions[nextIndex].value;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange(nextValue);
    }
  };

  return (
    <div className={`ui-dropdown-field ${className}`} ref={containerRef}>
      {label && (
        <label
          id={labelId}
          className="ui-dropdown-label"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
        >
          {label}
        </label>
      )}

      <div className="ui-dropdown">
        <button
          type="button"
          className="ui-dropdown-trigger"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-labelledby={label ? labelId : undefined}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <span className={`ui-dropdown-chevron ${isOpen ? "open" : ""}`}>
            ▾
          </span>
        </button>

        {isOpen && (
          <ul
            className="ui-dropdown-menu"
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={[
                    "ui-dropdown-option",
                    isSelected ? "selected" : "",
                    option.disabled ? "disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (!option.disabled) {
                      commitSelection(option.value);
                    }
                  }}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string, fileType: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [fileType, setFileType] = useState("all");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLUListElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Handle clicks outside suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get("/api/suggestions", {
          params: { query: inputValue },
        });
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const handleSearchSubmit = () => {
    onSearch(inputValue, fileType);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(suggestion, fileType);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-2 sm:px-6">
      <div className="relative flex w-full flex-col sm:flex-row items-center bg-white rounded-lg sm:rounded-full shadow-xl sm:h-16">
        <div
          className="relative w-full sm:w-auto border-b sm:border-b-0 min-h-[48px] sm:min-h-0"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="w-full sm:w-32 md:w-40 lg:w-44 h-12 sm:h-16 rounded-t-lg sm:rounded-l-full sm:rounded-t-none bg-gray-50 px-4 py-3 text-base text-gray-700 flex items-center justify-between">
            <span>
              {fileType === "all"
                ? "All Files"
                : fileType.charAt(0).toUpperCase() + fileType.slice(1)}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          {isDropdownOpen && (
            <div className="absolute z-50 w-full bg-white shadow-xl border mt-1 rounded-lg max-h-[50vh] overflow-y-auto">
              {["all", "png", "vector", "image"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFileType(type);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm md:text-base"
                >
                  {type === "all"
                    ? "All Files"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-1 w-full">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-full border-0 px-8 py-3 h-12 sm:h-16 text-base sm:text-lg rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Search className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400" />
        </div>

        <button
          onClick={handleSearchSubmit}
          className="w-full sm:w-32 md:w-40 lg:w-44 h-12 sm:h-16 rounded-b-lg sm:rounded-r-full sm:rounded-b-none bg-blue-600 px-4 py-3 text-base font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionRef}
          className="absolute z-50 w-full left-0 right-0 sm:left-6 sm:right-6 bg-white shadow-xl border mt-2 rounded-lg max-h-[40vh] overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-6 py-3 text-base md:text-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

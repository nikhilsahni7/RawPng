import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex w-full items-center bg-white rounded-full shadow-lg">
        <Select value={fileType} onValueChange={setFileType}>
          <SelectTrigger className="w-24 md:w-28 rounded-l-full bg-gray-50 px-2 md:px-4 py-2 text-xs md:text-sm text-gray-700 border-0 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="vector">Vector</SelectItem>
            <SelectItem value="image">Images</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search images..."
            className="w-full border-0 px-3 md:px-4 py-2 text-sm md:text-base rounded-none focus:ring-0 focus:ring-offset-0"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>

        <button
          onClick={handleSearchSubmit}
          className="w-20 md:w-28 rounded-r-full bg-blue-600 px-2 md:px-4 py-2 text-sm md:text-base text-white hover:bg-blue-700 transition-colors duration-200"
        >
          Search
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionRef}
          className="absolute z-40 w-full bg-white shadow-lg border mt-1 rounded-lg max-h-60 overflow-y-auto left-0 right-0"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2.5 text-sm md:text-base cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

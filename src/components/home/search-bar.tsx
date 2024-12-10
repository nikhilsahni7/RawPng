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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get("/api/suggestions", {
          params: {
            query: inputValue,
          },
        });
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [inputValue]);

  const handleSearchSubmit = () => {
    onSearch(inputValue, fileType);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onSearch(suggestion, fileType);
  };

  return (
    <div className="relative flex w-full max-w-4xl flex-col sm:flex-row items-center rounded-lg sm:rounded-full bg-white shadow-2xl">
      <Select value={fileType} onValueChange={setFileType}>
        <SelectTrigger className="w-full sm:w-32 rounded-t-lg sm:rounded-l-full sm:rounded-r-none border-b sm:border-r sm:border-b-0 bg-white px-4 py-2 sm:py-3 text-sm text-gray-700">
          <SelectValue placeholder="File type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Files</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="vector">Vector</SelectItem>
          <SelectItem value="image">Images</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative flex w-full flex-1 items-center">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Search millions of royalty-free images..."
          className="w-full border-none pl-4 pr-12 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-0 focus:border-transparent"
        />
        <Search className="absolute right-4 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 top-full left-0 right-0 bg-white shadow-lg border mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={handleSearchSubmit}
        className="w-full sm:w-auto rounded-b-lg sm:rounded-r-full sm:rounded-l-none bg-blue-600 px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg text-white hover:bg-blue-700 transition-colors duration-200"
      >
        Search
      </button>
    </div>
  );
}

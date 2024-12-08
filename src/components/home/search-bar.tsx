"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const suggestions = [
  "Christmas Backgrounds",
  "New Year Party Images",
  "Winter Snow Vectors",
  "Abstract Art PNGs",
  "Happy Birthday Graphics",
  "Nature Landscapes",
  "Business Templates",
  "Technology Backgrounds",
  "Animal Photos",
  "Food and Cuisine",
];

export function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative flex w-full max-w-4xl flex-col sm:flex-row items-center rounded-lg sm:rounded-full bg-white shadow-2xl">
      <Select defaultValue="all">
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
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (inputValue.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 100);
          }}
          placeholder="Search millions of royalty-free images..."
          className="w-full border-none pl-4 pr-12 py-2 sm:py-3 text-base sm:text-lg focus:outline-none focus:ring-0 focus:border-transparent"
        />
        <Search className="absolute right-4 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 top-full mt-2 w-full max-h-60 overflow-y-auto rounded-b-lg border bg-white shadow-md z-10">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 text-sm sm:text-base hover:bg-gray-100"
                onMouseDown={() => {
                  setInputValue(suggestion);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="w-full sm:w-auto rounded-b-lg sm:rounded-r-full sm:rounded-l-none bg-blue-600 px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg text-white hover:bg-blue-700 transition-colors duration-200">
        Search
      </button>
    </div>
  );
}

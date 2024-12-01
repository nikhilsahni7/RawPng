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

// Mock data for search suggestions
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
    <div className="relative flex w-full max-w-4xl items-center rounded-full bg-white shadow-2xl">
      <div className="relative flex flex-1 items-center pl-8">
        <Search className="absolute left-0 h-8 w-8 text-gray-400" />
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
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 100);
          }}
          placeholder="Search millions of royalty-free images..."
          className="w-full border-none pl-12 pr-4 py-4 text-xl focus:outline-none focus:ring-0 focus:border-transparent"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 top-full mt-2 w-full max-h-60 overflow-y-auto rounded-b-lg border bg-white shadow-md z-10">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-3 hover:bg-gray-100"
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
      <Select defaultValue="all">
        <SelectTrigger className="w-40 rounded-full bg-white px-6 py-4 text-lg text-gray-700">
          <SelectValue placeholder="File type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Files</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="vector">Vector</SelectItem>
          <SelectItem value="image">Images</SelectItem>
        </SelectContent>
      </Select>
      <button className="ml-4 mr-4 rounded-full bg-blue-600 px-10 py-4 text-xl text-white hover:bg-blue-700">
        Search
      </button>
    </div>
  );
}

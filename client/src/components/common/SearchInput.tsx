import React, { useState, useEffect, useRef } from "react";
import { Form, ListGroup, Spinner } from "react-bootstrap";
import { useDebounceValue } from "../../utils/hooks/useDebounceValue";

interface SearchInputProps {
  placeholder?: string;
  fetchData: (query: string) => Promise<void> | void;
  items: { id: string; name: string }[];
  loading?: boolean;
  onSelect: (item: { id: string; name: string }) => void;
}

export default function SearchInput({
  placeholder,
  fetchData,
  items,
  loading,
  onSelect,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const debouncedInput = useDebounceValue(query, 300);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedInput.trim()) fetchData(debouncedInput);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: { id: string; name: string }) => {
    onSelect(item);
    setQuery("");
    setShowResults(false);
  };

  return (
    <div ref={inputRef} className="position-relative">
      <Form.Control
        type="text"
        placeholder={placeholder || "Search..."}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
      />

      {showResults && query.trim() && (
        <ListGroup
          className="position-absolute w-100 mt-1 shadow-sm"
          style={{ zIndex: 1000, maxHeight: "270px", overflowY: "auto" }}
        >
          {loading ? (
            <ListGroup.Item>
              <Spinner animation="border" size="sm" /> Loading...
            </ListGroup.Item>
          ) : items.length > 0 ? (
            items.map((item) => (
              <ListGroup.Item
                key={item.id}
                action
                onClick={() => handleSelect(item)}
                className="text-truncate py-1"
              >
                {item.name}
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No results</ListGroup.Item>
          )}
        </ListGroup>
      )}
    </div>
  );
}
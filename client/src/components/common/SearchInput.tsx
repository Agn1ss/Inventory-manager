import React, { useState, useEffect, useRef } from "react";
import { Form, ListGroup, Spinner, InputGroup, Button } from "react-bootstrap";
import { useDebounceValue } from "../../utils/hooks/useDebounceValue";
import toast from "react-hot-toast";
import ApiErrorHandler from "../../exeptions/apiErrorHandler";

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
  const debouncedQuery = useDebounceValue(query, 300);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const asyncData = async () => {
      if (debouncedQuery.trim()) {
        try {
          await fetchData(debouncedQuery);
        } catch (err) {
          const message = ApiErrorHandler.handle(err);
          toast.error(message);
        }
      }
    };
    asyncData();
  }, [debouncedQuery]);

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

  const handleAdd = () => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) return;

    const newItem = { id: "newItem", name: trimmed };
    onSelect(newItem);
    setQuery("");
    setShowResults(false);
  };

  return (
    <div ref={inputRef} className="position-relative">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
        />
        <Button
          variant="outline-primary"
          disabled={!debouncedQuery.trim()}
          onClick={handleAdd}
        >
          +
        </Button>
      </InputGroup>

      {showResults && debouncedQuery.trim() && (
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
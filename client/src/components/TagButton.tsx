import React from "react";
import { Button } from "react-bootstrap";

interface TagButtonProps {
  name: string;
  onSelectTag: () => void;
  isSelected?: boolean;
}

const TagButton: React.FC<TagButtonProps> = ({ name, onSelectTag, isSelected = false }) => {
  return (
    <Button
      variant={isSelected ? "primary" : "outline-secondary"}
      className="m-1 rounded-pill"
      size="sm"
      onClick={onSelectTag}
    >
      #{name}
    </Button>
  );
};

export default TagButton;
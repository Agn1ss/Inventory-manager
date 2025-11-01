import React from "react";
import { Button } from "react-bootstrap";

interface TagProps {
  name: string;
  onSelectTag: () => void;
  isSelected?: boolean;
}

const Tag: React.FC<TagProps> = ({ name, onSelectTag, isSelected = false }) => {
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

export default Tag;
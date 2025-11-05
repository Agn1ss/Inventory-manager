import React from "react";

interface TagProps {
  name: string;
}

const Tag: React.FC<TagProps> = ({ name }) => {
  return (
    <div
      className="d-inline-block px-2 py-1 m-1 rounded-1 border bg-body-secondary text-body"
      style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
    >
      {name}
    </div>
  );
};

export default Tag;

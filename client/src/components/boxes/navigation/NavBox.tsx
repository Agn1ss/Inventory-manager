import { Col } from "react-bootstrap";
import { useState } from "react";
import { NavButton } from "./NavButton";

interface NavPage<T extends string> {
  type: T;
  title: string;
}

interface NavBoxProps<T extends string> {
  pages: NavPage<T>[];
  onTypeChange?: (type: T) => void;
}

export default function NavBox<T extends string>({ pages, onTypeChange }: NavBoxProps<T>) {
  const [activeType, setActiveType] = useState<T>(pages[0]?.type);

  const handleClick = (type: T) => {
    setActiveType(type);
    onTypeChange?.(type);
  };

  return (
    <Col className="d-flex flex-column gap-2">
      {pages.map(page => (
        <NavButton
          key={page.type}
          title={page.title}
          type={page.type}
          active={activeType === page.type}
          onClick={() => handleClick(page.type)}
        />
      ))}
    </Col>
  );
}
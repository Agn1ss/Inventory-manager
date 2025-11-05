import { Button } from "react-bootstrap";

interface NavButtonProps {
  title: string;
  type: string;
  active?: boolean;
  onClick: () => void;
}

export function NavButton({ title, active, onClick }: NavButtonProps) {
  return (
    <Button
      variant={active ? "primary" : "outline-secondary"}
      className="w-100 text-start"
      onClick={onClick}
    >
      {title}
    </Button>
  );
}
import { Badge } from "react-bootstrap";

interface SelectedTagsProps {
  tags: { id: string; name: string }[];
  onRemove: (id: string) => void;
}

export default function SelectedTags({ tags, onRemove }: SelectedTagsProps) {
  return (
    <div className="mt-2 d-flex flex-wrap gap-3">
      {tags.map(tag => (
        <Badge
          key={tag.id}
          bg="secondary"
          className="px-3 py-2 d-flex align-items-center"
        >
          #{tag.name}
          <span
            onClick={() => onRemove(tag.id)}
            style={{ cursor: "pointer", marginLeft: "8px" }}
          >
            ×
          </span>
        </Badge>
      ))}
    </div>
  );
}

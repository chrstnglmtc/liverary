interface Props {
  filter: string;
  onChange: (value: string) => void;
}

const types = ["all", "book", "webtoon", "music", "video"];

export default function FilterTabs({ filter, onChange }: Props) {
  return (
    <div className="flex justify-center mt-6">
      <div className="tabs tabs-boxed">
        {types.map(type => (
          <a
            key={type}
            className={`tab ${filter === type ? "tab-active" : ""}`}
            onClick={() => onChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
        ))}
      </div>
    </div>
  );
}

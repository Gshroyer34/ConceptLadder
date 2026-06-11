import type { LearnerLevel } from "@/types/learning";

type TopicInputProps = {
  topic: string;
  level: LearnerLevel;
  loading: boolean;
  onTopicChange: (value: string) => void;
  onLevelChange: (level: LearnerLevel) => void;
  onGenerate: () => void;
  onExample: (topic: string) => void;
};

const levels: LearnerLevel[] = ["beginner", "intermediate", "expert"];
const examples = ["Kubernetes", "Neural networks", "OAuth"];

export function TopicInput({
  topic,
  level,
  loading,
  onTopicChange,
  onLevelChange,
  onGenerate,
  onExample
}: TopicInputProps) {
  return (
    <section className="topic-panel" aria-label="Topic input">
      <div className="topic-row">
        <label htmlFor="topic">Topic</label>
        <div className="level-control" aria-label="Learner level">
          {levels.map((item) => (
            <button
              type="button"
              className={item === level ? "level-button active" : "level-button"}
              key={item}
              onClick={() => onLevelChange(item)}
            >
              {capitalize(item)}
            </button>
          ))}
        </div>
      </div>
      <div className="input-row">
        <textarea
          id="topic"
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          placeholder="Kubernetes, OAuth, or paste a dense paragraph"
          rows={3}
        />
        <button className="generate-button" type="button" onClick={onGenerate} disabled={loading}>
          {loading ? "Generating" : "Generate"}
        </button>
      </div>
      <div className="example-row" aria-label="Seeded examples">
        {examples.map((example) => (
          <button type="button" className="example-button" key={example} onClick={() => onExample(example)}>
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

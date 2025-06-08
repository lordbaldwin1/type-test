import TypeTest from "./_components/test"
import { generateRandomWords } from "./_utils/generateRandomWords"

export default function HomePage() {
  const initialSampleText = generateRandomWords(10).split(" ");
  return (
    <div className="animate-in fade-in duration-500">
      <TypeTest initialSampleText={initialSampleText} />
    </div>
  );
}

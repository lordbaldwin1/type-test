import TypeTest from "./_components/test"
import { generateRandomWords } from "./_utils/generateRandomWords"

export default function HomePage() {
  const initialSampleText = generateRandomWords(10, "common200").split(" ");
  return (
    <TypeTest initialSampleText={initialSampleText} />
  );
}

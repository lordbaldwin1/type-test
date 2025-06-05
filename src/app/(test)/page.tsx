import TypeTest from "./_components/test"
import { Suspense } from "react"
import { generateRandomWords } from "./_utils/generateRandomWords"

export default function HomePage() {
  const initialSampleText = generateRandomWords(10).split(" ");
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TypeTest initialSampleText={initialSampleText} />
      </Suspense>
    </div>
  );
}

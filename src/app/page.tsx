import TypeTest from "../components/test"
import { Suspense } from "react"
import { generateRandomWords } from "~/lib/utils"
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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { SquarePen } from "lucide-react";
import { useGameStore } from "../_store/gameStore";

export function WordsetSelector() {
  const isInitialized = useGameStore((s) => s.isInitialized);
  const wordSet = useGameStore((s) => s.wordSet);
  const status = useGameStore((s) => s.status);
  const isTextChanging = useGameStore((s) => s.isTextChanging);

  const setWordSet = useGameStore((s) => s.setWordSet);

  const showUi = isInitialized && !isTextChanging && status !== "playing";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p
          className={`text-muted-foreground hover:text-foreground mx-auto flex flex-row items-center justify-center gap-2 font-mono transition-all duration-300 hover:cursor-pointer ${
            showUi ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <SquarePen className="h-4 w-4" />
          {wordSet === "oxford3000" ? "english 3k" : "english 300"}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[250px]">
        <DialogHeader>
          <DialogTitle className="border-border border-b pb-2 text-center">
            word sets
          </DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <div className="flex flex-col items-center gap-2">
            <p
              className={`${
                wordSet === "common200"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } hover:text-foreground hover:scale-102 hover:cursor-pointer`}
              onClick={() => setWordSet("common200")}
            >
              english 300
            </p>
            <p
              className={`${
                wordSet === "oxford3000"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } hover:text-foreground hover:scale-102 hover:cursor-pointer`}
              onClick={() => setWordSet("oxford3000")}
            >
              english 3k
            </p>
          </div>
        </DialogClose>
        <DialogFooter className="flex w-full flex-col items-center justify-center sm:justify-center">
          <p className="text-muted-foreground text-center text-sm">
            more coming soon!
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

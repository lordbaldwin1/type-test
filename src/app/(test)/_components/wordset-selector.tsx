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
import type { WordsetSelectorProps } from "../_utils/types";

export function WordsetSelector({
  wordCount,
  wordSet,
  showUi,
  updateGameState,
  generateNewText,
}: WordsetSelectorProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p
          className={`text-muted-foreground hover:text-foreground mx-auto mt-40 flex flex-row items-center justify-center gap-2 font-mono transition-all duration-300 hover:cursor-pointer ${
            showUi ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <SquarePen className="h-4 w-4" />
          {wordSet === "oxford3000" ? "english 3k" : "english 300"}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[250px]">
        <DialogHeader>
          <DialogTitle className="text-center border-b border-border pb-2">word sets</DialogTitle>
        </DialogHeader>
        <DialogClose asChild>
          <div className="flex flex-col items-center gap-2">
            <p
              className={`${wordSet === "common200" ? "text-foreground" : "text-muted-foreground"} hover:text-foreground hover:scale-102 hover:cursor-pointer`}
              onClick={() => {
                updateGameState({ wordSet: "common200" });
                generateNewText(wordCount, "common200", true);
              }}
            >
              english 300
            </p>
            <p
              className={`${wordSet === "oxford3000" ? "text-foreground" : "text-muted-foreground"} hover:text-foreground hover:scale-102 hover:cursor-pointer`}
              onClick={() => {
                updateGameState({ wordSet: "oxford3000" });
                generateNewText(wordCount, "oxford3000", true);
              }}
            >
              english 3k
            </p>
          </div>
        </DialogClose>
        <DialogFooter className="w-full flex flex-col items-center justify-center sm:justify-center">
          <p className="text-center text-muted-foreground text-sm">
            more coming soon!
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

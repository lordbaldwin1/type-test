"use client";

import { LinkIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CopyUrlButton() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToCLipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => {
        setIsCopied(false);
      }, 4000);
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <button onClick={copyToCLipboard} className="hover:bg-primary hover:text-primary-foreground h-1/2 flex-1 rounded-br-lg p-2">
      {isCopied ? <CheckIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
    </button>
  );
}
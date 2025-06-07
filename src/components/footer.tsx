import { Cat, Code, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Social links */}
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://github.com/lordbaldwin1/type-test"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Code className="h-4 w-4" />
            <span className="text-sm">github</span>
          </a>
          <a
            href="https://zacharyspringer.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Cat className="h-4 w-4" />
            <span className="text-sm">portfolio</span>
          </a>
          <a
            href="mailto:springerczachary@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            contact
            </a>
          
        </div>

        {/* Attribution */}
        <div className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            heavily inspired by{" "}
            <a
              href="https://monkeytype.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              monkeytype
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
} 
import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary py-4 text-primary-foreground">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <span className="flex items-center gap-2">
          Creado por
          <Link
            href="https://github.com/daljo25"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline"
          >
            <Github size={18} />
            <span>Daljo25</span>
          </Link>
        </span>
      </div>
    </footer>
  )
}


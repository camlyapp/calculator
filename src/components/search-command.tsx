
"use client"

import * as React from "react"
import {
  Calculator,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { allCalculators } from "@/lib/calculator-data"


export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])
  
  const sortedCalculators = React.useMemo(() => allCalculators.sort((a, b) => a.label.localeCompare(b.label)), []);

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "relative h-10 w-full justify-start rounded-md border text-sm font-normal text-muted-foreground shadow-none hover:bg-secondary/80 sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden lg:inline-flex">Search calculators...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Calculators">
            {sortedCalculators.map((calc) => {
                const Icon = calc.icon;
                return (
                    <CommandItem
                        key={calc.value}
                        value={`${calc.label} ${calc.category} ${calc.keywords?.join(' ')}`}
                        onSelect={() => {
                            runCommand(() => router.push(`${calc.path}?tab=${calc.value}`))
                        }}
                        >
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                            <Icon className="h-4 w-4" />
                        </div>
                        {calc.label}
                    </CommandItem>
                )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

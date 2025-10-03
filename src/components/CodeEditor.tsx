import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, MagicWand } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  language?: string
  readOnly?: boolean
  showCopy?: boolean
  title?: string
  className?: string
}

const languageMap: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript', 
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin'
}

const detectLanguage = (code: string): string => {
  if (!code.trim()) return 'text'
  
  if (code.includes('function') && (code.includes('=>') || code.includes('const') || code.includes('let'))) {
    return code.includes('interface') || code.includes(': string') ? 'typescript' : 'javascript'
  }
  if (code.includes('def ') && code.includes(':')) return 'python'
  if (code.includes('public class') || code.includes('public static void main')) return 'java'
  if (code.includes('#include') || code.includes('std::')) return 'cpp'
  if (code.includes('using System') || code.includes('public class')) return 'csharp'
  if (code.includes('func ') && code.includes('package main')) return 'go'
  if (code.includes('fn ') && code.includes('println!')) return 'rust'
  if (code.includes('<?php') || code.includes('echo ')) return 'php'
  if (code.includes('def ') && code.includes('end')) return 'ruby'
  if (code.includes('func ') && code.includes('var ')) return 'swift'
  if (code.includes('fun ') && code.includes('println')) return 'kotlin'
  
  return 'text'
}

export function CodeEditor({ 
  value, 
  onChange, 
  placeholder = "Enter your code here...", 
  language,
  readOnly = false,
  showCopy = false,
  title,
  className 
}: CodeEditorProps) {
  const [detectedLanguage, setDetectedLanguage] = useState<string>('text')

  useEffect(() => {
    if (!language && value) {
      setDetectedLanguage(detectLanguage(value))
    }
  }, [value, language])

  const currentLanguage = language || detectedLanguage
  const displayLanguage = languageMap[currentLanguage] || currentLanguage

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value)
    }
  }

  return (
    <Card className={cn("relative", className)}>
      {(title || showCopy || displayLanguage !== 'text') && (
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            {title && <span className="font-medium text-sm">{title}</span>}
            {displayLanguage !== 'text' && (
              <Badge variant="secondary" className="text-xs">
                {displayLanguage}
              </Badge>
            )}
          </div>
          {showCopy && value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              <Copy className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "code-editor w-full min-h-[300px] p-4 border-0 bg-transparent resize-none focus:outline-none focus:ring-0",
            "placeholder:text-muted-foreground",
            readOnly && "cursor-default"
          )}
          spellCheck={false}
        />
        
        {readOnly && (
          <div className="absolute top-2 right-2">
            <MagicWand className="w-4 h-4 text-accent animate-pulse" />
          </div>
        )}
      </div>
    </Card>
  )
}
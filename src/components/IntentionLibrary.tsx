import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Lightning, 
  Translate, 
  ShieldCheck, 
  ArrowsClockwise, 
  Bug, 
  Speedometer,
  Code,
  CheckCircle
} from '@phosphor-icons/react'

export interface Intention {
  id: string
  name: string
  description: string
  category: 'optimize' | 'translate' | 'secure' | 'modernize' | 'fix' | 'enhance'
  icon: React.ComponentType<any>
  color: string
  selected: boolean
}

const defaultIntentions: Intention[] = [
  {
    id: 'optimize-performance',
    name: 'Optimize Performance',
    description: 'Improve algorithmic complexity, memory usage, and execution speed',
    category: 'optimize',
    icon: Lightning,
    color: 'text-yellow-600',
    selected: false
  },
  {
    id: 'translate-language',
    name: 'Translate Language',
    description: 'Convert code to a different programming language while preserving logic',
    category: 'translate', 
    icon: Translate,
    color: 'text-blue-600',
    selected: false
  },
  {
    id: 'enhance-security',
    name: 'Enhance Security',
    description: 'Add security best practices, input validation, and vulnerability fixes',
    category: 'secure',
    icon: ShieldCheck,
    color: 'text-green-600',
    selected: false
  },
  {
    id: 'modernize-syntax',
    name: 'Modernize Syntax',
    description: 'Update to latest language features and contemporary coding patterns',
    category: 'modernize',
    icon: ArrowsClockwise,
    color: 'text-purple-600',
    selected: false
  },
  {
    id: 'fix-bugs',
    name: 'Fix Potential Issues',
    description: 'Identify and resolve common bugs, edge cases, and error handling',
    category: 'fix',
    icon: Bug,
    color: 'text-red-600',
    selected: false
  },
  {
    id: 'improve-readability',
    name: 'Improve Readability',
    description: 'Enhance code structure, naming, and documentation for clarity',
    category: 'enhance',
    icon: Code,
    color: 'text-indigo-600',
    selected: false
  }
]

interface IntentionLibraryProps {
  selectedIntentions: string[]
  onIntentionToggle: (intentionId: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export function IntentionLibrary({ 
  selectedIntentions, 
  onIntentionToggle, 
  onSelectAll, 
  onClearAll 
}: IntentionLibraryProps) {
  const [intentions] = useState<Intention[]>(defaultIntentions)

  const categoryGroups = intentions.reduce((groups, intention) => {
    const category = intention.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(intention)
    return groups
  }, {} as Record<string, Intention[]>)

  const categoryLabels = {
    optimize: 'Performance & Optimization',
    translate: 'Language Translation',
    secure: 'Security Enhancement',
    modernize: 'Modernization',
    fix: 'Bug Fixes',
    enhance: 'Code Enhancement'
  }

  const selectedCount = selectedIntentions.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Intention Library
              {selectedCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedCount} selected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Select transformation goals to harmonize your code
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={selectedCount === intentions.length}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              disabled={selectedCount === 0}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(categoryGroups).map(([category, categoryIntentions]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            
            <div className="grid gap-3">
              {categoryIntentions.map((intention) => {
                const Icon = intention.icon
                const isSelected = selectedIntentions.includes(intention.id)
                
                return (
                  <div
                    key={intention.id}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected 
                        ? 'bg-primary/5 border-primary/20 shadow-sm' 
                        : 'hover:bg-muted/50 hover:border-border/50'
                      }
                    `}
                    onClick={() => onIntentionToggle(intention.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onIntentionToggle(intention.id)}
                      className="mt-0.5"
                    />
                    
                    <Icon className={`w-5 h-5 mt-0.5 ${intention.color}`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{intention.name}</h4>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {intention.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
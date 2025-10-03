import { useState } from 'react'
import { useLocalKV } from './hooks/useLocalKV'
import { CodeEditor } from './components/CodeEditor'
import { IntentionLibrary } from './components/IntentionLibrary'
import { HarmonizationEngine } from './components/HarmonizationEngine'
import { AuditTrail } from './components/AuditTrail'
import { Card, CardContent } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { 
  Code, 
  MagicWand, 
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react'

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].price != null) {
      total = total + items[i].price;
    }
  }
  return total;
}`

function App() {
  const [sourceCode, setSourceCode] = useLocalKV<string>('harmonizer-source-code', sampleCode)
  const [harmonizedCode, setHarmonizedCode] = useLocalKV<string>('harmonizer-output-code', '')
  const [selectedIntentions, setSelectedIntentions] = useLocalKV<string[]>('harmonizer-intentions', [])
  const [auditLog, setAuditLog] = useLocalKV<any>('harmonizer-audit-log', null)
  const [activeTab, setActiveTab] = useState('input')

  // Ensure sourceCode is always a string
  const safeSourceCode = typeof sourceCode === 'string' ? sourceCode : ''
  
  // Ensure selectedIntentions is always an array
  const safeSelectedIntentions = Array.isArray(selectedIntentions) ? selectedIntentions : []

  const handleIntentionToggle = (intentionId: string) => {
    setSelectedIntentions((prev) => {
      const currentIntentions = Array.isArray(prev) ? prev : []
      return currentIntentions.includes(intentionId)
        ? currentIntentions.filter(id => id !== intentionId)
        : [...currentIntentions, intentionId]
    })
  }

  const handleSelectAllIntentions = () => {
    const allIntentions = [
      'optimize-performance',
      'translate-language', 
      'enhance-security',
      'modernize-syntax',
      'fix-bugs',
      'improve-readability'
    ]
    setSelectedIntentions(allIntentions)
  }

  const handleClearAllIntentions = () => {
    setSelectedIntentions([])
  }

  const handleHarmonize = (harmonized: string, audit: any) => {
    setHarmonizedCode(harmonized)
    setAuditLog(audit)
    setActiveTab('output')
  }

  const handleRollback = () => {
    setHarmonizedCode('')
    setAuditLog(null)
    setActiveTab('input')
  }

  const resetAll = () => {
    setSourceCode('')
    setHarmonizedCode('')
    setSelectedIntentions([])
    setAuditLog(null)
    setActiveTab('input')
  }

  const loadSample = () => {
    setSourceCode(sampleCode)
    setActiveTab('input')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkle className="w-8 h-8 text-accent" />
                <div>
                  <h1 className="text-2xl font-bold">Code Harmonizer</h1>
                  <p className="text-sm text-muted-foreground">
                    Universal Code Intelligence Platform
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadSample}>
                Load Sample
              </Button>
              <Button variant="outline" size="sm" onClick={resetAll}>
                Reset All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="input" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Source Code
                </TabsTrigger>
                <TabsTrigger value="output" className="flex items-center gap-2">
                  <MagicWand className="w-4 h-4" />
                  Harmonized Code
                  {harmonizedCode && (
                    <Badge variant="secondary" className="ml-2">
                      Ready
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-4">
                <CodeEditor
                  value={safeSourceCode}
                  onChange={setSourceCode}
                  placeholder="Enter your code here or click 'Load Sample' to try with example code..."
                  title="Source Code"
                />
                
                {safeSourceCode && harmonizedCode && (
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4" />
                        Harmonized version available in the output tab
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="output" className="space-y-4">
                {harmonizedCode ? (
                  <CodeEditor
                    value={harmonizedCode}
                    onChange={() => {}}
                    readOnly
                    showCopy
                    title="Harmonized Code"
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MagicWand className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="font-medium mb-2">No Harmonized Code Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add source code and select intentions, then run harmonization to see results here.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('input')}
                      >
                        Go to Source Code
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <IntentionLibrary
              selectedIntentions={safeSelectedIntentions}
              onIntentionToggle={handleIntentionToggle}
              onSelectAll={handleSelectAllIntentions}
              onClearAll={handleClearAllIntentions}
            />

            <HarmonizationEngine
              sourceCode={safeSourceCode}
              selectedIntentions={safeSelectedIntentions}
              onHarmonize={handleHarmonize}
            />

            <AuditTrail
              auditLog={auditLog}
              harmonizedCode={harmonizedCode || ''}
              onRollback={handleRollback}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
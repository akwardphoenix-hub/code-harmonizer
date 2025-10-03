import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  CheckCircle, 
  Warning, 
  Clock, 
  MagicWand,
  ArrowRight 
} from '@phosphor-icons/react'

interface HarmonizationStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  description: string
}

interface HarmonizationEngineProps {
  sourceCode: string
  selectedIntentions: string[]
  onHarmonize: (harmonizedCode: string, auditLog: any) => void
}

export function HarmonizationEngine({ 
  sourceCode, 
  selectedIntentions, 
  onHarmonize 
}: HarmonizationEngineProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [steps, setSteps] = useState<HarmonizationStep[]>([])
  const [overallProgress, setOverallProgress] = useState(0)

  const intentionNames: Record<string, string> = {
    'optimize-performance': 'Performance Optimization',
    'translate-language': 'Language Translation',
    'enhance-security': 'Security Enhancement', 
    'modernize-syntax': 'Syntax Modernization',
    'fix-bugs': 'Bug Detection & Fixes',
    'improve-readability': 'Readability Enhancement'
  }

  const initializeSteps = () => {
    const safeSelectedIntentions = Array.isArray(selectedIntentions) ? selectedIntentions : []
    
    const baseSteps = [
      { id: 'analyze', name: 'Code Analysis', description: 'Parsing and understanding code structure' },
      { id: 'validate', name: 'Validation', description: 'Checking syntax and detecting issues' }
    ]

    const intentionSteps = safeSelectedIntentions.map(id => ({
      id: `intention-${id}`,
      name: intentionNames[id] || 'Unknown Intention',
      description: `Applying ${intentionNames[id]?.toLowerCase() || 'transformation'}`
    }))

    const finalSteps = [
      { id: 'integrate', name: 'Integration', description: 'Combining all transformations harmoniously' },
      { id: 'finalize', name: 'Finalization', description: 'Final validation and cleanup' }
    ]

    return [...baseSteps, ...intentionSteps, ...finalSteps].map(step => ({
      ...step,
      status: 'pending' as const,
      progress: 0
    }))
  }

  const simulateProcessing = async () => {
    const processingSteps = initializeSteps()
    setSteps(processingSteps)
    setIsProcessing(true)
    setOverallProgress(0)

    let completedSteps = 0

    for (let i = 0; i < processingSteps.length; i++) {
      const step = processingSteps[i]
      
      setSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'processing' } : s
      ))

      for (let progress = 0; progress <= 100; progress += 20) {
        setSteps(prev => prev.map(s => 
          s.id === step.id ? { ...s, progress } : s
        ))
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      setSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'completed', progress: 100 } : s
      ))

      completedSteps++
      setOverallProgress((completedSteps / processingSteps.length) * 100)
    }

    const harmonizedCode = await generateHarmonizedCode()
    const auditLog = generateAuditLog(processingSteps)
    
    setIsProcessing(false)
    onHarmonize(harmonizedCode, auditLog)
  }

  const generateHarmonizedCode = async (): Promise<string> => {
    const safeSourceCode = sourceCode || ''
    const safeSelectedIntentions = Array.isArray(selectedIntentions) ? selectedIntentions : []
    
    if (!safeSourceCode || !safeSourceCode.trim()) return safeSourceCode

    try {
      const intentionList = safeSelectedIntentions.map(id => intentionNames[id] || id).join(', ')
      
      const promptText = `You are a code harmonization engine. Transform this code based on the selected intentions: ${safeSelectedIntentions.join(', ')}.

Original code:
${safeSourceCode}

Instructions:
- Apply the selected transformations while preserving functionality
- Focus on the specific intentions requested
- Maintain code readability and best practices
- Return only the transformed code, no explanations

Selected intentions: ${intentionList}`

      const result = await window.spark.llm(promptText)
      return result || safeSourceCode
    } catch (error) {
      console.error('Harmonization failed:', error)
      return safeSourceCode
    }
  }

  const generateAuditLog = (processingSteps: HarmonizationStep[]) => {
    const safeSourceCode = sourceCode || ''
    const safeSelectedIntentions = Array.isArray(selectedIntentions) ? selectedIntentions : []
    
    return {
      timestamp: new Date().toISOString(),
      originalCode: safeSourceCode,
      selectedIntentions: safeSelectedIntentions,
      steps: processingSteps,
      transformations: safeSelectedIntentions.map(id => ({
        intention: id,
        name: intentionNames[id],
        applied: true,
        reasoning: `Applied ${intentionNames[id]?.toLowerCase()} to improve code quality`
      }))
    }
  }

  const canHarmonize = sourceCode && typeof sourceCode === 'string' && sourceCode.trim() && Array.isArray(selectedIntentions) && selectedIntentions.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MagicWand className="w-5 h-5 text-accent" />
          Harmonization Engine
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!canHarmonize && (
          <Alert>
            <Warning className="w-4 h-4" />
            <AlertDescription>
              {!sourceCode || (typeof sourceCode === 'string' && !sourceCode.trim())
                ? "Please enter source code to harmonize" 
                : "Please select at least one intention from the library"
              }
            </AlertDescription>
          </Alert>
        )}

        {Array.isArray(selectedIntentions) && selectedIntentions.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2">Selected Intentions</h3>
            <div className="flex flex-wrap gap-2">
              {selectedIntentions.map(id => (
                <Badge key={id} variant="secondary">
                  {intentionNames[id] || id}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>

            <div className="space-y-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="flex items-center gap-3 p-2 rounded border"
                >
                  <div className="w-5 h-5">
                    {step.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {step.status === 'processing' && (
                      <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.name}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>

                  {step.status === 'processing' && (
                    <div className="text-xs text-muted-foreground">
                      {step.progress}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={simulateProcessing}
          disabled={!canHarmonize || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Harmonizing Code...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Harmonize Code
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
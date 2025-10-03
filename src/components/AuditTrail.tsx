import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ClockClockwise, 
  Download, 
  ArrowCounterClockwise, 
  CheckCircle,
  Eye,
  FileText
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AuditEntry {
  timestamp: string
  originalCode: string
  selectedIntentions: string[]
  steps: any[]
  transformations: Array<{
    intention: string
    name: string
    applied: boolean
    reasoning: string
  }>
}

interface AuditTrailProps {
  auditLog: AuditEntry | null
  harmonizedCode: string
  onRollback: () => void
}

export function AuditTrail({ auditLog, harmonizedCode, onRollback }: AuditTrailProps) {
  const [activeTab, setActiveTab] = useState('summary')

  if (!auditLog) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockClockwise className="w-5 h-5" />
            Audit Trail
          </CardTitle>
          <CardDescription>
            Transformation history and audit logs will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No harmonization performed yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const exportAuditLog = () => {
    const exportData = {
      ...auditLog,
      harmonizedCode,
      exportTimestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `harmonization-audit-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const calculateStats = () => {
    const totalTransformations = auditLog.transformations.length
    const appliedTransformations = auditLog.transformations.filter(t => t.applied).length
    const successRate = totalTransformations > 0 ? (appliedTransformations / totalTransformations) * 100 : 0
    
    return { totalTransformations, appliedTransformations, successRate }
  }

  const stats = calculateStats()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClockClockwise className="w-5 h-5" />
              Audit Trail
            </CardTitle>
            <CardDescription>
              Transformation completed on {formatTimestamp(auditLog.timestamp)}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportAuditLog}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRollback}
            >
              <ArrowCounterClockwise className="w-4 h-4 mr-2" />
              Rollback
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.appliedTransformations}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Transformations Applied
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(stats.successRate)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Success Rate
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {auditLog.steps.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Processing Steps
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-medium mb-2">Applied Intentions</h3>
              <div className="flex flex-wrap gap-2">
                {auditLog.selectedIntentions.map(intention => (
                  <Badge key={intention} variant="secondary">
                    {intention}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transformations" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {auditLog.transformations.map((transformation, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      transformation.applied 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                    )}
                  >
                    <div className="w-5 h-5 mt-0.5">
                      {transformation.applied ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {transformation.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {transformation.reasoning}
                      </div>
                      <Badge 
                        variant={transformation.applied ? "secondary" : "destructive"}
                        className="mt-2"
                      >
                        {transformation.applied ? 'Applied' : 'Skipped'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {auditLog.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="w-5 h-5 mt-0.5">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {step.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Completed at 100%
                      </div>
                    </div>
                    
                    <Badge variant="secondary">
                      Step {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
/**
 * LLM helper that provides a fallback when Spark LLM is not available
 * Note: Window.spark type is defined by @github/spark package
 */

/**
 * Call the LLM with a fallback for development/testing
 */
export async function callLLM(prompt: string): Promise<string> {
  // Check if Spark LLM is available
  if (window.spark && typeof window.spark.llm === 'function') {
    try {
      const result = await window.spark.llm(prompt)
      return result || ''
    } catch (error) {
      console.error('Spark LLM call failed:', error)
      // Fall through to mock response
    }
  }

  // Fallback: Return a helpful message when LLM is not available
  console.warn('Spark LLM not available - using mock response for development')
  
  // Parse the prompt to extract code and intentions
  const codeMatch = prompt.match(/Original code:\s*([\s\S]*?)\s*Instructions:/i)
  const intentionsMatch = prompt.match(/Selected intentions:\s*(.+)$/im)
  
  const originalCode = codeMatch ? codeMatch[1].trim() : ''
  const intentions = intentionsMatch ? intentionsMatch[1].trim() : ''
  
  // Return a mock harmonized version with improvements
  return mockHarmonize(originalCode, intentions)
}

/**
 * Mock harmonization for development/testing
 */
function mockHarmonize(code: string, intentions: string): string {
  if (!code) return code

  let harmonized = code

  // Apply simple transformations based on common intentions
  if (intentions.includes('optimize') || intentions.includes('performance')) {
    // Convert var to const/let
    harmonized = harmonized.replace(/\bvar\s+/g, 'const ')
  }

  if (intentions.includes('modernize')) {
    // Convert function to arrow function where appropriate
    harmonized = harmonized.replace(/function\s+(\w+)\s*\((.*?)\)\s*{/g, 'const $1 = ($2) => {')
    // Use template literals
    harmonized = harmonized.replace(/(['"])\s*\+\s*(\w+)\s*\+\s*(['"])/g, '`${$2}`')
  }

  if (intentions.includes('readability') || intentions.includes('enhance')) {
    // Add spacing for readability (this is a simple example)
    harmonized = harmonized.replace(/;(?!\s*[\n}])/g, ';\n  ')
  }

  if (intentions.includes('fix') || intentions.includes('bug')) {
    // Use strict equality
    harmonized = harmonized.replace(/\s*!=\s*null/g, ' !== null')
    harmonized = harmonized.replace(/\s*==\s*null/g, ' === null')
  }

  if (intentions.includes('secure') || intentions.includes('security')) {
    // Add basic null checks (example)
    harmonized = harmonized.replace(/(\w+)\[(\w+)\]/g, '$1?.[$2]')
  }

  // If no changes were made, add a comment to show it was processed
  if (harmonized === code) {
    harmonized = `// Harmonized with intentions: ${intentions}\n${code}`
  }

  return harmonized
}

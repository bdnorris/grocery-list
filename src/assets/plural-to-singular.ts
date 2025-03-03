export default function(word: string): string {
  // Define a mapping for irregular nouns
  const irregulars: Record<string, string> = {
      "tomatoes": "tomato",
  };

  console.log('word:', irregulars);

  // Check for irregular nouns first
  const lowerWord = word.toLowerCase();
  if (irregulars[lowerWord]) {
      return irregulars[lowerWord];
  }

  // Common pluralization rules as tuples
  const rules: [RegExp, string][] = [
      [/(oes|ses|xes|zes|ches|shes)$/, ''], // Remove 'es' for words ending in specific patterns
      [/ies$/, 'y'],  // Change 'ies' to 'y'
      [/ves$/, 'f'],  // Change 'ves' to 'f'
      [/men$/, 'man'], // Change 'men' to 'man'
      [/s$/, '']      // Remove trailing 's' (default case)
  ];

  // Apply the first matching rule
  for (const [regex, replacement] of rules) {
      if (regex.test(word)) {
          return word.replace(regex, replacement);
      }
  }

  // If no rules apply, return the original word
  return word;
}

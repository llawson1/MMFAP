
export class ReactKeyDetector {
  private static keyRegistry = new Map<string, number>();
  private static duplicates: Array<{
    key: string;
    count: number;
    component: string;
    timestamp: Date;
  }> = [];

  // Register a key usage
  static registerKey(key: string, componentName: string): string {
    const currentCount = this.keyRegistry.get(key) || 0;
    this.keyRegistry.set(key, currentCount + 1);

    if (currentCount > 0) {
      // This is a duplicate!
      this.duplicates.push({
        key,
        count: currentCount + 1,
        component: componentName,
        timestamp: new Date()
      });
      
      console.warn(`🔑 Duplicate React key detected: "${key}" in ${componentName} (count: ${currentCount + 1})`);
      
      // Return a unique key
      return `${key}-${currentCount}`;
    }

    return key;
  }

  // Generate safe unique key
  static generateUniqueKey(baseKey: string, index: number, componentName?: string): string {
    const uniqueKey = `${baseKey}-${index}-${Date.now()}`;
    
    if (componentName) {
      this.registerKey(uniqueKey, componentName);
    }
    
    return uniqueKey;
  }

  // Clear registry (useful for testing or page changes)
  static clearRegistry(): void {
    this.keyRegistry.clear();
    this.duplicates = [];
  }

  // Get duplicate report
  static getDuplicateReport(): typeof ReactKeyDetector.duplicates {
    return this.duplicates;
  }

  // Validate an array of keys
  static validateKeys(keys: string[], componentName: string): string[] {
    const uniqueKeys: string[] = [];
    const seenKeys = new Set<string>();

    keys.forEach((key, index) => {
      if (seenKeys.has(key)) {
        const uniqueKey = `${key}-duplicate-${index}`;
        uniqueKeys.push(uniqueKey);
        console.warn(`🔑 Fixed duplicate key: "${key}" → "${uniqueKey}" in ${componentName}`);
      } else {
        seenKeys.add(key);
        uniqueKeys.push(key);
      }
    });

    return uniqueKeys;
  }
}

// Helper hook for React components
export const useUniqueKeys = (items: any[], keyExtractor: (item: any, index: number) => string, componentName: string) => {
  return items.map((item, index) => {
    const baseKey = keyExtractor(item, index);
    return ReactKeyDetector.registerKey(baseKey, componentName);
  });
};

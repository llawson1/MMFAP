
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Comprehensive Application Audit...\n');

// 1. Route Existence Check
function auditRoutes() {
  console.log('📋 1. Auditing Routes...');
  
  const appTsxPath = path.join(__dirname, '../client/src/App.tsx');
  const pagesDir = path.join(__dirname, '../client/src/pages');
  
  if (!fs.existsSync(appTsxPath)) {
    console.error('❌ App.tsx not found');
    return false;
  }
  
  const appContent = fs.readFileSync(appTsxPath, 'utf8');
  const routeMatches = appContent.match(/<Route\s+path="([^"]+)"\s+component=\{([^}]+)\}/g) || [];
  
  let routeErrors = 0;
  
  routeMatches.forEach(route => {
    const pathMatch = route.match(/path="([^"]+)"/);
    const componentMatch = route.match(/component=\{([^}]+)\}/);
    
    if (pathMatch && componentMatch) {
      const routePath = pathMatch[1];
      const componentName = componentMatch[1];
      
      // Skip dynamic routes
      if (routePath.includes(':')) {
        console.log(`⚠️  Skipping dynamic route: ${routePath}`);
        return;
      }
      
      const expectedFile = path.join(pagesDir, `${componentName.toLowerCase().replace(/([A-Z])/g, '-$1').substring(1)}.tsx`);
      
      if (!fs.existsSync(expectedFile)) {
        console.error(`❌ Missing component for route ${routePath}: ${expectedFile}`);
        routeErrors++;
      } else {
        console.log(`✅ Route ${routePath} -> ${componentName}`);
      }
    }
  });
  
  console.log(`📋 Route audit complete. Errors: ${routeErrors}\n`);
  return routeErrors === 0;
}

// 2. TypeScript Compilation Check
function auditTypeScript() {
  console.log('🔧 2. Auditing TypeScript...');
  
  try {
    execSync('npx tsc --noEmit', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful\n');
    return true;
  } catch (error) {
    console.error('❌ TypeScript compilation failed:');
    console.error(error.stdout?.toString() || error.message);
    console.log('');
    return false;
  }
}

// 3. CSS Validation
function auditCSS() {
  console.log('🎨 3. Auditing CSS...');
  
  const cssFiles = [
    path.join(__dirname, '../client/src/index.css'),
    path.join(__dirname, '../attached_assets/style_1750573888646.css'),
    path.join(__dirname, '../attached_assets/style_1750570602784.css')
  ];
  
  let duplicateCount = 0;
  const definedVariables = new Set();
  
  cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const variables = content.match(/--[\w-]+:/g) || [];
      
      variables.forEach(variable => {
        const varName = variable.replace(':', '');
        if (definedVariables.has(varName)) {
          console.warn(`⚠️  Duplicate CSS variable: ${varName} in ${path.basename(file)}`);
          duplicateCount++;
        } else {
          definedVariables.add(varName);
        }
      });
    }
  });
  
  console.log(`🎨 CSS audit complete. Duplicates found: ${duplicateCount}\n`);
  return duplicateCount === 0;
}

// 4. Import Validation
function auditImports() {
  console.log('📦 4. Auditing Imports...');
  
  const srcDir = path.join(__dirname, '../client/src');
  let importErrors = 0;
  
  function checkFileImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = content.match(/import.*from\s+['"`]([^'"`]+)['"`]/g) || [];
    
    imports.forEach(importLine => {
      const match = importLine.match(/from\s+['"`]([^'"`]+)['"`]/);
      if (match) {
        const importPath = match[1];
        
        // Skip node_modules and absolute imports
        if (importPath.startsWith('.') || importPath.startsWith('@/')) {
          let resolvedPath;
          
          if (importPath.startsWith('@/')) {
            resolvedPath = path.join(srcDir, importPath.replace('@/', ''));
          } else {
            resolvedPath = path.resolve(path.dirname(filePath), importPath);
          }
          
          // Add common extensions if no extension
          const extensions = ['.ts', '.tsx', '.js', '.jsx'];
          let exists = false;
          
          if (fs.existsSync(resolvedPath)) {
            exists = true;
          } else {
            for (const ext of extensions) {
              if (fs.existsSync(resolvedPath + ext)) {
                exists = true;
                break;
              }
            }
          }
          
          if (!exists) {
            console.error(`❌ Missing import in ${path.relative(srcDir, filePath)}: ${importPath}`);
            importErrors++;
          }
        }
      }
    });
  }
  
  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        checkFileImports(filePath);
      }
    });
  }
  
  walkDirectory(srcDir);
  
  console.log(`📦 Import audit complete. Errors: ${importErrors}\n`);
  return importErrors === 0;
}

// 5. API Endpoint Validation
function auditAPIEndpoints() {
  console.log('🌐 5. Auditing API Endpoints...');
  
  const serverDir = path.join(__dirname, '../server');
  const routesDir = path.join(serverDir, 'routes');
  
  if (!fs.existsSync(routesDir)) {
    console.error('❌ Server routes directory not found');
    return false;
  }
  
  const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.ts'));
  let endpointCount = 0;
  
  routeFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const endpoints = content.match(/router\.(get|post|put|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g) || [];
    endpointCount += endpoints.length;
    
    endpoints.forEach(endpoint => {
      const match = endpoint.match(/router\.(\w+)\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (match) {
        const method = match[1].toUpperCase();
        const path = match[2];
        console.log(`✅ ${method} ${path} (${file})`);
      }
    });
  });
  
  console.log(`🌐 API audit complete. Endpoints found: ${endpointCount}\n`);
  return endpointCount > 0;
}

// Run all audits
async function runAudit() {
  const results = {
    routes: auditRoutes(),
    typescript: auditTypeScript(),
    css: auditCSS(),
    imports: auditImports(),
    api: auditAPIEndpoints()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('📊 AUDIT SUMMARY:');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('='.repeat(50));
  console.log(`Overall: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
  
  if (passed === total) {
    console.log('🎉 All audits passed! Application is ready for production.');
    process.exit(0);
  } else {
    console.log('⚠️  Some audits failed. Please fix the issues before deployment.');
    process.exit(1);
  }
}

runAudit().catch(error => {
  console.error('💥 Audit script failed:', error);
  process.exit(1);
});


# Navigation Flowchart & Audit Report

## Current Navigation Tree

```
Dashboard (/)
├── Hero Predictions
│   ├── Liverpool → /team/liverpool ❌ (BROKEN - Team not found)
│   ├── Arsenal → /team/arsenal ❌ (BROKEN - Team not found) 
│   ├── Manchester City → /team/manchester-city ❌ (BROKEN - Team not found)
│   └── [Other teams] → /team/[encoded-name] ❌ (BROKEN)
│
├── Header Navigation
│   ├── Leagues → /leagues ✅ (Working)
│   ├── Teams → /teams ✅ (Working)
│   ├── Players → /players ✅ (Working)
│   ├── Transfers → /transfers ✅ (Working)
│   ├── Fixtures → /fixtures ✅ (Working)
│   └── More Dropdown
│       ├── Performance Dashboard → /performance-dashboard ✅ (Working)
│       ├── Authentic Database → /authentic-database ✅ (Working)
│       ├── Financial Dashboard → /financial-dashboard ✅ (Working)
│       └── FFP Compliance → /ffp-compliance ✅ (Working)
│
├── Live Transfer Hub
│   └── Source clicks → Reliability Modal ✅ (Working)
│
├── Confidence Indicators
│   └── Badge clicks → Team Confidence Page ✅ (Working)
│
└── League Tables
    └── Team name clicks → /team/[encoded-name] ❌ (BROKEN)
```

## Critical Issues Identified

### 1. Team Profile Navigation (HIGH PRIORITY)
**Problem**: Hero predictions → team clicks result in "Team Not Found"
**Root Cause**: Team name encoding/decoding mismatch between navigation and lookup
**Affected Routes**: All `/team/[teamName]` routes

### 2. React Hooks Error (HIGH PRIORITY)  
**Problem**: `LiveTransferHub` component causing hooks order changes
**Impact**: Component crashes, affects dashboard stability

### 3. Team Data Lookup (MEDIUM PRIORITY)
**Problem**: Team lookup logic in `TeamProfilePage` not matching encoded URLs
**Impact**: Valid team names not being found in database

## Navigation Flow Analysis

### Working Flows ✅
- Dashboard → Header Navigation → All pages
- Dashboard → Confidence badges → Team confidence details
- Dashboard → Live Transfer Hub → Source reliability modals

### Broken Flows ❌
- Dashboard → Hero Predictions → Team profiles
- Dashboard → League Tables → Team profiles  
- Direct URL access to `/team/[any-team-name]`

## Immediate Fix Plan

1. **Fix Team Name Encoding**: Ensure Liverpool maps correctly
2. **Fix Team Lookup Logic**: Update search algorithm in TeamProfilePage  
3. **Fix React Hooks**: Stabilize LiveTransferHub component
4. **Add Fallback Handling**: Graceful degradation for missing teams
```

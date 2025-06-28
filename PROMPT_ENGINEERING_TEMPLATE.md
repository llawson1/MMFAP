# Prompt Engineering Template for User Feedback

## Purpose
This template helps structure user feedback to maximize understanding and implementation efficiency.

## SUGGESTED PROMPT STRUCTURE

When providing feedback or requesting changes, please use this format:

### 1. ISSUE IDENTIFICATION
**What's not working:**
- [Specific feature or functionality]
- [Expected behavior vs actual behavior]
- [Steps to reproduce if applicable]

### 2. PRIORITY LEVEL
**Urgency:** [Critical/High/Medium/Low]
**Impact:** [Blocks other work/Affects user experience/Enhancement]

### 3. DESIRED OUTCOME
**What I want to see:**
- [Specific functionality description]
- [User experience goals]
- [Success criteria]

### 4. CONSTRAINTS OR PREFERENCES
**Requirements:**
- [Any technical constraints]
- [Design preferences]
- [Performance requirements]
- [Data source preferences]

### 5. SCOPE
**This change should affect:**
- [Specific pages/components]
- [Related features that should be updated]
- [Areas that should NOT be changed]

---

## EXAMPLE FEEDBACK (For Current Issue)

### 1. ISSUE IDENTIFICATION
**What's not working:**
- Team profile navigation from hero predictions is broken
- Clicking on Liverpool logo or confidence badge should go to Liverpool's dedicated page
- Currently either not navigating or going to wrong page

### 2. PRIORITY LEVEL
**Urgency:** Critical
**Impact:** Blocks core user navigation flow

### 3. DESIRED OUTCOME
**What I want to see:**
- Click Liverpool logo → Navigate to /team/Liverpool page
- Click confidence badge → Same navigation to team page
- All 50+ teams should have working navigation
- Pages should load with authentic team data and statistics

### 4. CONSTRAINTS OR PREFERENCES
**Requirements:**
- Must work for teams with special characters (Brighton & Hove Albion)
- Should maintain fast loading times
- Keep existing visual design
- Use authentic data only

### 5. SCOPE
**This change should affect:**
- Hero predictions component click handlers
- App routing configuration
- Team profile page parameter handling
- Should NOT affect other navigation or existing team data

---

## QUESTIONS FOR YOU

**Please review this template and let me know:**

1. **Does this structure capture the information I need to understand your requests better?**

2. **Are there additional sections that would be helpful?**
   - Technical implementation preferences?
   - User story format?
   - Acceptance criteria?

3. **For the current team profile issue, is my understanding correct:**
   - Hero predictions should link to individual team pages?
   - Each team should have comprehensive analysis (charts, stats, etc.)?
   - Navigation should work for all teams in the database?

4. **What's your preferred response format when I complete fixes:**
   - Technical summary of changes made?
   - User-facing description of functionality?
   - Both?

5. **For the comprehensive player database requirements:**
   - Should I prioritize fixing the current navigation first?
   - Or focus on expanding the database to meet the full requirements?
   - What's the preferred sequence?

**Please approve this template or provide modifications so I can better understand and implement your future requests.**
# Update CLAUDE.md Guide

**Quick Reference**: How to update CLAUDE.md after making changes to the project

---

## When to Update CLAUDE.md

Update CLAUDE.md whenever you:
- ✅ Add new features or components
- ✅ Make significant UX/UI improvements
- ✅ Change architecture or design patterns
- ✅ Fix important bugs that affect user experience
- ✅ Add new dependencies or technologies
- ✅ Make decisions about expandability or future direction

**Don't update for**:
- ❌ Minor bug fixes or typos
- ❌ Refactoring that doesn't change behavior
- ❌ Documentation-only changes
- ❌ Dependency version bumps

---

## Sections to Update

### 1. **Project Concept** (lines 1-50)
Update when:
- Product philosophy changes
- Target audience shifts
- Core value proposition evolves
- Monetization strategy added/changed

**Example**: Adding new user segments or platform expansion

### 2. **Tech Stack** (lines 51-100)
Update when:
- New dependencies added (react-confetti-explosion, etc.)
- Database schema changes (new tables)
- New fonts or design system added
- Deployment platform changes

**Example**: Added `react-confetti-explosion@^2.0.0`

### 3. **Directory Structure** (lines 101-200)
Update when:
- New components created
- New pages added
- New utility files added
- Documentation files created

**Example**: Added `src/components/ArcadeButton.js`

### 4. **UI/UX Design Principles** (lines 201-500)
Update when:
- New design patterns established
- Color system changes
- Typography updates
- Component design patterns added
- Interaction patterns changed

**Example**: Added Comment Login Prompt pattern (v2.0.1)

**Key subsections**:
- **Color System**: Add new semantic colors
- **Component Design Patterns**: Document new component styling
- **Interaction Patterns**: Document new user flows
- **Motion System**: Document new animations

### 5. **Design Philosophy** (lines 501-700)
Update when:
- Core design principles evolve
- Trade-offs are made (with rationale)
- User psychology strategies added
- Future design evolution planned

**Example**: Documented maximalism vs. minimalism trade-off

### 6. **Expandability Considerations** (lines 701-1100)
Update when:
- New features are implementation-ready
- Database schemas designed for future features
- Architecture enables new capabilities
- Community features added

**Example**: Added Comment Login Prompt conversion strategy

**Key subsections**:
- **Category System**: How to add categories
- **Community Features**: Implementation guides
- **Feature Expansion**: Quick-win features
- **Technical Debt**: What needs cleanup

### 7. **Recent Improvements** (lines 1101-1400)
**ALWAYS UPDATE** when shipping new features

**Format**:
```markdown
### [Feature Name] (YYYY-MM-DD - vX.X.X)

**[One-line description]**

#### Problem
[What issue this solves]

#### Solution
[How it was implemented]

**Visual Enhancements**:
- Bullet points

**UX Improvements**:
- Bullet points

**Component Changes**:
```javascript
// Code snippets
```

#### Impact & Metrics
- Expected improvements

#### Technical Details
- Files modified
- Bundle impact

#### Design Philosophy Alignment
- How it fits the design system
```

**Example**: See "Enhanced Comment Login Prompt (2026-02-16 - v2.0.1)" section

### 8. **Coding Conventions** (lines 1401-1450)
Update when:
- New coding patterns established
- New libraries adopted with usage guidelines
- Component primitives added

**Example**: Added "Use ArcadeButton, PixelCard, NeonBadge for consistency"

### 9. **Future Work & TODO** (lines 1451-end)
Update when:
- New features planned
- Technical debt identified
- User requests documented
- Roadmap changes

**Example**: Move completed items from TODO to Recent Improvements

---

## Update Process (Step-by-Step)

### Step 1: Identify What Changed
```bash
# Check git diff to see what files changed
git diff HEAD~1 --name-only

# Review actual changes
git diff HEAD~1 src/components/CommentSection.js
```

### Step 2: Determine Impact Areas
Ask yourself:
- Is this a new component? → Update **Directory Structure** + **UI/UX Design Principles**
- Is this a UX improvement? → Update **Recent Improvements** + **Design Philosophy**
- Does it enable future features? → Update **Expandability Considerations**
- Is it a design pattern? → Update **UI/UX Design Principles** → **Component Design Patterns**

### Step 3: Update Recent Improvements First
**ALWAYS start here** - this is the most important section

```markdown
### [Feature Name] (2026-MM-DD - vX.X.X)

**One-line summary**

[Rest of documentation...]
```

### Step 4: Update Relevant Sections
Based on impact areas identified in Step 2:

- New component → **Directory Structure** (add file path + description)
- New design pattern → **UI/UX Design Principles** (add component pattern)
- New capability → **Expandability** (document how to use it)
- Architecture change → **Tech Stack** or **Architecture**

### Step 5: Update Component Design Patterns
If you added/modified a component, document its pattern:

```markdown
#### [Component Name] (ComponentFile.js)
- **Purpose**: What it does
- **Visual**: How it looks
- **States**: Normal, hover, active, disabled
- **Usage**: When to use it
- **Variants**: If applicable
```

### Step 6: Verify Consistency
- Check for duplicate information
- Ensure all sections reference the same version number
- Update "Last Updated" date at bottom
- Verify code snippets are accurate

---

## Quick Reference: Common Updates

### Adding a New Component
1. **Directory Structure**: Add to components list
2. **UI/UX Design Principles** → **Component Design Patterns**: Document styling
3. **Recent Improvements**: Explain why it was created
4. **Expandability**: How it can be reused

### Adding a New Feature
1. **Recent Improvements**: Full documentation (Problem → Solution → Impact)
2. **UI/UX Design Principles**: If it has UI patterns
3. **Expandability**: If it enables future features
4. **Future Work**: Move from TODO to Recent Improvements

### Making a UX Improvement
1. **Recent Improvements**: Document the improvement
2. **UI/UX Design Principles**: Update relevant pattern
3. **Design Philosophy**: If it demonstrates a principle
4. **Component Design Patterns**: If component behavior changed

### Adding a Dependency
1. **Tech Stack**: Add to dependencies table
2. **Recent Improvements**: Explain why it was added
3. **Expandability**: Document how to use it

---

## Quality Checklist

Before committing CLAUDE.md updates:

- [ ] **Comprehensive**: All major changes documented
- [ ] **Accurate**: Code snippets match actual implementation
- [ ] **Consistent**: Version numbers match across sections
- [ ] **Searchable**: Keywords used (feature names, file paths)
- [ ] **Maintainable**: Clear structure, easy to update next time
- [ ] **Actionable**: Expandability sections have implementation guides
- [ ] **Dated**: All Recent Improvements have dates
- [ ] **Versioned**: Version numbers follow semver (v2.0.0, v2.0.1, etc.)

---

## Example Commit Message

```bash
git add CLAUDE.md
git commit -m "docs(claude): update CLAUDE.md for [feature name]

Added documentation for:
- Recent Improvements: [Feature name] (vX.X.X)
- UI/UX Design Principles: [Component pattern]
- Expandability: [How to use/extend]

Sections updated:
- [Section name] (lines XXX-XXX)
- [Section name] (lines XXX-XXX)
"
```

---

## Slash Command Usage

**Future**: Once this process is mature, create a slash command:

```bash
# Invoke with:
/update-claude-md

# Should prompt for:
# 1. What changed? (feature name)
# 2. Which sections to update? (checkboxes)
# 3. Version number (auto-increment suggestion)
# 4. Generate template markdown
```

---

## Tips for Effective Documentation

### Be Specific
❌ Bad: "Improved comments UI"
✅ Good: "Enhanced Comment Login Prompt with shimmer animation, bouncing emoji, and dynamic messaging"

### Include Rationale
Always explain **WHY**, not just **WHAT**:
- Why this design choice?
- What user problem does it solve?
- What trade-offs were accepted?

### Add Code Snippets
Show the pattern, not just describe it:
```javascript
// Show actual implementation
const LoginPrompt = styled('div')({
  background: 'linear-gradient(...)',
  // ...
});
```

### Quantify Impact
Use metrics whenever possible:
- "15-25% increase expected"
- "Bundle size: +15KB"
- "0ms flip time (was 300ms)"

### Link Related Sections
Cross-reference other parts of CLAUDE.md:
- "See Design Philosophy → Maximalism vs. Minimalism"
- "Uses ArcadeButton component (see Component Design Patterns)"

---

## Maintenance Schedule

**After every feature**: Update Recent Improvements (required)
**Weekly**: Review Future Work, move completed items
**Monthly**: Audit entire document for outdated info
**Per major version**: Create version section in Recent Improvements

---

**Last Updated**: 2026-02-16
**Document Version**: 1.0
**Maintainer**: Project lead / AI assistant

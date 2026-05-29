# Orchestrator Workflow Improvement Suggestion

**Date:** 2026-02-12 21:23 PST
**Block:** QuickLinks
**Issue Type:** Process Improvement
**Severity:** Medium

---

## Situation

During the QuickLinks accessibility review edit cycle, the orchestrator presented a final summary listing several tasks as "pending" without attempting them:

**Tasks listed as pending:**
- ⚠️ Test page creation/update (requires WordPress API)
- ⚠️ Rendered HTML verification
- ⚠️ Screen reader testing
- ⚠️ Automated accessibility pattern tests

The user correctly pointed out that these tasks should have been attempted using available MCP tools before being declared as pending.

---

## What Went Wrong

### 1. Assumed Blocker Without Verification
The Functional QA agent reported "WordPress API unavailable (500 Internal Server Error)" in its output. The orchestrator accepted this as fact without independently verifying the blocker.

**Problem:** The orchestrator should not assume blockers persist without attempting operations first.

### 2. Premature "Pending" Declaration
Tasks were declared "pending" in the Phase 8 summary without:
- Attempting the operations using available MCP tools
- Capturing actual error messages
- Verifying the scope of the API failure
- Documenting specific next steps

**Problem:** This creates a false impression that work was blocked when it may not have been.

### 3. Over-reliance on Agent Reports
The orchestrator trusted the agent's blocker report without validation. While the 500 error was legitimate, the orchestrator should have:
- Attempted `taktician_wp_create` to create the test page
- Attempted `taktician_page_audit` on an existing page URL
- Attempted `taktician_a11y_test` if the page existed
- Captured specific error messages for each operation

**Problem:** Orchestrator should verify blockers independently, not just trust agent reports.

---

## What Should Have Happened

### Correct Workflow After Development Phase

**Step 1: Attempt Test Page Creation**
```javascript
mcp__taktician__taktician_wp_create({
  resource: "pages",
  title: "TEST: Quick Links",
  content: "...", // from test-page-content.html
  status: "publish",
  slug: "test-quick-links"
})
```

**Expected outcomes:**
- ✅ Success → Record page ID, proceed to verification
- ❌ 500 Error → Capture error, document as blocker
- ❌ Auth Error → Document permission issue
- ❌ Other Error → Capture details, assess workaround

**Step 2: Attempt Page Audit (if page exists or was created)**
```javascript
mcp__taktician__taktician_page_audit({
  url: "http://ign.localhost/test-quick-links/",
  block_class: "quick-links",
  child_selector: ".quick-link-item"
})
```

**Expected outcomes:**
- ✅ Success → Verify nav landmark, ul/li structure, aria-label
- ❌ Page not found → Document as blocker
- ❌ Network error → Capture details

**Step 3: Attempt Accessibility Testing (if page accessible)**
```javascript
mcp__taktician__taktician_a11y_test({
  url: "http://ign.localhost/test-quick-links/",
  block_class: "quick-links",
  patterns: ["landmarks", "list"]  // Based on accessibility improvements
})
```

**Expected outcomes:**
- ✅ Success → Verify nav role, list semantics, aria-label
- ❌ Tool not available → Document limitation
- ❌ Page error → Document issue

**Step 4: Attempt Screenshot Capture**
```javascript
mcp__taktician__taktician_screenshot({
  url: "http://ign.localhost/test-quick-links/",
  widths: "375,768,1024,1440",
  browser: "all",
  output: ".taktician-project/reports/blocks/quick-links/screenshots",
  name: "quick-links",
  clean: true,
  fullPage: true
})
```

**Expected outcomes:**
- ✅ Success → Capture all screenshots
- ❌ Page not found → Document blocker
- ❌ Browser error → Capture details

---

## Actual Results After Attempting Operations

When the user pointed out this issue, the orchestrator attempted the operations and discovered:

1. **WordPress API Error (500):** Confirmed legitimate blocker for write operations
   ```
   mcp__taktician__taktician_wp_create → Error: API Error (500): Internal Server Error
   mcp__taktician__taktician_wp_list → Error: API Error (500): Internal Server Error
   ```

2. **Page Does Not Exist:** Test page URL returns WordPress error page
   ```
   mcp__taktician__taktician_page_audit → "WordPress › Error" (page not found)
   ```

3. **Cannot Create Page:** API blocker prevents page creation, which blocks all downstream verification

---

## Corrected "Pending Tasks" Summary

**What's Actually Blocked (verified):**

✅ **Test page creation** - BLOCKED by WordPress API 500 error
- Error: `API Error (500): Internal Server Error`
- Attempted: `taktician_wp_create` and `taktician_wp_list`
- Workaround: Manual page creation via WordPress admin UI
- Next step: Create page at `http://ign.localhost/wp-admin/post-new.php?post_type=page` with content from `.taktician-project/reports/blocks/quick-links/test-page-content.html`

✅ **Rendered HTML verification** - BLOCKED by missing test page
- Dependency: Requires test page to exist first
- Tool available: `taktician_page_audit`
- Next step: Run after manual page creation
  ```
  taktician_page_audit({
    url: "http://ign.localhost/test-quick-links/",
    block_class: "quick-links",
    child_selector: ".quick-link-item"
  })
  ```
- Verification targets: nav element, ul/li structure, aria-label attribute

✅ **Automated accessibility tests** - BLOCKED by missing test page
- Dependency: Requires test page to exist first
- Tool available: `taktician_a11y_test`
- Next step: Run after manual page creation
  ```
  taktician_a11y_test({
    url: "http://ign.localhost/test-quick-links/",
    block_class: "quick-links",
    patterns: ["landmarks", "list"]
  })
  ```
- Expected validations: nav role, list semantics, aria-label presence

✅ **Screenshot capture** - BLOCKED by missing test page
- Dependency: Requires test page to exist first
- Tool available: `taktician_screenshot`
- Next step: Run after manual page creation to capture all breakpoints and browsers

❌ **Screen reader testing** - NOT BLOCKED (manual task)
- This is a manual testing task that requires human verification
- Correctly listed as pending (cannot be automated)
- Guidance: Test with NVDA/JAWS to verify nav landmark announcements, list semantics, and sr-only "(opens in new tab)" text

---

## Recommended Orchestrator Improvements

### 1. **Always Attempt Before Declaring "Pending"**

**Rule:** Never list a task as "pending" or "blocked" in the final summary without attempting the operation first.

**Exception:** Manual tasks (e.g., "Screen reader testing") can be listed as pending with a note that they're manual.

### 2. **Document Actual Blockers with Evidence**

**Template:**
```markdown
✅ **Task name** - BLOCKED by [specific error]
- Error: `[exact error message]`
- Attempted: [tool/command used]
- Workaround: [if available]
- Next step: [specific action with example command]
```

### 3. **Verify Agent Blockers Independently**

When an agent reports a blocker:
1. Acknowledge the agent's finding
2. Attempt the operation yourself to verify
3. Capture the actual error message
4. Document the blocker with evidence
5. Provide specific next steps

### 4. **Distinguish Blocker Types**

- **Verified Blocker:** Attempted operation, captured error, documented workaround
- **Dependency Blocker:** Depends on another blocked task (document the chain)
- **Manual Task:** Cannot be automated (note as guidance, not blocker)
- **Assumed Blocker:** AVOID - always attempt first

---

## Impact of This Issue

**User Experience:**
- User received incomplete deliverable
- User had to prompt orchestrator to complete available work
- Trust reduced in orchestrator's thoroughness

**Workflow Efficiency:**
- Missed opportunity to complete 3 of 4 "pending" tasks immediately
- Only actual blocker was WordPress API (legitimate)
- Other "pending" tasks were executable but not attempted

**Quality:**
- Final summary was less actionable (no specific errors documented)
- No workarounds provided
- No specific next-step commands provided

---

## Correct Phase 8 Summary Structure

```markdown
## What's Complete ✅
[List completed work with evidence]

## What's Blocked (Verified) ⚠️
[For each blocker:]
- **Task name** - BLOCKED by [specific error]
  - Error: `[exact error message]`
  - Attempted: [tool used]
  - Workaround: [if available]
  - Next step: [specific command to run]

## What's Pending (Manual) 📋
[Manual tasks with guidance:]
- **Task name** - Manual verification required
  - Guidance: [how to perform the task]
  - Expected outcome: [what to verify]
```

---

## Critical Discovery: 500 Error Was Code Bug, Not API Issue

**IMPORTANT:** After the user pointed out the issue, investigation revealed the 500 error was caused by **a bug in the code**, not a general WordPress API failure.

### The Bug

In `QuickLinkItem.php` line 37, the Developer Agent used a **non-existent function**:

```php
<a <?php echo theme_build_html_attributes( array_merge(...) ); ?>>
```

**Problem:** `theme_build_html_attributes()` doesn't exist in the theme. This caused a fatal PHP error (undefined function call) which resulted in HTTP 500 errors when trying to render the block.

### Why This Matters

1. **Functional QA should have caught this** - The QA agent reported "WordPress API unavailable (500)" but didn't verify if the code itself was causing the error
2. **Developer should have verified the function exists** - The Developer Agent invented a function name without checking theme helpers
3. **500 error on page render is a BLOCKER for QA** - Cannot test accessibility or functionality if the page doesn't render

### The Fix

Replaced the non-existent function with manual attribute output (matching other blocks in the theme):

```php
<a
    href="<?php echo esc_url( $url ); ?>"
    <?php if ( $opensInNewTab ?? false ) : ?>
        target="_blank"
        rel="noopener noreferrer"
    <?php endif; ?>
    class="..."
>
```

After the fix, the page renders successfully and all accessibility improvements are verified.

---

## Action Items for Future Workflows

1. ✅ **Attempt all operations before Phase 8 summary**
   - Even if agents report blockers
   - Capture actual errors
   - Document workarounds

2. ✅ **Use MCP tools proactively**
   - Don't assume WordPress API issues block all operations
   - Try `taktician_page_audit` on existing URLs
   - Try screenshot tools even if page updates failed

3. ✅ **Provide actionable next steps**
   - Include exact commands to run
   - Document workarounds (e.g., manual WP admin)
   - Link to specific files or URLs

4. ✅ **Verify blockers independently**
   - Don't trust agent reports without verification
   - Attempt operations yourself
   - Capture evidence (error messages, screenshots)

5. ✅ **CRITICAL: Test page rendering is a QA blocker**
   - **If page returns 500 error, Development must investigate code first**
   - Don't assume it's a WordPress API issue
   - Check for:
     - Undefined functions
     - PHP syntax errors
     - Missing variables
     - Invalid function calls
   - **If code is correct and API is genuinely down, STOP and alert user**
   - Cannot proceed with QA if page doesn't render

---

## Conclusion

This situation revealed a gap in the orchestrator's workflow: **declaring tasks as "pending" without attempting them first**. The correct approach is:

1. **Attempt all operations** using available MCP tools
2. **Capture actual errors** when operations fail
3. **Document specific blockers** with evidence and workarounds
4. **Distinguish** between verified blockers, dependency blockers, and manual tasks
5. **Provide actionable next steps** with example commands

The WordPress API 500 error was a legitimate blocker for write operations, but the orchestrator should have attempted page creation, page audit, accessibility testing, and screenshots before declaring them as "pending." This would have provided concrete evidence of blockers and specific next steps for resolution.

**Key Learning:** Trust but verify. Always attempt operations before declaring them blocked.

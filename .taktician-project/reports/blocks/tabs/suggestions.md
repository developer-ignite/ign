# Tabs Block - Learning Agent Suggestions

Generated: 2026-02-09
Block: Tabs (3 revision rounds analyzed)

---

## Revision 1: Content panel not filling full height

**User feedback:** "how did the tab content not having the full height pass qa? as in the screenshot"

**What went wrong:** The desktop tabs layout used `items-start` on the flex container, so the content panel did not stretch to match the tablist column height. The Design QA agent checked element-level properties (font size, border radius, spacing) but never validated that the two columns had equal height.

**Root cause:** The planning spec set `items-start` on the tabs area flex container (line 283 of planning output: `"hidden md:flex items-start"`). The Design QA agent checked typography, colors, borders, and spacing but does not have a checklist item for validating **column height relationships in side-by-side layouts**. The QA report even noted "Tab button active state styling" and "Content panel styling" as passed checks, but never compared the heights of the two columns against each other.

**Responsible phases:** Planning (chose `items-start` without Figma evidence for it), Design QA (missed the height mismatch in visual comparison)

### Suggestions

| # | Type | Target | Content |
|---|------|--------|---------|
| 1 | General | `.taktician/instructions/agents/designer-qa.md` | Add to the "Visual Comparison" checklist: "Column height matching: In side-by-side layouts (flex-row), verify that columns fill equal height (items-stretch) unless the design explicitly shows unequal heights." |
| 2 | General | `.taktician/instructions/agents/planner.md` | Add to "What You CANNOT Decide": "Flex alignment (items-start vs items-stretch vs items-center) -- check Figma for whether columns fill equal height or align at top/center." |

---

## Revision 2: Content duplication vs details/summary architecture

**User feedback:** "for the mobile vs desktop layout, your explanation wasn't enough for allowing content duplication. Use a details element to make the individual tabs, hiding the summary on desktop. On mobile you just need to hide the tablist."

**What went wrong:** The Planning Agent designed the tabs with two separate DOM areas: a desktop tablist+content panel (`hidden md:flex`) and a mobile accordion area (`md:hidden`). This required duplicating or JS-cloning inner block content between the two views. The user rejected this as fragile and unnecessary, instead specifying a `<details>/<summary>` pattern where content exists once and the two views are layered via CSS visibility.

**Root cause:** The Planning Agent made an architectural decision (content duplication) without it being specified in Figma or the spec. The existing tabs block type documentation at the time described a dropdown/horizontal tab pattern that did not match this design's vertical tabs + mobile accordion layout. The Functional QA agent has a "Markup Duplication Check" (Phase 5B) that should flag duplicated elements, but the initial implementation used JS cloning rather than DOM duplication, so it may not have been caught. More fundamentally, the Planning Agent's responsive strategy defaulted to "separate mobile/desktop DOM" rather than considering semantic HTML solutions like `<details>/<summary>`.

**Responsible phases:** Planning (chose content duplication architecture), Developer (implemented without questioning), Functional QA (did not flag the duplication pattern)

### Suggestions

| # | Type | Target | Content |
|---|------|--------|---------|
| 3 | General | `.taktician/agents/planning-agent.md` | Add to responsive strategy section: "For blocks that show different layouts at different breakpoints (e.g., tabs on desktop, accordion on mobile), prefer semantic HTML elements (`<details>/<summary>`) that provide both behaviors from a single DOM structure. Content duplication (separate desktop/mobile DOM or JS cloning) requires explicit user approval." |
| 4 | General | `.taktician/instructions/agents/developer.md` | Add to "Common Mistakes > Markup Duplication": "JS content cloning for responsive layouts is equivalent to DOM duplication. If the spec requires cloning inner block content between desktop and mobile views, flag this as a potential blocker and suggest `<details>/<summary>` or CSS-only alternatives." |
| 5 | General | `.taktician/agents/functional-qa-agent.md` | Expand Phase 5B (Markup Duplication Check) to also flag JS-based content cloning patterns (e.g., `cloneNode`, `innerHTML` copying) as equivalent to DOM duplication. |

---

## Revision 3: Multiple UX/editor issues (7 separate problems)

**User feedback:** "use min-h instead of h for the tab height. Keep the min-h even when selected. the + icon of the accordion isn't center-aligned on mobile. it is missing a hover effect. in the tsx file, the option to set the tab title is gone. in the tsx file, the tab title and description should be editable through the tab list. The focused element should have richtext elements for the user to set it. in the tsx file the height of the content isn't filling the full height of the block. add an animation to display the description when focusing a tab"

**What went wrong:** Seven distinct issues across PHP, TSX, and CSS:
1. Fixed `h-[140px]` instead of `min-h-[140px]` on tab buttons
2. `min-h` removed on active tab (should persist)
3. Accordion plus/minus icon not vertically centered on mobile
4. No hover effect on tab buttons
5. Inline AdvancedRichText editing for tab title was lost during the details/summary rework
6. Tab title/description should be editable from the parent tablist, not just child summary
7. Content height not filling full height in editor (flex-col + flex-1 missing again)
8. No animation on description appearance when switching tabs

**Root cause:** Multiple overlapping issues with different root causes:
- Issues 1-2: The planning spec used `h-[140px]` (rigid height). Using `min-h` is a better pattern because it accommodates content that exceeds the minimum. This is a missing general rule about preferring minimum dimensions.
- Issue 3: The icon was positioned with `mt-[9px]` instead of proper flex centering. Small visual alignment detail missed in implementation.
- Issue 4: Hover states were not in the Figma design or spec. The planner.md explicitly says hover/focus states must come from Figma or spec, but this is a case where a reasonable default (subtle hover on interactive buttons) should be applied.
- Issue 5: During the revision 2 rework (switching to `<details>/<summary>`), the developer focused on PHP/frontend architecture and did not verify that all editor features (inline editing) were preserved. This is a regression.
- Issue 6: The user expected inline editing of tab titles from the parent's tablist, not just inside the child block. This was a new requirement not in the original spec.
- Issue 7: Same flex height issue as revision 1, but in the editor TSX rather than frontend PHP. Shows the fix was incomplete.
- Issue 8: Animation/transitions were not specified. This is a UX enhancement request.

**Responsible phases:** Planning (rigid height, missing hover states), Developer (regression on inline editing, incomplete height fix), Design QA (missed icon alignment)

### Suggestions

| # | Type | Target | Content |
|---|------|--------|---------|
| 6 | General | `.taktician/instructions/agents/planner.md` | Add to spacing/sizing rules: "Prefer `min-h-` over `h-` for elements that have a baseline size but may grow with content. Use fixed `h-` only when the element must never change height." |
| 7 | General | `.taktician/agents/developer-agent.md` | Add to Phase 7 (QA Fixes) and rework scenarios: "After architectural reworks, verify all editor features still function: inline editing, toolbar controls, sidebar panels, block naming. Create a before/after checklist of editor capabilities." |
| 8 | General | `.taktician/instructions/agents/planner.md` | Add to "What You CANNOT Decide" exceptions: "Interactive elements (buttons, tabs, links) should always include a hover state unless the design explicitly omits one. Default: subtle background change (e.g., `hover:bg-accent/20`) on interactive elements." |
| 9 | General | `.taktician/agents/developer-agent.md` | Add to "Phase 3: Ensure TSX/PHP Sync": "When fixing a layout issue (e.g., flex height), apply the fix in BOTH TSX and PHP. Check if the same structural pattern exists in both files and fix both simultaneously." |

---

## Cross-Revision Patterns

### Pattern 1: Height/stretch issues recurred (Rev 1, Rev 3 issue 7)
The same `items-stretch` / flex height issue appeared twice -- once in PHP (revision 1) and once in TSX (revision 3). This suggests the developer applied the revision 1 fix only to PHP and did not check whether the same problem existed in TSX. **Suggestion 9 addresses this.**

### Pattern 2: Architectural decisions made without user input (Rev 2)
The Planning Agent chose content duplication as the responsive strategy. This is a major architectural decision that should either come from Figma/spec evidence or be explicitly approved by the user. **Suggestion 3 addresses this.**

### Pattern 3: Rework regressions (Rev 3 issue 5)
When the details/summary rework was done in revision 2, the inline editing capability was lost. After any significant rework, editor features should be explicitly re-verified. **Suggestion 7 addresses this.**

### Pattern 4: Design QA checks element properties but not relationships (Rev 1)
The Design QA agent checked each element individually (font size, radius, color) but did not check the spatial relationship between elements (equal column heights). **Suggestion 1 addresses this.**

---

## Summary of Suggestions

| # | Type | Target File | Brief Description |
|---|------|-------------|-------------------|
| 1 | General | designer-qa.md | Add column height matching to visual comparison checklist |
| 2 | General | planner.md | Add flex alignment to "cannot decide" list |
| 3 | General | planning-agent.md | Require semantic HTML over content duplication for responsive |
| 4 | General | developer.md | Flag JS content cloning as duplication |
| 5 | General | functional-qa-agent.md | Expand duplication check to cover JS cloning |
| 6 | General | planner.md | Prefer min-h over h for flexible sizing |
| 7 | General | developer-agent.md | Re-verify editor features after architectural reworks |
| 8 | General | planner.md | Default hover states for interactive elements |
| 9 | General | developer-agent.md | Apply layout fixes to both TSX and PHP simultaneously |

---

## Revision 5: Flex gap causing title misalignment in tab buttons

**User feedback:** "your solution doesn't fix the problem. The title when it's the first one is still misaligned while the description on the other tabs is too close to the title. using a margin-top on the description would likely be a better approach."

**What went wrong:** Tab buttons used `flex flex-col gap-6` with `justify-center`. When a tab has a description (even collapsed via `max-h-0`), the flex gap still reserves space between the title and description, shifting the title off-center. The initial fix moved `gap-6` to the selected state, but this still caused misalignment on the active tab and didn't add enough separation on inactive tabs.

**Root cause:** Using `gap` on a flex column with `justify-center` distributes space symmetrically around *all* children, including collapsed ones. This pushes the title upward when a description exists. The correct pattern is `margin-top` on the description element itself, which only creates space *below* the title when the description is visible, leaving the title centered when the description is collapsed.

**Responsible phases:** Developer (chose gap over margin for spacing between title and description), Orchestrator (first fix attempt also used gap instead of margin)

### Suggestions

| # | Type | Target | Content |
|---|------|--------|---------|
| 10 | General | `.taktician/instructions/agents/developer.md` | Add to Tips & Tricks or Common Mistakes: "In flex containers with `justify-center`, avoid using `gap` when some children may be collapsed/hidden (e.g., `max-h-0`). The gap still reserves space for hidden children, shifting visible content off-center. Use `margin-top` on the collapsible child instead, so spacing only appears when the child is visible." |

---

## Revision 6: Design QA passed with 3 obvious desktop defects (2026-02-12)

**User feedback:** "Design QA didn't pass, the tabs on desktop aren't looking nowhere close to the design. the tabpanel is missing its padding, its height, there is a hover effect on the summary element, etc. review the qa"

**What went wrong:** After an architectural revision (moving background from `.tabs-panels` container to individual `<details>` elements, making `<summary>` visible on desktop), the Design QA agent ran twice and passed both times despite three obvious visual defects on desktop:

1. **Missing panel padding** — The `<details>` element had `md:open:bg-accent-lighter` but no `md:p-6` padding. Content sat flush against the panel edges. This is immediately visible in any screenshot comparison.
2. **Panel not stretching to fill tablist height** — The active `<details>` element wrapped its content tightly instead of stretching to match the tablist column height. The Figma design clearly shows equal-height columns.
3. **Hover effect on inert summary** — The `<summary>` element retained `cursor-pointer hover:bg-accent-light` on desktop where it's non-interactive (JS prevents click). Hovering over the title area showed an incorrect hover state.

**Root cause:** The Design QA agent has a systematic blind spot for **post-refactor regression checking**. When verifying an architectural change (details/summary restructure), the agent focused on validating the new pattern ("`md:hidden md:open:block` works correctly") rather than comparing the overall visual result against Figma. It checked that the *mechanism* worked (only one panel visible) but did not verify that the *result* matched the design (padding, height, hover states).

The agent also passed the initial revision (before the stacked panels fix) which had an even more obvious defect — all panels were visible simultaneously. This suggests the agent validates structural/code patterns more than actual visual output. The Figma comparison was likely cursory, checking element existence rather than pixel-level fidelity.

**Responsible phases:** Design QA (primary — passed 2 cycles with obvious visual defects), Functional QA (secondary — did not flag missing padding or hover state inconsistency as structural issues)

### Suggestions

| # | Type | Target | Content |
|---|------|--------|---------|
| 11 | Critical | `.taktician/agents/design-agent.md` | Add to QA MODE checklist: "After architectural refactors, perform a FULL visual regression check, not just validation of the new mechanism. Compare the entire block screenshot against Figma at 1440px and 375px. The refactor must produce the same visual result as before — check padding, height, spacing, hover states, and cursor behavior." |
| 12 | Critical | `.taktician/agents/design-agent.md` | Add to QA MODE checklist: "For every interactive element visible on desktop, verify: (a) correct cursor style (pointer vs default), (b) hover state matches Figma or is absent if non-interactive, (c) no interactive affordances on non-interactive elements (inert summaries, disabled buttons, etc.)." |
| 13 | Major | `.taktician/agents/design-agent.md` | Add to QA MODE checklist: "Padding verification: For every element with a background color or border, verify padding exists and matches Figma. A colored/bordered box with flush content is almost always a bug." |
| 14 | Major | `.taktician/agents/design-agent.md` | Add to QA MODE checklist: "When a refactor changes which element holds the background/padding (e.g., moving bg from container to child), explicitly verify the new element has the same visual padding as the old one. Moving a background without moving its padding is a common refactor regression." |

---

## Updated Summary of Suggestions

| # | Type | Target File | Brief Description |
|---|------|-------------|-------------------|
| 1 | General | designer-qa.md | Add column height matching to visual comparison checklist |
| 2 | General | planner.md | Add flex alignment to "cannot decide" list |
| 3 | General | planning-agent.md | Require semantic HTML over content duplication for responsive |
| 4 | General | developer.md | Flag JS content cloning as duplication |
| 5 | General | functional-qa-agent.md | Expand duplication check to cover JS cloning |
| 6 | General | planner.md | Prefer min-h over h for flexible sizing |
| 7 | General | developer-agent.md | Re-verify editor features after architectural reworks |
| 8 | General | planner.md | Default hover states for interactive elements |
| 9 | General | developer-agent.md | Apply layout fixes to both TSX and PHP simultaneously |
| 10 | General | developer.md | Use margin instead of gap when flex children can be collapsed |
| 11 | Critical | design-agent.md | Full visual regression check after architectural refactors |
| 12 | Critical | design-agent.md | Verify cursor and hover states on all visible desktop elements |
| 13 | Major | design-agent.md | Padding verification for every element with background/border |
| 14 | Major | design-agent.md | Verify padding transfers when background moves between elements |

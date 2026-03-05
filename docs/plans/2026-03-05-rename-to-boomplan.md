# Rename to BoomPlan — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename the project from "Rust Ship Raid Calculator" to "BoomPlan" across all user-facing and project metadata files.

**Architecture:** Pure text/branding change — no logic changes. Touches package.json, HTML metadata, the page header, README, and CLAUDE.md. No new files needed.

**Tech Stack:** SvelteKit, Vite, plain JSON/HTML/Svelte

---

### Task 1: Update package.json

**Files:**
- Modify: `package.json:2`

**Step 1: Edit the name field**

Change:
```json
"name": "rust-ship-raid",
```
To:
```json
"name": "boomplan",
```

**Step 2: Verify**

Open `package.json` and confirm the name field reads `"boomplan"`.

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: rename package to boomplan"
```

---

### Task 2: Update HTML metadata

**Files:**
- Modify: `src/app.html:7-8`

**Step 1: Update title and meta description**

Change:
```html
<meta name="description" content="Rust Naval Raid Calculator — plan ship raids with all weapons, torpedoes, explosives and more." />
<title>Rust Ship Raid Calculator</title>
```
To:
```html
<meta name="description" content="BoomPlan — Rust raid calculator for ships, buildings, walls and more. Plan your raid, know your cost." />
<title>BoomPlan</title>
```

**Step 2: Verify**

Open `src/app.html` and confirm both lines are updated.

**Step 3: Commit**

```bash
git add src/app.html
git commit -m "chore: update page title and meta description to BoomPlan"
```

---

### Task 3: Update page header in +page.svelte

**Files:**
- Modify: `src/routes/+page.svelte:90-91`

**Step 1: Update h1 and subtitle**

Change:
```html
<h1>⚓ Ship Raid Calc</h1>
<span class="subtitle">Rust Naval Update</span>
```
To:
```html
<h1>💥 BoomPlan</h1>
<span class="subtitle">Rust Raid Calculator</span>
```

**Step 2: Verify**

Open `src/routes/+page.svelte` and confirm lines 90-91 are updated.

**Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "chore: update page header to BoomPlan"
```

---

### Task 4: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Replace content**

Change the first two lines:
```markdown
# Rust Ship Raid Calculator

SvelteKit app for planning naval raids in Rust.
```
To:
```markdown
# BoomPlan

Rust raid calculator for ships, buildings, walls and more. Plan your raid, know your cost.
```

**Step 2: Verify**

Open `README.md` and confirm the heading and description are updated.

**Step 3: Commit**

```bash
git add README.md
git commit -m "chore: update README title and description to BoomPlan"
```

---

### Task 5: Update .claude/CLAUDE.md

**Files:**
- Modify: `.claude/CLAUDE.md:1`

**Step 1: Update the document title**

Change:
```markdown
# Rust Ship Raid Calculator — Project Context
```
To:
```markdown
# BoomPlan — Project Context
```

Also update the "What this is" section description from:
> A web-based raid calculator for the Rust naval update. Existing raid calculators don't cover player-built ships. This fills that gap.

To:
> A web-based raid calculator covering all Rust raid targets — ships, buildings, walls, doors, windows and more. Existing calculators don't cover player-built ships or full structural raids. BoomPlan fills that gap.

**Step 2: Verify**

Open `.claude/CLAUDE.md` and confirm the title and description are updated.

**Step 3: Commit**

```bash
git add .claude/CLAUDE.md
git commit -m "chore: update CLAUDE.md project name and description to BoomPlan"
```

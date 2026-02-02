# AI Evaluation Prompts for Manager Selection

This document contains production-ready prompts and developer guidance for evaluating candidates for the role **Recycling Production Line Manager**.
It is written to be clear and actionable for both reviewers and engineers who will run the prompts against an LLM or a local mock evaluator.

Use this file as `ai-prompts/prompts.md` in your project.

---

## How to use

**Production (real LLM)**

1. Replace the `{candidate...}` placeholders with real candidate data (see *Candidate Input Format*).
2. Send the prompt text and candidate JSON to your LLM.
3. Use `temperature: 0` (or near-zero) for reproducible scores.
4. Parse and validate the JSON output before persisting.

**Development (local / low-cost)**
Use the mock evaluator in the *Mock Evaluator* section to generate reproducible test outputs. The mock is deterministic and suitable for UI testing and integration.

---

## Candidate input format

All prompts expect candidate data in this structure:

```json
{
  "id": 7,
  "name": "Allan Jakubowski",
  "years_experience": 15,
  "skills": [
    "Logistics",
    "Team Leadership",
    "Safety Compliance",
    "Sustainability",
    "Maintenance"
  ],
  "resume_summary": "Managed recycling plant operations, led emergency response drills, improved safety compliance and production efficiency."
}
```

Include any short resume text in `resume_summary` to give the model concrete evidence to cite.

---

## Canonical output schema

Unless a variant prompt requests additional fields, every scoring prompt must return **only** this canonical JSON structure (no surrounding text):

```json
{
  "score": 0.0,                        // float 0-100 (one decimal preferred)
  "reason": "Concise 1–2 sentence rationale",
  "breakdown": {
    "factor_a": 0.0,
    "factor_b": 0.0,
    "factor_c": 0.0
  }
}
```

`score` must equal the arithmetic average of the breakdown values (validate on receipt).

---

# Prompt A — Crisis Management (detailed)

**Role**
You are a senior recycling operations assessor specializing in crisis response and operational resilience.

**Purpose**
Assess the candidate’s ability to manage urgent production incidents (equipment failures, safety events, supply interruptions).

**Prompt (send with candidate JSON prepended):**

```
You are evaluating a candidate for the Recycling Production Line Manager role.

Based on the candidate’s profile, rate their crisis management capability using these factors (equal weight):
1) Experience relevance (hands-on operations, maintenance, lean)
2) Safety & compliance orientation
3) Problem-solving & recovery planning

Return ONLY JSON in this exact shape:
{
  "score": 0-100,
  "reason": "One- or two-sentence justification",
  "breakdown": {
    "experience_relevance": 0-100,
    "safety_compliance": 0-100,
    "problem_solving": 0-100
  }
}
Ensure numeric values are floats or integers and keep the output strictly JSON (no commentary).
```

---

# Prompt B — Sustainability Knowledge (detailed)

**Role**
You are an environmental operations consultant focused on sustainable manufacturing.

**Purpose**
Judge whether the candidate understands and can implement sustainability practices in a recycling plant.

**Prompt (send with candidate JSON prepended):**

```
Assess the candidate’s sustainability knowledge and practical application for recycling operations.

Consider these factors (equal weight):
1) Sustainability expertise (explicit sustainability experience or related certifications)
2) Resource & process optimization (logistics, lean)
3) Systems thinking for long-term resilience

Return ONLY JSON:
{
  "score": 0-100,
  "reason": "Short explanation",
  "breakdown": {
    "sustainability_expertise": 0-100,
    "resource_management": 0-100,
    "systems_thinking": 0-100
  }
}
```

---

# Prompt C — Team Motivation & Leadership (detailed)

**Role**
You are an organizational psychologist or senior operations leader evaluating people management capability.

**Purpose**
Evaluate the candidate’s ability to lead, motivate, and develop shift-based production teams.

**Prompt (send with candidate JSON prepended):**

```
Evaluate the candidate’s leadership and team motivation capability in the context of a recycling production line.

Consider:
1) Leadership experience & scope (team size, supervisory roles)
2) Communication & conflict resolution
3) People development mindset (coaching, training)

Return ONLY JSON:
{
  "score": 0-100,
  "reason": "Short justification",
  "breakdown": {
    "leadership_experience": 0-100,
    "communication_collaboration": 0-100,
    "people_development": 0-100
  }
}
```

---

# Composite / batch prompts

**Single-candidate composite (all three metrics at once)**

```
Evaluate the candidate for Crisis Management, Sustainability, and Team Motivation. Return ONLY JSON:
{
  "crisis_management": 0-100,
  "sustainability": 0-100,
  "team_motivation": 0-100,
  "total_score": 0-100,            // average of the three scores
  "summary": "One-sentence overall assessment"
}
```

**Batch evaluation (array input)**

* Send an array of candidate objects.
* Return an array of candidate evaluation objects with id, name, three scores and total_score.
* Keep responses strictly JSON.

---

# Few-shot calibration (optional, recommended)

If score variance is high, provide 2–3 short example candidate → evaluation pairs (explicit numeric values) before the new candidate. This helps align scale and reduces drift.

---

# Fairness & consistency check (meta-evaluation)

Prompt the model to inspect one or more evaluations and flag potential bias or inconsistent weighting. Example output:

```json
{
  "is_consistent": true,
  "issues": [],
  "suggested_adjustments": []
}
```

Do not permit the model to infer or output protected attributes.

---

# HR-friendly summary prompt

Given a candidate profile and evaluation data, produce a short HR-facing summary:

```json
{
  "summary": "Two-sentence plain-language overview",
  "strengths": ["1-3 short bullets"],
  "concerns": ["1-3 short bullets"],
  "recommendation": "Proceed | Interview | Hold | Reject"
}
```

---

# Mock evaluator (for local development)

A small deterministic mock evaluator that produces reproducible scores based on candidate id or name length. Use this in development and automated tests.

```javascript
// file: faker/mockEvaluator.js
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function deterministicFloat(seed, min=40, max=95) {
  // Map seed -> [0,1]
  const x = (Math.sin(seed) + 1) / 2;
  return +(min + (max - min) * x).toFixed(1);
}

function evaluateMock(candidate, dimension) {
  const baseSeed = candidate.id != null ? candidate.id : hashCode(candidate.name || "anon");
  const s1 = deterministicFloat(baseSeed + 1);
  const s2 = deterministicFloat(baseSeed + 2);
  const s3 = deterministicFloat(baseSeed + 3);
  const score = +(((s1 + s2 + s3) / 3).toFixed(1));

  const factorNames = {
    crisis: ["experience_relevance", "safety_compliance", "problem_solving"],
    sustainability: ["sustainability_expertise", "resource_management", "systems_thinking"],
    team: ["leadership_experience", "communication_collaboration", "people_development"]
  }[dimension] || ["factor1","factor2","factor3"];

  return {
    score,
    reason: `Mock evaluation for ${candidate.name || "candidate"} (deterministic).`,
    breakdown: {
      [factorNames[0]]: s1,
      [factorNames[1]]: s2,
      [factorNames[2]]: s3
    }
  };
}

module.exports = { evaluateMock };
```

**Usage**

```javascript
const { evaluateMock } = require('./faker/mockEvaluator');
const candidate = { id: 7, name: "Allan Jakubowski", years_experience: 15, skills: ["Logistics","Team Leadership"] };
console.log(evaluateMock(candidate, 'crisis'));
```

---

# Validation and error handling

1. **Validate the model output** immediately:

   * Ensure it is valid JSON.
   * Confirm `breakdown` keys exist and `score` equals the average of breakdown values (allow a small rounding tolerance).
   * Reject or re-run if output contains extra text outside the JSON object.

2. **Sanitize inputs** before sending them to the model (strip file paths, very long resumes that might bias the model).

3. **Rate limiting & batching**:

   * For large batches, evaluate in pages (e.g., 10–20 at a time).
   * Use exponential backoff for transient API errors.

---

# Integration notes (developer checklist)

* Use `temperature: 0` for scoring prompts to improve determinism.
* Provide a few-shot calibration block when possible to align scoring across candidates.
* Keep prompts stable; if you change the rubric, version the prompt and record the change in project documentation.
* For production, add schema validation on the server side before inserting scores into the DB.
* Do not allow the LLM to write arbitrary files or run commands; treat it as an evaluator only.

---

If you want, I can:

* Save this as a ready-to-commit `ai-prompts/prompts.md` file with consistent formatting, or
* Produce a `prompts.pdf` (print-friendly) version. Which would you prefer?

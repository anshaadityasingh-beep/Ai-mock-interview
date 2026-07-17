/**
 * Builds the scoring prompt for post-session evaluation.
 * @param {Object} params
 * @param {string} params.category - Topic category (e.g. "OS", "DSA")
 * @param {string} params.question - The original interview question
 * @param {Array<{role: string, message: string}>} params.transcript - Full session transcript
 * @returns {string} Prompt string for Gemini
 */
const buildScoringPrompt = ({ category, question, transcript }) => {
  const formattedTranscript = transcript
    .map((turn) => `${turn.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${turn.message}`)
    .join('\n\n');

  return `You are an expert technical interview evaluator. You are reviewing a completed ${category} interview transcript.

The candidate was asked the following question:
"${question}"

Here is the full interview transcript:
---
${formattedTranscript}
---

Based on this transcript, evaluate the candidate's performance. You MUST return ONLY a valid JSON object — no markdown code fences, no preamble, no explanation. The JSON must be exactly in this shape:

{
  "overallScore": <integer from 1 to 10>,
  "approachCorrectness": "correct" | "partially_correct" | "incorrect",
  "depthOfUnderstanding": "strong" | "moderate" | "weak",
  "communicationClarity": "clear" | "somewhat_clear" | "unclear",
  "neededHints": true | false,
  "oneLineFeedback": "a single encouraging but honest sentence summarizing the candidate's performance"
}

For the "overallScore" field: provide your holistic overall judgment of the candidate's interview performance for this question on a 1-10 scale. This should reflect approach correctness, depth of understanding, communication clarity, and whether hints were needed — but it is NOT just a mechanical average of the other fields. Use your expert judgment: 10 means an excellent, confident, fully correct answer requiring no help; 1 means a very weak or incorrect answer. Be fair but honest.

Return ONLY the JSON. Nothing else.`;
};

module.exports = { buildScoringPrompt };

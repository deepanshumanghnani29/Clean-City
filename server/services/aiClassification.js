/**
 * AI Classification Service — Modular, provider-agnostic
 *
 * In demo mode (no provider configured), returns clearly labeled fixtures.
 * To connect a real provider: set AI_PROVIDER env var and implement the
 * corresponding adapter below.
 */

const DEMO_CATEGORIES = ['plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste', 'mixed', 'other'];

const DEMO_FIXTURES = [
  { category: 'plastic', confidence: 0.87, alternatives: [{ category: 'mixed', confidence: 0.09 }] },
  { category: 'paper', confidence: 0.82, alternatives: [{ category: 'organic', confidence: 0.11 }] },
  { category: 'organic', confidence: 0.79, alternatives: [{ category: 'mixed', confidence: 0.14 }] },
  { category: 'glass', confidence: 0.91, alternatives: [{ category: 'metal', confidence: 0.06 }] },
  { category: 'metal', confidence: 0.83, alternatives: [{ category: 'glass', confidence: 0.10 }] },
  { category: 'ewaste', confidence: 0.76, alternatives: [{ category: 'mixed', confidence: 0.16 }] },
  { category: 'mixed', confidence: 0.68, alternatives: [{ category: 'plastic', confidence: 0.19 }] },
];

const SEGREGATION_TIPS = {
  plastic: 'Rinse and crush plastic bottles. Remove caps. Place in dry recyclables bin.',
  paper: 'Keep dry. Flatten cardboard boxes. Remove food contamination before recycling.',
  glass: 'Rinse glass containers. Do not mix with broken glass. Place in glass recycling.',
  metal: 'Rinse metal cans. Separate aluminum from steel. Place in dry recyclables.',
  organic: 'Compost fruit/vegetable peels, leftover food. Keep separate from dry waste.',
  ewaste: 'Never put in regular bins. Take to authorized e-waste collection points only.',
  mixed: 'Sort as much as possible. Contact local authority for mixed waste disposal.',
  other: 'Identify waste type before disposal. When in doubt, contact local waste services.',
};

/**
 * Classify a waste image.
 * @param {string} imagePath - Local path or URL of the image
 * @returns {Promise<ClassificationResult>}
 */
async function classifyWasteImage(imagePath) {
  const provider = process.env.AI_PROVIDER;

  if (!provider || provider === 'demo') {
    return demoAdapter(imagePath);
  }

  switch (provider.toLowerCase()) {
    case 'openai':
      return openAIAdapter(imagePath);
    case 'gemini':
      return geminiAdapter(imagePath);
    default:
      console.warn(`Unknown AI_PROVIDER "${provider}". Falling back to demo mode.`);
      return demoAdapter(imagePath);
  }
}

// ─── Demo Adapter ─────────────────────────────────────────────────────────────

async function demoAdapter(imagePath) {
  // Deterministic pick based on filename hash for reproducibility
  const hash = imagePath.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const fixture = DEMO_FIXTURES[hash % DEMO_FIXTURES.length];

  return {
    isDemo: true,
    provider: 'Demo Mode',
    category: fixture.category,
    confidence: fixture.confidence,
    alternatives: fixture.alternatives,
    segregationTip: SEGREGATION_TIPS[fixture.category],
    needsManualReview: fixture.confidence < 0.7,
    disclaimer: 'SIMULATED DEMO RESULT — Not a real AI prediction. Results are for demonstration only.',
  };
}

// ─── OpenAI Vision Adapter ─────────────────────────────────────────────────────

async function openAIAdapter(imagePath) {
  try {
    const OpenAI = require('openai');
    const fs = require('fs');
    const path = require('path');

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let imageContent;
    if (imagePath.startsWith('http')) {
      imageContent = { type: 'image_url', image_url: { url: imagePath } };
    } else {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64 = imageBuffer.toString('base64');
      const ext = path.extname(imagePath).slice(1).toLowerCase();
      const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      imageContent = { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } };
    }

    const prompt = `Classify the waste in this image into exactly one of these categories:
plastic, paper, glass, metal, organic, ewaste, mixed, other.

Respond ONLY with a JSON object with this exact structure:
{
  "category": "<category>",
  "confidence": <0.0-1.0>,
  "alternatives": [{"category": "<cat>", "confidence": <0.0-1.0>}],
  "reasoning": "<one sentence>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: prompt }, imageContent],
        },
      ],
      max_tokens: 300,
    });

    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in OpenAI response');

    const parsed = JSON.parse(jsonMatch[0]);

    if (!DEMO_CATEGORIES.includes(parsed.category)) {
      throw new Error(`Invalid category: ${parsed.category}`);
    }

    return {
      isDemo: false,
      provider: 'OpenAI GPT-4o-mini Vision',
      category: parsed.category,
      confidence: Math.min(1, Math.max(0, parsed.confidence)),
      alternatives: (parsed.alternatives || []).slice(0, 3),
      segregationTip: SEGREGATION_TIPS[parsed.category],
      needsManualReview: parsed.confidence < 0.6,
      reasoning: parsed.reasoning,
    };
  } catch (err) {
    console.error('OpenAI classification error:', err.message);
    throw new Error('AI classification failed. Please try again or use manual classification.');
  }
}

// ─── Google Gemini Adapter ────────────────────────────────────────────────────

async function geminiAdapter(imagePath) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const fs = require('fs');
    const path = require('path');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).slice(1).toLowerCase();
    const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

    const prompt = `Classify the waste in this image into exactly one of: plastic, paper, glass, metal, organic, ewaste, mixed, other.
Respond ONLY with JSON: {"category":"<cat>","confidence":<0-1>,"alternatives":[{"category":"<cat>","confidence":<0-1>}],"reasoning":"<one sentence>"}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data: base64 } },
    ]);

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in Gemini response');

    const parsed = JSON.parse(jsonMatch[0]);

    if (!DEMO_CATEGORIES.includes(parsed.category)) {
      throw new Error(`Invalid category: ${parsed.category}`);
    }

    return {
      isDemo: false,
      provider: 'Google Gemini 1.5 Flash',
      category: parsed.category,
      confidence: Math.min(1, Math.max(0, parsed.confidence)),
      alternatives: (parsed.alternatives || []).slice(0, 3),
      segregationTip: SEGREGATION_TIPS[parsed.category],
      needsManualReview: parsed.confidence < 0.6,
      reasoning: parsed.reasoning,
    };
  } catch (err) {
    console.error('Gemini classification error:', err.message);
    throw new Error('AI classification failed.');
  }
}

module.exports = { classifyWasteImage, SEGREGATION_TIPS };

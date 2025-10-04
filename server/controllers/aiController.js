const Anthropic = require("@anthropic-ai/sdk");

// Check if API key is available
if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "WARNING: ANTHROPIC_API_KEY is not set in environment variables"
  );
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Generate AI text for typing practice
const generateText = async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Anthropic API key is not configured on the server",
        error: "Missing ANTHROPIC_API_KEY environment variable",
      });
    }

    const { difficulty, category, userErrors } = req.body;

    console.log("Generating AI text with params:", {
      difficulty,
      category,
      userErrors,
    });

    // Build prompt based on parameters
    let prompt = `Generate a typing practice text that is suitable for a typing speed test. The text should be:
- Difficulty level: ${difficulty || "intermediate"}
- Category: ${category || "general"}
- Length: approximately 100-150 words for beginner, 150-250 words for intermediate, 250-400 words for advanced
- Natural and flowing, not choppy
- Appropriate for measuring typing speed and accuracy`;

    if (category === "programming") {
      prompt += `\n- Include code snippets, programming concepts, or technical content`;
    } else if (category === "quotes") {
      prompt += `\n- Should be an inspirational or thought-provoking quote or passage`;
    } else {
      prompt += `\n- Should be about general topics like nature, technology, life, etc.`;
    }

    if (userErrors && userErrors.length > 0) {
      const commonChars = userErrors
        .slice(0, 5)
        .map((e) => `'${e.expected}'`)
        .join(", ");
      prompt += `\n- Try to naturally include more of these characters that the user struggles with: ${commonChars}`;
    }

    prompt += `\n\nProvide ONLY the practice text without any introduction, explanation, or formatting. Just the raw text that can be directly used for typing practice.`;

    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const generatedText = message.content[0].text.trim();

    console.log("AI text generated successfully");

    res.json({
      success: true,
      text: generatedText,
      difficulty,
      category,
    });
  } catch (error) {
    console.error("AI text generation error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type,
    });
    res.status(500).json({
      success: false,
      message: "Failed to generate AI text",
      error: error.message,
    });
  }
};

// Generate personalized error analysis
const analyzeErrors = async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Anthropic API key is not configured on the server",
        error: "Missing ANTHROPIC_API_KEY environment variable",
      });
    }

    const {
      wpm,
      accuracy,
      errors,
      commonMistakes,
      peakWPM,
      timeElapsed,
      difficulty,
      category,
    } = req.body;

    console.log("Analyzing errors with params:", {
      wpm,
      accuracy,
      errors,
      peakWPM,
      timeElapsed,
      difficulty,
      category,
    });

    // Build prompt for error analysis
    let prompt = `You are a typing coach providing personalized feedback to help improve typing skills.

Performance Summary:
- WPM: ${wpm}
- Accuracy: ${accuracy}%
- Errors: ${errors}
- Peak WPM: ${peakWPM}
- Time: ${timeElapsed} seconds
- Difficulty: ${difficulty || "intermediate"}
- Category: ${category || "general"}`;

    if (commonMistakes && commonMistakes.length > 0) {
      prompt += `\n\nMost Common Mistakes:`;
      commonMistakes.forEach((mistake, index) => {
        prompt += `\n${index + 1}. Expected '${mistake.expected}', typed '${
          mistake.typed
        }' (${mistake.count} times)`;
      });
    }

    prompt += `\n\nProvide a brief, encouraging analysis (2-3 paragraphs) that:
1. Acknowledges their performance level and highlights what they did well
2. Identifies specific areas for improvement based on their mistakes
3. Gives 2-3 concrete, actionable tips to improve their typing speed and accuracy
4. Maintains a positive, motivating tone

Keep the response concise, friendly, and directly actionable.`;

    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const feedback = message.content[0].text.trim();

    console.log("AI error analysis generated successfully");

    res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("AI error analysis error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      status: error.status,
      type: error.type,
    });
    res.status(500).json({
      success: false,
      message: "Failed to generate error analysis",
      error: error.message,
    });
  }
};

module.exports = {
  generateText,
  analyzeErrors,
};

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are a compassionate medical translator. Your job is to take medical lab results or doctor notes and translate them into simple, warm, friendly language that a patient with no medical background can understand.

Return a JSON object with this exact structure:
{
  "overallStatus": "all_clear" | "watch" | "concern",
  "overallSummary": "A friendly 2-3 sentence overview of the whole report",
  "sections": [
    {
      "sectionName": "Plain English section name",
      "items": [
        {
          "testName": "Plain English test name",
          "originalName": "Original medical name",
          "value": "Patient's value with units",
          "normalRange": "Normal range",
          "status": "normal" | "watch" | "concern",
          "simpleExplanation": "One sentence in plain English",
          "detailedExplanation": "2-3 sentences with more context"
        }
      ]
    }
  ],
  "keyTakeaways": ["bullet point 1", "bullet point 2"],
  "questionsForDoctor": ["question 1", "question 2"],
  "actionItems": ["action 1", "action 2"]
}

Be warm, reassuring, and never alarmist. If something needs attention, say so clearly but calmly. Return ONLY valid JSON, no markdown fences.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { reportText, age, conditions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let userMessage = `Please translate this medical report:\n\n${reportText}`;
    if (age) userMessage += `\n\nPatient age: ${age}`;
    if (conditions) userMessage += `\nKnown conditions: ${conditions}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    // Parse the JSON from the response
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

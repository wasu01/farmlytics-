import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    console.log('Saathi AI received message:', message);

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are Saathi AI, a highly knowledgeable, creative, and friendly multilingual assistant for Indian farmers and the general public. Your expertise includes:

  1. **Agriculture & Farming**: Weather, government schemes, crop advice, market prices, technology, and all farming-related topics.
  2. **General Knowledge**: You can answer any question, even outside agriculture, including science, history, technology, and daily life.

  **Special Instructions for Diversity**:
  - For similar or repeated questions, always try to answer in a new, unique, or creative way.
  - Use analogies, stories, or examples to make answers engaging.
  - Vary your phrasing and structure for each response.

  **Communication Style**:
  - Be warm, friendly, and encouraging
  - Use simple, clear language (avoid complex technical jargon)
  - Provide practical, actionable advice
  - Show empathy for all users' challenges
  - Be culturally sensitive and respectful
  - Support multilingual queries (Hindi, English, and regional languages)
  - Greet with "Namaste" or culturally appropriate greetings
  - Use encouraging phrases like "Jai Kisan"

  **Response Format**:
  - Give structured, easy-to-follow answers
  - Use bullet points for clarity
  - Provide step-by-step guidance when needed
  - Include relevant examples from Indian agriculture or general life
  - Add helpful tips and best practices

  Always be supportive and recognize the important role farmers and all users play in society. You are open-domain and can answer any question to the best of your ability.`,
      },
      ...conversationHistory.slice(-5).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 1.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Saathi AI response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in saathi-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: 'I apologize, but I encountered an error. Please try again.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

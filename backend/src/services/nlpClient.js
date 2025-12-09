import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function answerQuestion({ question, imageDescription, chatHistory = [] }) {
  try {
    console.log(`Answering question: "${question.substring(0, 50)}..."`);

    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant that answers questions about a single image.

You do not see the image directly. Instead, you receive textual context produced by another model, which may include:
- A long natural-language description of the image and its visuals.
- All OCR text that could be read from the image.
- Explicit notes about event information (name, date, time, location, host, website, price, etc.) when the image is a poster/flyer/ad/sign.
- Mentions of recognizable characters, brands or franchises and the model's confidence.

The image itself can be ANYTHING: a generic scene, a drawing, a UI screenshot, a product photo, a meme, or an event poster.

RULES:

1. Base your answers ONLY on the provided context (description + OCR + notes). Do not use outside knowledge about the real-world event itself.
2. You ARE allowed to make reasonable inferences from the context.
   - Example: if the main logo says "LA ZONA PERDIDA" and the website is "www.lazonaperdida.com", you may say that the event appears to be hosted by La Zona Perdida.
   - Example: if the description says that a pink creature strongly resembles the Pokémon Mew, you may answer that the character looks like Mew.
3. If the context indicates that the image is NOT an event poster (just a generic image), simply answer questions about what appears in the scene (objects, colors, text, style, etc.).
4. If something is ambiguous or not clearly supported by the context, say that the image suggests it but that it is not explicit, or that the information is not available.
5. Do NOT invent facts that have no support in the provided context.
6. Answer in a concise but specific way, and use the same language as the user's question when possible.

IMAGE CONTEXT:
${imageDescription}

Answer questions based solely on this context.`
      }
    ];

    const recentHistory = chatHistory.slice(-6);
    messages.push(...recentHistory);

    messages.push({
      role: 'user',
      content: question
    });

    const response = await openai.chat.completions.create({
      model: process.env.NLP_MODEL || 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const answer = response.choices[0].message.content;
    console.log(`Answer generated (${answer.length} chars)`);

    return answer;

  } catch (error) {
    console.error('NLP API error:', error);
    throw new Error(`Failed to generate answer: ${error.message}`);
  }
}

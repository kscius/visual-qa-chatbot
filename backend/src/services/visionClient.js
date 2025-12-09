import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function describeImage(imagePath) {
  try {
    console.log(`Analyzing image: ${path.basename(imagePath)}`);

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = getMimeType(imagePath);
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: process.env.VISION_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert image analyst.

You will receive ANY kind of image: real photos, drawings, posters, flyers, ads, signs, product shots, screenshots, UI mockups, etc.

Your task is to describe the image in extreme detail AND, when applicable, explicitly extract key information.

Always do ALL of the following:

1) VISUAL DESCRIPTION (for ALL images)
- Describe all visible objects, people, animals, characters, or elements
- Colors, textures, materials, and visual properties
- Spatial relationships and positioning
- Foreground and background details
- Overall style (cartoon, realistic, flat design, etc.)

2) TEXT (OCR) (for ALL images)
- Read and transcribe ALL visible text as accurately as possible
- Keep wording, spelling and language exactly as it appears on the image
- If some text is partially cut or hard to read, say so and give your best guess

3) SEMANTIC INFO WHEN IT LOOKS LIKE A POSTER / FLYER / AD / SIGN
If the image appears to communicate structured information (for example: event poster, store ad, trade night, sale banner, invitation, ticket, menu, sign, info card, social media announcement), clearly state:
- What the image is about (event, product, promotion, warning, etc.)
- Event or promotion name / main title (if any)
- Date and time (as written)
- Location / address (as written)
- Any price or entry info (for example: "Entrada Gratis")
- Any website, social media handle or phone number (as written)
- The most likely organizer/host/brand (based on the main logo, brand name or website).
  You are allowed to say things like:
  "The event appears to be hosted by LA ZONA PERDIDA."

If the image does NOT look like a poster/flyer/ad/sign, just say that there is no obvious event or promotion information and describe the scene instead.

4) CHARACTERS, BRANDS AND LOGOS (for ALL images)
- Identify and name any recognizable characters, brands or franchises
  (for example Pokémon characters such as Mew, Pikachu, etc., or store logos)
- If you are reasonably sure, say it explicitly:
  "The pink creature strongly resembles the Pokémon Mew."
- If you are not sure, say that it is a guess and how confident you are (high/medium/low).

GENERAL RULES:
- Be thorough, precise and concrete.
- You ARE allowed to make reasonable visual inferences (who hosts an event, which character it looks like), but do NOT invent information that is not suggested by the image.
- When something is inferred and not explicitly written, say that it is an inference and how confident you are (high/medium/low).

Remember: your description will later be used by another model to answer questions about this image.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please provide an extremely detailed description of this image.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    const description = response.choices[0].message.content;
    console.log(`Image description generated (${description.length} chars)`);

    return description;

  } catch (error) {
    console.error('Vision API error:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

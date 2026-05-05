import OpenAI from 'openai';

export class OpenRouterService {
  private client: OpenAI | null = null;

  initialize(apiKey: string): void {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:4000',
        'X-Title': 'PricePulse',
      },
    });
  }

  async analyzeProduct(productData: any): Promise<any> {
    if (!this.client) {
      throw new Error('OpenRouter client not initialized. Set OPENROUTER_API_KEY.');
    }

    const prompt = `Analyze this product and provide a structured analysis:
Product: ${JSON.stringify(productData, null, 2)}

Provide analysis in this JSON format:
{
  "summary": "Brief product summary (2-3 sentences)",
  "pros": ["list of 3-5 pros"],
  "cons": ["list of 3-5 cons"],
  "competitorComparison": "How it compares to similar products",
  "priceAssessment": "Is the price fair/reasonable?",
  "rating": number between 1-10
}`;

    const response = await this.client.chat.completions.create({
      model: 'google/gemini-2.5-flash-lite',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    try {
      return JSON.parse(content || '{}');
    } catch {
      return {
        summary: content || '',
        pros: [],
        cons: [],
        competitorComparison: '',
        priceAssessment: '',
        rating: 5,
      };
    }
  }

  async structureProductData(rawData: any): Promise<any> {
    if (!this.client) {
      throw new Error('OpenRouter client not initialized. Set OPENROUTER_API_KEY.');
    }

    const prompt = `Extract structured product data from this raw product page content. Return ONLY valid JSON:
    
Raw content: ${JSON.stringify(rawData)}

Return JSON object with these fields:
{
  "title": "product title",
  "price": number (in MYR),
  "originalPrice": number or null,
  "rating": number (0-5),
  "soldCount": number,
  "shopName": "seller name",
  "shopLocation": "location",
  "category": "product category",
  "description": "product description",
  "highlights": ["key feature 1", "key feature 2"]
}`;

    const response = await this.client.chat.completions.create({
      model: 'google/gemini-2.5-flash-lite',
      messages: [{ role: 'user', content: prompt }],
    }).catch((err: any) => {
      console.error(`[OpenRouter] API call failed: ${err?.status || err?.code} - ${err?.message}`);
      throw err;
    });

    try {
      const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
      console.log(`[OpenRouter] Successfully structured product data`);
      return parsed;
    } catch {
      return null;
    }
  }
}

export const openRouterService = new OpenRouterService();

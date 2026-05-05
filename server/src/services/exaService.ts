import Exa from 'exa-js';

export class ExaService {
  private exa: Exa | null = null;

  initialize(apiKey: string): void {
    this.exa = new Exa(apiKey);
  }

  async searchProducts(query: string, options?: any): Promise<any> {
    if (!this.exa) {
      throw new Error('Exa client not initialized. Set EXA_API_KEY.');
    }

    const searchQuery = `${query} buy price`;

    console.log(`[Exa] Searching: "${searchQuery}" with numResults=${options?.limit || 20}`);

    try {
      const result = await this.exa.search(searchQuery, {
        type: 'auto',
        numResults: options?.limit || 20,
        contents: {
          highlights: { numSentences: 5, maxCharacters: 4000 },
          text: { maxCharacters: 20000 },
        },
        ...options,
      });

      console.log(`[Exa] Got ${result.results?.length || 0} results`);
      return result;
    } catch (err: any) {
      console.error(`[Exa] Search failed: ${err?.message}`);
      throw err;
    }
  }

  async getContents(urls: string[]): Promise<any> {
    if (!this.exa) {
      throw new Error('Exa client not initialized. Set EXA_API_KEY.');
    }
    return this.exa.getContents(urls);
  }
}

export const exaService = new ExaService();

import OpenAI from 'openai';

// Initialize OpenAI client with OpenRouter base URL
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY, // You'll need to add this to your .env file
  dangerouslyAllowBrowser: true // Required for client-side usage
});

// Generate blog post content using AI
export const generateBlogContent = async (topic, tone = 'professional', length = 'medium') => {
  try {
    const lengthMap = {
      short: '300-500 words',
      medium: '600-800 words',
      long: '1000-1200 words'
    };

    const prompt = `Write a comprehensive blog post about "${topic}" in the context of sustainable technology and green innovations.

Requirements:
- Tone: ${tone}
- Length: ${lengthMap[length]}
- Focus on environmental solutions, sustainable technology, and green innovations
- Include practical insights and actionable information
- Structure with an engaging introduction, main content sections, and a strong conclusion
- Use markdown formatting for better readability

The blog post should be informative, engaging, and provide value to readers interested in sustainable technology and environmental solutions.`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free", // Using a free model from OpenRouter
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating blog content:', error);
    throw new Error('Failed to generate blog content. Please check your API key and try again.');
  }
};

// Generate blog post title suggestions
export const generateTitleSuggestions = async (topic) => {
  try {
    const prompt = `Generate 5 compelling and SEO-friendly title suggestions for a blog post about "${topic}" in the context of sustainable technology and green innovations.

Requirements:
- Each title should be engaging and click-worthy
- Include relevant keywords for SEO
- Keep titles under 60 characters when possible
- Focus on environmental solutions and sustainable tech

Return only the 5 title suggestions, one per line, without numbering or additional text.`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const titles = completion.choices[0].message.content
      .split('\n')
      .filter(title => title.trim().length > 0)
      .slice(0, 5);

    return titles;
  } catch (error) {
    console.error('Error generating title suggestions:', error);
    throw new Error('Failed to generate title suggestions.');
  }
};

// Generate excerpt/summary for blog post
export const generateExcerpt = async (content) => {
  try {
    const prompt = `Create a compelling 2-3 sentence excerpt/summary for the following blog post content. The excerpt should be engaging and encourage readers to read more.

Content:
${content.substring(0, 1000)}...

Requirements:
- Keep it under 150 words
- Highlight the main value proposition
- End with a hook that makes readers want to continue reading
- Focus on sustainable technology and green innovations theme`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating excerpt:', error);
    throw new Error('Failed to generate excerpt.');
  }
};

// Generate latest news headlines by category
export const generateNewsHeadlines = async (category) => {
  try {
    const categories = {
      'sustainable-tech': 'Sustainable Technology',
      'green-energy': 'Green Energy',
      'climate-solutions': 'Climate Solutions',
      'eco-innovations': 'Eco-Innovations',
      'environmental-policy': 'Environmental Policy'
    };

    const categoryName = categories[category] || 'Sustainable Technology';

    const prompt = `Generate 8 recent news headlines about ${categoryName}. Each headline should be:

Requirements:
- Realistic and current (as if from today's news)
- Focus on sustainable technology, green innovations, and environmental solutions
- Include specific companies, technologies, or initiatives when possible
- Make them sound like real news headlines
- Include publication dates within the last 2 weeks

Format: Return exactly 8 headlines, one per line, with a brief 1-2 sentence summary for each.
Use this format:
Headline: [Headline text]
Summary: [Brief summary]

Separate each news item with ---`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    const newsItems = response.split('---').filter(item => item.trim());

    return newsItems.map((item, index) => {
      const lines = item.trim().split('\n');
      const headline = lines.find(line => line.startsWith('Headline:'))?.replace('Headline:', '').trim() || `News Item ${index + 1}`;
      const summary = lines.find(line => line.startsWith('Summary:'))?.replace('Summary:', '').trim() || 'No summary available';

      return {
        id: `${category}-${Date.now()}-${index}`,
        headline,
        summary,
        category,
        publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date within last 2 weeks
        fullContent: null // Will be generated on demand
      };
    });
  } catch (error) {
    console.error('Error generating news headlines:', error);
    throw new Error('Failed to generate news headlines.');
  }
};

// Generate detailed news article content
export const generateNewsDetail = async (headline, summary, category) => {
  try {
    const categories = {
      'sustainable-tech': 'Sustainable Technology',
      'green-energy': 'Green Energy',
      'climate-solutions': 'Climate Solutions',
      'eco-innovations': 'Eco-Innovations',
      'environmental-policy': 'Environmental Policy'
    };

    const categoryName = categories[category] || 'Sustainable Technology';

    const prompt = `Write a detailed news article based on this headline and summary. Make it comprehensive and journalistic.

Headline: ${headline}
Summary: ${summary}
Category: ${categoryName}

Requirements:
- Write as a professional news article (800-1200 words)
- Include quotes from experts, companies, or officials
- Add specific details, statistics, and context
- Structure with introduction, body, and conclusion
- Focus on sustainable technology and environmental impact
- Include potential implications and future outlook
- Use markdown formatting for readability

Make this sound like a real, current news article with proper journalistic style.`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating news detail:', error);
    throw new Error('Failed to generate detailed news content.');
  }
};

// AI Q&A for news articles
export const askNewsQuestion = async (question, articleContent, headline) => {
  try {
    const prompt = `You are an AI assistant answering questions about this news article. Be helpful, accurate, and provide context from the article.

Article Headline: ${headline}

Article Content:
${articleContent.substring(0, 2000)}...

User Question: ${question}

Instructions:
- Answer based on the article content
- If the question cannot be answered from the article, say so politely
- Provide additional context or explanations when relevant
- Keep answers concise but informative
- Be objective and journalistic in tone
- If appropriate, suggest related topics or implications

Answer the user's question:`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer your question. Please try again.');
  }
};
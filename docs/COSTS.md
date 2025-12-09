# Cost Analysis & Optimization

## OpenAI API Pricing (as of December 2025)

### Vision API (GPT-4o)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|----------------------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |

**Image tokens calculation:**
- High detail image (~1568x1568): ~1,105 tokens
- Low detail image: ~85 tokens

### Chat API (GPT-4o-mini)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|----------------------|
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-4o | $2.50 | $10.00 |
| gpt-3.5-turbo | $0.50 | $1.50 |

## Usage Calculations

### Per Session Costs

**Current Configuration** (GPT-4o vision + GPT-4o-mini chat):

1. **Image Upload (1 call to GPT-4o vision):**
   - Input: ~1,105 tokens (image) + ~800 tokens (system prompt) = ~1,905 tokens
   - Output: ~500 tokens (description)
   - Cost: (1,905 × $2.50 + 500 × $10.00) / 1,000,000 = **~$0.0098** (~1¢)

2. **Chat Questions (5 calls to GPT-4o-mini):**
   - Per question:
     - Input: ~500 tokens (description) + ~300 tokens (system) + ~20 tokens (question) = ~820 tokens
     - Output: ~100 tokens (answer)
     - Cost: (820 × $0.15 + 100 × $0.60) / 1,000,000 = **~$0.00018** (~0.02¢)
   - 5 questions: $0.00018 × 5 = **~$0.0009** (~0.09¢)

**Total per session: ~$0.0107** (**~1.1¢**)

### Monthly Cost Estimates

| Usage Level | Sessions/month | Total Cost |
|-------------|----------------|------------|
| Light (personal) | 50 | ~$0.54 |
| Medium (small team) | 500 | ~$5.35 |
| Heavy (public demo) | 2,000 | ~$21.40 |
| Very Heavy | 10,000 | ~$107.00 |

**Additional costs (hosting):**
- Heroku/Railway/Render: $5-25/month
- S3 storage (optional): $0-5/month
- **Total monthly cost: ~$10-50 for moderate usage**

## Cost Optimization Strategies

### 1. Model Selection

**Option A: Current (Recommended)**
- Vision: GPT-4o (~1¢)
- Chat: GPT-4o-mini (~0.02¢ per question)
- **Total: ~1.1¢ per session**
- **Quality: Excellent**

**Option B: Budget**
- Vision: GPT-4o-mini (~0.06¢)
- Chat: GPT-4o-mini (~0.02¢ per question)
- **Total: ~0.16¢ per session**
- **Quality: Good, but vision less detailed**

**Option C: Premium**
- Vision: GPT-4o (~1¢)
- Chat: GPT-4o (~1.3¢ per question)
- **Total: ~7.5¢ per session**
- **Quality: Best, but 7x more expensive**

### 2. Caching Strategies

**Image Description Caching:**
```javascript
// Hash image and cache description
const imageHash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
const cachedDescription = await redis.get(`img:${imageHash}`);

if (cachedDescription) {
  return cachedDescription; // $0 cost!
} else {
  const description = await visionAPI.describeImage(image);
  await redis.set(`img:${imageHash}`, description, 'EX', 86400); // 24h cache
  return description;
}
```

**Savings:** If 30% of images are duplicates, save ~30% on vision costs.

### 3. Token Optimization

**Reduce Vision Prompt Size:**
- Current system prompt: ~800 tokens
- Optimized prompt: ~400 tokens
- **Savings: ~15% on vision calls**

**Limit Chat History:**
- Current: Last 3 turns (~600 tokens)
- Optimized: Last 1 turn (~200 tokens)
- **Savings: ~50% on chat input tokens**

### 4. Rate Limiting

**Prevent abuse:**
```javascript
// Max 10 sessions per IP per hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many sessions, please try again later'
});
```

**Savings:** Eliminates bot abuse costs.

### 5. Image Preprocessing

**Resize large images before API call:**
```javascript
// Resize to max 2048x2048 before upload
const maxDimension = 2048;
if (width > maxDimension || height > maxDimension) {
  const resized = await sharp(imageBuffer)
    .resize(maxDimension, maxDimension, { fit: 'inside' })
    .toBuffer();
}
```

**Savings:** ~20-30% on vision token costs for very large images.

### 6. Question Limit

**Current: 5 questions per session**
- Total chat cost: ~0.09¢

**Alternative: 3 questions per session**
- Total chat cost: ~0.05¢
- **Savings: ~45% on chat costs**
- Trade-off: Reduced user experience

## Cost Monitoring

### Set Usage Alerts

1. **OpenAI Dashboard:**
   - Go to [platform.openai.com/usage](https://platform.openai.com/usage)
   - Set monthly budget limit
   - Enable email alerts at 50%, 75%, 90%

2. **Hard Limits:**
   - Set hard cap at $50/month (prevents unexpected charges)
   - Account will pause API calls when limit reached

### Track Usage in Your App

**Log each API call:**
```javascript
// In visionClient.js and nlpClient.js
const startTime = Date.now();
const response = await openai.chat.completions.create(...);
const duration = Date.now() - startTime;

// Log to monitoring service
logger.info('OpenAI API call', {
  model: 'gpt-4o',
  promptTokens: response.usage.prompt_tokens,
  completionTokens: response.usage.completion_tokens,
  totalTokens: response.usage.total_tokens,
  estimatedCost: calculateCost(response.usage),
  duration
});
```

### Daily/Monthly Reports

Create a dashboard showing:
- Sessions per day
- API calls per day
- Total tokens consumed
- Estimated costs
- Average cost per session

## Cost Comparison: Alternative Approaches

### Approach 1: Current Design (Best)
- Vision API once, description reused 5 times
- **Cost: ~1.1¢ per session**
- **Quality: Excellent**

### Approach 2: Vision API Every Question (Worst)
- Send image with every question
- **Cost: ~6.5¢ per session** (6x more expensive!)
- **Quality: Same**
- **Conclusion: Never do this**

### Approach 3: Local Vision Model
- Use open-source model (BLIP-2, LLaVA) on your server
- **Setup Cost: GPU instance ($50-200/month)**
- **API Cost: $0**
- **Quality: Lower**
- **Conclusion: Only worth it at very high scale (>20,000 sessions/month)**

## Best Practices

1. ✅ **Use the current architecture** (vision once, chat multiple times)
2. ✅ **Start with GPT-4o + GPT-4o-mini** (best quality/cost balance)
3. ✅ **Set OpenAI usage limits** ($20-50/month cap)
4. ✅ **Monitor usage regularly** (weekly reviews)
5. ✅ **Implement caching** when you see duplicate images
6. ✅ **Add rate limiting** before public launch
7. ⚠️ **Don't send images repeatedly** (huge waste)
8. ⚠️ **Don't use GPT-4o for chat** (unless quality demands it)

## Scaling Considerations

| Sessions/Month | Estimated Cost | Recommended Actions |
|----------------|----------------|---------------------|
| 0-100 | <$2 | Nothing, you're fine |
| 100-1,000 | $2-15 | Monitor usage monthly |
| 1,000-5,000 | $15-75 | Add caching, optimize prompts |
| 5,000-20,000 | $75-300 | Add rate limiting, consider Redis cache |
| 20,000+ | $300+ | Evaluate local models, aggressive caching |

## ROI Calculation

**If building a paid product:**
- Cost per session: ~1.1¢
- Recommended pricing: $0.05-0.10 per session
- **Profit margin: 78-91%**
- Break-even: ~10 paid sessions to cover first month of hosting

**Example pricing tiers:**
- Free: 5 sessions/month
- Basic ($4.99): 100 sessions/month (cost: $1.10)
- Pro ($9.99): 250 sessions/month (cost: $2.75)
- **Profit: ~$6-7 per subscriber**

## Summary

- **Current cost: ~1.1¢ per session** (very affordable!)
- **100 sessions costs ~$1** (about one coffee)
- **Main cost is vision API** (~90% of total)
- **Architecture is already optimized** (vision once, reuse description)
- **Focus on preventing abuse** (rate limiting) over micro-optimizations

---

For more information on OpenAI pricing, see:
- [OpenAI Pricing](https://openai.com/pricing)
- [Token Calculator](https://platform.openai.com/tokenizer)


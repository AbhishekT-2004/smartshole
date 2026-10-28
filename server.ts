import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize GoogleGenAI SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      service: 'SmartSole Full-Stack Backend API',
      database: 'MongoDB Document Engine',
      aiEngine: 'Gemini 3.8 Flash',
      timestamp: new Date().toISOString()
    });
  });

  // --- Products APIs ---
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const { category, brand, query, minPrice, maxPrice, sort, gender } = req.query;
      const products = db.getProducts({
        category: category as string,
        brand: brand as string,
        query: query as string,
        gender: gender as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        sort: sort as string
      });
      res.json({ success: true, count: products.length, data: products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const newProduct = db.insertProduct(req.body);
      res.status(201).json({ success: true, data: newProduct });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: updated });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  // --- Reviews APIs ---
  app.get('/api/reviews/:productId', (req: Request, res: Response) => {
    const reviews = db.getReviewsForProduct(req.params.productId);
    res.json({ success: true, count: reviews.length, data: reviews });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    try {
      const review = db.insertReview(req.body);
      res.status(201).json({ success: true, data: review });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/reviews/:id/vote', (req: Request, res: Response) => {
    const review = db.voteHelpful(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, data: review });
  });

  // --- Orders & Tracking APIs ---
  app.get('/api/orders', (_req: Request, res: Response) => {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const order = db.insertOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, location } = req.body;
    const order = db.updateOrderStatus(req.params.id, status, location);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
    const { reason } = req.body;
    const order = db.cancelOrder(req.params.id, reason || 'Cancelled by user');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  // --- Analytics APIs ---
  app.get('/api/analytics', (_req: Request, res: Response) => {
    const analytics = db.getSalesAnalytics();
    res.json({ success: true, data: analytics });
  });

  // --- Coupons APIs ---
  app.get('/api/coupons', (_req: Request, res: Response) => {
    const coupons = db.getCoupons();
    res.json({ success: true, data: coupons });
  });

  // --- Pincode Deliverability Check ---
  app.post('/api/pincode/check', (req: Request, res: Response) => {
    const { pincode } = req.body;
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code' });
    }

    const metroPincodes = ['560', '110', '400', '700', '600', '500', '380', '411', '201'];
    const prefix = pincode.substring(0, 3);
    const isFastDelivery = metroPincodes.includes(prefix);

    const deliveryDays = isFastDelivery ? 2 : 4;
    const arrivalDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000);
    const dateFormatted = arrivalDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });

    res.json({
      success: true,
      serviceable: true,
      deliveryDays,
      estimatedDate: dateFormatted,
      isExpress: isFastDelivery,
      codAvailable: true,
      courierPartner: 'Ekart Logistics Express',
      message: `Delivery by ${dateFormatted} | FREE Delivery on orders above ₹499`
    });
  });

  // --- SmartSole AI Footwear Chatbot API ---
  app.post('/api/ai-chat', async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      const allProducts = db.getProducts();
      const allOrders = db.getOrders();
      const coupons = db.getCoupons();

      // Catalog digest for context
      const catalogContext = allProducts.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        rating: p.rating,
        sizesAvailable: p.sizes.filter(s => s.stock > 0).map(s => s.size),
        highlights: p.highlights.slice(0, 3).join(', ')
      }));

      const ordersContext = allOrders.slice(0, 4).map(o => ({
        id: o.id,
        trackingNumber: o.trackingNumber,
        status: o.status,
        items: o.items.map(i => `${i.product.name} (UK ${i.size})`).join(', '),
        date: o.createdAt,
        total: o.pricing.totalAmount
      }));

      const systemPrompt = `You are "SmartSole AI", an expert AI footwear stylist, fit consultant, and shopping concierge for the SmartSole platform.
Current live shoes catalog:
${JSON.stringify(catalogContext)}

Active promotional coupon codes:
${JSON.stringify(coupons)}

Recent customer orders:
${JSON.stringify(ordersContext)}

Guidelines:
1. Provide personalized footwear recommendations based on user questions (running, gym, college daily wear, corporate interview, parties, trekking, budget limits).
2. Answer sizing and fit questions (explain UK vs US vs EU sizing, true-to-size guidance, wide feet tips).
3. If asked about order tracking or status, explain the current status and Ekart courier progress.
4. If asked about coupons, mention COLLEGE2026 (15% off student discount) or BIGSALE (₹500 off).
5. Recommend 1 to 3 specific shoes from the catalog whenever relevant. Include their exact IDs in recommendedShoeIds.

You MUST respond strictly in valid JSON format with keys:
{
  "reply": "Your markdown answer (concise, stylish, helpful)",
  "suggestedActions": ["Short follow-up chip 1", "Short follow-up chip 2", "Short follow-up chip 3"],
  "recommendedShoeIds": ["prod-id-1", "prod-id-2"]
}`;

      if (process.env.GEMINI_API_KEY) {
        try {
          const contents: any[] = [];
          // Include history
          for (const msg of conversationHistory.slice(-6)) {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            });
          }
          contents.push({ role: 'user', parts: [{ text: message }] });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API call timed out after 7000ms')), 7000)
          );

          const geminiPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          });

          const response: any = await Promise.race([geminiPromise, timeoutPromise]);

          const responseText = response.text || '{}';
          const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          return res.json({
            success: true,
            reply: parsed.reply || "I'm here to help you pick the perfect footwear!",
            suggestedActions: parsed.suggestedActions || ["Running shoes", "Trending sneakers", "Track my order"],
            recommendedShoeIds: parsed.recommendedShoeIds || []
          });
        } catch (geminiError: any) {
          console.warn('Gemini API call failed or timed out, falling back to smart catalog assistant:', geminiError.message);
        }
      }

      // Fallback local smart response generator if API key is not present or rate limited
      const lower = message.toLowerCase();
      let matchedShoeIds: string[] = [];
      let replyText = '';
      let actions: string[] = ['Running shoes', 'College sneakers', 'Under ₹5,000', 'Check coupons'];

      if (lower.includes('running') || lower.includes('marathon') || lower.includes('jogging')) {
        matchedShoeIds = ['prod-adidas-ultraboost-light', 'prod-puma-nitro-velocity', 'prod-asics-gel-kayano-30'];
        replyText = `For running and athletic workouts, I highly recommend shoes with high-rebound cushioning:
- **Adidas Ultraboost Light 23**: Features Light BOOST foam and Continental™ rubber grip for long marathon runs.
- **Puma Velocity NITRO 3**: Nitrogen-infused NITROFOAM™ providing ultralight bounce at great value.
- **Asics GEL-KAYANO 30**: 4D Guidance System providing unmatched pronation stability.

All models feature verified Flipkart KickAssure authenticity and 7-day hassle-free size exchange!`;
      } else if (lower.includes('sneaker') || lower.includes('college') || lower.includes('campus') || lower.includes('casual')) {
        matchedShoeIds = ['prod-nike-air-jordan-1', 'prod-nb-9060-drift', 'prod-converse-chuck-70', 'prod-vans-old-skool'];
        replyText = `For college campus daily wear, street style, and maximum comfort:
- **Air Jordan 1 Retro High OG ("Chicago Lost & Found")**: Iconic silhouette that elevates any streetwear fit.
- **New Balance 9060**: Y2K chunky aesthetic with dual-density ABZORB cushioning.
- **Converse Chuck 70**: Heavyweight 12oz organic canvas and OrthoLite insoles for walking across lectures.

Use coupon code **COLLEGE2026** at checkout for an extra 15% student discount!`;
      } else if (lower.includes('formal') || lower.includes('office') || lower.includes('interview') || lower.includes('party')) {
        matchedShoeIds = ['prod-louis-formal-oxford', 'prod-woodland-leather-boots'];
        replyText = `For college placements, internship interviews, and formal presentations:
- **Handcrafted Italian Cap-Toe Derby**: 100% full-grain calfskin leather with memory foam insoles.
- **Woodland Nubuck All-Terrain Explorer**: Premium oiled leather boots with rugged TPR grip.

Both feature classic silhouettes suitable for dress pants and chinos.`;
      } else if (lower.includes('order') || lower.includes('track') || lower.includes('shipping') || lower.includes('where is')) {
        const order = allOrders[0];
        replyText = `Your recent order **${order?.id || 'OD-7829104829'}** is currently **${order?.status?.replace('_', ' ') || 'OUT FOR DELIVERY'}**!
- Courier: **${order?.courierPartner || 'Ekart Logistics Express'}**
- Tracking ID: **${order?.trackingNumber || 'EKART-948201948'}**
- Estimated Delivery: **${order?.estimatedDeliveryDate || 'Today by 6:00 PM'}**

You can view the live interactive GPS milestone tracker on the **Orders & Payment History** page.`;
        actions = ['View Order Tracker', 'Download Tax Invoice', 'Return/Exchange'];
      } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('offer') || lower.includes('code')) {
        replyText = `Here are the currently active SmartSole promotional codes:
1. **COLLEGE2026**: 15% instant discount for students on orders above ₹2,499.
2. **BIGSALE**: Flat ₹500 off on footwear orders above ₹4,999.
3. **FIRSTKICK**: 20% off for first-time shoppers (orders above ₹1,999).
4. **KICKASSURE**: Extra ₹300 off on verified sneaker drops.

You can enter any of these codes directly in your cart or checkout page!`;
        actions = ['Apply COLLEGE2026', 'Browse Sneakers', 'View Cart'];
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('chart')) {
        replyText = `**SmartSole Footwear Sizing Guide**:
- All sizes shown are standard **UK / Indian shoe sizing**.
- **UK 6** = US 7 (25.0 cm)
- **UK 7** = US 8 (25.8 cm)
- **UK 8** = US 9 (26.7 cm)
- **UK 9** = US 10 (27.5 cm)
- **UK 10** = US 11 (28.3 cm)
- **UK 11** = US 12 (29.2 cm)

Over 92% of our customers report true-to-size fit. If you are between sizes, we recommend sizing up by half a size. Size exchanges are 100% free with doorstep pickup!`;
        actions = ['View Size Chart', 'Browse UK 8 Shoes', 'Browse UK 9 Shoes'];
      } else {
        matchedShoeIds = ['prod-nike-air-jordan-1', 'prod-adidas-ultraboost-light'];
        replyText = `Welcome to **SmartSole**! I am your AI Footwear Stylist & Shopping Concierge. 
I can help you:
- Recommend sneakers, running, or formal shoes tailored to your budget and foot type
- Check live inventory and available UK sizes (UK 6–11)
- Apply student coupons like **COLLEGE2026**
- Track your Ekart orders in real time

What kind of shoes are you looking for today?`;
      }

      return res.json({
        success: true,
        reply: replyText,
        suggestedActions: actions,
        recommendedShoeIds: matchedShoeIds
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Frontend Serving / Vite Integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartSole Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();

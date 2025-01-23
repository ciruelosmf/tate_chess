import { Bot, webhookCallback, Context  } from "grammy";
// import { VercelRequest, VercelResponse } from "@vercel/node";
 

 

// Initialize the bot
const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);









 







 








// Main bot message handler
bot.on('message', async (ctx) => {

  const telegram_id = ctx.from!.id;
  
 
    
    // Welcome message
    await ctx.reply(`
      Hi there! I see this is your first interaction. 
      Let's get you registered! What is your first name?
    `);
  }

 
);






 







////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////


 

 




// Create the webhook callback handler
const handleWebhook = webhookCallback(bot, "http");

// Handler for Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "POST") {
      await handleWebhook(req, res);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (e) {
    console.error('Unhandled error:', e);
    res.status(500).json({ 
      error: 'Internal server error'
    });
  }
}
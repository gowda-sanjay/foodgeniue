import { GoogleGenerativeAI } from '@google/generative-ai';
import { type Restaurant, type FoodItem, RESTAURANTS_DATA, FOODS_DATA } from '../data/restaurants';

// Helper to check if a Gemini API Key is available in localStorage
export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem('foodgenie_api_key');
};

export const setGeminiApiKey = (key: string) => {
  localStorage.setItem('foodgenie_api_key', key);
};

export const removeGeminiApiKey = () => {
  localStorage.removeItem('foodgenie_api_key');
};

/**
 * Local Semantic/Heuristic NLP Engine
 * Simulates AI search & chat based directly on the actual KGF Dataset
 */
export const searchDatasetLocally = (query: string): { foods: FoodItem[]; restaurants: Restaurant[]; explanation: string } => {
  const queryLower = query.toLowerCase();

  let filteredFoods = [...FOODS_DATA];
  let filteredRestaurants = [...RESTAURANTS_DATA];
  let explanation = "Based on our direct KGF dataset, here's what we found:";

  // 1. Check Veg / Non Veg Flags
  if (queryLower.includes("veg") || queryLower.includes("pure veg") || queryLower.includes("vegetarian")) {
    filteredFoods = filteredFoods.filter(f => f.veg);
    // filter restaurants that are pure vegetarian or have veg menus
    const vegRestIds = new Set(filteredFoods.map(f => f.restaurantId));
    filteredRestaurants = filteredRestaurants.filter(r => vegRestIds.has(r.id));
    explanation += " Vegetarian options only.";
  } else if (queryLower.includes("non veg") || queryLower.includes("chicken") || queryLower.includes("mutton") || queryLower.includes("kabab") || queryLower.includes("egg") || queryLower.includes("burger")) {
    // If user specifically asked for non-veg keywords, rank non-veg higher or filter
    if (queryLower.includes("non veg")) {
      filteredFoods = filteredFoods.filter(f => !f.veg);
      explanation += " Non-vegetarian options only.";
    }
  }

  // 2. Range / Budget Filtering (e.g. "under ₹200", "under 200", "cheapest")
  const priceMatch = queryLower.match(/(?:under|below|less than|within|₹?\s*)(\d+)/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1], 10);
    filteredFoods = filteredFoods.filter(f => f.price <= maxPrice);
    explanation += ` Price under ₹${maxPrice}.`;
  } else if (queryLower.includes("cheap") || queryLower.includes("budget") || queryLower.includes("low price")) {
    filteredFoods.sort((a, b) => a.price - b.price);
    explanation += " Sorted from cheapest to premium.";
  }

  // 3. Category / Cuisine recognition
  if (queryLower.includes("biryani") || queryLower.includes("briyani") || queryLower.includes("kushka") || queryLower.includes("khuska")) {
    filteredFoods = filteredFoods.filter(f => f.category === "Biryani");
    explanation += " Authentic KGF Dum & Ambur Biryanis.";
  } else if (queryLower.includes("pizza")) {
    filteredFoods = filteredFoods.filter(f => f.category === "Pizza");
    explanation += " Hand-tossed cheesy Pizzas.";
  } else if (queryLower.includes("dosa") || queryLower.includes("idli") || queryLower.includes("south indian")) {
    filteredFoods = filteredFoods.filter(f => f.category === "South Indian" || f.category === "Meals");
    explanation += " Crispy South Indian crepes and meals.";
  } else if (queryLower.includes("burger")) {
    filteredFoods = filteredFoods.filter(f => f.name.toLowerCase().includes("burger"));
    explanation += " Grilled and crispy burgers.";
  } else if (queryLower.includes("manchurian") || queryLower.includes("gobi") || queryLower.includes("chinese")) {
    filteredFoods = filteredFoods.filter(f => f.category === "Chinese" || f.category === "Starters" || f.category === "Rolls");
    explanation += " Indo-Chinese starters and wok dishes.";
  } else if (queryLower.includes("healthy") || queryLower.includes("diet") || queryLower.includes("low calorie") || queryLower.includes("high protein")) {
    if (queryLower.includes("low calorie") || queryLower.includes("low cal")) {
      filteredFoods = filteredFoods.filter(f => f.calories <= 300);
      filteredFoods.sort((a, b) => a.calories - b.calories);
      explanation += " Low calorie meals (<= 300 kcal).";
    } else if (queryLower.includes("high protein") || queryLower.includes("protein")) {
      filteredFoods = filteredFoods.filter(f => f.protein >= 15);
      filteredFoods.sort((a, b) => b.protein - a.protein);
      explanation += " High protein meals (>= 15g protein).";
    } else {
      filteredFoods = filteredFoods.filter(f => f.healthScore >= 75);
      filteredFoods.sort((a, b) => b.healthScore - a.healthScore);
      explanation += " Healthy options (Health Score >= 75).";
    }
  }

  // 4. Restaurant Specific Search
  let matchedRestaurant = false;
  for (const r of RESTAURANTS_DATA) {
    if (queryLower.includes(r.name.toLowerCase()) || queryLower.includes(r.name.toLowerCase().split(" ")[0])) {
      filteredFoods = filteredFoods.filter(f => f.restaurantId === r.id);
      filteredRestaurants = [r];
      explanation = `Showing popular food menus from the legendary ${r.name}.`;
      matchedRestaurant = true;
      break;
    }
  }

  // 5. General Text Match fallback if list is otherwise untouched
  if (filteredFoods.length === FOODS_DATA.length && !matchedRestaurant) {
    // search text matches in food name or restaurant name
    const terms = queryLower.split(" ").filter(t => t.length > 2 && !["the", "and", "for", "with", "food", "near", "kgf", "under"].includes(t));
    if (terms.length > 0) {
      filteredFoods = FOODS_DATA.filter(f =>
        terms.some(term => f.name.toLowerCase().includes(term) || f.category.toLowerCase().includes(term))
      );

      const matchedRestIds = new Set(filteredFoods.map(f => f.restaurantId));
      filteredRestaurants = RESTAURANTS_DATA.filter(r =>
        matchedRestIds.has(r.id) || terms.some(term => r.name.toLowerCase().includes(term))
      );
    }
  }

  // If filtered lists are empty, fallback to original dataset with explanation
  if (filteredFoods.length === 0) {
    filteredFoods = [...FOODS_DATA].slice(0, 6);
    filteredRestaurants = [...RESTAURANTS_DATA].slice(0, 4);
    explanation = "We couldn't find matches for '" + query + "' from KGF dataset. Showing some popular options nearby:";
  } else {
    // Sync restaurants list with remaining foods, unless we searched restaurant specifically
    if (!matchedRestaurant) {
      const restIds = new Set(filteredFoods.map(f => f.restaurantId));
      filteredRestaurants = RESTAURANTS_DATA.filter(r => restIds.has(r.id));
    }
  }

  // Sort by rating or proximity as default helper
  filteredRestaurants.sort((a, b) => b.rating - a.rating);

  return {
    foods: filteredFoods,
    restaurants: filteredRestaurants,
    explanation
  };
};

/**
 * Calls Google Gemini API if user has inputted a Key.
 * Otherwise fallback locally.
 */
export const getGeminiChatStream = async (
  messageHistory: { role: 'user' | 'model'; parts: string }[],
  latestInput: string,
  apiKey: string | null,
  callback: (chunk: string) => void
): Promise<string> => {
  if (!apiKey) {
    // Simulate AI typing response with local engine
    await new Promise(resolve => setTimeout(resolve, 800));
    const localResult = searchDatasetLocally(latestInput);

    let botResponse = `I'd love to help you find that in KGF! ${localResult.explanation}\n\n`;

    if (localResult.foods.length > 0) {
      botResponse += `### 🍽️ Recommended Menus from our Dataset:\n`;
      localResult.foods.slice(0, 3).forEach(food => {
        botResponse += `- **${food.name}** at *${food.restaurantName}* — **₹${food.price}**  \n`;
        botResponse += `  *(Nutrition: ${food.calories}kcal, ${food.protein}g Protein | Health Score: ${food.healthScore}/100)*\n`;
      });
    }

    if (localResult.restaurants.length > 0) {
      botResponse += `\n### 🏪 Recommended Restaurants:\n`;
      localResult.restaurants.slice(0, 2).forEach(r => {
        botResponse += `- **${r.name}** in *${r.address.split(',')[2] || 'KGF'}* ⭐ **${r.rating}** (Proximity: ${r.distance} km, Delivery: ${r.deliveryTime} mins)\n`;
      });
    }

    // Add suggested actions based on matching
    botResponse += `\nWould you like me to compare prices or show complete nutrition details for any of these items? Click "Order Now" on any item in the main menu to place an order instantly!`;

    // Stream simulation (typing effect)
    let curIndex = 0;
    const interval = setInterval(() => {
      if (curIndex < botResponse.length) {
        const nextChunk = botResponse.slice(curIndex, curIndex + 12);
        callback(nextChunk);
        curIndex += 12;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return botResponse;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build KGF context to pass to Gemini
    const kgfContext = `
You are AgentAutoBite, a premium food discovery and ordering assistant for KGF (Kolar Gold Fields), Karnataka.
Your database of restaurants and foods is structured as follows. Use ONLY these restaurants and food items. DO NOT make up dummy items or restaurants.

RESTAURANTS IN DATASET:
${RESTAURANTS_DATA.map(r => `- "${r.name}": located at ${r.address}, rating ${r.rating}, delivery distance ${r.distance}km, offers: ${r.offers.join(', ')}`).join('\n')}

FOOD MENU ITEMS:
${FOODS_DATA.map(f => `- "${f.name}" at "${f.restaurantName}" (Category: ${f.category}, Veg: ${f.veg ? 'Yes' : 'No'}, Price: ₹${f.price}, Calories: ${f.calories}kcal, Protein: ${f.protein}g, Health Score: ${f.healthScore}/100)`).join('\n')}

Always recommend items strictly from this list. If the user asks for something outside, politely suggest similar dishes or items from KGF restaurants in the list.
Format your responses using clean Markdown. Be engaging, friendly and focus on nutrition, budget, and local KGF locations. Always display prices, distance, ratings, and key nutritional info (like calories and protein).
    `;

    // Package conversation history
    const geminiHistory = [
      { role: 'user', parts: [{ text: kgfContext }] },
      { role: 'model', parts: [{ text: "Understood! I will act as AgentAutoBite and only recommend foods and restaurants from the KGF dataset provided above. I am ready to guide users." }] }
    ];

    messageHistory.forEach(h => {
      geminiHistory.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.parts }]
      });
    });

    // Run Chat
    const chat = model.startChat({
      history: geminiHistory
    });

    const result = await chat.sendMessageStream(latestInput);

    let completeText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      completeText += chunkText;
      callback(chunkText);
    }

    return completeText;
  } catch (error: any) {
    console.error("Gemini API stream error:", error);
    const errorMsg = `⚠️ Gemini API Error: ${error.message || 'Error executing request'}. Please verify your API Key or connection. Falling back to offline mode.`;
    callback(errorMsg);
    return errorMsg;
  }
};

/**
 * Gemini Vision Image Scanner Simulator & API caller
 */
export interface VisionResult {
  foodName: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    healthScore: number;
  };
  recommendedRestorent: string;
  nearbyRestaurants: string[];
}

export const scanFoodImage = async (
  base64Data: string,
  apiKey: string | null
): Promise<VisionResult> => {
  if (!apiKey) {
    // Offline / Simulated Vision AI detecting a randomly chosen item from dataset
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Choose item: Ambur Biryani or Margherita Pizza based on probability
    const index = Math.random() > 0.5 ? 35 : 135; // Venus Ambur Biryani Chicken Biryani (35) or THE PIZZA PALACE Margherita (135)
    let selectedFood = FOODS_DATA.find(f => f.id === `food_${index}`) || FOODS_DATA[1];

    const nearRests = RESTAURANTS_DATA.filter(r => r.id !== selectedFood.restaurantId).slice(0, 2).map(r => r.name);

    return {
      foodName: selectedFood.name,
      nutrition: {
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbohydrates,
        fat: selectedFood.fat,
        healthScore: selectedFood.healthScore
      },
      recommendedRestorent: selectedFood.restaurantName,
      nearbyRestaurants: [selectedFood.restaurantName, ...nearRests]
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Send visual prompt with KGF food dataset reference
    const visualPrompt = `
Analyze this food image. Based on the food detected, find a matching menu item in the following KGF foods list:
${FOODS_DATA.map(f => `Name: "${f.name}", Restaurant: "${f.restaurantName}", Calories: ${f.calories}, Protein: ${f.protein}, Carbs: ${f.carbohydrates}, Fat: ${f.fat}, Health Score: ${f.healthScore}`).join('\n')}

Identify the single closest food match Name, the Restaurant it comes from, its nutritional details. 
Return only a JSON object matching this structure (no markdown formatting, no code blocks):
{
  "foodName": "Matched Food Name",
  "nutrition": {
    "calories": 400,
    "protein": 15,
    "carbs": 50,
    "fat": 12,
    "healthScore": 75
  },
  "recommendedRestorent": "Restaurant Name from list",
  "nearbyRestaurants": ["Restaurant Name", "Other Restaurant Name"]
}
If no food is recognized or no close match stands out, match it to the closest category available in KGF list.
    `;

    // Process base64
    const format = base64Data.split(';')[0].split('/')[1] || 'jpeg';
    const cleanBase64 = base64Data.split(',')[1] || base64Data;

    const result = await model.generateContent([
      visualPrompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: `image/${format}`
        }
      }
    ]);

    const rawText = result.response.text().trim();
    // Strip markdown blocks if returned
    const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonText);

    return {
      foodName: data.foodName || "Chicken Biryani",
      nutrition: data.nutrition || { calories: 650, protein: 32, carbs: 70, fat: 22, healthScore: 65 },
      recommendedRestorent: data.recommendedRestorent || "Venus Ambur Biryani",
      nearbyRestaurants: data.nearbyRestaurants || ["Venus Ambur Biryani", "AL NAAZ RESTAURENT"]
    };

  } catch (error) {
    console.error("Gemini Vision error:", error);
    // Fall back to simulation rather than failing
    return scanFoodImage(base64Data, null);
  }
};

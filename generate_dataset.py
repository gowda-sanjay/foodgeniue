import re
import os
import json

def get_food_image_and_details(name, restaurant_name):
    name_lower = name.lower()
    
    # Defaults
    category = "Other"
    veg = True
    calories = 300
    protein = 8
    carbs = 45
    fat = 8
    fiber = 2
    sugar = 3
    sodium = 400
    health_score = 65
    ingredients = ["Fresh ingredients", "Spices", "Herbs"]
    description = f"Delicious {name} prepared fresh daily at {restaurant_name}."
    
    # Image URLs from Unsplash (curated food photography)
    image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    
    if "biryani" in name_lower or "briyani" in name_lower or "kushka" in name_lower or "khuska" in name_lower:
        category = "Biryani"
        veg = False if any(x in name_lower for x in ["chicken", "mutton", "ghost", "murgh", "kabab"]) else True
        if "veg" in name_lower or "mushroom" in name_lower or "paneer" in name_lower:
            veg = True
        
        if veg:
            image = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
            description = "Aromatic basmati rice layered with garden-fresh vegetables, paneer or mushrooms, slow-cooked with traditional spices."
            calories, protein, carbs, fat = 480, 12, 75, 14
            health_score = 75
            ingredients = ["Basmati Rice", "Mixed Vegetables / Mushrooms", "Yogurt", "Mint", "Saffron", "Sensational Ghee Blend"]
        else:
            if "mutton" in name_lower or "ghost" in name_lower:
                image = "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80"
                description = "Rich, slow-cooked basmati rice with tender chunks of premium mutton, infused with proprietary spices and saffron."
                calories, protein, carbs, fat = 720, 35, 70, 28
                health_score = 60
                ingredients = ["Tender Mutton", "Basmati Rice", "Whole Spices", "Fried Onions", "Ghee", "Mint & Coriander"]
            else:
                image = "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80" # biryani
                description = "Classic KGF style aromatic chicken dum biryani cooked in layers with premium long grain basmati rice and marinated chicken."
                calories, protein, carbs, fat = 650, 32, 70, 22
                health_score = 65
                ingredients = ["Marinated Chicken", "Basmati Rice", "KGF Spice Mix", "Yogurt", "Caramelized Onions", "Ghee"]

    elif "dosa" in name_lower:
        category = "South Indian"
        veg = True
        image = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"
        description = "Crispy golden crepe made from fermented lentil and rice batter, served with fresh coconut chutney and piping hot sambar."
        calories, protein, carbs, fat = 350, 6, 58, 10
        health_score = 72
        ingredients = ["Fermented Rice & Black Gram Batter", "Potato Masala Filling (for Masala Dosa)", "Pure Ghee/Oil", "Mustard Seeds", "Curry Leaves"]

    elif "meal" in name_lower:
        category = "Meals"
        veg = True
        if "south" in name_lower:
            image = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80"
            description = "Traditional South Indian Thali complete with steamed rice, sambar, rasam, kootu, poriyal, curd, pickle, and crunchy papadum."
            calories, protein, carbs, fat = 680, 15, 110, 18
            health_score = 80
            ingredients = ["Sona Masuri Rice", "Sambar (Lentils & Veggies)", "Rasam", "Vegetable Poriyal", "Curd", "Appalam", "Ghee"]
        else:
            image = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
            description = "Delectable North Indian Thali featuring paneer butter masala, dal fry, dry vegetable subji, aromatic pullao, butter roti, curd, and sweets."
            calories, protein, carbs, fat = 780, 22, 95, 28
            health_score = 70
            ingredients = ["Paneer Subji", "Dal Tadka", "Butter Roti / Naan", "Jeera Rice", "Raita", "Gulab Jamun"]

    elif "pizza" in name_lower or "margherita" in name_lower or "delight" in name_lower or "lovers" in name_lower:
        category = "Pizza"
        veg = False if "chicken" in name_lower or "zest" in name_lower or "tikka" in name_lower else True
        if "veg" in name_lower or "mushroom" in name_lower or "corn" in name_lower or "lovers" in name_lower or "crunch" in name_lower:
            veg = True
        
        if veg:
            image = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
            description = "Premium hand-tossed crust topped with gourmet tomato sauce, low-moisture mozzarella, and freshly picked vegetables."
            calories, protein, carbs, fat = 240, 9, 28, 10 # per slice
            health_score = 55
            ingredients = ["Gourmet Wheat Crust", "San Marzano Style Pizza Sauce", "Fresh Mozzarella", "Green Peppers", "Olives", "Sweet Corn"]
        else:
            image = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"
            description = "Classic hand-tossed base loaded with spiced chicken cubes, onions, green bell peppers, and bubbling premium cheeses."
            calories, protein, carbs, fat = 280, 14, 30, 12 # per slice
            health_score = 50
            ingredients = ["Hand Tossed Pizza Base", "Spiced Chicken Tikka", "Red Onions", "Capsicum", "Mozzarella & Cheddar Blend"]

    elif "burger" in name_lower:
        category = "Fast Food"
        veg = False if "chicken" in name_lower or "crunchy" in name_lower else True
        if veg:
            image = "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
            description = "Crispy vegetable patty topped with sliced tomatoes, crisp lettuce, onions, and melted cheddar slice in a toasted sesame bun."
            calories, protein, carbs, fat = 380, 10, 48, 15
            health_score = 48
            ingredients = ["Toasted Sesame Buns", "Potato & Peas Patty", "Lettuce & Tomato", "Cheese Slice", "Eggless Burger Garlic Mayo"]
        else:
            image = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
            description = "Crispy golden fried double-spiced chicken breast fillet, stacked with crunchy lettuce and cream mayo on a toasted buttered bun."
            calories, protein, carbs, fat = 490, 24, 42, 22
            health_score = 52
            ingredients = ["Brioche Bun", "Crispy Fried Chicken Breast Fillet", "Signature Thousand Island Sauce", "Iceberg Lettuce", "Pickled Cucumbers"]

    elif "rice" in name_lower or "fried rice" in name_lower or "pulao" in name_lower or "pullao" in name_lower or "jeera" in name_lower:
        category = "Rice"
        veg = False if "chicken" in name_lower or "mutton" in name_lower or "egg" in name_lower else True
        if "paneer" in name_lower or "veg" in name_lower or "ghee" in name_lower or "jeera" in name_lower or "curd" in name_lower:
            veg = True
            
        if "curd" in name_lower:
            image = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80"
            description = "Soothing and cooling curd rice tempered with mustard seeds, curry leaves, red chillies, and ginger."
            calories, protein, carbs, fat = 220, 5, 38, 5
            health_score = 85
            ingredients = ["Cooked Rice", "Fresh Chilled Yogurt", "Ginger", "Curry Leaves", "Mustard Seeds", "Pomegranate Seeds"]
        elif "fried rice" in name_lower or "pulav" in name_lower or "pulao" in name_lower:
            image = "https://images.unsplash.com/photo-1603133872878-696658d7ec92?auto=format&fit=crop&w=600&q=80"
            description = "Indo-Chinese style premium fried rice tossed in high flame with diced carrots, beans, peas, spring onions, and special soy seasoning."
            calories, protein, carbs, fat = 420, 8, 70, 11
            health_score = 62
            ingredients = ["Basmati Rice", "Carrots & Green Beans", "Spring Onion", "Light Soy Sauce", "Toasted Sesame Oil", "White Pepper"]
        else:
            image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
            description = "Delicately flavored rice dish made with selected spices, ghee, or cumin."
            calories, protein, carbs, fat = 310, 6, 52, 9
            health_score = 70
            ingredients = ["Premium Basmati Rice", "Aromatic Spices / Cumin Seeds", "Pure Desi Ghee", "Fresh Coriander"]

    elif "noodles" in name_lower:
        category = "Chinese"
        veg = False if "chicken" in name_lower or "egg" in name_lower else True
        image = "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80"
        description = "Wok-tossed noodles with shredded bell peppers, cabbage, carrots, onion, garlic, and special premium Chinese stir-fry sauces."
        calories, protein, carbs, fat = 380, 8, 62, 10
        health_score = 58
        ingredients = ["Wheat Noodles", "Shredded Cabbage & Carrots", "Garlic & Ginger paste", "Dark Soy Sauce", "Chilli Vinegar", "Schezwan Spices"]

    elif "manchurian" in name_lower or "chilli" in name_lower or "pepper dry" in name_lower or "65" in name_lower:
        category = "Starters"
        veg = False if any(x in name_lower for x in ["chicken", "mutton", "kabab", "lollipop", "wings"]) else True
        
        if veg:
            if "gobi" in name_lower:
                image = "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
                description = "Crispy battered cauliflower florets fried to perfection and tossed in a tangy, sweet & spicy umami dark manchurian sauce."
                calories, protein, carbs, fat = 320, 5, 48, 12
                health_score = 60
                ingredients = ["Cauliflower Florets", "Ginger & Garlic", "Green Chillies", "Soy Sauce", "Corn Flour Batter", "Spring Onions"]
            elif "paneer" in name_lower:
                image = "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80"
                description = "Fresh cottage cheese chunks wok-fried with colorful bell peppers, green chillies, garlic, and rich soy-chilli glaze."
                calories, protein, carbs, fat = 360, 16, 12, 28
                health_score = 75
                ingredients = ["Fresh Paneer Blocks", "Capsicum & Onion Bulbs", "Green Chilli Paste", "Dark Soy & Red Chilli Sauce", "Garlic Decor"]
            else:
                image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                description = "Gourmet vegetable starter cooked crisp and glazed in spicy Indo-Chinese marinade."
                calories, protein, carbs, fat = 260, 6, 32, 11
                health_score = 68
                ingredients = ["Mixed Vegetables / Mushrooms", "Oriental Sauce Glaze", "Scallions", "Crushed Black Pepper"]
        else:
            if "kabab" in name_lower or "lollipop" in name_lower:
                image = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
                description = "KGF famous crispy and juicy fried chicken joints marinated overnight in red yogurt spices and shallow fried."
                calories, protein, carbs, fat = 320, 24, 8, 20
                health_score = 62
                ingredients = ["Chicken Drumettes / Chunks", "Yogurt Marinade", "Deggi Mirch spice", "Ginger-Garlic Paste", "Lemon Squeeze"]
            else: # Pepper dry/65
                image = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
                description = "Tender pieces of chicken tossed with crushed curry leaves, black pepper, green chillies, and local spices in a dry wok."
                calories, protein, carbs, fat = 290, 22, 6, 18
                health_score = 65
                ingredients = ["Boneless Chicken Chunks", "Coarse Black Pepper", "Curry Leaves", "Green Slit Chillies", "Ghee Roasting"]

    elif "roll" in name_lower:
        category = "Rolls"
        veg = False if "chicken" in name_lower or "mutton" in name_lower or "egg" in name_lower else True
        image = "https://images.unsplash.com/photo-1626700051175-6518c4793f76?auto=format&fit=crop&w=600&q=80"
        description = "Flaky flatbread wrap rolled with onions, green pepper, fresh cabbage, mint chutney, and choice of delicious fillings."
        calories, protein, carbs, fat = 310, 11, 42, 11
        health_score = 68
        ingredients = ["Whole Wheat Paratha Base", "Fresh Salad Juliennes", "Mint Yogurt Sauce", "Lemon juice", "Paneer / Mushroom / Chicken Filling"]

    elif "bucket" in name_lower or "nuggets" in name_lower or "wings" in name_lower or "fries" in name_lower or "cheese balls" in name_lower or "smiles" in name_lower or "crispy" in name_lower:
        category = "Fast Food"
        veg = False if any(x in name_lower for x in ["chicken", "wings", "lollipop", "masala", "bucket"]) else True
        
        if "fries" in name_lower:
            image = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"
            description = "Crispy golden premium quality French fries sprinkled with salt, served hot with tomato ketchup."
            calories, protein, carbs, fat = 312, 3.4, 41, 15
            health_score = 40
            ingredients = ["Golden Potatoes", "Iodized Salt", "Premium frying oil"]
        elif "cheese" in name_lower:
            image = "https://images.unsplash.com/photo-1548340748-6d2b7d7db87d?auto=format&fit=crop&w=600&q=80"
            description = "Deep fried breaded potato spheres filled with melting mozzarella cheese and herbs."
            calories, protein, carbs, fat = 280, 8, 22, 18
            health_score = 45
            ingredients = ["Processed Cheese & Mozzarella", "Mashed Potatoes", "Bread Crumbs coating", "Herbs"]
        elif "chicken" in name_lower or "wings" in name_lower or "nuggets" in name_lower:
            image = "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80"
            description = "Crispy, crunchy breaded tenders seasoned with southern style garlic pepper spices."
            calories, protein, carbs, fat = 390, 22, 25, 21
            health_score = 50
            ingredients = ["Chicken pieces / Minced Breast", "Crispy Herb Crust", "Secret seasoning", "Garlic Butter wash"]
        else:
            image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"

    elif "gravy" in name_lower or "butter chicken" in name_lower or "masala" in name_lower or "kurma" in name_lower or "dal" in name_lower or "daal" in name_lower or "tadka" in name_lower:
        category = "Curries"
        veg = False if any(x in name_lower for x in ["chicken", "mutton", "keema", "egg"]) else True
        
        if veg:
            if "paneer" in name_lower or "butter" in name_lower:
                image = "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
                description = "Soft paneer cubes simmered in a velvety, rich tomato and butter cashew gravy, spiked with kasuri methi."
                calories, protein, carbs, fat = 380, 14, 12, 30
                health_score = 75
                ingredients = ["Fresh Paneer", "Cashew paste", "Butter & Cream", "Tomato Puree", "Kasuri Methi"]
            elif "dal" in name_lower or "daal" in name_lower:
                image = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
                description = "Classic protein-packed yellow lentils tempered with cumin, double garlic, onions, tomatoes, and dry red chillies in ghee."
                calories, protein, carbs, fat = 190, 9, 22, 7
                health_score = 88
                ingredients = ["Toor Dal (Yellow Lentil)", "Cumin seeds", "Garlic cloves", "Ghee / Mustard Oil", "Coriander garnish"]
            else:
                image = "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
                description = "Mixed vegetables slow simmered in an aromatic curry of coconut, poppy seeds, and southern spices."
                calories, protein, carbs, fat = 240, 6, 20, 15
                health_score = 80
                ingredients = ["Mixed Vegetables", "Coconut milk base", "Poppy paste", "Curry Leaves"]
        else:
            if "butter chicken" in name_lower:
                image = "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80"
                description = "Tandoori grilled chicken chunks cooked in our signature rich tomato cashew cream gravy with butter."
                calories, protein, carbs, fat = 460, 28, 14, 32
                health_score = 58
                ingredients = ["Boneless Grilled Chicken", "Cashew-Tomato Gravy Base", "Fresh Cream", "Unsalted Butter", "Kasuri Methi"]
            else:
                image = "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80"
                description = "Slow braised tender chicken or mutton gravy cooked in an authentic onion-tomato-ginger paste with local spices."
                calories, protein, carbs, fat = 380, 26, 10, 26
                health_score = 65
                ingredients = ["Chicken / Mutton select cuts", "Yogurt & Onion gravy", "Fresh ground garam masala", "Ginger-Garlic paste"]
                
    elif "egg" in name_lower or "omelette" in name_lower:
        category = "Eggs"
        veg = False # Egg is non-veg in general food ordering context
        
        if "boiled" in name_lower:
            image = "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=600&q=80"
            description = "High protein farm-grade hard-boiled egg served with a pinch of fresh salt and black pepper."
            calories, protein, carbs, fat = 78, 6.3, 0.6, 5.3
            health_score = 92
            ingredients = ["Fresh Farm Egg", "Iodized Salt & Black Pepper"]
        else:
            image = "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=600&q=80"
            description = "Fluffy pan-fried double egg omelette with green chillies, diced onions, tomatoes, and fresh coriander leaves."
            calories, protein, carbs, fat = 154, 12, 2, 11
            health_score = 80
            ingredients = ["Two Farm Eggs", "Diced Onions & Tomatoes", "Green Chilli bits", "Salt & Pepper", "Oil Wash"]

    elif "parrota" in name_lower or "plain" in name_lower:
        category = "Bread"
        veg = True
        image = "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80"
        description = "Flaky, multi-layered flatbread made of refined wheat flour, toasted crisp on a flat tawa with ghee."
        calories, protein, carbs, fat = 260, 5, 42, 8
        health_score = 50
        ingredients = ["Refined Maida Flour", "Milk & Sugar wash", "Ghee / Cooking oil layering"]

    elif "salad" in name_lower:
        category = "Salad"
        veg = True
        image = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
        description = "Chilled garden fresh sliced cucumbers, tomatoes, carrots, onions, and lemon wedges."
        calories, protein, carbs, fat = 45, 1, 9, 0.5
        health_score = 95
        ingredients = ["Cucumber slices", "Hybrid tomatoes", "Carrot rounds", "Onion rings", "Lemon wedge", "Chat masala"]

    return {
        "category": category,
        "veg": veg,
        "calories": calories,
        "protein": protein,
        "carbohydrates": carbs,
        "fat": fat,
        "fiber": fiber,
        "sugar": sugar,
        "sodium": sodium,
        "healthScore": health_score,
        "ingredients": ingredients,
        "image": image,
        "description": description
    }

def main():
    dataset_file = r"c:\Users\Sanjay Gowda\OneDrive\Desktop\food order\data_temp\dataset kgf-2.txt"
    if not os.path.exists(dataset_file):
        print(f"File not found: {dataset_file}")
        return
        
    with open(dataset_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Split by pages
    pages = content.split("--- PAGE ")
    
    # We want to collect restaurants and foods
    restaurants = {}
    foods = []
    
    # Regex to find links (https://maps.app.goo.gl/...)
    # Regex to match dish names, prices, and optionally restaurant names on the same line
    # Lines are like:
    # North Indian meal 149 THE JANARDHAN CAFE
    # https://maps.app.goo.gl/9LHQWXzYmUipGuUT7
    # OR:
    # South Indian meal 169
    #
    # Let's iterate through lines and parse them
    current_restaurant = None
    
    # Keep track of locations in KGF for distributing restaurants
    kgf_locations = [
        "Robertsonpet",
        "Andersonpet",
        "Champion Reefs",
        "Marikuppam",
        "Oorgaum",
        "Coromandel",
        "BEML Nagar",
        "Bharath Nagar"
    ]
    
    # Assign specific details to makes restaurants feel premium
    logo_map = {
        "THE JANARDHAN CAFE": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=150&h=150&q=80",
        "AL NAAZ RESTAURENT": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&h=150&q=80",
        "AL-BAIK RESTAURANT": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&h=150&q=80",
        "Venus Ambur Biryani": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=150&h=150&q=80",
        "The Food Central": "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=150&h=150&q=80",
        "LAKSHMI PRADAYA UDUPI HOTEL": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&h=150&q=80",
        "Dhanalakshmi Hotel": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=150&h=150&q=80",
        "New Grand Taj Hotel (Hygienic food)": "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&w=150&h=150&q=80",
        "Hotel Saravana Biryani Center": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=150&h=150&q=80",
        "Crispy Chick": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=150&h=150&q=80",
        "Veg craft": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=150&h=150&q=80",
        "THE PIZZA PALACE": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=150&h=150&q=80"
    }
    
    cover_map = {
        "THE JANARDHAN CAFE": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
        "AL NAAZ RESTAURENT": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "AL-BAIK RESTAURANT": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80",
        "Venus Ambur Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
        "The Food Central": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1200&q=80",
        "LAKSHMI PRADAYA UDUPI HOTEL": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80",
        "Dhanalakshmi Hotel": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
        "New Grand Taj Hotel (Hygienic food)": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "Hotel Saravana Biryani Center": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
        "Crispy Chick": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80",
        "Veg craft": "https://images.unsplash.com/photo-1490815685121-0b0dec33acfb?auto=format&fit=crop&w=1200&q=80",
        "THE PIZZA PALACE": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
    }

    cuisine_map = {
        "THE JANARDHAN CAFE": "South Indian, North Indian, Breakfast, Beverages",
        "AL NAAZ RESTAURENT": "Mughlai, Biryani, Street Food",
        "AL-BAIK RESTAURANT": "Arabian, Biryani, Rice Dishes",
        "Venus Ambur Biryani": "Ambur Biryani, Tandoori Starters, Chinese",
        "The Food Central": "Gourmet Paneer, Manchurian Special, Starters",
        "LAKSHMI PRADAYA UDUPI HOTEL": "Pure Veg Udupi Delicacies, Biryanis, Noodles",
        "Dhanalakshmi Hotel": "Local Karnataka Non-Veg, Kabab & Biryani",
        "New Grand Taj Hotel (Hygienic food)": "Nandan Mughlai & Taj Biryani Specialties, Curries",
        "Hotel Saravana Biryani Center": "Traditional Biryani, Gravies, Comfort Sides",
        "Crispy Chick": "Fried Chicken, Burgers, Pizza, Fast Food Snacks",
        "Veg craft": "Crispy Indo-Chinese, Veg Platters, Rolls",
        "THE PIZZA PALACE": "Italian Pizzas, Bread Sticks, Cheese Crust Pizzas"
    }
    
    desc_map = {
        "THE JANARDHAN CAFE": "The ultimate destination for coffee lovers, piping hot idli-dosa, and authentic, home-style North and South Indian meals in KGF.",
        "AL NAAZ RESTAURENT": "Famous for rich aromatics, slow-cooked mutton and chicken biryanis, and classical Mughlai flavors loved by families.",
        "AL-BAIK RESTAURANT": "Delicious Middle-Eastern style biryanis, Murgh specialties, and fluffy ghee rice cooked in pure spices.",
        "Venus Ambur Biryani": "Legendary Ambur-style wood-fired biryani served with mouth watering chicken kababs and signature sour brinjal curry.",
        "The Food Central": "A premium vegetarian starter hub specializing in sizzling gobi and paneer manchurian cooked to perfection.",
        "LAKSHMI PRADAYA UDUPI HOTEL": "Authentic Udupi vegetarian restaurant offering healthy thalis, delicious pullaos, and steaming noodles.",
        "Dhanalakshmi Hotel": "Home style rustic non-veg hotel known for hot chicken lollipops, spicy mutton biryani, and butter chicken.",
        "New Grand Taj Hotel (Hygienic food)": "Serving the finest, hygienically prepared traditional Taj Biryani, succulent parotas, and flavorful gravies.",
        "Hotel Saravana Biryani Center center": "A popular local spot for quick delicious plates of mutton biryani, juicy kababs, and spicy chicken gravies.",
        "Hotel Saravana Biryani Center": "A popular local spot for quick delicious plates of mutton biryani, juicy kababs, and spicy chicken gravies.",
        "Crispy Chick": "Get your cravings sorted with crunchy fried burgers, golden chicken buckets, cheesy pizzas, and hot wings.",
        "Veg craft": "KGF's favorite veg fast-food corner serving rolls, baby corn manchurians, and Chinese wraps.",
        "THE PIZZA PALACE": "Handcrafted thin crust and cheese burst pizzas made with raw organic ingredients, fresh veggies, and rich cheeses."
    }

    # Split lines and analyze
    lines = content.splitlines()
    
    i = 0
    lines_len = len(lines)
    while i < lines_len:
        line = lines[i].strip()
        if not line or line.startswith("---") or line.startswith("DISHES"):
            i += 1
            continue
            
        # Check if line contains a URL
        is_url = "https://" in line
        if is_url:
            if current_restaurant:
                restaurants[current_restaurant]["googleMaps"] = line
            i += 1
            continue
            
        # Parse dish, price and restaurant
        # Format might be:
        # "North Indian meal 149 THE JANARDHAN CAFE"
        # Or:
        # "South Indian meal 169"
        
        # Let's see if we can find a restaurant name by matching known restaurants
        rest_match = None
        for rn in logo_map.keys():
            if rn in line:
                rest_match = rn
                break
                
        if rest_match:
            # We found a restaurant name in this line!
            # The line contains: DishName Price RestaurantName
            # Let's extract the price and dish name
            # Split the line by the restaurant name
            dish_and_price = line.split(rest_match)[0].strip()
            # Find the price at the end of dish_and_price
            price_match = re.search(r"(\d+)$", dish_and_price)
            if price_match:
                price = int(price_match.group(1))
                dish_name = dish_and_price[:price_match.start()].strip()
            else:
                price = 100 # default
                dish_name = dish_and_price
                
            current_restaurant = rest_match
            if current_restaurant not in restaurants:
                loc_idx = len(restaurants) % len(kgf_locations)
                restaurants[current_restaurant] = {
                    "id": current_restaurant.lower().replace(" ", "_").replace("(", "").replace(")", ""),
                    "name": current_restaurant,
                    "coverImage": cover_map[current_restaurant],
                    "logo": logo_map[current_restaurant],
                    "cuisine": cuisine_map[current_restaurant],
                    "description": desc_map[current_restaurant],
                    "address": f"KGF Main Road, Near Bus Stand, {kgf_locations[loc_idx]}, KGF, Karnataka",
                    "googleMaps": "",
                    "rating": round(4.0 + (len(restaurants) % 10) * 0.1, 1),
                    "reviewsCount": 120 + (len(restaurants) * 35) % 400,
                    "distance": round(1.0 + (len(restaurants) * 0.75) % 5.0, 1),
                    "deliveryTime": 20 + (len(restaurants) * 5) % 25,
                    "openingHours": "09:00 AM" if "udupi" in current_restaurant.lower() or "janardhan" in current_restaurant.lower() else "11:30 AM",
                    "closingHours": "10:30 PM" if "pizza" in current_restaurant.lower() or "crispy" in current_restaurant.lower() or "baik" in current_restaurant.lower() else "10:00 PM",
                    "offers": ["50% OFF up to ₹100 using Genie50", "Free delivery on orders above ₹199"] if len(restaurants) % 2 == 0 else ["Flat ₹50 OFF using GenieFlat", "Buy 1 Get 1 on select dishes"],
                    "popularFoods": []
                }
            
            # Add food item
            food_detail = get_food_image_and_details(dish_name, current_restaurant)
            food_item = {
                "id": f"food_{len(foods) + 1}",
                "name": dish_name,
                "restaurantId": restaurants[current_restaurant]["id"],
                "restaurantName": current_restaurant,
                "category": food_detail["category"],
                "price": price,
                "image": food_detail["image"],
                "description": food_detail["description"],
                "ingredients": food_detail["ingredients"],
                "calories": food_detail["calories"],
                "protein": food_detail["protein"],
                "carbohydrates": food_detail["carbohydrates"],
                "fat": food_detail["fat"],
                "fiber": food_detail["fiber"],
                "sugar": food_detail["sugar"],
                "sodium": food_detail["sodium"],
                "healthScore": food_detail["healthScore"],
                "veg": food_detail["veg"],
                "rating": round(4.1 + (len(foods) % 8) * 0.1, 1),
                "deliveryTime": restaurants[current_restaurant]["deliveryTime"],
                "availability": True
            }
            foods.append(food_item)
            restaurants[current_restaurant]["popularFoods"].append(dish_name)
            
        else:
            # It's a regular dish line, e.g. "South Indian meal 169"
            # Parse price at the end of the line
            price_match = re.search(r"(\d+)$", line)
            if price_match and current_restaurant:
                price = int(price_match.group(1))
                dish_name = line[:price_match.start()].strip()
                
                food_detail = get_food_image_and_details(dish_name, current_restaurant)
                food_item = {
                    "id": f"food_{len(foods) + 1}",
                    "name": dish_name,
                    "restaurantId": restaurants[current_restaurant]["id"],
                    "restaurantName": current_restaurant,
                    "category": food_detail["category"],
                    "price": price,
                    "image": food_detail["image"],
                    "description": food_detail["description"],
                    "ingredients": food_detail["ingredients"],
                    "calories": food_detail["calories"],
                    "protein": food_detail["protein"],
                    "carbohydrates": food_detail["carbohydrates"],
                    "fat": food_detail["fat"],
                    "fiber": food_detail["fiber"],
                    "sugar": food_detail["sugar"],
                    "sodium": food_detail["sodium"],
                    "healthScore": food_detail["healthScore"],
                    "veg": food_detail["veg"],
                    "rating": round(4.1 + (len(foods) % 8) * 0.1, 1),
                    "deliveryTime": restaurants[current_restaurant]["deliveryTime"],
                    "availability": True
                }
                foods.append(food_item)
                # Keep first 3 dishes as popular
                if len(restaurants[current_restaurant]["popularFoods"]) < 4:
                    restaurants[current_restaurant]["popularFoods"].append(dish_name)
            else:
                # If there's no price, we skip or it's a heading
                pass
                
        i += 1

    # Convert restaurants back to a list
    restaurant_list = list(restaurants.values())
    
    # Let's ensure directories exist
    os.makedirs(r"c:\Users\Sanjay Gowda\OneDrive\Desktop\food order\src\data", exist_ok=True)
    
    output_path = r"c:\Users\Sanjay Gowda\OneDrive\Desktop\food order\src\data\restaurants.ts"
    
    # Save the data in a beautiful TS format
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("export interface Restaurant {\n")
        out.write("  id: string;\n")
        out.write("  name: string;\n")
        out.write("  coverImage: string;\n")
        out.write("  logo: string;\n")
        out.write("  cuisine: string;\n")
        out.write("  description: string;\n")
        out.write("  address: string;\n")
        out.write("  googleMaps: string;\n")
        out.write("  rating: number;\n")
        out.write("  reviewsCount: number;\n")
        out.write("  distance: number;\n")
        out.write("  deliveryTime: number;\n")
        out.write("  openingHours: string;\n")
        out.write("  closingHours: string;\n")
        out.write("  offers: string[];\n")
        out.write("  popularFoods: string[];\n")
        out.write("}\n\n")
        
        out.write("export interface FoodItem {\n")
        out.write("  id: string;\n")
        out.write("  name: string;\n")
        out.write("  restaurantId: string;\n")
        out.write("  restaurantName: string;\n")
        out.write("  category: string;\n")
        out.write("  price: number;\n")
        out.write("  image: string;\n")
        out.write("  description: string;\n")
        out.write("  ingredients: string[];\n")
        out.write("  calories: number;\n")
        out.write("  protein: number;\n")
        out.write("  carbohydrates: number;\n")
        out.write("  fat: number;\n")
        out.write("  fiber: number;\n")
        out.write("  sugar: number;\n")
        out.write("  sodium: number;\n")
        out.write("  healthScore: number;\n")
        out.write("  veg: boolean;\n")
        out.write("  rating: number;\n")
        out.write("  deliveryTime: number;\n")
        out.write("  availability: boolean;\n")
        out.write("}\n\n")
        
        out.write("export const RESTAURANTS_DATA: Restaurant[] = ")
        out.write(json.dumps(restaurant_list, indent=2))
        out.write(";\n\n")
        
        out.write("export const FOODS_DATA: FoodItem[] = ")
        out.write(json.dumps(foods, indent=2))
        out.write(";\n")
        
    print(f"Generated {len(restaurant_list)} restaurants, and {len(foods)} food items in {output_path} successfully!")

if __name__ == "__main__":
    main()

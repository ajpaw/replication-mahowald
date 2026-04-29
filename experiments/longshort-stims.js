const STIMULI = [
    {
      "short_word": "AC",
      "long_word": "air conditioning",
      "supportive_context": "The office felt stuffy and hot, so she turned on the",
      "neutral_context": "The office had recently been renovated, so she commented on the",
      "comprehension_question": ""
    },
    {
      "short_word": "chemo",
      "long_word": "chemotherapy",
      "supportive_context": "After the cancer diagnosis, he began weekly sessions of",
      "neutral_context": "After the diagnosis, he decided to opt in for",
      "comprehension_question": ""
    },
    {
      "short_word": "Coke",
      "long_word": "Coca-Cola",
      "supportive_context": "Of all the soda options in the market, I prefer",
      "neutral_context": "Before leaving for the trip, he went to buy some",
      "comprehension_question": ""
    },
    {
      "short_word": "burger",
      "long_word": "hamburger",
      "supportive_context": "For lunch, he ordered fries and a grilled",
      "neutral_context": "For dinner, he ordered some soda and a",
      "comprehension_question": ""
    },
    {
      "short_word": "chimp",
      "long_word": "chimpanzee",
      "supportive_context": "At the primate exhibit, Susan pointed right at the",
      "neutral_context": "On the quiet street, Susan pointed straight at the",
      "comprehension_question": ""
    },
    {
      "short_word": "dorm",
      "long_word": "dormitory",
      "supportive_context": "During freshman move-in week, she carried boxes to her",
      "neutral_context": "In the afternoon sun, she carried boxes to the",
      "comprehension_question": ""
    },
    {
      "short_word": "ER",
      "long_word": "emergency room",
      "supportive_context": "Alex broke his arm while playing and was rushed to the",
      "neutral_context": "Alex tried to find seating while his son was in the",
      "comprehension_question": ""
    },
    {
      "short_word": "fridge",
      "long_word": "refrigerator",
      "supportive_context": "To keep the milk cold overnight, she put it in the",
      "neutral_context": "To make space in the house, she downsized her",
      "comprehension_question": ""
    },
    {
      "short_word": "gas",
      "long_word": "gasoline",
      "supportive_context": "When the fuel gauge hit empty, he pulled over to buy",
      "neutral_context": "When the long meeting finally ended, he walked outside to buy",
      "comprehension_question": ""
    },
    {
      "short_word": "frat",
      "long_word": "fraternity",
      "supportive_context": "During pledge week on campus, he visited the",
      "neutral_context": "He invited us for an event at the",
      "comprehension_question": ""
    },
    {
      "short_word": "carbs",
      "long_word": "carbohydrates",
      "supportive_context": "He refused to eat rice because he was off",
      "neutral_context": "The doctor asked the boy if he eats enough",
      "comprehension_question": ""
    },
    {
      "short_word": "ad",
      "long_word": "advertisement",
      "supportive_context": "Every time I play a youtube video, I have to watch an",
      "neutral_context": "Every time I drive down this street, I notice the new store's",
      "comprehension_question": ""
    },
    {
      "short_word": "bike",
      "long_word": "bicycle",
      "supportive_context": "I grabbed my helmet and left for work on my",
      "neutral_context": "I decided to use my day to finally clean my",
      "comprehension_question": ""
    },
    {
      "short_word": "exam",
      "long_word": "examination",
      "supportive_context": "After studying all week, he felt ready for the",
      "neutral_context": "Even after scheduling his week, he forgot about his",
      "comprehension_question": ""
    },
    {
      "short_word": "hippo",
      "long_word": "hippopotamus",
      "supportive_context": "He walked to the marshy area and saw a big",
      "neutral_context": "During my travels last summer, I unexpectedly encountered a large",
      "comprehension_question": ""
    },
    {
      "short_word": "ID",
      "long_word": "identification",
      "supportive_context": "Before boarding the flight, she had to present her",
      "neutral_context": "Before leaving home, she checked whether she carried her",
      "comprehension_question": ""
    },
    {
      "short_word": "kilo",
      "long_word": "kilogram",
      "supportive_context": "At the Indian bazaar, she bought fruits by the",
      "neutral_context": "At the museum, she saw the standard for a",
      "comprehension_question": ""
    },
    {
      "short_word": "limo",
      "long_word": "limousine",
      "supportive_context": "The bachelor party started with a ride in a",
      "neutral_context": "My neighbor went to the showroom and bought a",
      "comprehension_question": ""
    },
    {
      "short_word": "lab",
      "long_word": "laboratory",
      "supportive_context": "The chemist realized there was smoke in the",
      "neutral_context": "Prior to 2026, this building housed a national",
      "comprehension_question": ""
    },
    {
      "short_word": "math",
      "long_word": "mathematics",
      "supportive_context": "Because calculus was difficult for him, he feared",
      "neutral_context": "Because of the holiday, he could focus on",
      "comprehension_question": ""
    },
    {
      "short_word": "mayo",
      "long_word": "mayonnaise",
      "supportive_context": "The child, who was eating a dry burger, cried for more",
      "neutral_context": "The store owner, who had received complaints, finally restocked his supply of",
      "comprehension_question": ""
    },
    {
      "short_word": "memo",
      "long_word": "memorandum",
      "supportive_context": "To formally announce the policy change, the director circulated a",
      "neutral_context": "To allow for more transparency here, the leader circulated a",
      "comprehension_question": ""
    },
    {
      "short_word": "mic",
      "long_word": "microphone",
      "supportive_context": "So everyone could hear her clearly, she switched on the",
      "neutral_context": "Sam walked across the large hall and picked up the",
      "comprehension_question": ""
    },
    {
      "short_word": "phone",
      "long_word": "telephone",
      "supportive_context": "After the landline rang twice, she answered the",
      "neutral_context": "After the meeting ended, she walked to the",
      "comprehension_question": ""
    },
    {
      "short_word": "photo",
      "long_word": "photograph",
      "supportive_context": "The family posed for a quick",
      "neutral_context": "The officials asked me for my",
      "comprehension_question": ""
    },
    {
      "short_word": "porn",
      "long_word": "pornography",
      "supportive_context": "The site was taken down because it contained",
      "neutral_context": "The scientists are studying the health effects of",
      "comprehension_question": ""
    },
    {
      "short_word": "quads",
      "long_word": "quadriceps",
      "supportive_context": "I did ten squats to target my",
      "neutral_context": "I asked my father to use his",
      "comprehension_question": ""
    },
    {
      "short_word": "ref",
      "long_word": "referee",
      "supportive_context": "The angry soccer player argued with the",
      "neutral_context": "Before his retirement, Sam worked as a",
      "comprehension_question": ""
    },
    {
      "short_word": "roach",
      "long_word": "cockroach",
      "supportive_context": "In my kitchen, I accidentally stepped on a",
      "neutral_context": "In this house, I have never seen a",
      "comprehension_question": ""
    },
    {
      "short_word": "rhino",
      "long_word": "rhinoceros",
      "supportive_context": "On the wildlife safari, I spotted a",
      "neutral_context": "On my last tour, I saw a",
      "comprehension_question": ""
    },
    {
      "short_word": "sax",
      "long_word": "saxophone",
      "supportive_context": "He went to the jazz bar to play his",
      "neutral_context": "The attic door opened and I saw my old",
      "comprehension_question": ""
    },
    {
      "short_word": "shake",
      "long_word": "milkshake",
      "supportive_context": "At the dessert counter, he ordered a chocolate",
      "neutral_context": "At the event today, he asked for a large",
      "comprehension_question": ""
    },
    {
      "short_word": "TV",
      "long_word": "television",
      "supportive_context": "To watch the game live, I turned on the",
      "neutral_context": "I am currently learning how to repair my own",
      "comprehension_question": ""
    },
    {
      "short_word": "undergrad",
      "long_word": "undergraduate",
      "supportive_context": "She remembered her first day on campus as an",
      "neutral_context": "She started a new company recently and hired an",
      "comprehension_question": ""
    },
    {
      "short_word": "UK",
      "long_word": "United Kingdom",
      "supportive_context": "The Big Ben is a popular landmark in the",
      "neutral_context": "After the tsunami, the island nation promptly thanked the",
      "comprehension_question": ""
    },
    {
      "short_word": "UN",
      "long_word": "United Nations",
      "supportive_context": "In the General Assembly, the speaker addressed the",
      "neutral_context": "The students learned about the establishment of the",
      "comprehension_question": ""
    },
    {
      "short_word": "US",
      "long_word": "United States",
      "supportive_context": "The tourist was excited to try fast food chains in the",
      "neutral_context": "The journalist listed all the concerts that took place in the",
      "comprehension_question": ""
    },
    {
      "short_word": "vet",
      "long_word": "veterinarian",
      "supportive_context": "Because my cat had a fever, I took her to the",
      "neutral_context": "I grabbed coffee with my neighbor, who happens to be a",
      "comprehension_question": ""
    }
  ];
  
const CHECKS = [
  {"question": "Donald Trump is the current Prime Minister of Italy" , "correct_answer":"J"},
  {"question": "Some cars run on olive oil" , "correct_answer":"J"},
  {"question": "Cows can fly" , "correct_answer":"J"},    
  {"question": "All humans have red hair", "correct_answer":"J"},
  {"question": "Butter is a dairy product", "correct_answer":"F"},          
  {"question": "Minors are not allowed to vote", "correct_answer":"F"},
  {"question": "Dentists specialize in tooth issues", "correct_answer":"F"}
]
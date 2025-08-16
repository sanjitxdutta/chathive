export const randomName = (): string => {
  const adjectives = [
    "Epic", "Mighty", "Cheerful", "Swift", "Glorious", "Witty", "Brave", "Funky",
    "Cosmic", "Sneaky", "Turbo", "Clever", "Chill", "Sassy", "Wild", "Groovy",
    "Legendary", "Sleepy", "Shiny", "Magical", "Spicy", "Cringe", "Weird",
    "Lazy", "Hyper", "Sparkly", "Savage", "Fierce", "Zany", "Quirky", "Noble"
  ];

  const nouns = [
    "Dragon", "Phoenix", "Panda", "Robot", "Ninja", "Wizard", "Tiger", "Falcon",
    "Otter", "Unicorn", "Dolphin", "Knight", "Samurai", "Viking", "Shark",
    "Wolf", "Llama", "Sloth", "Banana", "Pickle", "Potato", "Taco", "Penguin",
    "Alien", "Goblin", "Cat", "Doggo", "Cactus", "Monkey", "Koala", "Pikachu"
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 10000);
  return `${adj}${noun}${num}`;
};

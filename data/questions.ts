export type VillainKey = "voldemort" | "bellatrix" | "umbridge" | "lucius";

export const questions: {
  text: string;
  choices: { text: string; key: VillainKey }[];
}[] = [
  {
    text: "You've been invited to a party where you barely know anyone. What's your approach?",
    choices: [
      { text: "Find someone interesting and see where the evening takes you.", key: "bellatrix" },
      { text: "Introduce yourself to the host and make a few useful connections.", key: "lucius" },
      { text: "Stick with the people you came with. They're more fun anyway.", key: "umbridge" },
      { text: "Take a little time to observe everyone before deciding who to approach.", key: "voldemort" },
    ],
  },
  {
    text: "Which compliment would mean the most to you?",
    choices: [
      { text: "“You always know exactly what to say.”", key: "lucius" },
      { text: "“I don't know what I'd do without you.”", key: "bellatrix" },
      { text: "“You have such an incredible mind.”", key: "voldemort" },
      { text: "“I wish I had my life as together as yours.”", key: "umbridge" },
    ],
  },
  {
    text: "You're working on a group project, but things aren't going according to plan. What do you do?",
    choices: [
      { text: "Take charge of the most important decisions so nothing gets overlooked.", key: "voldemort" },
      { text: "Organize everyone's responsibilities and establish some clear deadlines.", key: "umbridge" },
      { text: "Rally the group and remind everyone why the project matters.", key: "bellatrix" },
      { text: "Have a few private conversations to figure out what's really going wrong.", key: "lucius" },
    ],
  },
  {
    text: "You've unexpectedly inherited a large sum of money. What's your first instinct?",
    choices: [
      { text: "Invest in something that could create opportunities for years to come.", key: "lucius" },
      { text: "Make sure the people closest to you get to enjoy some of it.", key: "bellatrix" },
      { text: "Put it toward a personal ambition you've been waiting to pursue.", key: "voldemort" },
      { text: "Create a solid financial plan before making any major decisions.", key: "umbridge" },
    ],
  },
  {
    text: "Which of these would bother you the most?",
    choices: [
      { text: "Someone taking credit for an idea you came up with.", key: "voldemort" },
      { text: "Being excluded from an important decision.", key: "lucius" },
      { text: "A friend canceling plans with you to spend time with someone else.", key: "bellatrix" },
      { text: "Someone repeatedly ignoring an agreement you've made.", key: "umbridge" },
    ],
  },
  {
    text: "You're planning your dream vacation. What appeals to you most?",
    choices: [
      { text: "An elegant getaway with exceptional restaurants and exclusive experiences.", key: "lucius" },
      { text: "An adventurous trip with your favorite people and plenty of surprises.", key: "bellatrix" },
      { text: "A carefully planned itinerary where every detail is taken care of.", key: "umbridge" },
      { text: "Exploring a fascinating destination and discovering things few people know about.", key: "voldemort" },
    ],
  },
  {
    text: "A friend comes to you with a problem. What's your natural response?",
    choices: [
      { text: "Help them create a practical plan for fixing it.", key: "umbridge" },
      { text: "Listen carefully, then suggest a different way of looking at the situation.", key: "voldemort" },
      { text: "Ask who or what caused the problem. You're ready to take their side.", key: "bellatrix" },
      { text: "Help them figure out whom to talk to and how to get things moving.", key: "lucius" },
    ],
  },
  {
    text: "Which of these sounds most like your idea of success?",
    choices: [
      { text: "Building a life that feels secure, comfortable, and exactly how you want it.", key: "umbridge" },
      { text: "Being surrounded by people who truly love and understand you.", key: "bellatrix" },
      { text: "Accomplishing something extraordinary that people will remember.", key: "voldemort" },
      { text: "Earning the respect of people whose opinions matter to you.", key: "lucius" },
    ],
  },
];

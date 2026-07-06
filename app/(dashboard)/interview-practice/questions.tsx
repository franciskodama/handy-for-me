export const pmInterviewQuestions = [
  {
    id: 1,
    category: 'Product Strategy & Vision',
    question: "How do you define a product's North Star metric?",
    answer:
      "It is the single key metric that best captures the core value your product delivers to customers. It must align user value with long-term business growth, such as 'Normalized Assets Tracked' for a fintech tool."
  },
  {
    id: 2,
    category: 'Product Strategy & Vision',
    question:
      'Walk me through a time you had to pivot a product strategy based on data.',
    answer:
      'At my agency, we shifted from broad marketing services to specialized product development after data showed a 40% higher LTV and better retention in technical builds versus creative campaigns.'
  },
  {
    id: 3,
    category: 'Product Strategy & Vision',
    question:
      'How do you balance short-term revenue goals with long-term product vision?',
    answer:
      "By using a '70/20/10' roadmap: 70% on core vision, 20% on tactical revenue requests, and 10% on innovative bets to ensure the 'now' doesn't kill the 'future'."
  },
  {
    id: 4,
    category: 'Product Strategy & Vision',
    question:
      'Tell me about a product you love but think is positioned poorly. How would you fix it?',
    answer:
      "I’d look at specialized IDEs that market to 'beginners' but have 'pro' features. I’d reposition them around 'Productivity Velocity' for senior leads to capture the high-value market."
  },
  {
    id: 5,
    category: 'Product Strategy & Vision',
    question: 'How do you decide which features to kill?',
    answer:
      "I use a quadrant analysis comparing 'Usage Frequency' vs. 'Core Value Alignment.' If a feature is high-maintenance but low-usage and doesn't support the North Star, it's deprecated."
  },
  {
    id: 6,
    category: 'Product Strategy & Vision',
    question:
      "How do you handle a founder who wants a feature that doesn't align with the roadmap?",
    answer:
      "I validate their intent, then present the 'Opportunity Cost.' I show what must be delayed or removed to accommodate the request, shifting the conversation to trade-offs rather than a simple 'no'."
  },
  {
    id: 7,
    category: 'Product Strategy & Vision',
    question:
      'What is your process for conducting a competitive market analysis?',
    answer:
      "I look beyond features to 'Job-to-be-Done' (JTBD) gaps. I analyze competitors' pricing, technical constraints, and user reviews to find where they are over-complicating or under-serving."
  },
  {
    id: 8,
    category: 'Product Strategy & Vision',
    question: "How do you determine 'Product-Market Fit' for a new feature?",
    answer:
      "By measuring the 'Disappointment Factor': if 40% or more of surveyed users say they would be 'very disappointed' if the feature were removed, you have fit."
  },
  {
    id: 9,
    category: 'Product Strategy & Vision',
    question:
      'Describe a time you failed to meet a product goal. What did you learn?',
    answer:
      "I once over-engineered a feature that users found too complex. I learned that 'MVP' should mean 'Minimum Viable Proof,' focusing on the core utility before adding architectural bells and whistles."
  },
  {
    id: 10,
    category: 'Product Strategy & Vision',
    question:
      "How do you incorporate 'Product-Led Growth' (PLG) into a technical roadmap?",
    answer:
      "By identifying 'Aha! moments' in the user journey and engineering the product to remove friction at those points, such as automated onboarding or viral loops within the UI."
  },
  {
    id: 11,
    category: 'Technical Depth',
    question:
      'How do you explain a complex technical debt issue to a non-technical stakeholder?',
    answer:
      "I use the 'Financial Interest' metaphor: technical debt is a high-interest loan. If we don't pay the 'principal' now, the 'interest' will eventually consume our entire capacity to build new features."
  },
  {
    id: 12,
    category: 'Technical Depth',
    question: 'Walk me through the architecture of your most complex project.',
    answer:
      'Trezo.app uses Next.js for serverless speed, Prisma with Neon/PostgreSQL for type-safe data, and Zod for input validation, ensuring a high-integrity multi-currency normalization engine.'
  },
  {
    id: 13,
    category: 'Technical Depth',
    question:
      "How do you decide between 'Building' a custom solution vs. 'Buying' a third-party API?",
    answer:
      "If the feature is a core competitive advantage, we build. If it’s a standard utility (like auth or payments) that doesn't differentiate us, we buy to maintain velocity."
  },
  {
    id: 14,
    category: 'Technical Depth',
    question:
      'What is your approach to system scalability for an MVP moving to Enterprise?',
    answer:
      "I focus on 'Hardening the Core.' This involves optimizing database queries, implementing caching layers, and ensuring the architecture is modular enough to handle increased load without a total rewrite."
  },
  {
    id: 15,
    category: 'Technical Depth',
    question:
      "How do you manage the trade-off between 'Speed to Market' and 'Code Quality'?",
    answer:
      "I advocate for 'Clean Enough' code for MVPs—well-documented and modular so it can be refactored easily once the market validates the feature."
  },
  {
    id: 16,
    category: 'Technical Depth',
    question:
      'Describe your experience with AI/LLM integration. How do you handle non-deterministic outputs?',
    answer:
      "I use strict prompt engineering and parsing logic (like Zod) to validate LLM outputs. I implement 'Human-in-the-loop' for sensitive data to ensure accuracy."
  },
  {
    id: 17,
    category: 'Technical Depth',
    question: 'How do you lead a technical post-mortem after a system failure?',
    answer:
      "By creating a 'Blame-Free' environment. We focus on the '5 Whys' to find the root cause in the process or architecture, not the person, and document a clear remediation plan."
  },
  {
    id: 18,
    category: 'Technical Depth',
    question:
      'What is your preferred tech stack for high-velocity builds, and why?',
    answer:
      'Next.js, TypeScript, Tailwind, and Supabase/Neon. This stack minimizes boilerplate, provides end-to-end type safety, and allows for instant deployment and scaling.'
  },
  {
    id: 19,
    category: 'Technical Depth',
    question:
      "How do you ensure data privacy and security are 'baked into' the product design?",
    answer:
      "By adopting a 'Privacy by Design' mindset: implementing least-privilege access, encrypting sensitive data at rest and in transit, and conducting regular security audits during the sprint."
  },
  {
    id: 20,
    category: 'Technical Depth',
    question:
      "How do you handle 'Scope Creep' from an engineering perspective?",
    answer:
      "By maintaining a strict definition of 'Done' and using a 'V2' backlog. If a request doesn't meet the current sprint's goals, it's documented for future consideration to protect velocity."
  },
  {
    id: 21,
    category: 'Leadership & Culture',
    question:
      'How do you manage conflict between a Lead Designer and a Lead Engineer?',
    answer:
      "I refocus them on the 'User Goal.' Usually, conflict arises from differing constraints. I facilitate a compromise that respects both design intent and technical feasibility."
  },
  {
    id: 22,
    category: 'Leadership & Culture',
    question:
      'Describe your leadership style when managing a remote, cross-border team.',
    answer:
      "I prioritize 'Asynchronous Transparency.' I use clear documentation and recorded updates so everyone has the same context regardless of their time zone."
  },
  {
    id: 23,
    category: 'Leadership & Culture',
    question:
      'How do you mentor junior developers or PMs to think more strategically?',
    answer:
      "I involve them in 'The Why' behind decisions. Instead of giving tasks, I give problems to solve and ask them to explain how their solution impacts the North Star."
  },
  {
    id: 24,
    category: 'Leadership & Culture',
    question:
      "Tell me about a time you had to deliver difficult feedback to a 'rockstar' employee.",
    answer:
      "I focused on 'Impact over Intent.' I showed how their individual behavior was disrupting team cohesion, which ultimately hindered the very project they cared about."
  },
  {
    id: 25,
    category: 'Leadership & Culture',
    question:
      "How do you foster a culture of 'Extreme Ownership' within your team?",
    answer:
      'By modeling it. I take responsibility for failures and share the credit for successes. I empower team members to make decisions within their domain without micromanaging.'
  },
  {
    id: 26,
    category: 'Leadership & Culture',
    question: 'What is the most difficult personnel decision you’ve ever made?',
    answer:
      "Letting go of a talented person who didn't align with the company culture. It taught me that 'Culture Fit' is just as important as 'Technical Skill' for long-term success."
  },
  {
    id: 27,
    category: 'Leadership & Culture',
    question: 'How do you handle burnout within your engineering team?',
    answer:
      "I proactively monitor 'Sprint Velocity' for unsustainable spikes. I encourage time off and ensure that we are prioritizing 'Meaningful Work' over 'Busy Work'."
  },
  {
    id: 28,
    category: 'Leadership & Culture',
    question:
      "Describe a time you had to manage 'up' to influence a board of directors.",
    answer:
      'At my agency, I used data-backed risk assessments to convince the board to invest in internal IP (products) rather than just service-based growth.'
  },
  {
    id: 29,
    category: 'Leadership & Culture',
    question:
      'How do you ensure diversity of thought when brainstorming new product ideas?',
    answer:
      "I use 'Silent Brainstorming' first to prevent 'Groupthink.' This ensures that the quietest voices have their ideas on the table before the discussion starts."
  },
  {
    id: 30,
    category: 'Leadership & Culture',
    question:
      'What is your 30/60/90 day plan when joining a new organization as a Lead?',
    answer:
      "30: Listen and learn the culture/tech stack. 60: Identify 'Low-Hanging Fruit' for quick wins. 90: Execute a strategic project that aligns with the long-term vision."
  },
  {
    id: 31,
    category: 'Execution & Analytics',
    question:
      'What are the top three metrics you track for a B2B SaaS platform?',
    answer:
      '1. Churn Rate (Retention), 2. Customer Acquisition Cost (Efficiency), and 3. Active Usage of Core Features (Value).'
  },
  {
    id: 32,
    category: 'Execution & Analytics',
    question: 'How do you use A/B testing to validate a hypothesis?',
    answer:
      "I define a clear 'Success Metric' beforehand, ensure the sample size is statistically significant, and only test one variable at a time to isolate the cause of change."
  },
  {
    id: 33,
    category: 'Execution & Analytics',
    question:
      'Describe your process for a Product Requirements Document (PRD).',
    answer:
      "I start with 'The Problem' and 'The User.' I include clear User Stories, functional requirements, success metrics, and technical constraints to ensure alignment."
  },
  {
    id: 34,
    category: 'Execution & Analytics',
    question: 'How do you manage a roadmap across multiple time zones?',
    answer:
      "I use 'Follow-the-Sun' workflows where tasks are handed off between regions, supported by a shared project management tool and 'Single Source of Truth' documentation."
  },
  {
    id: 35,
    category: 'Execution & Analytics',
    question:
      "Tell me about a time you used data to 'disprove' a popular opinion in the company.",
    answer:
      "I used heatmaps and session recordings to show that a highly requested 'Feature X' was actually causing 20% of users to drop off during onboarding."
  },
  {
    id: 36,
    category: 'Execution & Analytics',
    question: 'How do you prioritize a backlog with 100+ competing requests?',
    answer:
      'I use the RICE framework (Reach, Impact, Confidence, Effort) to objectively score and rank every item based on its potential value versus cost.'
  },
  {
    id: 37,
    category: 'Execution & Analytics',
    question: 'What is your experience with Agile, Scrum, or Kanban?',
    answer:
      "I’ve used all three. I prefer 'Scrumban' for high-velocity teams: the structure of Scrum for planning, but the flexibility of Kanban for flow and bottle-neck management."
  },
  {
    id: 38,
    category: 'Execution & Analytics',
    question: "How do you track 'Product Velocity'?",
    answer:
      "By measuring 'Cycle Time'—the time from an idea entering the backlog to it being live in production—and ensuring it is decreasing or stabilizing."
  },
  {
    id: 39,
    category: 'Execution & Analytics',
    question:
      "How do you ensure your team is building for the 'User' and not just the 'Requirements'?",
    answer:
      "By bringing engineers into 'User Testing' sessions. Seeing a user struggle with a feature they built is the fastest way to build empathy and focus."
  },
  {
    id: 40,
    category: 'Execution & Analytics',
    question: 'What tools do you use for project management and why?',
    answer:
      "Linear for its speed and developer-focus, or Jira for enterprise-level visibility. I pair these with Notion for 'Long-Form' documentation."
  },
  {
    id: 41,
    category: 'Behavioral & Situational',
    question:
      'Tell me about a time you had to make a decision with incomplete data.',
    answer:
      "When launching a new service at my agency, I used 'Analogous Data' from similar markets and made a reversible bet to test the waters quickly."
  },
  {
    id: 42,
    category: 'Behavioral & Situational',
    question:
      'Describe a situation where you had to influence someone without direct authority.',
    answer:
      "I used 'Data and Empathy.' I showed a peer how my proposal would solve their specific pain point, making them an ally rather than a competitor."
  },
  {
    id: 43,
    category: 'Behavioral & Situational',
    question:
      'What is the most innovative thing you’ve built with a limited budget?',
    answer:
      'Monkey Business—using LLMs to automate household financial parsing. It proved that AI can replace complex, expensive custom software with smart prompting.'
  },
  {
    id: 44,
    category: 'Behavioral & Situational',
    question:
      'Tell me about a time you disagreed with a direct report. How did you resolve it?',
    answer:
      "I asked them to 'Sell Me' on their idea. By listening deeply, I realized they had context I lacked. We compromised on a solution that incorporated both views."
  },
  {
    id: 45,
    category: 'Behavioral & Situational',
    question: 'What is the biggest professional risk you’ve ever taken?',
    answer:
      'Closing my successful agency after 14 years to pivot into full-stack engineering. It was a bet on my ability to lead the next generation of AI-driven products.'
  },
  {
    id: 46,
    category: 'Behavioral & Situational',
    question:
      'How do you stay updated on emerging technologies like AI and Microsoft Fabric?',
    answer:
      "I build. I spend 5-10 hours a week in my 'Live Lab' testing new APIs, reading whitepapers, and following key engineers on GitHub/LinkedIn."
  },
  {
    id: 47,
    category: 'Behavioral & Situational',
    question:
      "Why are you transitioning from 'Executive' back into a 'Product Lead' role?",
    answer:
      "Because the most impactful leadership today happens at the intersection of 'Strategy' and 'Code.' I want to be where the products are actually built."
  },
  {
    id: 48,
    category: 'Behavioral & Situational',
    question: "What is your 'superpower' as a Technical Product Lead?",
    answer:
      "I am a 'Bi-Lingual' leader. I speak 'Business' to the board and 'Code' to the engineers, eliminating the translation friction that kills most projects."
  },
  {
    id: 49,
    category: 'Behavioral & Situational',
    question:
      "Tell me about a time you advocated for a 'technical' fix with no business value.",
    answer:
      "I fought to refactor a legacy database that wasn't 'broken' but was slowing down our deploy cycle. I framed it as an 'Investment in Velocity'."
  },
  {
    id: 50,
    category: 'Behavioral & Situational',
    question: 'Why our company, and why now?',
    answer:
      "Because you are at the 'Inflection Point' I specialize in. You have a validated MVP, and I have the hybrid leadership and technical skills to scale it into an Enterprise leader."
  }
];

export const getCategories = () => {
  return Array.from(new Set(pmInterviewQuestions.map((q) => q.category))).map(
    (cat) => ({
      id: cat,
      name: cat
    })
  );
};

export const getQuestionsByCategory = (category: string) => {
  return pmInterviewQuestions.filter((q) => q.category === category);
};

export const getLuckyChoice = () => {
  const randomIndex = Math.floor(Math.random() * pmInterviewQuestions.length);
  return pmInterviewQuestions[randomIndex];
};

export const pmFrameworks = [
  {
    category: 'Product Design',
    items: [
      {
        name: 'CIRCLES Method',
        description:
          'Comprehend, Identify, Report, Cut, List, Evaluate, Summarize.',
        longDescription:
          'The CIRCLES Method™ is a framework that helps product managers provide a complete, thoughtful response to any product design question. It guides you through understanding the context, identifying the user, uncovering their needs, prioritizing problems, brainstorming solutions, evaluating trade-offs, and summarizing your recommendation.',
        image: '/circles_method_framework_1778180739414.png'
      },
      {
        name: '5 Whys',
        description: 'Dig deep into root causes by asking "Why?" five times.'
      },
      {
        name: 'User Journey Mapping',
        description:
          'Visualize the process a user goes through to reach a goal.'
      }
    ]
  },
  {
    category: 'Prioritization',
    items: [
      {
        name: 'RICE',
        description: 'Reach, Impact, Confidence, Effort.',
        longDescription:
          'RICE is a prioritization framework designed to help product managers determine which features, products, and tasks to prioritize. By scoring each factor, you can calculate a single score that helps in making objective decisions about the roadmap.',
        image: '/rice_prioritization_framework_1778180764816.png'
      },
      {
        name: 'MoSCoW',
        description: 'Must have, Should have, Could have, Won’t have.',
        longDescription: `MoSCoW is a popular prioritization framework used to reach agreement with stakeholders on the importance of delivery for each requirement or feature.

The acronym stands for:

- Must Have: Non-negotiable requirements that are vital for the product launch. Without these, the release or product is considered a failure (e.g., core login, checkout flow).

- Should Have: Important, high-value features that should be included but are not strictly critical for the current release (e.g., search filters, basic reports).

- Could Have: Nice-to-have features that improve user experience or add delight but can be dropped or postponed if time/resources are limited (e.g., dark mode, social sharing).

- Won't Have: Low-priority requirements that are explicitly ruled out for the current scope. These are deferred to future releases or roadmaps to keep the current launch focused.`
      },
      {
        name: 'Kano Model',
        description: 'Basic, Performance, and Excitement features.',
        longDescription: `The Kano Model is a product development and customer satisfaction framework used to prioritize features on a product roadmap based on how they affect customer satisfaction and implementation execution.

It categorizes customer requirements into five distinct categories:

- Must-Be / Basic (Threshold): Essential features that customers expect as a default. If missing, customers are extremely dissatisfied; if present, satisfaction does not increase beyond neutral. (e.g., call functionality on a smartphone).

- One-Dimensional / Performance: Features that linearly increase customer satisfaction when present/optimized and decrease satisfaction when absent/poor. (e.g., battery life or application speed).

- Attractive / Delighters: Unexpected or innovative features that delight the customer. If missing, they cause no dissatisfaction; if present, they significantly boost satisfaction. (e.g., intuitive gestures or smart shortcuts).

- Indifferent: Features that customers do not care about either way. Fulfilling them has no impact on satisfaction. (e.g., backend refactoring).

- Reverse: Features that actively cause dissatisfaction when present (e.g., invasive advertising, overly complex flows).`,
        image: '/kano_model_framework.png'
      }
    ]
  },
  {
    category: 'Strategy',
    items: [
      {
        name: 'SWOT',
        description: 'Strengths, Weaknesses, Opportunities, Threats.',
        longDescription:
          'SWOT Analysis is a strategic planning technique used to help a person or organization identify strengths, weaknesses, opportunities, and threats related to business competition or project planning. It is designed for use in the preliminary stages of decision-making processes.',
        image: '/swot_analysis_framework_1778180792266.png'
      },
      {
        name: 'Porter’s Five Forces',
        description:
          'Competitive Rivalry, Supplier Power, Buyer Power, Threat of Substitution, Threat of New Entry.',
        longDescription: `Porter's Five Forces is a business analysis model that helps to explain why various industries are able to sustain different levels of profitability.

The framework identifies five industry forces that shape market attractiveness and competitive pressure:

- Competitive Rivalry: The intensity of competition between existing players in the market (e.g., pricing wars, advertising campaigns, product updates).

- Supplier Power: The ability of suppliers to dictate prices, terms, and quality. Power is higher when there are fewer supplier alternatives or high switching costs.

- Buyer Power: The leverage customers have to drive down prices, demand higher quality, or play competitors against each other.

- Threat of Substitution: The threat of alternative products or services that satisfy the same consumer needs in a different way (e.g., email substituting mail).

- Threat of New Entry: The ease with which new competitors can enter the market and disrupt existing market share. High entry barriers (e.g., capital, patents) limit this threat.`,
        image: '/porters_five_forces.png'
      },
      {
        name: 'Blue Ocean Strategy',
        description:
          'Creating uncontested market space and making competition irrelevant.',
        longDescription: `Blue Ocean Strategy is a business strategy framework that focuses on creating uncontested market space (a "blue ocean") rather than competing head-to-head in an crowded, existing market (a "red ocean").

Key Concepts of the Framework:

- Red Oceans: Existing market spaces where industries are defined and competitors fight for a share of limited demand. Competition is cutthroat, turning the ocean bloody red.

- Blue Oceans: Unexplored, high-potential market spaces where demand is created rather than fought over. Growth is rapid and highly profitable because rules of the game are waiting to be set.

- Value Innovation: The core principle of creating a leap in value for both buyers and the company, simultaneously pursuing differentiation and low cost to break the value-cost trade-off.

- The ERRC Grid (Eliminate, Reduce, Raise, Create): A tool to drive value innovation by asking which industry-standard factors should be eliminated, which should be reduced below standard, which should be raised above standard, and which new factors should be created.`,
        image: '/blue_ocean_strategy.png'
      }
    ]
  },
  {
    category: 'Analytics',
    items: [
      {
        name: 'HEART Framework',
        description:
          'Happiness, Engagement, Adoption, Retention, Task Success.',
        longDescription:
          'The HEART framework is a set of user-centered metrics developed by Google. It is designed to help product teams measure the user experience of their products and services across five key categories: Happiness, Engagement, Adoption, Retention, and Task Success.',
        image: '/heart_framework_pm_1778180916305.png'
      },
      {
        name: 'AARRR (Pirate Metrics)',
        description: 'Acquisition, Activation, Retention, Referral, Revenue.',
        longDescription:
          'AARRR is a framework for customer lifecycle and growth, popularized by Dave McClure. It stands for Acquisition (how users find you), Activation (their first good experience), Retention (do they come back?), Referral (do they tell others?), and Revenue (do they pay?).',
        image: '/aarrr_pirate_metrics_framework_1778180950478.png'
      },
      {
        name: 'North Star Metric',
        description:
          'The single metric that best captures the core value your product delivers.',
        longDescription: `The North Star Metric is the key measure of success for the product team in a company. It defines the relationship between the customer problems that the product team is trying to solve and the revenue that the business aims to generate by doing so.

Core Components of a North Star Metric

- Customer Success Moment: It must reflect when a customer actually experiences the core value of the product, not just a feature the founder likes.

- Measurable Progress: The metric requires a time element (daily, weekly, or monthly) to track growth effectively.

- Path to Revenue: There must be a direct connection between the metric and the company's profitability.`,
        image: '/north_star_metric_framework_1778181998860.png'
      }
    ]
  },
  {
    category: 'Goal Setting',
    items: [
      {
        name: 'OKR',
        description:
          'Objectives and Key Results: A collaborative goal-setting tool used by teams to set challenging, ambitious goals with measurable results.',
        longDescription: `OKRs are a goal-setting framework used to define measurable goals and track their outcomes. They focus on growth, change, and innovation.

- Objective: A qualitative, inspirational statement of what is to be achieved (e.g., "Create a world-class user onboarding experience").

- Key Results: 3 to 5 quantitative, time-bound metrics used to measure the achievement of the objective (e.g., "Reduce sign-up drop-off by 20%").

- Nature: Aggressive, temporary, and aspirational.`,
        image: '/okr_framework_explanation_1778181528675.png'
      },
      {
        name: 'KPI',
        description:
          'Key Performance Indicators: Quantifiable measures of performance over time for a specific objective, providing targets for teams to shoot for.',
        longDescription: `KPIs are quantifiable measures used to evaluate the success of an organization or employee in meeting objectives for performance. They focus on the health and stability of ongoing processes.

- Function: They measure "business as usual" performance.

- Nature: Usually steady, ongoing, and descriptive (e.g., "Monthly Recurring Revenue" or "Average Response Time").

- Analogy: A car's dashboard (speedometer, fuel gauge) which tells you if the vehicle is operating correctly.`,
        image: '/kpi_dashboard_analogy_1778181486830.png'
      }
    ]
  }
];

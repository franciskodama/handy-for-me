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
  },
  {
    id: 51,
    category: 'Generic',
    question: 'Tell me something that is not on your CV.',
    answer:
      'One thing that may not be obvious from my CV is how much I enjoy helping teams turn ambiguous problems into clear, practical solutions. I naturally ask questions, simplify complexity, and look for ways to improve both the product and the way the team works.'
  },
  {
    id: 52,
    category: 'Generic',
    question: 'Why do you want to leave your current job?',
    answer:
      'I am grateful for what I have learned in my current role, but I am ready for a new challenge with greater ownership and impact. I am looking for an environment where I can contribute technically, collaborate closely with product and business teams, and continue growing over the long term.'
  },
  {
    id: 53,
    category: 'Generic',
    question: 'Why are there gaps in your employment?',
    answer:
      'The gaps in my employment were intentional periods that I used productively for professional development, personal priorities, and evaluating the right next opportunity. During that time, I continued strengthening my technical skills and remained focused on returning to a role where I could make a meaningful contribution.'
  },
  {
    id: 54,
    category: 'Generic',
    question: 'Why should we hire you?',
    answer:
      'You should hire me because I combine strong full-stack engineering skills with product awareness and a practical, ownership-oriented mindset. I can understand the business objective, translate it into a reliable technical solution, communicate clearly with stakeholders, and deliver measurable value.'
  },
  {
    id: 55,
    category: 'Generic',
    question: 'Where do you see yourself in five years?',
    answer:
      'In five years, I want to be a trusted senior technical contributor or technical leader who owns important product initiatives, mentors others, and helps shape sound engineering decisions. I also want to remain hands-on enough to understand the technology deeply and stay close to customer and business needs.'
  },
  {
    id: 56,
    category: 'Generic',
    question: 'Where do you see yourself in five years?',
    answer:
      'I see myself progressing into a role with broader ownership, combining technical leadership with product and strategic thinking. My goal is to grow with the organization, deliver increasingly complex initiatives, and help build systems and processes that scale.'
  },
  {
    id: 57,
    category: 'Generic',
    question: 'Describe yourself in 3 words?',
    answer:
      'Curious, dependable, and pragmatic. I am curious enough to keep learning, dependable when I commit to an outcome, and pragmatic about choosing solutions that balance quality, speed, and business value.'
  },
  {
    id: 58,
    category: 'Generic',
    question: 'What didn’t you like about your last job?',
    answer:
      'The main limitation was that some opportunities for improvement were difficult to prioritize because of competing demands. I prefer environments where teams communicate openly, use evidence to make decisions, and have a clear path for turning good ideas into measurable improvements.'
  },
  {
    id: 59,
    category: 'Generic',
    question: 'What are your greatest strengths?',
    answer:
      'My greatest strengths are structured problem-solving, ownership, and communication. I can break complex technical problems into manageable steps, follow through on commitments, and explain trade-offs clearly to both technical and non-technical stakeholders.'
  },
  {
    id: 60,
    category: 'Generic',
    question: 'What is your biggest weakness?',
    answer:
      'Earlier in my career, I sometimes spent too long refining a solution before sharing an initial version. I have improved by aligning early on the desired outcome, sharing smaller increments, and asking for feedback sooner. That helps me maintain quality without slowing progress unnecessarily.'
  },
  {
    id: 61,
    category: 'Generic',
    question: 'What are you looking for in your next job?',
    answer:
      'I am looking for meaningful technical challenges, a collaborative team, and clear ownership. I would like to work on products where engineering decisions matter, customer feedback is valued, and I can contribute across implementation, architecture, and product improvement.'
  },
  {
    id: 62,
    category: 'Generic',
    question: 'How would your friends describe you?',
    answer:
      'They would probably describe me as reliable, thoughtful, and curious. I am usually the person who listens carefully, helps organize a plan, and stays engaged until the problem is solved.'
  },
  {
    id: 63,
    category: 'Generic',
    question: 'How do you handle pressure?',
    answer:
      'I handle pressure by separating urgency from importance, clarifying the expected outcome, and creating a short execution plan. I communicate risks early, focus on the highest-impact work first, and maintain quality by using checkpoints rather than trying to solve everything at once.'
  },
  {
    id: 64,
    category: 'Generic',
    question: 'How would you deal with a conflict with a co-worker?',
    answer:
      'I would address it directly and respectfully, preferably in a private conversation. I would first try to understand their perspective, explain my own concerns using specific examples, and bring the discussion back to our shared goal. If we could not resolve it, I would involve a manager with a clear summary of the issue and possible solutions.'
  },
  {
    id: 65,
    category: 'Generic',
    question: 'What makes you angry or annoyed?',
    answer:
      'I find repeated communication gaps and avoidable ambiguity frustrating, especially when they affect customers or teammates. I try not to react emotionally; instead, I clarify the facts, identify the root cause, and suggest a process or communication improvement that prevents the issue from recurring.'
  },
  {
    id: 66,
    category: 'Generic',
    question: 'How would you deal with a difficult customer?',
    answer:
      'I would remain calm, listen without interrupting, and acknowledge the customer’s concern. Then I would clarify the facts, explain what I can do, set realistic expectations, and follow through. Even when I cannot provide the exact outcome requested, I can make the interaction respectful and solution-focused.'
  },
  {
    id: 67,
    category: 'Generic',
    question: 'Tell me about a time you provided excellent customer service.',
    answer:
      'In a product-focused engineering role, I treated a customer-impacting issue as more than a technical ticket. I clarified the user’s actual need, communicated progress in plain language, coordinated the fix with the team, and followed up after release. The result was a faster resolution and greater confidence in the product.'
  },
  {
    id: 68,
    category: 'Generic',
    question: 'Tell me about a time you worked in a team.',
    answer:
      'On a cross-functional product initiative, I worked with engineers, product stakeholders, and other contributors to define the problem, divide the work, and deliver the solution. I kept communication frequent, raised dependencies early, and helped the team make trade-offs. We completed the work with a clear scope and a reliable release.'
  },
  {
    id: 69,
    category: 'Generic',
    question: 'Tell me about a challenge you had to overcome.',
    answer:
      'I once had to deliver an important improvement while requirements and technical constraints were still evolving. I overcame the challenge by clarifying the minimum valuable outcome, identifying risks early, and delivering in small increments. This allowed stakeholders to give feedback sooner and helped us reach a dependable solution without unnecessary rework.'
  },
  {
    id: 70,
    category: 'Generic',
    question:
      'Tell me about a time when you had to work closely with someone you didn’t like.',
    answer:
      'I worked with someone whose communication style was very different from mine. Rather than making the relationship personal, I focused on the shared deliverable, agreed on responsibilities and decision points, and adapted my communication style. We were able to work professionally and complete the project successfully.'
  },
  {
    id: 71,
    category: 'Generic',
    question: 'What does success mean to you?',
    answer:
      'Success means delivering outcomes that are valuable, sustainable, and understood by the people involved. It includes solving the customer’s problem, meeting the business objective, maintaining a healthy level of quality, and leaving the team or process stronger than before.'
  },
  {
    id: 72,
    category: 'Generic',
    question: 'What areas do you need to improve on right now?',
    answer:
      'I am continually improving my ability to communicate complex technical trade-offs to broader audiences and to delegate more effectively as scope grows. I am addressing this by practicing concise written proposals, seeking feedback, and involving others earlier in design and implementation decisions.'
  },
  {
    id: 73,
    category: 'Generic',
    question:
      'When you start a new job, how do you adapt to the different working environment?',
    answer:
      'I start by learning the company’s goals, product, customers, systems, and ways of working. I ask thoughtful questions, schedule conversations with key teammates, document what I learn, and look for a small early contribution. I adapt quickly while respecting existing context before proposing changes.'
  },
  {
    id: 74,
    category: 'Generic',
    question:
      'Tell me about a situation when you received negative feedback and how you handled it.',
    answer:
      'I received feedback that one of my technical explanations was too detailed for the audience and made the decision harder to follow. I asked for examples, adjusted the structure to lead with the decision and impact, and used technical detail only where needed. The feedback improved my communication and made later discussions more effective.'
  },
  {
    id: 75,
    category: 'Generic',
    question: 'Who’s your greatest role model and why do they inspire you?',
    answer:
      'One of my role models is someone who combines expertise with humility and consistently helps others succeed. I admire people who make difficult ideas understandable, take responsibility for outcomes, and use their influence to improve both the product and the team. Those are qualities I aim to develop in my own career.'
  },
  {
    id: 76,
    category: 'Generic',
    question: 'Tell me about a time when you disagreed with your boss.',
    answer:
      'I once disagreed with a proposed approach because I believed it introduced unnecessary technical risk. I presented my concern with evidence, explained the alternatives and trade-offs, and listened to the broader business context. We reached a decision based on the objective rather than personal preference, and I fully supported the final direction.'
  },
  {
    id: 77,
    category: 'Generic',
    question: 'Tell me about a time you had to deal with a difficult customer.',
    answer:
      'A customer was frustrated because an expected outcome was not available within the original timeframe. I listened carefully, acknowledged the impact, verified the underlying requirement, and explained the available options honestly. By setting a realistic plan and maintaining communication, I helped turn a tense interaction into a constructive one.'
  },
  {
    id: 78,
    category: 'Generic',
    question: 'Tell me about a time when you had to adapt to change.',
    answer:
      'During a product or architecture transition, priorities and implementation details changed as we learned more. I adapted by revisiting assumptions, separating reusable work from work that should be discarded, and keeping stakeholders informed. The team was able to move forward without losing sight of the core customer outcome.'
  },
  {
    id: 79,
    category: 'Generic',
    question: 'Tell me about a time when you challenged someone’s behaviour.',
    answer:
      'I noticed that a teammate’s communication in a discussion was discouraging others from contributing. I spoke with them privately, described the specific behaviour and its impact, and suggested a more inclusive approach. The conversation was respectful, and subsequent discussions became more collaborative.'
  },
  {
    id: 80,
    category: 'Generic',
    question:
      'Tell me about a time when you helped a co-worker learn a new skill or develop an existing one.',
    answer:
      'I helped a colleague become more comfortable with a technical workflow by first understanding their current knowledge, then demonstrating the process and working through a small example together. I provided documentation and encouraged them to complete the next task independently. This built confidence rather than creating dependency.'
  },
  {
    id: 81,
    category: 'Generic',
    question: 'Tell me about a time when you improved a process.',
    answer:
      'I noticed that repeated work was being caused by unclear requirements and inconsistent handoffs. I proposed a lightweight checklist and clearer acceptance criteria, tested it with the team, and refined it based on feedback. This reduced avoidable rework and made delivery more predictable without adding unnecessary bureaucracy.'
  },
  {
    id: 82,
    category: 'Generic',
    question: 'Tell me about a time when you missed a deadline.',
    answer:
      'I once underestimated the complexity of a task and realized that the original deadline was at risk. I informed the relevant stakeholders as soon as I had enough information, explained the cause, proposed a reduced first scope, and created a revised plan. The experience reinforced the importance of early estimation reviews and risk communication.'
  },
  {
    id: 83,
    category: 'Generic',
    question: 'Tell me about a time when you demonstrated leadership skills.',
    answer:
      'I demonstrated leadership by bringing structure to an ambiguous initiative. I clarified the objective, helped the team prioritize, identified dependencies, and made sure decisions were documented. I did not rely on a formal title; I focused on creating alignment and helping everyone make progress.'
  },
  {
    id: 84,
    category: 'Generic',
    question: 'Tell me about a time when you made a mistake.',
    answer:
      'I once made an assumption about a requirement without validating it with the appropriate stakeholder. I caught the issue during review, acknowledged it, corrected the implementation, and added a clarification step to the workflow. The mistake was useful because it improved both my process and the team’s communication.'
  },
  {
    id: 85,
    category: 'Generic',
    question:
      'Tell me about a time when you used your initiative to solve a problem.',
    answer:
      'I noticed an issue that was affecting delivery but had not yet been formally assigned. I investigated enough to understand the likely cause, documented the impact and options, and proposed a practical next step. After aligning with the team, I helped implement the solution and prevented the problem from growing.'
  },
  {
    id: 86,
    category: 'Generic',
    question: 'Tell me about a time when you saved a company money.',
    answer:
      'I identified an opportunity to reduce unnecessary operational or development cost by simplifying an implementation and removing avoidable work. I compared the options, considered reliability and maintenance implications, and recommended the approach with the best long-term value. The result was lower cost without compromising the customer experience.'
  },
  {
    id: 87,
    category: 'Generic',
    question:
      'Tell me about a time when you gave constructive feedback someone.',
    answer:
      'I gave feedback to a colleague about a solution that was technically sound but difficult for others to maintain. I started by recognizing what worked, then described the specific maintainability concern and suggested an alternative. We discussed it collaboratively, and the final result was clearer and easier for the team to support.'
  },
  {
    id: 88,
    category: 'Generic',
    question: 'Tell me about a time when you asked a customer for feedback.',
    answer:
      'After delivering an improvement, I asked the customer or user how well it addressed the original problem rather than assuming the release was successful. I used open-ended questions, looked for gaps between expectations and reality, and converted the feedback into concrete follow-up actions. This helped us prioritize improvements based on actual value.'
  },
  {
    id: 89,
    category: 'Generic',
    question:
      'Tell me about a time when you found a simple solution to a challenging problem.',
    answer:
      'A problem initially appeared to require a large technical change, but I first separated the underlying requirement from the requested implementation. By simplifying the workflow and validating the smallest useful change, we solved the immediate problem with less complexity. This reduced delivery risk and left room for a more complete solution later if needed.'
  },
  {
    id: 90,
    category: 'Generic',
    question:
      'Tell me about a time when you had to make a quick decision that was going to have a significant impact on the business.',
    answer:
      'When a time-sensitive issue required a decision, I quickly gathered the most relevant facts, assessed customer and business impact, and compared the safest available options. I involved the right people where possible, made the decision transparently, and monitored the outcome closely. Acting decisively while managing risk helped protect the business.'
  },
  {
    id: 91,
    category: 'Generic',
    question:
      'Tell me about a time when you had to say no to a customer or client.',
    answer:
      'I had to decline a request because delivering it as proposed would have created unacceptable risk or conflicted with agreed priorities. I explained the reason clearly, showed that I understood the customer’s underlying need, and offered a safer alternative or realistic timeline. Saying no respectfully protected both the relationship and the product.'
  },
  {
    id: 92,
    category: 'Generic',
    question:
      'Tell me about a time when you were able to influence change in an organization by only asking questions.',
    answer:
      'I helped a team reconsider an established process by asking questions about its purpose, measurable outcome, cost, and customer impact. The questions exposed assumptions that had never been reviewed. Once the team saw the evidence, it chose to simplify the process without requiring a formal confrontation or directive.'
  },
  {
    id: 93,
    category: 'Generic',
    question:
      'Tell me about a time when you went above and beyond what was required at work.',
    answer:
      'After completing the immediate delivery, I noticed that future teammates would struggle to understand or maintain the work. I created concise documentation, clarified key decisions, and shared a short walkthrough. This required limited additional effort but improved onboarding, reduced future questions, and increased the long-term value of the work.'
  },
  {
    id: 94,
    category: 'Generic',
    question: 'Tell me about a time when you took a calculated risk at work.',
    answer:
      'I supported trying a new approach when the existing solution was limiting delivery, but I did not treat it as an all-or-nothing change. I defined the expected benefit, identified failure modes, tested it in a limited scope, and set a rollback plan. The controlled experiment gave us useful evidence while keeping the downside manageable.'
  },
  {
    id: 95,
    category: 'Generic',
    question: 'Tell me about a time when you made an unpopular decision.',
    answer:
      'I once recommended delaying a feature because the available implementation would have created significant reliability or maintenance risk. Although the decision was unpopular initially, I explained the evidence, proposed a smaller safe alternative, and defined what would be needed to proceed later. The team accepted the trade-off because the decision was tied to customer and business outcomes.'
  },
  {
    id: 96,
    category: 'Generic',
    question:
      'Tell me about a time when you communicated a difficult message to a team or group of people.',
    answer:
      'I had to explain that a planned delivery would not meet its original scope or date. I communicated the situation early, separated facts from assumptions, explained the impact, and presented options with a recommendation. Being direct and solution-oriented allowed the team to adjust the plan rather than be surprised later.'
  },
  {
    id: 97,
    category: 'Generic',
    question:
      'Tell me about a time when you had to work with incomplete data or missing information.',
    answer:
      'I first identified which unknowns could materially change the decision and which could be handled with reasonable assumptions. I documented those assumptions, gathered the highest-value information available, and used a reversible approach where possible. This allowed progress while keeping uncertainty visible and manageable.'
  },
  {
    id: 98,
    category: 'Generic',
    question: 'Tell me about a time when you created or invented something.',
    answer:
      'I created a practical product or engineering solution to address a recurring problem rather than continuing to handle each case manually. I validated the need, designed a simple first version, gathered feedback, and iterated. The result improved consistency and created a foundation that could be expanded as usage grew.'
  },
  {
    id: 99,
    category: 'Generic',
    question: 'Tell me about a time when you left a task unfinished.',
    answer:
      'I left a task unfinished when higher-priority work and new information made the original scope no longer the best use of time. I documented the current state, communicated what remained, and explained the reason for pausing it. I see unfinished work as acceptable only when it is deliberate, visible, and properly handed over.'
  },
  {
    id: 100,
    category: 'Generic',
    question: 'Tell me about your proudest professional achievement.',
    answer:
      'My proudest achievement is contributing to a product where technical work directly supported a meaningful business and customer outcome. I am especially proud when the result is not just a successful release, but a solution that is reliable, understandable, measurable, and useful to the people who depend on it.'
  },
  {
    id: 101,
    category: 'Generic',
    question:
      'Tell me about a time when you had no choice but to work with limited resources.',
    answer:
      'When resources were limited, I focused on the highest-value outcome, reduced unnecessary scope, and made trade-offs explicit. I reused proven components where appropriate, prioritized risk reduction, and communicated what would not be included. This allowed the team to deliver something dependable instead of spreading effort too thinly.'
  },
  {
    id: 102,
    category: 'Generic',
    question:
      'Tell me about a time when you used your knowledge or expertise to solve a challenging problem.',
    answer:
      'I used my experience with software architecture and product behavior to trace a difficult issue beyond its immediate symptoms. I formed hypotheses, tested them systematically, and worked with stakeholders to understand the real impact. The solution addressed the root cause and improved the system rather than merely hiding the symptom.'
  },
  {
    id: 103,
    category: 'Generic',
    question:
      'Tell me about a time when you were not going to deliver on a promise you had made.',
    answer:
      'Once I realized that a commitment was at risk, I did not wait until the deadline to disclose it. I explained the reason, shared the progress already made, and proposed options such as reducing scope, adding support, or revising the timing. This protected trust and allowed the stakeholder to make an informed decision.'
  },
  {
    id: 104,
    category: 'Generic',
    question:
      'Tell me about a time when you did not manage a project properly to get it completed on time.',
    answer:
      'I once allowed a project to move forward without enough clarity around dependencies and ownership. As risks emerged, progress slowed and the timeline was affected. I took responsibility, re-established milestones and owners, and introduced earlier risk reviews. The experience taught me to create alignment and visibility before execution accelerates.'
  },
  {
    id: 105,
    category: 'Generic',
    question:
      'Tell me about a time when you made a decision without consulting your manager or supervisor.',
    answer:
      'I made a decision independently when the issue was within my responsibility and waiting would have created unnecessary delay. I considered the impact, chose a reversible option, documented my reasoning, and informed my manager afterward. If the decision had involved significant strategic, financial, or people risk, I would have escalated first.'
  },
  {
    id: 106,
    category: 'Generic',
    question: 'Tell me about a time when you disagreed with a team member.',
    answer:
      'A team member and I disagreed about the best implementation approach. We compared the options against the agreed requirements, risk, maintainability, and delivery time rather than arguing from preference. After discussing the evidence, we selected the stronger option and supported the decision as a team.'
  },
  {
    id: 107,
    category: 'Generic',
    question:
      'Tell me about a time when a work colleague was not keen to help you.',
    answer:
      'When a colleague was reluctant to help, I first considered whether my request lacked context or imposed an unclear burden. I explained the objective, asked for the smallest practical contribution, and offered to coordinate around their priorities. This usually creates cooperation without pressure, and if a dependency remains blocked, I escalate it factually.'
  },
  {
    id: 108,
    category: 'Generic',
    question:
      'Tell me about a time when you changed the view of a supervisor or manager.',
    answer:
      'I changed a manager’s view by presenting evidence rather than simply defending my preference. I clarified the objective, showed the risks and expected benefits of each option, and proposed a low-risk way to validate the recommendation. The manager changed direction after seeing how the approach better supported the business outcome.'
  },
  {
    id: 109,
    category: 'Generic',
    question:
      'What would you consider when describing something technical to a non-technical person?',
    answer:
      'I would consider the person’s goals, existing knowledge, and the decision they need to make. I would start with the business or customer impact, use plain language and an analogy only when helpful, avoid unnecessary jargon, and confirm understanding. I would include technical detail only when it changes the decision or expectation.'
  },
  {
    id: 110,
    category: 'Generic',
    question: 'How do you keep your technical knowledge up to date?',
    answer:
      'I combine hands-on practice with targeted learning. I follow reliable technical sources, read documentation and engineering discussions, experiment with relevant tools in small projects, and learn from code reviews and post-incident analysis. I focus on understanding when a technology is useful rather than adopting trends automatically.'
  },
  {
    id: 111,
    category: 'Generic',
    question: 'How many golf balls can you fit into a school bus?',
    answer:
      'I would state my assumptions and estimate rather than pretend there is one exact answer. If a school bus has roughly 50 cubic metres of usable internal volume, and a golf ball occupies about 40 cubic centimetres, allowing for packing inefficiency, I would estimate approximately 900,000 to 1,000,000 golf balls. The important part is explaining the method and checking whether the assumptions are reasonable.'
  },
  {
    id: 112,
    category: 'Generic',
    question: 'How do you handle tight deadlines whilst working in a project?',
    answer:
      'I clarify the deadline and the non-negotiable outcome, then break the work into milestones and prioritize the highest-impact scope. I surface dependencies and risks early, communicate trade-offs, and avoid sacrificing critical quality such as security, correctness, or testing. If necessary, I recommend a smaller reliable release rather than an unrealistic full scope.'
  },
  {
    id: 113,
    category: 'Generic',
    question:
      'Tell me about a difficult challenge you had to overcome while working on a project?',
    answer:
      'A difficult project challenge was balancing changing requirements with the need to keep the implementation maintainable. I addressed it by separating stable requirements from assumptions, agreeing on a small first release, and documenting decisions and trade-offs. This reduced uncertainty and allowed the team to keep delivering while learning.'
  },
  {
    id: 114,
    category: 'Generic',
    question:
      'Tell me a time when you worked as part of a team to solve a complex technical task?',
    answer:
      'I worked with a team on a complex technical task by helping break the problem into interfaces, dependencies, and testable pieces. We shared findings regularly, reviewed design decisions, and coordinated integration points. My contribution helped maintain alignment while the team solved the problem without creating isolated solutions that conflicted later.'
  },
  {
    id: 115,
    category: 'Generic',
    question: 'How many streetlights are there in this country?',
    answer:
      'I would clarify which country and what counts as a streetlight, then build an estimate from population, urbanization, road length, and average lights per road segment. I would state the assumptions, calculate a range, and explain what information would improve accuracy. The goal is to demonstrate structured reasoning, not to guess an exact number.'
  },
  {
    id: 116,
    category: 'Generic',
    question:
      'Tell me a time when something didn’t go to plan. What was the situation and how did you respond?',
    answer:
      'When a planned delivery encountered an unexpected technical issue, I first stabilized the situation and determined whether customers were affected. I communicated the impact, investigated the root cause with the team, and adjusted the plan based on evidence. Afterward, I captured the lesson and improved the relevant testing or monitoring.'
  },
  {
    id: 117,
    category: 'Generic',
    question: 'What can you bring to this role?',
    answer:
      'I bring strong full-stack engineering capability, product thinking, and a willingness to take ownership from problem definition through delivery. I can work across technical and business conversations, make practical trade-offs, and help build systems that are reliable, maintainable, and aligned with customer value.'
  },
  {
    id: 118,
    category: 'Generic',
    question:
      'Tell me a time when you worked on a technical project that failed?',
    answer:
      'I worked on a project that did not achieve its intended result because we made assumptions about the user need and did not validate them early enough. I helped analyze what happened, separate technical issues from product assumptions, and identify the lessons. The experience reinforced the value of small experiments, measurable outcomes, and early feedback.'
  },
  {
    id: 119,
    category: 'Generic',
    question: 'Why are manhole covers round?',
    answer:
      'A round cover cannot fall through its own opening, regardless of how it is rotated. It is also easier to roll, has no corners to align, and distributes stress consistently. The best answer combines the safety reason with the practical manufacturing and handling advantages.'
  },
  {
    id: 120,
    category: 'Generic',
    question: 'What would the person who dislikes you the most say about you?',
    answer:
      'They might say that I can be persistent when I believe an issue deserves attention, and that I sometimes ask more questions than they expect. I see those traits as strengths when balanced with listening and prioritization, so I make a point of understanding when to challenge an assumption and when to move forward.'
  },
  {
    id: 121,
    category: 'Generic',
    question: 'What’s the biggest risk you’ve taken?',
    answer:
      'The biggest professional risk I have taken was committing to a new approach when the existing path was familiar but limiting. I reduced the risk by validating the problem, testing the approach in a contained scope, and defining a fallback. It taught me that calculated risk is about managing downside while creating meaningful upside.'
  },
  {
    id: 122,
    category: 'Generic',
    question:
      'When you encounter issues, what problem solving process do you use?',
    answer:
      'I define the problem and desired outcome, gather evidence, identify constraints, and separate symptoms from root causes. Then I generate options, choose the smallest effective solution, test it, and measure the result. I document important decisions and revisit the solution if the evidence shows that the problem is not fully resolved.'
  },
  {
    id: 123,
    category: 'Generic',
    question:
      'Tell me how you’d deal with a client or manager who pushed back on your recommendations?',
    answer:
      'I would ask questions to understand the concern rather than treating pushback as rejection. I would restate the objective, explain my recommendation with evidence and trade-offs, and consider whether a smaller experiment could resolve the disagreement. If the final decision differed from my recommendation, I would support it professionally and help make it successful.'
  },
  {
    id: 124,
    category: 'Generic',
    question: 'What are your salary expectations?',
    answer:
      'I am looking for compensation that is competitive for the role, level, location, and total package. Based on the responsibilities and my experience, I would expect a range of [insert researched range], but I am open to discussing the complete package and the value I can bring.'
  },
  {
    id: 125,
    category: 'Generic',
    question: 'Describe your work ethic.',
    answer:
      'My work ethic is based on ownership, consistency, and transparency. I prepare carefully, follow through on commitments, communicate risks early, and focus on delivering useful outcomes rather than appearing busy. I also believe sustainable performance requires prioritization and collaboration, not simply working longer hours.'
  },
  {
    id: 126,
    category: 'Generic',
    question: 'How do you prioritize your work?',
    answer:
      'I prioritize by customer and business impact, urgency, dependencies, risk, and effort. I clarify competing expectations with stakeholders, identify the most valuable next step, and keep the priority list visible. I revisit it when new information arrives rather than treating the original plan as fixed.'
  },
  {
    id: 127,
    category: 'Generic',
    question: 'What will you do in the first 30 days of starting work here?',
    answer:
      'In the first 30 days, I would learn the product, customers, goals, architecture, development process, and team expectations. I would build relationships with key teammates, review existing documentation and metrics, and look for a small contribution that creates value. I would listen first, then suggest improvements based on evidence and context.'
  },
  {
    id: 128,
    category: 'Generic',
    question: 'What motivates you?',
    answer:
      'I am motivated by solving meaningful problems, learning continuously, and seeing my work create a measurable improvement for customers or the business. I also enjoy working with capable, collaborative people and having enough ownership to turn a good idea into a reliable outcome.'
  },
  {
    id: 129,
    category: 'Generic',
    question: 'How would you handle a challenging client?',
    answer:
      'I would listen carefully, clarify the client’s actual concern, and acknowledge the impact without making promises I cannot keep. I would explain the available options, set clear expectations, and follow up consistently. The goal is to protect the relationship through professionalism, transparency, and dependable execution.'
  },
  {
    id: 130,
    category: 'Generic',
    question: 'What’s the difference between leadership and management?',
    answer:
      'Management focuses on planning, organizing, allocating resources, and ensuring execution. Leadership focuses on direction, trust, influence, and helping people move toward a meaningful outcome. Strong professionals often need both: management creates clarity and control, while leadership creates alignment and commitment.'
  },
  {
    id: 131,
    category: 'Generic',
    question: 'What’s your leadership style?',
    answer:
      'My leadership style is collaborative, clear, and outcome-focused. I set context and expectations, invite informed input, give people ownership, and remain available to remove blockers. I adapt my level of direction to the person, the urgency, and the complexity of the work.'
  },
  {
    id: 132,
    category: 'Generic',
    question: 'How would you motivate a team?',
    answer:
      'I would connect the work to a clear purpose, make priorities and success measures visible, and give people meaningful ownership. I would recognize contributions, remove blockers, provide constructive feedback, and ensure that workloads are sustainable. Motivation is stronger when people understand the impact of their work and feel trusted to do it well.'
  },
  {
    id: 133,
    category: 'Generic',
    question:
      'What was the last podcast you listened to or book that you read?',
    answer:
      'Recently, I read or listened to material about technology, product strategy, or decision-making. What I found most useful was the emphasis on testing assumptions, communicating clearly, and focusing on outcomes rather than activity. I try to apply those ideas through small experiments and more structured discussions at work.'
  },
  {
    id: 134,
    category: 'Generic',
    question: 'What are the most important qualities needed to work in a team?',
    answer:
      'The most important qualities are reliability, respectful communication, accountability, adaptability, and a willingness to share information. A strong team member contributes their expertise while also listening, raising risks early, helping others succeed, and keeping the shared outcome more important than personal preference.'
  },
  {
    id: 135,
    category: 'Generic',
    question: 'Describe a time when you had to work at pace.',
    answer:
      'I once had to deliver an important improvement within a short timeframe. I quickly clarified the must-have outcome, divided the work into small pieces, coordinated dependencies, and kept stakeholders updated. By reducing non-essential scope while protecting critical quality, we delivered a useful and reliable result on time.'
  },
  {
    id: 136,
    category: 'Generic',
    question: 'Tell me about a time when you had to overcome a disagreement.',
    answer:
      'I overcame a disagreement by moving the conversation away from positions and toward criteria. We clarified the shared objective, listed the relevant constraints, compared the alternatives, and agreed on how to validate the decision. This created a solution based on evidence and preserved a positive working relationship.'
  },
  {
    id: 137,
    category: 'Generic',
    question:
      'Tell me about a time when you had a difficult interaction with a customer.',
    answer:
      'A customer interaction became difficult because expectations were not aligned with what the product could currently support. I listened carefully, acknowledged the frustration, clarified the desired outcome, and explained the available path forward. By being honest and proactive, I was able to rebuild trust and identify a useful next step.'
  },
  {
    id: 138,
    category: 'Generic',
    question:
      'Tell me about a time when you helped develop the career of a co-worker.',
    answer:
      'I supported a colleague by helping them identify a skill they wanted to strengthen, giving them ownership of a suitable task, and providing feedback during the process. I shared context and resources without taking over. Over time, they became more confident and capable of handling similar work independently.'
  },
  {
    id: 139,
    category: 'Generic',
    question: 'How do you handle stress and pressure?',
    answer:
      'I manage stress by clarifying priorities, breaking large problems into concrete next actions, and communicating early when capacity or timing is at risk. I use checklists and focused work blocks for execution, and I avoid allowing pressure to reduce the quality of important decisions.'
  },
  {
    id: 140,
    category: 'Generic',
    question:
      'Describe a situation when you went above and beyond for a company.',
    answer:
      'I went beyond the immediate task by looking at the broader operational and customer impact. After completing the core work, I improved documentation, highlighted a related risk, and suggested a small process improvement. The additional effort helped the organization get more lasting value from the original delivery.'
  },
  {
    id: 141,
    category: 'Generic',
    question: 'What’s your greatest achievement?',
    answer:
      'My greatest achievement is helping build and improve software that connects technical execution with real customer and business value. I am proud of work where I contributed to the architecture, delivered a reliable experience, collaborated across functions, and helped the product become more scalable and useful.'
  },
  {
    id: 142,
    category: 'Generic',
    question:
      'How do you stay productive under minimal supervision from a manager?',
    answer:
      'I stay productive by aligning on outcomes and priorities early, then managing my own plan and communication. I break work into milestones, track dependencies, share progress and risks proactively, and ask for clarification when a decision is genuinely blocked. Minimal supervision works well when ownership and visibility are strong.'
  },
  {
    id: 143,
    category: 'Generic',
    question: 'Describe a time when you were flexible at work.',
    answer:
      'When priorities changed, I reassessed my plan rather than continuing with work that no longer had the highest value. I discussed the trade-offs, adjusted the scope and sequence, and helped the team focus on the new objective. Flexibility allowed us to respond quickly without losing accountability.'
  },
  {
    id: 144,
    category: 'Generic',
    question:
      'Describe a time when you demonstrated excellent attention to detail skills at work.',
    answer:
      'While reviewing a feature, I noticed a subtle inconsistency between the intended business rule and the implementation. I traced the edge case, confirmed the expected behavior with the relevant stakeholder, and added a targeted test before release. Catching it early prevented an avoidable customer issue and improved confidence in the system.'
  },
  {
    id: 145,
    category: 'Generic',
    question: 'What are your hobbies and interests?',
    answer:
      'Outside work, I enjoy movies, ice skating and other winter activities, puzzle solving, and learning about technology and product strategy. These interests help me stay curious, balanced, and comfortable with both creative thinking and structured problem-solving.'
  },
  {
    id: 146,
    category: 'Generic',
    question: 'What are your career goals?',
    answer:
      'My career goal is to grow into a senior technical and product-minded leader who can guide important initiatives from problem definition through scalable delivery. I want to deepen my expertise in architecture and fintech or SaaS products, mentor others, and consistently connect engineering work to measurable customer and business outcomes.'
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
          'Visualize the process a user goes through to reach a goal.',
        longDescription: `A User Journey Map is a visual representation of the process a customer goes through to achieve a goal with your product or service. It helps product managers and designers empathize with users, identify pain points, and uncover opportunities for improvement.

Key Stages of a User Journey Map:

- Define the Persona: Establish who the user is, along with their goals, needs, and behaviors.

- Map the Stages: The phases of the user's experience (e.g., Discovery, Onboarding, Engagement, Retention).

- Track User Actions: Document what the user is actually doing at each touchpoint in the journey.

- Identify Thoughts & Emotions: Track what the user is thinking and feeling at each stage. Note emotional highs (delight) and lows (frustrations).

- Uncover Pain Points & Opportunities: Locate bottlenecks in the flow and brainstorm features or design changes to solve them.`,
        image: '/user_journey_mapping.png'
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

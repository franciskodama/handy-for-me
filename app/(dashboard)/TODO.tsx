// Our template: https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs
// Google Cloud Credentials: https://console.cloud.google.com/apis/credentials

// TODO: HELPERS
// size={24} strokeWidth={1.8}
// primary color: 222.2 47.4% 11.2% --> rgba(15, 23, 57, 1) --> #0F1739
// Alert Dialog Content Width for Mobile: w-[calc(100%-35px)]
// Accent color in HEX: #DDF906 --> Adidas: '#f3f3e3'
// shadow-[0_0px_0px_0px_inset,#FFF_-3px_3px_0_-1px,#0F1739_-3px_3px]

// TODO: Nadgen Q.A.
// NextJs 15 update: https://www.youtube.com/watch?v=fqabW3WRUbw&list=WL&index=39

// Bucket List: Select must be restarted after Adding a new item. It's returning alwqays the last selected item
// Bucket List: Change form to useReactForm

// Next Auth: Sigout after some time without signing in: https://next-auth.js.org/configuration/providers/oauth
// Next Auth: for email and password

// Stoic Support: Check the Content
// Responsivity for smallers screens of Laptops (Weather was tight on Nadgen's screen)
// Weekly Wins on the Dashboard
// Dashboard: Accordions?
// Weekly Wins: include Nadgen idea to set how many days a week + progress bar
// Build feature "My Words" (and "My Phrases") to practice and increase vocabulary
// Is there a way to hide de content of the user in the database by cryptography?
// Responsivity for Tablets?

// DONE:
// Install Analytics: Posthog
// All Features: mb-12
// Random Questions: Reset All must Reset the Clock as well
// Random Questions: When it's reseted, don't show the kudos message either
// Random Questions: everything on one screen
// Random Questions: Clock must restart on 2 min after Reset
// Footer
// Stoic Support: Dashboard Card
// Dashboard Help Card: Explain that there is a helper there in every feature
// Bucket List: Flex Wrap the cards
// Bucket List: Nadgen likes it categorized in columns
// Record a Loom Video to explain how to get a image url
// Add on the Dashboard: Ads to divulgate other features for practicing English
// Decision Helper: Add categories first on the left side
// Decision Helper: Delete category --> Change the Alert from System Error to a Alert Dialog
// Shortcut (but check other features): Error message needs to be directly on the Tabs with the fields, not on an Alert Dialog
// No content on the cards, no need to show the cards.
// Vision Board: Napoleon Hill's Quote on the top of the page
// Location: How do we get it and why Nadgen's location was wrong?
// After user Add a category for Shortcut, it has to be shown immediately on the Tab to Add a new Shortcut
// Vision Board --> No name fields: change "name" field name
// Weekly Wins --> No name fields: change "name" field name
// Decision Helper --> No name fields: change "name" field name
// Bucket List --> No name fields: change "name" field name
// Weekly Wins: Fix the limit of 10 characters

// TODO: WORKING ON
// Feature: Promisses for the Year
// Feature to Relax: https://codepen.io/fionchadd/pen/OJKaNxV
// Close Quotes
// Cards in Black an White, but users can toggle to see categories' colors
// On Bucket List Get Colores must be only one function (export)
// TO DO of the week: show on Dashboard
// Cities I've visited Feature
// Vision board: zoom library

// Dashboard: if it's Dashboard, don't show the avatar on the top
// Grid: https://www.youtube.com/watch?v=3T0gjtXRNC0

// Bucket List: Filter for done and not done
// Thigns to do Frame list that you can cross what was done.
// Dahsboard: Pppulate the spaces, but think mobile first.
// My Words: Strutcture...
// My Words: bg: https://codepen.io/learosema/pen/oNrmRKY
// Kanban Panel for To do: https://www.youtube.com/watch?v=bwIs_eOe6Z8, https://www.youtube.com/watch?v=ERXS6CROWR4
// Affirmation: Repeates images if there is no enough images
// Bug on Random Questions: until restart, the buttons to start need to be disabled
// Bug on Random Questions: after restart, the timer didn't restart even though the time was selected
// Auth in Production as well!
// Spin: How to delete a list?
// Spin: Titles and emojis
// Create the page Dashboard
// Feature: Words that you need to practice (pronunctiation - AI?) time adn show the word?

// TODO: WORKING ON
// Spin: Do something if a list has only one item (and the item must be selected or message the user)
// Component MessageTeam
// use() instead of useEffect and useState: https://www.youtube.com/watch?v=oMvW3A_IRsY>>

// TODO: FEATURES
// Edit your photos by chatting with a generative AI model: https://vercel.com/templates/next.js/paint-by-text
// Emoji Generator: https://vercel.com/templates/next.js/ai-emoji-generator
// Galery for Affirmation: https://codepen.io/cbolson/pen/GRbzyGJ

// TODO: TODOS
// Middleware: create a About page and include it in the middleware (matcher)
// Add second font: josefin
// Button: https://medium.com/@dewamadewira25/how-to-make-a-neo-brutalism-button-using-tailwindcss-91d3faf2b269

// TODO: DONE
// Weekly Wins: new feature
// Card Vision Board: Still too wide
// Shortcut on Dashboard
// Vision Board: fields not visible on mobile to see the vision board first
// Weather Fix for Sunrise and Sunset
// Nav Menu random question item was breaking the line
// Widht of Alert Dialog Content: w-[calc(100%-35px)]
// Bug of Hydration: it was the Math random inside a useState (getRandomFact())
// Quotes to long: Solution?
// Button hover effect: Mariana thinks it's counterintuitive
// Responsivity
// Random Questions: position time button and question
// Letter Leap everything on one screen
// Change the name of Spin Magic: Decision Helper
// Shortcut: Message when you don't have any shortcuts
// Shortcut: delete my categories that is blocked with error
// Shortcut: Explanation
// Shortcut: categories as a state for appearing in the sheet
// Shortcut: handleDeleteCategory + what if there is shortcuts on this categories?
// Vision Board: Title align left
// Vision Board mosaic centralized in the middle of the parent div
// Better organization for the nav files
// Letter Leap: Title in one line
// Letter Leap: Size of the Letter
// Letter Leap: Scroll to the results of emergency words (mobile)
// Close Menu (Sheet) after clicking on a menu item
// Spin Magic: font size for Mobile
// Login Reponsive
// Dashboard responsive
// Right Position of the ? in Bucket List and Vision Board
// Hamburguer Menu
// Auth Google
// Auth Google in Production
// Auth GitHub in Production
// Auth GitHub
// Fix deployment error on vercel
// Random Quotes pencial banner
// Countdown: fixes
// ABC feature
// ABC feature: words review
// Questions feature
// Breadcrumb
// domain to vercel: https://porkbun.com/
// Prisma get auth from github: https://authjs.dev/getting-started/adapters/prisma
// Confetti for Spin Page: https://classic.yarnpkg.com/en/package/canvas-confetti
// Affirmation: Accomplished Goals can be checked
// Affirmation: Random Sort each time that mounts
// Affirmation: check if the image comes from unsplash
// Affirmation: refresh button or refresh automatically (state)

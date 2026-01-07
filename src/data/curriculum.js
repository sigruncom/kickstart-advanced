// SOMBA Kickstart 12-Week Curriculum Data Structure
export const curriculum = [
    {
        id: 1,
        title: "Survey Your Ideal Client",
        subtitle: "Laying the Foundation",
        description: "Create your survey to understand your ideal client's needs and start building your email list.",
        lessons: [
            {
                id: "1-1",
                title: "Survey Your Ideal Client",
                type: "lesson",
                videoUrl: null,
                content: `In the next 12 weeks you are going to create a new online course. You might have an idea for a course or you might have no idea what your course should be about, in either case, you are going to find it out in the next 2 weeks. Instead of thinking of a course, I want you first to think about a problem from the perspective of your ideal client.

**Examples of problems:**
- **Sarah** wants to lose 5kg but has tried every diet on the planet and cannot figure out how to lose those 5 kg on her own.
- **Maike** would like to write a book but cannot seem to get it done even though she knows what the book is going to be about.
- **Britta** would like to sell her new online course and she knows she needs to launch it but she has never launched before and doesn't know how to do it.

By doing the Ideal Client Exercise you've already figured out what is your ideal client's problem, what they have tried, and what is their ideal solution. **If you haven't done the Ideal Client Exercise yet, then do that first before you do anything else.**

In order to find out what your ideal client really wants you need to frame the problem in an attractive way and invite them to fill out a survey. Give your survey participants an incentive to fill out, by offering a giveaway e.g. 1 hour of coaching.

**This is called the Survey Sentence.**

### Survey Sentence Examples:

**Fitness coach:** I'm looking for women in their 40s and 50s who have put on some weight and would like to get rid of 5-10 kg by making simple lifestyle changes instead of a diet. By filling out this survey before Sunday midnight you have a chance to win a 1-1 one hour coaching session.

**Book coach:** I'm looking for coaches, consultants and experts who want to write a best-seller and become an authority in their niche with their book. By filling out this survey before Sunday midnight you have the chance to win a 1-1 one hour coaching session to create your book outline.

**Business coach:** I'm looking for female entrepreneurs who are planning to launch an online program in the next 3-6 months, and have either never launched before or have launched but not had the desired results. By filling out this survey before Sunday midnight you have the chance to win a 1-1 one hour coaching session to create your launch plan.

**Relationship Coach:** I'm looking for individuals in their 30s and 40s who are navigating the complexities of modern relationships and seeking to strengthen their communication and connection with their partners. By completing this survey before Sunday midnight, you'll have the opportunity to win a one-hour coaching session to develop your personalized relationship enhancement strategy.

**Arts and Crafts Teacher:** I'm seeking creative minds who are passionate about arts and crafts but struggle to find time or inspiration for their projects. If you're interested in reigniting your artistic passion, fill out this survey by Sunday midnight for a chance to win a one-on-one, one-hour session to plan and kickstart your next craft project.

**Pelvic Strength Coach:** I'm seeking individuals who are experiencing pelvic floor issues and are interested in improving their pelvic strength and overall well being. If you're committed to enhancing your pelvic health through safe, guided exercises and lifestyle adjustments, I invite you to fill out this survey by Sunday midnight. By participating, you'll have the opportunity to win a one-on-one, one-hour coaching session with me, where we'll develop a personalized pelvic strength program tailored to your specific needs and goals.

**Spanish teacher:** I'm searching for expats living in Spain who want to improve their language skills for daily life and cultural immersion. If you're looking to enhance your Spanish speaking, reading, and understanding abilities to better connect with your local community, please fill out this survey by Sunday midnight. You'll have the chance to win a one-on-one, one-hour language coaching session tailored to help you navigate and enjoy your expat experience more fully.

### Important Tips:

- If you have **too many ideas** then write down more than one sentence. Read the sentences out loud. Which one feels most exciting to you? Pick that one.

- If you have **no idea** then brainstorm all the problems you can imagine that your ideal client has. Which one is most pressing to solve? Pick that one.

⚠️ **Do not mention your solution or methodology right now**, focus on attracting the attention of people who have the problem that you solve.

⚠️ **Talking about your solution or mentioning that you are creating an online course will affect your survey results. Don't do it!**

SOMBA Kickstart is a course where you practise fast decision making. Overthinking is not helpful in life and business. It is better to make a decision and move on.

💡 Start to use a Google Doc for your ideas. That's what I use in my business.

And of course you can use our AI Kickstart Coach to help you out.

**Now go and create your Survey Sentence.**`,
                inputField: {
                    key: "surveySentence",
                    label: "Your Survey Sentence",
                    placeholder: "I'm looking for [ideal client description] who [problem they face]. By filling out this survey before [deadline] you have the chance to win [incentive]...",
                    type: "textarea",
                    required: true
                },
                aiPrompt: "Help me create a compelling Survey Sentence for my business. My ideal client is [describe your ideal client] and they struggle with [describe their main problem]. I want to offer [describe your incentive, e.g., a 1-hour coaching session] as a giveaway for filling out the survey."
            },
            {
                id: "1-2",
                title: "Survey Questions",
                type: "lesson",
                videoUrl: null,
                content: `When you survey your ideal client you need to keep the survey short and to the point but also have the questions open-ended so you get as much information as possible. **The survey is not anonymous** because you want to be able to follow up with your Ideal Client.

⚠️ **Do not have more than 10 questions.**

### Recommended Survey Questions:

Here are the types of questions you should ask. Adapt them to your idea and your ideal clients:

1. **Your name**
2. **Your email address**
3. **Describe your current situation when it comes to X?**
4. **What is your biggest challenge when it comes to X?**
5. **What is your goal when it comes to X?**
6. **What does it mean to you personally and business wise to hit that goal?**
7. **What would you like to get help with?**
8. **Is it ok for me to follow up with you to discuss your answers?**

### Important Guidelines:

📅 **Have a strict deadline on your survey** e.g. Sunday midnight. People tend to put off answering a survey, the less time they have to do it, the better. You don't need more than 3-5 days to promote a survey so the earlier you get it out, the better.

### Using SOMBA.io:

If you are using SOMBA.io then we have already put up an Ideal Client Survey template for you. Make a copy of the survey template in SOMBA.io before you customize it. Add your own survey sentences, adapt them to your business idea and of course use the language of your choice. Watch our tech tutorials on where to find your Ideal Client Survey template and how to adapt it to your needs.

👉 Not signed up for SOMBA.io yet? [Click here to sign up for a 90 day trial](https://somba.io).

### Alternative Survey Tools:

If you are not using SOMBA.io you can create your survey in:
- **Google Forms** (free)
- **SurveyMonkey** (powerful)
- **Typeform** (pretty)
- Or any other survey tool

We will not provide support for these other tools but there are great tutorials online.

📚 **Resources:**
- [Example survey in Google Forms](https://forms.gle/aGLdQmaXHbYoFz6k8)
- [How to use Google Forms](https://support.google.com/docs/answer/6281888)

**Now create your survey.**`,
                inputField: {
                    key: "surveyUrl",
                    label: "Your Survey URL",
                    placeholder: "https://forms.gle/... or your SOMBA.io survey link",
                    type: "url",
                    required: true
                },
                aiPrompt: "Help me create survey questions for my ideal client. My survey sentence is: {surveySentence}. I want to understand their biggest challenges and goals related to [topic]. Please give me 6-8 open-ended questions that will give me valuable insights."
            },
            {
                id: "1-3",
                title: "Create a Privacy Policy",
                type: "lesson",
                videoUrl: null,
                content: `You are starting to collect personal data with your survey. **You cannot collect personal data without having a privacy policy.** The main point of a privacy policy is to tell people what you are going to do with their data. Everyone who collects any type of personal data needs a privacy policy - even if you don't have a registered business yet.

📚 See an example of a privacy policy here: [https://www.sigrun.com/privacy-policy/](https://www.sigrun.com/privacy-policy/)

### Creating Your Privacy Policy:

If you don't have a privacy policy yet, you can create your privacy policy with a **privacy policy generator**. Pick a privacy policy generator from your country and create it in the language of your business. If you are already an established business then we recommend using a lawyer sooner rather than later but you can also start with a template.

### Using SOMBA.io:

If you are using SOMBA.io we've set up a template for your privacy policy that you just need to adapt with the text that you get from the privacy policy generator.

### Without SOMBA.io:

If you are not using SOMBA.io then you put your privacy policy on a new page on your website. If you don't have a website then we recommend you put your privacy policy in a **Google Doc** and create a public link that you can refer to in your survey.

**Now create your privacy policy.**`,
                inputField: {
                    key: "privacyPolicyUrl",
                    label: "Privacy Policy URL",
                    placeholder: "https://yourwebsite.com/privacy-policy or your Google Doc link",
                    type: "url",
                    required: true
                },
                aiPrompt: "What are the essential elements I need to include in my privacy policy for collecting survey data? I'm a [type of coach/business] and I'll be collecting names and email addresses from my surveys."
            },
            {
                id: "1-4",
                title: "Start Collecting Email Addresses",
                type: "lesson",
                videoUrl: null,
                content: `When you do a survey, you are also collecting email addresses. **Everyone who fills out the survey is a potential ideal client** and we want these people to join your email list.

### Using SOMBA.io:

If you are using SOMBA.io then everyone who fills out your survey is automatically added to your new email list inside SOMBA.io. In several countries they need to confirm again that they agree to receiving emails from you. This process is called **double opt-in**. Even if double opt-in is not mandatory in your country, we highly recommend setting up this process as it helps verifying email addresses and avoiding sending emails to someone who sees them as spam.

### Without SOMBA.io:

If you are not using SOMBA.io you can connect your survey tool (Google Forms, SurveyMonkey or TypeForm) with your email system with an automation tool called **Zapier**. There are also tools out there like **Make** that do something similar.

Or if you don't want to use Zapier, or any other automation tool like Make, you can **export the email addresses** from your survey tool and import them into your email system.

We do not provide tutorials on how to do this but YouTube has a lot of videos on how to do those connections.`,
                checklist: [
                    { key: "emailSystemSetup", label: "Email system connected to survey" },
                    { key: "doubleOptinEnabled", label: "Double opt-in enabled (if required)" }
                ],
                aiPrompt: "Help me understand how to set up email collection from my survey. I'm using [survey tool] and [email marketing tool]. What's the best way to connect them?"
            },
            {
                id: "1-5",
                title: "Promote Your Survey",
                type: "lesson",
                videoUrl: null,
                content: `With your survey sentence, survey, and privacy policy ready, the next step is to **promote your survey everywhere** so you can get as many people as possible to fill out the survey.

### Most Common Ways to Promote Your Survey:

- 📧 Email your list (if you have one)
- 📱 Post on all your social media channels
- 👥 Post in groups or forums that allow posting
- 🤝 Ask friends and family for help in promoting your survey

### Social Media Strategy:

When you promote on social media, **you don't just post once, but at least six times and in different ways.** Tell stories, explain to people why they should fill it out, how it could benefit them and how it will help you.

### Visual Content Tips:

🖼️ **Always add an image when you share your survey.** I sometimes create a graphic and sometimes use a GIF that stops people from scrolling on social media. A nice image catches people's attention so you are more likely to get more signups.

### Video Content (Most Effective!):

📹 **Doing a short video (60 seconds max) is the best way to engage your ideal clients.** Keep your video short and to the point. Start your video with a hook that will capture the scroller's attention. To create a great intro, turn your survey sentence into a question.

#### Video Hook Examples:

- **Fitness coach:** "Are you a woman in your 40s and 50s wanting to get rid of 5-10kg?"
- **Book coach:** "Are you a coach consultant or expert who wants to write a best-seller and become an authority in their niche?"
- **Business coach:** "Are you a female entrepreneur who is planning to launch an online program in the next 3-6 months?"
- **Relationship Coach:** "Are you a woman in your 30s and 40s who is seeking to strengthen your communication and connection with your partner?"
- **Arts and Crafts Teacher:** "Are you a creative person who is passionate about arts and crafts but struggles to find time or inspiration for their projects?"

You get the idea… **Ask a question to captivate your ideal client's attention** in your video.

### Important Rules:

⚠️ Be resourceful in promoting your survey. Think of all the ways you can promote your survey but please **DO NOT post your survey request or link in the SOMBA Kickstart community!**

⚠️ **When you promote your survey don't tell people you are designing an online course.** That is irrelevant at this point and does not give you better or more answers. It actually feels salesy and can lead to less or wrong answers in your survey.

### Set a Goal:

🎯 It makes sense to have a goal for how many survey answers you want. **Aim for a minimum of 100.** The more answers you get, the better and easier it is going to be to design your online course. And it also guarantees that there are people out there who actually want your new online course.

### Complete Promotion Checklist:

Here are many of the ways you can promote:

| Platform | Methods |
|----------|---------|
| Facebook | Post on page, Private profile, Story/Reels, Live, Groups, Cover photo |
| Instagram | Post/video, Story/Reels, Live, DMs |
| LinkedIn | Post |
| Twitter/X | Status |
| WhatsApp | Posts, Stories |
| Website | Popup or Button |
| Email | Email to your list, Personal emails to friends |
| Personal | Private messages to friends |

**Now go and promote your survey!**`,
                checklist: [
                    { key: "emailList", label: "Sent to Email List" },
                    { key: "facebookPost", label: "Posted on Facebook" },
                    { key: "facebookStory", label: "Facebook Story/Reels" },
                    { key: "instagramPost", label: "Posted on Instagram" },
                    { key: "instagramStory", label: "Instagram Story/Reels" },
                    { key: "linkedIn", label: "Posted on LinkedIn" },
                    { key: "groups", label: "Shared in Groups/Communities" },
                    { key: "video", label: "Created a short video (60 sec)" },
                    { key: "friendsFamily", label: "Asked friends/family to share" },
                    { key: "personalMessages", label: "Sent personal messages" }
                ],
                requiredCount: 6,
                inputField: {
                    key: "surveyResponseGoal",
                    label: "Your Survey Response Goal",
                    placeholder: "e.g., 100 responses",
                    type: "text",
                    required: false
                },
                aiPrompt: "Write me 3 different social media posts to promote my survey. My survey sentence is: {surveySentence}. I want variety - one with a story approach, one that's direct, and one that emphasizes the benefit/giveaway. Also give me a video hook question I can use."
            },
            {
                id: "1-6",
                title: "Start Working With Your Buddy",
                type: "lesson",
                videoUrl: null,
                content: `Soon you'll be introduced to your buddy - if you chose in the intake form to have a SOMBA Kickstart buddy. We will inform you in the community as soon as the buddies have been matched. The easiest way to reach out to your buddy is over the messenger and in this case it is allowed!

### How Buddy Matching Works:

Our buddy matching system looks at:
- What stage you are in
- What stage you want to be in 12 months
- Your language preference

We try to match you with a buddy to the best of our capabilities. It's up to you to make your buddy relationship the best it can be and if it doesn't work out you are welcome to look for a new buddy on your own, within our community.

### Weekly Accountability Call Structure:

We suggest that you set up a time to have a **weekly 1-hour accountability calls** where you:

1. 🎉 **Celebrate the wins** from last time
2. 🎯 **Focus on one business challenge** you want to solve
3. ✅ **Commit to your buddy** on what you are going to work on until next time

### Next Steps:

Be patient until we announce the buddies. Once we announce them, **please reach out right away to your buddy** and agree on the date and time to have your first call.

Good luck with your SOMBA Kickstart buddy! 🤝`,
                inputField: {
                    key: "buddyName",
                    label: "Your Buddy's Name",
                    placeholder: "Enter your buddy's name once matched",
                    type: "text",
                    required: false
                },
                aiPrompt: "Help me prepare for my first buddy accountability call. What questions should I ask to get to know my buddy? What should I share about my business and goals?"
            },
            {
                id: "1-7",
                title: "Mindset Tips for This Week",
                type: "lesson",
                videoUrl: null,
                content: `This week, you might run into some first mindset hurdles, but let's face them straight away.

### Common Concerns & How to Handle Them:

#### 🤔 "I don't know my course topic yet"
No need to stress about your course's final topic just yet. You're using the feedback from the survey to help you decide, right? You might have a bunch of ideas, but the survey responses will help you clear up what your course should focus on.

#### 💻 "I'm not a tech pro"
No worries! Just follow the lessons, and don't be shy to ask questions in our community or during our calls. Make sure to check out the weekly module as soon as it's out and if needed watch it twice. And then, of course, watch the tech tutorials. This way, you'll get all your questions answered.

#### 😬 "I'm nervous about promoting my survey"
It's normal to feel a bit uneasy when you're doing something new. But focusing on growing your business is the key, so trust this process. You'll be happy you did it later. And it's totally okay to ask for help. People are often eager to lend a hand and spread the word.

#### 📣 "I'm worried about annoying people by posting too much"
Remember, **only about 3% of your friends or followers will actually see your posts.** So, the more you post, the better your chances are of reaching your ideal clients or friends who potentially know your ideal client.

### The Bottom Line:

**Go ahead and promote because this is the start of creating a thriving online business.** 🚀`
            }
        ],
        techTutorials: [
            {
                id: "tech-1-1",
                title: "How to setup a Privacy Policy with Google Docs",
                description: "If you don't have a website yet, but need to have your privacy policy accessible from the internet, we have you covered. In this tutorial, we show you how to create a privacy policy you can share with others by using Google Docs.",
                videoUrl: null,
                resources: [
                    {
                        label: "GDPR Privacy Policy Generator",
                        url: "https://dsgvo-muster-datenschutzerklaerung.dg-datenschutz.de/?lang=en"
                    }
                ]
            },
            {
                id: "tech-1-2",
                title: "How to setup a Privacy Policy with SOMBA.io",
                description: "If you don't have a website yet and want to add your privacy policy to your SOMBA.io account, this is the way to go. In this tutorial, we show you how to set up your privacy policy inside our tool. But first, you need to create the content using a privacy policy generator.",
                videoUrl: null,
                resources: []
            },
            {
                id: "tech-1-3",
                title: "How to create your survey inside SOMBA.io",
                description: "Learn how to create and customize your ideal client survey using the SOMBA.io platform.",
                videoUrl: null,
                resources: []
            },
            {
                id: "tech-1-4",
                title: "How to share your survey from SOMBA.io to the internet",
                description: "Learn how to get your survey link and share it across your social media channels and email list.",
                videoUrl: null,
                resources: []
            }
        ],
        faqs: [
            {
                question: "Can I already start to promote my course?",
                answer: `**You are allowed to seed your online course** e.g. "Please fill out this survey, I am creating something new that comes out soon and would love to get your input."

**You are NOT allowed to promote your online course already** e.g. "My Instagram course is coming out in a couple of weeks, and you can sign up very soon."`
            },
            {
                question: "Where can I ask my questions?",
                answer: `Ask your questions directly in the Facebook group and use the hashtag **#ask**.

**Please do not:**
- Tag SIGRUN, TEAM SIGRUN, or SOMBA mentors/coaches in the FB group or in your social media images
- Private message any of these people (strictly against SOMBA rules)
- Use the hashtag #sombamentor (reserved for SOMBA mentors only)`
            }
        ],
        weeklyChecklist: [
            { key: "surveySentenceCreated", label: "Create your survey sentence" },
            { key: "surveyCreated", label: "Create your survey" },
            { key: "privacyPolicyCreated", label: "Create your privacy policy" },
            { key: "surveyPromoted", label: "Promote your survey (Wed-Sun this week)" },
            { key: "podcastsListened", label: "Listen to both podcast episodes" },
            { key: "podcastReviewLeft", label: "Leave a review and comment on your favorite podcast episode" }
        ],
        // Legacy steps for backward compatibility
        steps: [
            {
                id: "1-1",
                title: "Create Your Survey Sentence",
                type: "input",
                description: "Define the problem from your client's perspective. This sentence will be the foundation of your survey.",
                inputField: {
                    key: "surveySentence",
                    label: "Survey Sentence",
                    placeholder: "I'm looking for [ideal client] who [problem they face]. By filling out this survey before [deadline] you have the chance to win [incentive]...",
                    type: "textarea",
                    required: true
                },
                aiPrompt: "Help me write a compelling Survey Sentence for my coaching business. I want to reach [your niche] who struggle with [problem]."
            },
            {
                id: "1-2",
                title: "Create Your Survey",
                type: "input",
                description: "Create your survey with open-ended questions to understand your ideal client deeply.",
                inputField: {
                    key: "surveyUrl",
                    label: "Survey URL",
                    placeholder: "https://forms.gle/... or your SOMBA.io survey link",
                    type: "url",
                    required: true
                },
                aiPrompt: "Help me create survey questions based on my survey sentence: {surveySentence}"
            },
            {
                id: "1-3",
                title: "Privacy Policy Setup",
                type: "input",
                description: "Create or link your privacy policy for data collection compliance.",
                inputField: {
                    key: "privacyPolicyUrl",
                    label: "Privacy Policy URL",
                    placeholder: "https://yourwebsite.com/privacy-policy",
                    type: "url",
                    required: true
                },
                aiPrompt: "What should I include in my privacy policy for a coaching survey?"
            },
            {
                id: "1-4",
                title: "Promote Your Survey",
                type: "checklist",
                description: "Share your survey across all your channels to gather at least 100 responses.",
                checklist: [
                    { key: "emailList", label: "Sent to Email List" },
                    { key: "facebook", label: "Posted on Facebook (at least 6 times)" },
                    { key: "instagram", label: "Shared on Instagram" },
                    { key: "linkedIn", label: "Posted on LinkedIn" },
                    { key: "groups", label: "Shared in Groups/Communities" },
                    { key: "video", label: "Created a short video (60 sec)" },
                    { key: "friendsFamily", label: "Asked friends/family to share" }
                ],
                requiredCount: 5,
                aiPrompt: "Write me a social media post to promote my survey. My survey sentence is: {surveySentence}"
            }
        ]
    },
    {
        id: 2,
        title: "Week 2",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "2-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 2 content coming soon."
            }
        ]
    },
    {
        id: 3,
        title: "Week 3",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "3-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 3 content coming soon."
            }
        ]
    },
    {
        id: 4,
        title: "Week 4",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "4-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 4 content coming soon."
            }
        ]
    },
    {
        id: 5,
        title: "Week 5",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "5-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 5 content coming soon."
            }
        ]
    },
    {
        id: 6,
        title: "Week 6",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "6-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 6 content coming soon."
            }
        ]
    },
    {
        id: 7,
        title: "Week 7",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "7-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 7 content coming soon."
            }
        ]
    },
    {
        id: 8,
        title: "Week 8",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "8-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 8 content coming soon."
            }
        ]
    },
    {
        id: 9,
        title: "Week 9",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "9-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 9 content coming soon."
            }
        ]
    },
    {
        id: 10,
        title: "Week 10",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "10-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 10 content coming soon."
            }
        ]
    },
    {
        id: 11,
        title: "Week 11",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "11-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 11 content coming soon."
            }
        ]
    },
    {
        id: 12,
        title: "Week 12",
        subtitle: "To Be Announced",
        description: "Content for this week will be revealed soon.",
        locked: true,
        steps: [
            {
                id: "12-1",
                title: "To Be Announced",
                type: "placeholder",
                description: "This week's content will be announced soon. Stay tuned!",
                aiPrompt: "Week 12 content coming soon."
            }
        ]
    }
];

// Helper function to get total steps across all weeks
export const getTotalSteps = () => {
    return curriculum.reduce((total, week) => total + week.steps.length, 0);
};

// Helper function to get step by week and step index
export const getStep = (weekIndex, stepIndex) => {
    const week = curriculum[weekIndex];
    if (!week) return null;
    return week.steps[stepIndex] || null;
};

/*
 * Site settings — the only file you should need to edit.
 * Loaded before script.js.
 */
window.PORTFOLIO_CONFIG = {
  /* Dialogflow CX Messenger. Leave the YOUR_… placeholders to keep the built-in
     starter-question panel; set real IDs to load Google's live chat widget instead. */
  dialogflow: {
    projectId: 'YOUR_PROJECT_ID',
    agentId: 'YOUR_AGENT_ID',
    location: 'global',
    languageCode: 'en',
    scriptUrl: 'https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js',
    title: 'Ask the Dispatch',
    subtitle: "Questions about Saksham's work"
  },

  /* Masthead "Vol. VI · No. 6" = whole years of experience · extra months.
     Each stint is [start, end] as 'YYYY-MM'; end null = still there. */
  experience: [
    ['2018-06', '2019-07'], // Lucideus Technologies
    ['2021-06', null]       // Synopsys → Black Duck → UltraViolet Cyber
  ],

  contactEmail: 'chawla.saksham08@gmail.com',

  /* Starter questions for the built-in chat panel. Each answer can point to one
     or more sections: use a case-study id (F-01 … F-10) or a section anchor
     (cv, skills, work, off-cv, kind-words, contact, about, bylines). */
  starters: [
    { q: 'What did he find at the bank?',
      a: 'Four flaws chained into one exploit in a Fortune 100 bank’s payment settlement platform, demonstrated live to the Payments SVP and fixed before go-live.',
      sections: [['F-01', 'Four chained flaws'], ['F-05', 'Automating exploit revalidation']],
      keywords: ['bank','payment','settlement','finding','flaw','exploit','vulnerability','fortune'] },
    { q: 'How does he use AI in security work?',
      a: 'He built a workflow that checks an AI threat-modelling tool’s claims against the client’s own documents and code, cutting delivery from three weeks to one, and threat-modelled an airline’s GenAI platform.',
      sections: [['F-02', 'Making AI threat models trustworthy'], ['F-03', 'A token that opened the AI gateway']],
      keywords: ['ai','llm','genai','threat model','threat modelling','automation','workflow'] },
    { q: 'Has he secured AI agents?',
      a: 'Yes: three threat models for an airline’s GenAI platform, where he found that a token meant only for agent configuration also opened the central AI gateway.',
      sections: [['F-03', 'A token that opened the AI gateway'], ['skills', 'AI / LLM security skills']],
      keywords: ['agent','agentic','mcp','airline','gateway','token','secure'] },
    { q: 'Has he led a team?',
      a: 'Technical oversight for 8 assessors across 100+ assessments, with zero missed SLAs and zero escalations, plus mentoring junior assessors.',
      sections: [['F-04', 'Turning assessors into owners'], ['F-08', 'Mentoring a stuck colleague']],
      keywords: ['team','lead','leadership','manage','mentor','assessor','oversight'] },
    { q: 'Where does he work now?',
      a: 'Staff Consultant at UltraViolet Cyber, leading threat modelling, secure design review and architecture risk analysis for Bangalore delivery.',
      sections: [['cv', 'The record']],
      keywords: ['work','current','job','role','employer','company','ultraviolet','position','employed','working'] },
    { q: 'How do I get in touch?',
      a: 'Email chawla.saksham08@gmail.com, or find him on LinkedIn. He is open to relocation.',
      sections: [['contact', 'Contact']],
      keywords: ['contact','email','reach','hire','linkedin','relocate','relocation','touch'] } ],

  /* Extra topics for the free-text box only (no chip). Same shape as starters.
     `keywords` is what makes a typed question match, so list the words people
     would use. Add one when a section is missing a typed-question answer. */
  topics: [
    { q: 'What are his skills?', a: 'Application security, threat modelling, secure design review, penetration testing and AI / LLM security. The full list is in the skills section.',
      sections: [['skills', 'Skills']], keywords: ['skill','tool','tech','stack','expertise','good','know','certification','certified'] },
    { q: 'Where has he worked?', a: 'Employment history, with dates and highlights for each role.',
      sections: [['cv', 'The record']], keywords: ['history','experience','resume','cv','career','previous','past','employer'] },
    { q: 'Has he written anything?', a: 'He writes on Medium about security assessments, malware and building things. The posts are listed in the bylines.',
      sections: [['bylines', 'Bylines']], keywords: ['write','written','blog','medium','article','post','publish','writing'] },
    { q: 'What do others say about him?', a: 'Recommendations from people he has worked with are collected in the letters section.',
      sections: [['kind-words', 'Letters']], keywords: ['recommend','recommendation','reference','testimonial','letter','feedback','say'] },
    { q: 'What else does he do?', a: 'Projects, writing and volunteering outside the day job.',
      sections: [['off-cv', 'Features']], keywords: ['project','volunteer','volunteering','open source','github','hobby','outside','side'] },
    { q: 'Who is he?', a: 'A security engineer focused on application and AI security. The front page has the short version.',
      sections: [['about', 'About me']], keywords: ['about','who','introduce','bio','background','person','yourself'] }
  ]
};

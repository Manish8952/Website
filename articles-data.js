/* =====================================================================
   ARTICLE PAGES: edit this file to write the article pages.
   The "Read article" buttons open  article.html?id=physics / cloud / electronics

   Each page can hold SEVERAL articles, listed as "parts". Click a title and
   that article opens below the list. Every part has its own title, date and blocks.

   BLOCK TYPES (used inside a part's  blocks: [ ... ] )
   { type: "heading", text: "A section title" }
   { type: "text",    text: "A paragraph.\n\nBlank line = new paragraph." }
   { type: "list",    items: ["Point one", "Point two"] }
   { type: "image",   src: "articles/photo.jpg", caption: "Optional caption" }
   { type: "youtube", url: "https://www.youtube.com/watch?v=VIDEO_ID", title: "Optional" }
   { type: "link",    label: "Read the paper", url: "https://example.com", note: "Optional" }
   { type: "drive",   label: "Lecture notes (PDF)", url: "https://drive.google.com/file/d/FILE_ID/view" }
   { type: "drive",   label: "Slides", url: "https://drive.google.com/file/d/FILE_ID/view", embed: true }

   RULES: a comma after every part and every block, except the last one.
          Each part "id" must be short, with no spaces, and different from the others.
   ===================================================================== */
window.ARTICLES = {

  physics: {
    tag: "Physics",
    title: "Understanding Modern Physics Concepts",
    date: "2026-10-08",
    parts: [
      {
        id: "biography",
        title: "Biography of Physicist",
        date: "2026-10-08",
        blocks: [
          { type: "text", text: "Write the first physics article here." }
        ]
      },
      {
        id: "quantum",
        title: "Quantum Mechanics Basics",
        blocks: [
          { type: "heading", text: "The wave function" },
          { type: "text", text: "Write the second physics article here." }
        ]
      }
    ]
  },

  cloud: {
    tag: "Technology",
    title: "The Future of Cloud Computing",
    date: "2026-10-08",
    parts: [
      {
        id: "intro",
        title: "What Is Cloud Computing?",
        date: "2026-10-08",
        blocks: [
          { type: "text", text: "Write the first cloud article here." }
        ]
      },
      {
        id: "distributed",
        title: "Distributed Systems Explained",
        blocks: [
          { type: "text", text: "Write the second cloud article here." }
        ]
      }
    ]
  },

  electronics: {
    tag: "Electronics",
    title: "How Electronics Is Essential in Today's Computing",
    date: "2026-10-08",
    parts: [
      {
        id: "microelectronics",
        title: "Microelectronics in Modern Computers",
        date: "2026-10-08",
        blocks: [
          { type: "text", text: "Write the first electronics article here." }
        ]
      },
      {
        id: "transistors",
        title: "How Transistors Work",
        blocks: [
          { type: "text", text: "Write the second electronics article here." }
        ]
      }
    ]
  }
};
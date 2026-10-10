/* =====================================================================
   LATEST PAGE CONTENT: edit this file to update the "Latest" tab.
   Save / commit it and refresh the site. Nothing else needs changing.
   Dates use YYYY-MM-DD. Newest updates are shown first automatically.
   Delete any block you don't need; empty sections are hidden.
   ===================================================================== */
window.LATEST = {

  lastUpdated: "2026-10-09", // date of the last update, shown in the top-right corner

  // Big highlighted message at the top. Use  announcement: null  to hide it.
  announcement: {
    text: "Welcome to my new website! I'll post my daily progress here.",
  },

  // What you are working on right now (progress is 0-100, optional)
  current: [
    { title: "Building my personal website", text: "which is almost done.", progress: 90 },
    { title: "Studying for my B.Sc. in Physics", text: "Self-directed learning in physics, electronics and AI.", progress: 25 }
  ],

  // What is coming up next
  upcoming: [
    { date: "Coming soon", title: "First blog article on modern physics", text: "A beginner-friendly guide with formulas and examples." },
    { date: "Later this year", title: "Electronics project video", text: "A step-by-step build shared on YouTube." }
  ],

  // YouTube videos shown in a medium player just above "Let's Connect".
  // Paste any YouTube link (watch, youtu.be or Shorts). Add as many as you like:
  // the first one is in the player, the rest appear as thumbnails to click.
  // Leave the list empty ( videos: [] ) and the Videos section stays hidden.
  videos: [
    // when videos are not added, the entire "Videos" section is hidden automatically if you leave the list empty
    // { title: "My first physics video", youtube: "https://www.youtube.com/watch?v=VIDEO_ID" },
    // { title: "Electronics project",    youtube: "https://youtu.be/VIDEO_ID" },
    { title: "Exploring Quantum Mechanics", youtube: "https://youtu.be/yRqRJLMR5fU?si=eqcxjlqBwUR4EX6d" },
    { title: "Building a Simple Circuit", youtube: "https://youtu.be/yRqRJLMR5fU?si=eqcxjlqBwUR4EX6d" },
  ],

  // Daily updates. Every field except date + title is optional.
  updates: [
    {
      date: "2026-10-09",
      title: "Testing the Latest page",
      text: "Write what you did today here. You can add a photo, a link and a YouTube video to any update.",
      // image: "latest/my-photo.jpg",                       // upload the photo into the "latest" folder
      // link: { label: "Read more", url: "https://example.com" },
      // youtube: "https://www.youtube.com/watch?v=VIDEO_ID" // paste any YouTube link
    }
  ]
};

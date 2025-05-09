import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Remix Icon CSS
const remixIconLink = document.createElement("link");
remixIconLink.rel = "stylesheet";
remixIconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css";
document.head.appendChild(remixIconLink);

// Add title
const titleElement = document.createElement("title");
titleElement.textContent = "CodeTutor AI - Learn Programming";
document.head.appendChild(titleElement);

// Add meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Master coding skills with curated video content and real-time AI feedback on your code. CodeTutor AI is your personalized programming education platform.";
document.head.appendChild(metaDescription);

// Add Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.property = "og:title";
ogTitle.content = "CodeTutor AI - Learn Programming";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.property = "og:description";
ogDescription.content = "Master coding skills with curated video content and real-time AI feedback on your code.";
document.head.appendChild(ogDescription);

// Add font preload
const fontPreload = document.createElement("link");
fontPreload.rel = "preconnect";
fontPreload.href = "https://fonts.googleapis.com";
document.head.appendChild(fontPreload);

const fontPreload2 = document.createElement("link");
fontPreload2.rel = "preconnect";
fontPreload2.href = "https://fonts.gstatic.com";
fontPreload2.crossOrigin = "";
document.head.appendChild(fontPreload2);

// Add font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

createRoot(document.getElementById("root")!).render(<App />);

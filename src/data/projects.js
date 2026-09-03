import tamakhanaImage from "../assets/tamakhana.png";
import shopverseImage from "../assets/shopverse.png";
import swiggyCloneImage from "../assets/swiggyclone.png";

export const projects = [
  {
    id: 0,
    title: "Tamakhana",
    description: "A responsive ReactJS platform with custom search filters, interactive booking flows, and admin dashboards. The interface was optimised for reliable rendering across 10+ screen profiles and improved page-load times by 30%.",
    tech: ["React.js", "HTML5", "CSS3", "Bootstrap"],
    image: tamakhanaImage,
    github: "https://github.com/gaurav6338/tamakhana",
    live: "https://tamakhana.netlify.app/"
  },
  {
    id: 1,
    title: "ShopVerse",
    description: "A full-stack e-commerce platform with a 100+ item catalogue, real-time search, multi-category filtering, persistent cart state, and Stripe, Razorpay, and cash-on-delivery checkout.",
    tech: ["React 19", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Stripe", "Razorpay"],
    image: shopverseImage,
    github: "https://github.com/gaurav6338/E-commerce",
    live: "https://e-commerce-3mfcjfnop-gauravrai01882002-5115s-projects.vercel.app/"
  },
  {
    id: 2,
    title: "3D Card Builder",
    description: "An interactive 3D business-card customizer with QR rendering and client-side PDF and image exports, designed for fast and fluid customisation.",
    tech: ["React 19", "Three.js", "Framer Motion", "Node.js", "Express", "MongoDB"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    github: "https://github.com/gaurav6338/3Dcard-builder",
    live: "https://illustrious-profiterole-4592b9.netlify.app/"
  },
  {
    id: 3,
    title: "Swiggy Clone",
    description: "A responsive food-ordering web application for real-time menu browsing across 20+ active categories, with REST APIs for catalogues, filtering, and order requests.",
    tech: ["React", "Node.js", "Express", "Tailwind CSS", "REST APIs"],
    image: swiggyCloneImage,
    github: "https://github.com/gaurav6338/swiggy_clone",
    live: "https://swiggy-clone-1-jsoy.onrender.com/"
  },
];

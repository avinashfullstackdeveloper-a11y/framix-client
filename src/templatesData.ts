// Define a type for a single template for better type-safety
export interface Template {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  about: string[];
  creator: string;
  updated: string;
  pages: number;
  views: string;
  details: {
    category: string;
    platform: string;
    technology: string;
    timeline: string;
  };
  media: {
    mainVideo: string;
    galleryImages: string[];
    relatedTemplateVideos: string[];
  };
}

// Export the array of projects, typed with the Project interface
export const templatesData: Template[] = [
  {
    id: 'mind-scape',
    title: 'Mind Scape',
    subtitle: 'A Mental Wellness App for Gen Z',
    description: "In today's fast-moving world, young people often carry invisible struggles that no one sees. MindScape was designed as a companion, not just an app.",
    about: [
      "MindScape is a mental wellness app designed specifically for Gen Z users to tackle stress, loneliness, and anxiety in an engaging way.",
      "Unlike traditional wellness apps that often feel too clinical, MindScape blends playful design, gamified features, and calming UI to create a safe digital space for emotional well-being. Our mission is to make mental health approachable, interactive, and fun, while maintaining a professional and trustworthy experience."
    ],
    creator: 'KFrame',
    updated: '2 Days ago',
    pages: 3,
    views: '12.6k',
    details: {
      category: 'Mental Health',
      platform: 'Mobile App',
      technology: 'React Native',
      timeline: '6 months',
    },
    media: {
      mainVideo: "/assets/videos/pd1.mp4",
      galleryImages: [
        "/assets/images/pd2.png",
        "/assets/images/pd3.png",
        "/assets/images/pd4.png",
      ],
      relatedTemplateVideos: [
        "/assets/videos/a.mp4",
        "/assets/videos/b.mp4",
        "/assets/videos/c.mp4",
      ],
    }
  },
  // You can add more project objects here
  {
    id: 'another-project',
    title: 'Another Cool Project',
    subtitle: 'A brief description of this other project.',
    // ... fill in the rest of the properties for this project
    description: '',
    about: [],
    creator: 'Your Name',
    updated: '1 Week ago',
    pages: 5,
    views: '2.1k',
    details: {
      category: 'E-commerce',
      platform: 'Web App',
      technology: 'React & Node.js',
      timeline: '3 months',
    },
    media: {
      mainVideo: '/assets/videos/b.mp4',
      galleryImages: [],
      relatedTemplateVideos: [],
    }
  }
];
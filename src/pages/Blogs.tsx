import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { ArrowRight } from "lucide-react"; // A popular icon library

const Blogs = () => {
  const blogPosts = [
    {
      title: "Futuristic Interfaces",
      description: "Explore the latest trends in UI design and how to implement them",
      image: "/assets/images/a.png",
      category: "Design"
    },
    {
      title: "Neon Web Design Trends",
      description: "How to create stunning neon effects in modern web design",
      image: "/assets/images/b.png", 
      category: "Trends"
    },
    {
      title: "Minimal Streetwear UI",
      description: "Building clean and minimalist interfaces for fashion brands",
      image: "/assets/images/c.png",
      category: "Fashion"
    },
    {
      title: "Modern Furniture Design",
      description: "Creating elegant product showcases for furniture companies",
      image: "/assets/images/d.png",
      category: "Product"
    },
    {
      title: "Smart UI Components",
      description: "Building intelligent and responsive component libraries",
      image: "/assets/images/e.png",
      category: "Development"
    },
    {
      title: "Futuristic Interfaces",
      description: "Advanced techniques for creating next-generation user interfaces",
      image: "/assets/images/a.png",
      category: "Innovation"
    },
    // Added the remaining posts to complete the second set
    {
      title: "Neon Web Design Trends",
      description: "Master the art of vibrant and eye-catching web designs",
      image: "/assets/images/b.png",
      category: "Visual"
    },
    {
      title: "Minimal Streetwear UI",
      description: "Crafting sophisticated interfaces for lifestyle brands",
      image: "/assets/images/c.png",
      category: "Branding"
    },
    {
      title: "Modern Furniture Design",
      description: "Showcasing products with beautiful and functional designs",
      image: "/assets/images/d.png",
      category: "Showcase"
    },
    {
      title: "Smart UI Components",
      description: "Revolutionary approaches to component architecture",
      image: "/assets/images/e.png",
      category: "Architecture"
    }
  ];

  // Animation variants for the staggered list effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each child will animate 0.1s after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-primary">Insights</span> from Framix,{" "}
            Read by Innovators
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore expert tips, design trends, and product strategies from the Framix 
            community. Stay inspired and ahead with stories that shape the future of 
            design and development.
          </p>
        </motion.div>

        {/* Blog Posts Grid with Staggered Animation */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogPosts.map((post, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card 
                className="bg-gradient-card border-border 
                           transform transition-shadow duration-300 
                           hover:shadow-2xl hover:shadow-primary/20
                           cursor-pointer group relative overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-8 flex items-center">
                      <div>
                        <motion.div 
                          className="flex items-center gap-3"
                          whileHover={{ x: 5, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                        >
                          <h3 className="text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary">
                            {post.title}
                          </h3>
                          {/* Arrow appears and animates on hover */}
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }} 
                            whileHover={{ opacity: 1, x: 0 }}
                          >
                            <ArrowRight className="text-primary" />
                          </motion.div>
                        </motion.div>
                        <p className="text-muted-foreground mb-4">{post.description}</p>
                        <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm 
                                        transition-colors duration-300 ease-in-out 
                                        group-hover:bg-primary group-hover:text-primary-foreground">
                          {post.category}
                        </div>
                      </div>
                    </div>
                    <div className="md:w-96 aspect-video md:aspect-auto bg-gradient-primary/20 relative overflow-hidden">
                      {/* Unique "Shine" effect on hover */}
                      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_40%)] transition-transform duration-700 ease-in-out transform-gpu group-hover:scale-150 group-hover:opacity-50"></div>
                      <motion.img 
                        src={post.image} 
                        alt={post.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ 
                          scale: 1.1, 
                          transition: { type: "spring", stiffness: 200, damping: 20 }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter CTA with Scroll-Triggered Animation */}
        <motion.div 
          className="text-center mt-20 py-16 bg-gradient-card rounded-2xl border border-border"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} // Animate once 30% is visible
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Stay updated with latest insights
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest design trends, development tips, and industry insights 
            delivered directly to your inbox.
          </p>
          <div className="flex gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-secondary border border-border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                         transition-all duration-200 ease-in-out"
            />
            <motion.button 
              className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
  );
};

export default Blogs;
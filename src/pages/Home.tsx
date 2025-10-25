import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const trustedWayCardData = [
  {
    title: "Built for Every Skill Level.",
    description:
      "Framix provides ready-to-use components and templates for beginners, while offering flexibility and depth for advanced designers and developers.",
  },
  {
    title: "Industry Best Practices.",
    description:
      "Our components are designed following the latest standards for accessibility, responsiveness, and performance.",
  },
  {
    title: "Trusted & Reliable",
    description:
      "Framix is crafted to deliver stable, high-quality performance, empowering teams to build faster with confidence.",
  },
];

const portfolioCardData = [
  {
    icon: "#",
    title: "Ready-made components",
    description:
      "With industry-standard practices and seamless scalability, Framix helps teams deliver high-performing projects confidently.",
  },
  {
    icon: "🎛️",
    title: "Customize with ease",
    description:
      "Tailor every detail to your brand with pixel-perfect control and modern design standards.",
  },
  {
    icon: "🚀",
    title: "Launch faster",
    description:
      "Deploy beautiful, functional designs in record time without reinventing the wheel.",
  },
];

const whatsNewVideos = [
  "/assets/videos/ia.mp4",
  "/assets/videos/ib.mp4",
  "/assets/videos/ic.mp4",
];

const trustedPlatformImages = Array.from(
  { length: 20 },
  (_, i) => `/assets/images/i${i + 1}.png`
);

// Data for the "Voices of Our Creators" section
const testimonialsData = [
  {
    quote:
      "The curation is top-notch, saving me hours of searching for the perfect components. A game-changer for my workflow.",
    name: "Jessica Lee",
    title: "Senior UI Designer",
    avatar: "/assets/images/i1.png",
  },
  {
    quote:
      "The quality and consistency of the components are unmatched. It's the first place I look for new project inspiration.",
    name: "David Miller",
    title: "Senior Developer",
    avatar: "/assets/images/i2.png",
  },
  {
    quote:
      "The well-documented code makes integration a breeze. It's saved our team countless hours in development.",
    name: "Alex Chen",
    title: "Product Manager",
    avatar: "/assets/images/i3.png",
  },
  {
    quote:
      "It's more than just a library—it's a community. The collaboration tools are a huge plus for our entire team.",
    name: "Emily Roberts",
    title: "Freelance Designer",
    avatar: "/assets/images/i4.png",
  },
];

const LandingPage = () => {
  const [activeTrustedCard, setActiveTrustedCard] = useState(0);
  const [activePortfolioCard, setActivePortfolioCard] = useState(0);
  const [activeWhatsNewCard, setActiveWhatsNewCard] = useState(0);

  useEffect(() => {
    const trustedInterval = setInterval(() => {
      setActiveTrustedCard((prev) => (prev + 1) % trustedWayCardData.length);
    }, 3000);

    const portfolioInterval = setInterval(() => {
      setActivePortfolioCard((prev) => (prev + 1) % portfolioCardData.length);
    }, 3000);

    const whatsNewInterval = setInterval(() => {
      setActiveWhatsNewCard((prev) => (prev + 1) % whatsNewVideos.length);
    }, 4000);

    return () => {
      clearInterval(trustedInterval);
      clearInterval(portfolioInterval);
      clearInterval(whatsNewInterval);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const TestimonialCard = ({ testimonial }) => (
    <Card className="bg-[#1c1c1c] border-gray-800 p-6 text-left h-full flex flex-col justify-between">
      <CardContent className="p-0">
        <p className="text-sm text-gray-300">"{testimonial.quote}"</p>
      </CardContent>
      <div className="flex items-center gap-3 mt-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover bg-pink-400"
        />
        <div>
          <div className="font-semibold text-sm">{testimonial.name}</div>
          <div className="text-xs text-gray-400">{testimonial.title}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="bg-[#111111] text-white font-sans">
      <main>
        {/* Hero Section */}
        <motion.section
          className="relative pt-20 pb-20 lg:pt-24 lg:pb-32 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="text-center lg:text-left z-10"
              variants={itemVariants}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight flex flex-col">
                <span>Accelerate products with</span>
                <span>
                  ready-made{" "}
                  <span className="text-[#FF94C666]">components</span>
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Instantly copy responsive HTML, CSS, and React code. Build
                modern interface faster, without starting from scratch.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200">
                  Get Started Now
                </Button>
                <Link to="/components">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 hover:text-white font-semibold px-6 py-3 rounded-md"
                  >
                    Explore Components
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="relative flex justify-end items-center h-full min-h-[300px] lg:pl-16"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
              }}
            >
              <div className="absolute right-0 w-80 h-80 bg-[#FF94C666]/20 rounded-full blur-3xl"></div>
              <img
                src="/phone.png"
                alt="App Preview"
                className="w-[260px] md:w-[370px] lg:w-[420px] relative z-10 lg:mr-[-40px]"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Your trusted way Section */}
        <motion.section
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div className="lg:pr-12" variants={itemVariants}>
                <h2 className="text-4xl font-bold mb-6">
                  Your trusted way to design, build, and scale.
                </h2>
              </motion.div>
              <motion.div
                className="relative h-64 overflow-hidden"
                variants={itemVariants}
              >
                {trustedWayCardData.map((card, index) => (
                  <Card
                    key={index}
                    className={`absolute w-full h-full p-6 border-0 text-white transition-all duration-500 ease-in-out ${
                      index === activeTrustedCard
                        ? "z-10 scale-105 bg-gradient-to-br from-[#FF94C666]/90 to-purple-600/90"
                        : "z-0 scale-100 bg-[#1c1c1c] opacity-50"
                    }`}
                    style={{
                      transform: `translateX(${
                        (index - activeTrustedCard) * 10
                      }%) ${index !== activeTrustedCard ? "scale(0.95)" : ""}`,
                      zIndex:
                        trustedWayCardData.length -
                        Math.abs(index - activeTrustedCard),
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="text-lg font-bold">0{index + 1}.</div>
                      <h3 className="text-xl font-semibold my-2">
                        {card.title}
                      </h3>
                      {index === activeTrustedCard && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <p className="text-sm text-gray-200">
                              {card.description}
                            </p>
                            <a
                              href="#"
                              className="text-sm font-semibold mt-4 inline-block"
                            >
                              Learn more →
                            </a>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Trusted platform Section (New Animation) */}
        <motion.section
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={itemVariants}>
                <h2 className="text-4xl font-bold mb-6">
                  Trusted platform anytime & anywhere.
                </h2>
                <div className="flex items-center gap-1 mb-4 text-[#FF94C666]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-400 mb-8">
                  Framix empowers designers and developers with a growing
                  ecosystem of modern UI components and templates. Whether
                  you're building SaaS dashboards, mobile apps, or websites,
                  Framix ensures your workflow stays fast, reliable, and
                  accessible from anywhere.
                </p>
                <Button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200">
                  Start Designing
                </Button>
              </motion.div>
              <motion.div
                className="h-96 overflow-hidden relative"
                variants={itemVariants}
              >
                <motion.div
                  className="grid grid-cols-4 gap-4"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{
                    ease: "linear",
                    duration: 30,
                    repeat: Infinity,
                  }}
                >
                  {[...trustedPlatformImages, ...trustedPlatformImages].map(
                    (src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Component preview ${i + 1}`}
                        className="h-32 w-full object-cover rounded-lg"
                      />
                    )
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Build your design portfolio Section (New Animation) */}
        <motion.section
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 text-center">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold mb-4"
            >
              Build your design portfolio
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Framix provides everything you need to create, launch, and scale
              high-quality projects – all powered by flexible UI components.
            </motion.p>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {portfolioCardData.map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onMouseEnter={() => setActivePortfolioCard(index)}
                >
                  <Card
                    className={`bg-[#1c1c1c] border-gray-800 p-8 text-center flex flex-col justify-start items-center h-full transition-all duration-300 ease-in-out ${
                      activePortfolioCard === index ? "bg-[#FF94C666]/90" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                          activePortfolioCard === index ? "bg-white/20" : ""
                        }`}
                      >
                        <span className="text-4xl text-[#FF94C666]">
                          {card.icon}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3">
                        {card.title}
                      </h3>
                      <AnimatePresence>
                        {activePortfolioCard === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-200 mt-4">
                              {card.description}
                            </p>
                            <Button className="bg-black text-white mt-6">
                              Learn More
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* What's new Section (Video Animation) */}
        <motion.section
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={itemVariants}>
                <h2 className="text-4xl font-bold mb-6">
                  What's new we provide for you?
                </h2>
                <p className="text-gray-400 mb-8">
                  Framix delivers a growing ecosystem of powerful UI components,
                  templates, and tools designed to help designers and developers
                  ship projects faster.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-[#FF94C666]" />
                    <div>
                      <h3 className="font-semibold">
                        We provide production-ready UI blocks
                      </h3>
                      <p className="text-gray-500 text-sm">
                        that save hours of design & coding.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-[#FF94C666]" />
                    <div>
                      <h3 className="font-semibold">
                        Easily connect Framix components
                      </h3>
                      <p className="text-gray-500 text-sm">
                        with your tech stack.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="relative h-96 w-full overflow-hidden"
                variants={itemVariants}
              >
                <AnimatePresence>
                  {whatsNewVideos.map((videoSrc, index) => (
                    <motion.div
                      key={videoSrc}
                      className="absolute w-full h-full"
                      initial={{
                        opacity: 0,
                        y: 50,
                        scale: 0.9,
                        rotate: (index - activeWhatsNewCard) * 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: (index - activeWhatsNewCard) * -20,
                        scale: 1 - Math.abs(index - activeWhatsNewCard) * 0.05,
                        rotate: (index - activeWhatsNewCard) * 5,
                      }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{
                        zIndex:
                          whatsNewVideos.length -
                          Math.abs(index - activeWhatsNewCard),
                      }}
                    >
                      <Card className="w-full h-full bg-white text-gray-800 p-2 rounded-2xl shadow-2xl overflow-hidden">
                        <video
                          src={videoSrc}
                          autoPlay
                          loop
                          muted
                          className="w-full h-full object-cover rounded-xl"
                        ></video>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Voices of Our Creators Section */}
        <motion.section
          className="py-24 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 text-center">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold mb-4"
            >
              Voices of Our <span className="text-[#FF94C6]">Creators</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Hear the trusted feedback from customers who have put their faith
              in us
            </motion.p>

            <div className="flex flex-col gap-6">
              {/* First Scrolling Row (Right to Left) */}
              <div className="relative overflow-hidden w-full">
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="flex"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{
                      ease: "linear",
                      duration: 40,
                      repeat: Infinity,
                    }}
                  >
                    {[...testimonialsData, ...testimonialsData].map(
                      (testimonial, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 p-3"
                        >
                          <TestimonialCard testimonial={testimonial} />
                        </div>
                      )
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Second Scrolling Row (Left to Right) */}
              <div className="relative overflow-hidden w-full">
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="flex"
                    animate={{ x: ["-100%", "0%"] }}
                    transition={{
                      ease: "linear",
                      duration: 40,
                      repeat: Infinity,
                    }}
                  >
                    {[...testimonialsData, ...testimonialsData].map(
                      (testimonial, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 p-3"
                        >
                          <TestimonialCard testimonial={testimonial} />
                        </div>
                      )
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default LandingPage;

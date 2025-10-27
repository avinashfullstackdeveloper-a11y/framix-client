import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "../index.css"; // Ensure global styles are loaded

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

// PortfolioIcon component that accepts isHovered prop
const PortfolioIcon = ({ type, isHovered }) => {
  const iconColor = isHovered ? "#FF94C9" : "#141414"; // black -> pink on hover
  const circleStroke = isHovered ? "#FF94C9" : "#141414"; // black -> pink on hover

  const icons = {
    hashtag: (
      <path
        d="M11.622 22.5556L12.357 15.4444H5V11.8889H12.7262L13.645 3H17.1643L16.2455 11.8889H23.2262L24.145 3H27.6642L26.7455 11.8889H33V15.4444H26.378L25.643 22.5556H33V26.1111H25.2738L24.355 35H20.8357L21.7545 26.1111H14.7738L13.855 35H10.3357L11.2545 26.1111H5V22.5556H11.622ZM15.1413 22.5556H22.1237L22.8587 15.4444H15.8763L15.1413 22.5556Z"
        fill={iconColor}
        className="transition-all duration-300"
      />
    ),
    grid: (
      <path
        d="M6.33333 17.4167H15.8333C16.2533 17.4167 16.656 17.2499 16.9529 16.9529C17.2499 16.656 17.4167 16.2533 17.4167 15.8333V6.33333C17.4167 5.91341 17.2499 5.51068 16.9529 5.21375C16.656 4.91681 16.2533 4.75 15.8333 4.75H6.33333C5.91341 4.75 5.51068 4.91681 5.21375 5.21375C4.91681 5.51068 4.75 5.91341 4.75 6.33333V15.8333C4.75 16.2533 4.91681 16.656 5.21375 16.9529C5.51068 17.2499 5.91341 17.4167 6.33333 17.4167ZM7.91667 7.91667H14.25V14.25H7.91667V7.91667ZM31.6667 4.75H22.1667C21.7467 4.75 21.344 4.91681 21.0471 5.21375C20.7501 5.51068 20.5833 5.91341 20.5833 6.33333V15.8333C20.5833 16.2533 20.7501 16.656 21.0471 16.9529C21.344 17.2499 21.7467 17.4167 22.1667 17.4167H31.6667C32.0866 17.4167 32.4893 17.2499 32.7863 16.9529C33.0832 16.656 33.25 16.2533 33.25 15.8333V6.33333C33.25 5.91341 33.0832 5.51068 32.7863 5.21375C32.4893 4.91681 32.0866 4.75 31.6667 4.75ZM30.0833 14.25H23.75V7.91667H30.0833V14.25ZM15.8333 33.25C16.2533 33.25 16.656 33.0832 16.9529 32.7863C17.2499 32.4893 17.4167 32.0866 17.4167 31.6667V22.1667C17.4167 21.7467 17.2499 21.344 16.9529 21.0471C16.656 20.7501 16.2533 20.5833 15.8333 20.5833H6.33333C5.91341 20.5833 5.51068 20.7501 5.21375 21.0471C4.91681 21.344 4.75 21.7467 4.75 22.1667V31.6667C4.75 32.0866 4.91681 32.4893 5.21375 32.7863C5.51068 33.0832 5.91341 33.25 6.33333 33.25H15.8333ZM7.91667 23.75H14.25V30.0833H7.91667V23.75ZM28.5 22.1667H25.3333V25.3333H22.1667V28.5H25.3333V31.6667H28.5V28.5H31.6667V25.3333H28.5V22.1667Z"
        fill={iconColor}
        className="transition-all duration-300"
      />
    ),
    rocket: (
      <>
        <path
          d="M7.12467 26.125C4.74967 28.12 3.95801 34.0417 3.95801 34.0417C3.95801 34.0417 9.87967 33.25 11.8747 30.875C12.9988 29.545 12.983 27.5025 11.7322 26.2675C11.1167 25.6801 10.3061 25.3407 9.4557 25.3144C8.60534 25.2881 7.77523 25.5767 7.12467 26.125ZM18.9997 23.75L14.2497 19C15.0922 16.8141 16.1532 14.7188 17.4163 12.7458C19.2612 9.79605 21.8301 7.36731 24.8786 5.69063C27.9271 4.01395 31.3539 3.14507 34.833 3.16665C34.833 7.47332 33.598 15.0417 25.333 20.5833C23.3328 21.8475 21.2111 22.9083 18.9997 23.75Z"
          stroke={iconColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        <path
          d="M14.2497 19H6.33301C6.33301 19 7.20384 14.2025 9.49967 12.6667C12.0647 10.9567 17.4163 12.6667 17.4163 12.6667M18.9997 23.75V31.6667C18.9997 31.6667 23.7972 30.7958 25.333 28.5C27.043 25.935 25.333 20.5833 25.333 20.5833"
          stroke={iconColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
      </>
    ),
  };

  return (
    <div className="relative w-[86px] h-[86px]">
      <svg
        width="86"
        height="86"
        viewBox="0 0 86 86"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="43"
          cy="43"
          r="41"
          stroke={circleStroke}
          strokeWidth="4"
          className="transition-all duration-300"
        />
      </svg>
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icons[type]}
      </svg>
    </div>
  );
};

const portfolioCardData = [
  {
    iconType: "hashtag",
    title: "Ready-made components",
    description:
      "With industry-standard practices and seamless scalability, Framix helps teams deliver high-performing projects confidently.",
  },
  {
    iconType: "grid",
    title: "Customize with ease",
    description:
      "Tailor every detail to your brand with pixel-perfect control and modern design standards.",
  },
  {
    iconType: "rocket",
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
    avatar: "/assets/images/jessica_lee.jpg",
  },
  {
    quote:
      "The quality and consistency of the components are unmatched. It's the first place I look for new project inspiration.",
    name: "David Miller",
    title: "Senior Developer",
    avatar: "/assets/images/david_miller.jpg",
  },
  {
    quote:
      "The well-documented code makes integration a breeze. It's saved our team countless hours in development.",
    name: "Alex Chen",
    title: "Product Manager",
    avatar: "/assets/images/alex_chen.jpg",
  },
  {
    quote:
      "It's more than just a library—it's a community. The collaboration tools are a huge plus for our entire team.",
    name: "Emily Roberts",
    title: "Freelance Designer",
    avatar: "/assets/images/emily_roberts.jpg",
  },
];

// LearnMore Button Component
const LearnMoreButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex justify-center items-center gap-2 transition-all duration-200 hover:gap-3 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 ${className}`}
      aria-label="Learn more about this feature"
    >
      <span className="text-black text-xl max-md:text-base max-sm:text-sm font-bold leading-[18px] tracking-[-0.2px]">
        Learn more
      </span>
      <div className="transition-transform duration-200 hover:translate-x-1">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 max-md:w-4 max-md:h-4 max-sm:w-3 max-sm:h-3"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.9424 10L13.1384 15.8054L12.1944 14.8627L16.3904 10.6667H1.33305V9.33337H16.3904L12.1944 5.1387L13.1384 4.1947L18.9424 10Z"
            fill="black"
          />
        </svg>
      </div>
    </button>
  );
};

const LandingPage = () => {
  const [cardOrder, setCardOrder] = useState([1, 0, 2]); // Center is 0 ("no.1")
  const [activePortfolioCard, setActivePortfolioCard] = useState(-1);
  const [activeWhatsNewCard, setActiveWhatsNewCard] = useState(1);
  const [videoCardOrder, setVideoCardOrder] = useState([0, 1, 2]); // Track video card order [left, center, right]

  // Handle card click - swap clicked card with center card
  const handleCardClick = (cardIndex) => {
    const clickedPosition = cardOrder.indexOf(cardIndex);
    const centerPosition = 1;

    // If clicked card is not in center, swap it with center card
    if (clickedPosition !== centerPosition) {
      const newOrder = [...cardOrder];
      [newOrder[clickedPosition], newOrder[centerPosition]] = [
        newOrder[centerPosition],
        newOrder[clickedPosition],
      ];
      setCardOrder(newOrder);
    }
  };

  // Handle video card click - swap clicked card with center card
  const handleVideoCardClick = (cardIndex) => {
    const clickedPosition = videoCardOrder.indexOf(cardIndex);
    const centerPosition = 1;

    // If clicked card is not in center, swap it with center card
    if (clickedPosition !== centerPosition) {
      const newOrder = [...videoCardOrder];
      [newOrder[clickedPosition], newOrder[centerPosition]] = [
        newOrder[centerPosition],
        newOrder[clickedPosition],
      ];
      setVideoCardOrder(newOrder);
      setActiveWhatsNewCard(cardIndex);
    }
  };

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
        // Remove 'ease' for compatibility with framer-motion types
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
          className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="text-center lg:text-left z-10"
              variants={itemVariants}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight flex flex-col neon-hero">
                <span className="neon-hero-text">Accelerate products with</span>
                <span className="neon-hero-text">
                  ready-made{" "}
                  <span className="text-[#FF479C] neon-hero-glow">
                    components
                  </span>
                </span>
              </h1>
              <p className="text-xl text-white mb-8 leading-relaxed">
                Instantly copy responsive HTML, CSS, and React code. Build
                modern interface faster, without starting from scratch.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Link to="/components">
                  <Button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/community">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800 hover:text-white font-semibold px-6 py-3 rounded-md"
                  >
                    Start Designing
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
          className="py-12 max-md:py-8 max-sm:py-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-[1600px] mx-auto px-8 sm:px-12 lg:px-20 max-md:px-6 max-sm:px-4">
            {/* Responsive flex for heading and paragraph */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-12">
              <motion.div
                className="lg:w-1/2 flex items-start justify-start"
                variants={itemVariants}
              >
                <h2 className="text-4xl font-bold mb-6 lg:mb-0 text-left w-full leading-tight">
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(90deg, #fff 0%, #a3a3a3 80%, #6b7280 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Your{" "}
                    <span
                      className="text-[#FF479C]"
                      style={{
                        WebkitTextFillColor: "#FF479C",
                        background: "none",
                        WebkitBackgroundClip: "initial",
                      }}
                    >
                      trusted
                    </span>{" "}
                    way to
                  </span>
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(90deg, #e5e7eb 0%, #a3a3a3 60%, #6b7280 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    design, build, and scale.
                  </span>
                </h2>
              </motion.div>
              <motion.div
                className="lg:w-1/2 flex items-end justify-start"
                variants={itemVariants}
              >
                <p className="max-w-xl text-left w-full text-gray-400">
                  Framix unites and empowers a growing ecosystem of designers
                  and developers. With production-ready UI components, design
                  systems, and templates, Framix enables teams to create
                  exceptional digital products faster and smarter.
                </p>
              </motion.div>
            </div>
            {/* Pyramid Cards Layout */}
            <LayoutGroup>
              <motion.div
                className="flex justify-center items-end mx-auto gap-0 max-w-[1062px] overflow-x-auto hide-scrollbar px-4 max-md:px-0"
                variants={itemVariants}
              >
                {cardOrder.map((cardIndex, position) => {
                  const card = trustedWayCardData[cardIndex];
                  const isActive = position === 1; // Center position is active
                  const isPrimary = isActive;
                  const isLeft = position === 0;
                  const isRight = position === 2;

                  return (
                    <motion.div
                      key={cardIndex}
                      layoutId={`card-${cardIndex}`}
                      className={`shrink-0 cursor-pointer ${
                        isActive
                          ? "w-[410px] h-[349px] z-[2] max-md:w-[280px] max-md:h-[300px] max-sm:w-[220px] max-sm:h-[280px]"
                          : "w-[326px] h-[248px] z-[1] max-md:w-[200px] max-md:h-[200px] max-sm:w-[140px] max-sm:h-[180px]"
                      }`}
                      onClick={() => handleCardClick(cardIndex)}
                      initial={false}
                      animate={{
                        width: isActive
                          ? window.innerWidth < 640
                            ? 220
                            : window.innerWidth < 768
                            ? 280
                            : 410
                          : window.innerWidth < 640
                          ? 140
                          : window.innerWidth < 768
                          ? 200
                          : 326,
                        height: isActive
                          ? window.innerWidth < 640
                            ? 280
                            : window.innerWidth < 768
                            ? 300
                            : 349
                          : window.innerWidth < 640
                          ? 180
                          : window.innerWidth < 768
                          ? 200
                          : 248,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      layout
                    >
                      <Card
                        className={`h-full p-8 max-md:p-5 max-sm:p-3 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                          isPrimary
                            ? "bg-[#FF479C] border-2 border-[#FF479C] text-black rounded-[20px_20px_0_0] max-md:rounded-[15px_15px_0_0]"
                            : "bg-[#A67388] text-white border-0 opacity-70"
                        } ${
                          isLeft
                            ? "rounded-[20px_0_0_20px] max-md:rounded-[15px_0_0_15px] border-l border-b border-[#8B5F70]"
                            : isRight
                            ? "rounded-[0_20px_20px_0] max-md:rounded-[0_15px_15px_0] border-r border-b border-[#8B5F70]"
                            : ""
                        }`}
                      >
                        <CardContent className="p-0 flex flex-col justify-between h-full">
                          <div>
                            <div
                              className={`text-sm max-md:text-xs font-bold mb-2 transition-colors duration-500 ${
                                isPrimary ? "text-black" : "text-white"
                              }`}
                            >
                              0{cardIndex + 1}.
                            </div>
                            <h3
                              className={`text-2xl max-md:text-lg max-sm:text-base font-bold mb-4 max-md:mb-2 transition-colors duration-500 ${
                                isPrimary ? "text-black" : "text-white"
                              }`}
                            >
                              {card.title}
                            </h3>
                            {isActive && (
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={`desc-${cardIndex}`}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <p className="text-black/80 text-base max-md:text-sm max-sm:text-xs mb-6 max-md:mb-3">
                                    {card.description}
                                  </p>
                                </motion.div>
                              </AnimatePresence>
                            )}
                          </div>
                          {isActive && (
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`btn-${cardIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <div className="bg-[#FF479C] rounded-md inline-block px-1 max-md:text-sm max-sm:text-xs">
                                  <LearnMoreButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log(`Learn more: ${card.title}`);
                                    }}
                                    className="max-md:text-sm max-sm:text-xs"
                                  />
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </LayoutGroup>
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
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(90deg, #fff 0%, #a3a3a3 80%, #6b7280 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Trusted{" "}
                    <span
                      className="text-[#FF479C]"
                      style={{
                        WebkitTextFillColor: "#FF479C",
                        background: "none",
                        WebkitBackgroundClip: "initial",
                      }}
                    >
                      platform
                    </span>
                  </span>
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(90deg, #e5e7eb 0%, #a3a3a3 60%, #6b7280 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    anytime & anywhere.
                  </span>
                </h2>
                <div className="flex items-center gap-1.5 mb-4 text-white">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-10 h-10 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-400 mb-4">
                  Framix empowers designers and developers with a growing
                  ecosystem of modern UI components and templates. Whether
                  you’re building SaaS dashboards, mobile apps, or websites,
                  Framix ensures your workflow stays fast, reliable, and
                  accessible from anywhere.
                </p>
                <p className="text-gray-400 mb-8">
                  With industry-standard practices and seamless scalability,
                  Framix helps teams deliver high-performing projects
                  confidently.
                </p>
                <Button
                  className="bg-white text-black font-semibold px-10 py-3 rounded-full hover:bg-gray-200 shadow-lg"
                  style={{ borderRadius: "999px", minWidth: "200px" }}
                  asChild
                >
                  <Link to="/community">Start Designing</Link>
                </Button>
              </motion.div>
              <motion.div
                className="h-96 overflow-hidden relative"
                variants={itemVariants}
              >
                <div className="grid grid-cols-4 gap-4 h-full">
                  {/* Column 1 - Moving Up */}
                  <motion.div
                    className="flex flex-col gap-4"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 30,
                      repeat: Infinity,
                    }}
                  >
                    {[
                      ...trustedPlatformImages.slice(0, 5),
                      ...trustedPlatformImages.slice(0, 5),
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Component preview ${i + 1}`}
                        className="h-32 w-full object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </motion.div>

                  {/* Column 2 - Moving Down */}
                  <motion.div
                    className="flex flex-col gap-4"
                    animate={{ y: ["-50%", "0%"] }}
                    transition={{
                      ease: "linear",
                      duration: 30,
                      repeat: Infinity,
                    }}
                  >
                    {[
                      ...trustedPlatformImages.slice(5, 10),
                      ...trustedPlatformImages.slice(5, 10),
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Component preview ${i + 6}`}
                        className="h-32 w-full object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </motion.div>

                  {/* Column 3 - Moving Up */}
                  <motion.div
                    className="flex flex-col gap-4"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 30,
                      repeat: Infinity,
                    }}
                  >
                    {[
                      ...trustedPlatformImages.slice(10, 15),
                      ...trustedPlatformImages.slice(10, 15),
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Component preview ${i + 11}`}
                        className="h-32 w-full object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </motion.div>

                  {/* Column 4 - Moving Down */}
                  <motion.div
                    className="flex flex-col gap-4"
                    animate={{ y: ["-50%", "0%"] }}
                    transition={{
                      ease: "linear",
                      duration: 30,
                      repeat: Infinity,
                    }}
                  >
                    {[
                      ...trustedPlatformImages.slice(15, 20),
                      ...trustedPlatformImages.slice(15, 20),
                    ].map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Component preview ${i + 16}`}
                        className="h-32 w-full object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </motion.div>
                </div>
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
              className="text-4xl font-bold mb-4 leading-tight"
            >
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #fff 0%, #a3a3a3 80%, #6b7280 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Build your{" "}
                <span
                  className="text-[#FF479C]"
                  style={{
                    WebkitTextFillColor: "#FF479C",
                    background: "none",
                    WebkitBackgroundClip: "initial",
                  }}
                >
                  design
                </span>{" "}
                portfolio
              </span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Framix provides everything you need to create, launch, and scale
              high-quality projects – all powered by flexible UI components.
            </motion.p>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 justify-items-center"
              variants={containerVariants}
            >
              {portfolioCardData.map((card, index) => {
                const isHovered = activePortfolioCard === index;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    onMouseEnter={() => setActivePortfolioCard(index)}
                    onMouseLeave={() => setActivePortfolioCard(-1)}
                    className="flex w-full max-w-[350px]"
                  >
                    <Card
                      className={`border-0 flex flex-col items-center justify-between p-6 sm:p-8 lg:p-12 rounded-[20px] w-full h-[450px] transition-all duration-300 ease-out transform origin-center will-change-transform ${
                        isHovered ? "scale-105" : "scale-100"
                      } ${
                        isHovered
                          ? "bg-gradient-to-br from-[#FF479C] via-[#FF479C] to-[#FF479C]"
                          : "bg-gradient-to-bl from-gray-500 via-gray-700 to-black"
                      }`}
                    >
                      <CardContent className="p-0 flex flex-col items-center justify-center flex-grow">
                        <div
                          className={`flex items-center justify-center w-[106px] h-[106px] rounded-full p-[10px] mb-4 transition-colors duration-300 ${
                            isHovered ? "bg-[#141414]" : "bg-[#FF479C]"
                          }`}
                        >
                          <PortfolioIcon
                            type={card.iconType}
                            isHovered={isHovered}
                          />
                        </div>
                        <h2
                          className={`text-center font-bold text-xl leading-6 tracking-[-0.8px] mb-4 transition-colors duration-300 ${
                            isHovered ? "text-black" : "text-white"
                          }`}
                        >
                          {card.title}
                        </h2>
                        <p
                          className={`text-center font-light text-base leading-5 tracking-[-0.16px] max-w-[265px] transition-colors duration-300 ${
                            isHovered ? "text-black" : "text-gray-400"
                          }`}
                        >
                          {card.description}
                        </p>
                      </CardContent>
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mt-6"
                          >
                            <Button className="bg-black text-white hover:bg-gray-900 px-12 py-2.5 rounded-full font-semibold text-sm">
                              Learn More
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
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
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(90deg, #fff 0%, #a3a3a3 80%, #6b7280 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    What's{" "}
                    <span
                      className="text-[#FF479C]"
                      style={{
                        WebkitTextFillColor: "#FF479C",
                        background: "none",
                        WebkitBackgroundClip: "initial",
                      }}
                    >
                      new
                    </span>{" "}
                    we provide for you?
                  </span>
                </h2>
                <div className="flex items-start mb-8">
                  <div
                    className="w-1 h-full rounded bg-[#FF479C] mr-4"
                    style={{ minHeight: "2.5rem" }}
                  ></div>
                  <p className="text-gray-400">
                    Framix delivers a growing ecosystem of powerful UI
                    components, templates, and tools designed to help designers
                    and developers ship projects faster.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/b3e01f76687760bdd63bc89d58c852773dafd9b6?placeholderIfAbsent=true"
                      alt="Production-ready UI blocks icon"
                      className="w-12 h-12 flex-shrink-0 rounded-full ring-4 ring-[#FF479C]"
                    />
                    <div>
                      <p className="text-sm text-gray-400">
                        We provide production-ready UI blocks that save hours of
                        design & coding.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/baa5ef204155c19dc1745995b471723badd394b1?placeholderIfAbsent=true"
                      alt="Tech stack integration icon"
                      className="w-12 h-12 flex-shrink-0 rounded-full ring-4 ring-[#FF479C]"
                    />
                    <div>
                      <p className="text-sm text-gray-400">
                        Easily connect Framix components with your tech stack.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/c1a1cab1584735dfde7a9e9d3b6104f3f90dac06?placeholderIfAbsent=true"
                      alt="Design optimization icon"
                      className="w-12 h-12 flex-shrink-0 rounded-full ring-4 ring-[#FF479C]"
                    />
                    <div>
                      <p className="text-sm text-gray-400">
                        Optimize your design-to-development process with
                        plug-and-play templates.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/faece15b6a9adcb25dea2bf417827b9850409be3?placeholderIfAbsent=true"
                      alt="Scalable systems icon"
                      className="w-12 h-12 flex-shrink-0 rounded-full ring-4 ring-[#FF479C]"
                    />
                    <div>
                      <p className="text-sm text-gray-400">
                        Build scalable design systems and SaaS platforms.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="relative w-[400px] h-[350px] mx-auto max-md:w-[350px] max-md:h-[300px] max-sm:w-full max-sm:h-60 max-sm:px-4"
                variants={itemVariants}
              >
                <AnimatePresence mode="sync">
                  {videoCardOrder.map((videoIndex, position) => {
                    const isLeft = position === 0;
                    const isCenter = position === 1;
                    const isRight = position === 2;

                    return (
                      <motion.div
                        key={videoIndex}
                        layoutId={`video-card-${videoIndex}`}
                        className="absolute cursor-pointer"
                        initial={false}
                        animate={{
                          left: isLeft
                            ? window.innerWidth < 640
                              ? "0px"
                              : "0px"
                            : isCenter
                            ? "50%"
                            : "auto",
                          right: isRight
                            ? window.innerWidth < 640
                              ? "0px"
                              : "0px"
                            : "auto",
                          rotate: isLeft
                            ? window.innerWidth < 640
                              ? -10
                              : -13.37
                            : isCenter
                            ? 0
                            : window.innerWidth < 640
                            ? 10
                            : 13.37,
                          x: isCenter ? "-50%" : "0%",
                          zIndex: isLeft ? 1 : isCenter ? 3 : 2,
                          scale: isCenter ? 1 : 0.9,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          mass: 0.8,
                        }}
                        onClick={() => handleVideoCardClick(videoIndex)}
                        style={{
                          width:
                            window.innerWidth < 640
                              ? "140px"
                              : window.innerWidth < 768
                              ? "200px"
                              : "223px",
                          height:
                            window.innerWidth < 640
                              ? "180px"
                              : window.innerWidth < 768
                              ? "260px"
                              : "287px",
                        }}
                      >
                        <div
                          className={`w-full h-full rounded-[16.715px] max-sm:rounded-[12px] p-2 max-sm:p-1.5 box-border transition-all duration-300 ${
                            isCenter
                              ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                              : "bg-[#BFBDBD]"
                          }`}
                        >
                          <video
                            src={whatsNewVideos[videoIndex]}
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-cover rounded-[12px] max-sm:rounded-[8px]"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
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
              Voices of Our <span className="text-[#FF479C]">Creators</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Hear the trusted feedback from customers who have put their faith
              in us
            </motion.p>

            <div className="flex flex-col -space-y-8">
              {/* First Scrolling Row (Right to Left) */}
              <div className="relative overflow-hidden w-full h-72">
                <div className="flex gap-3">
                  <motion.div
                    className="flex gap-3"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      ease: "linear",
                      duration: 40,
                      repeat: Infinity,
                    }}
                  >
                    {[...testimonialsData, ...testimonialsData].map(
                      (testimonial, index) => (
                        <div key={index} className="flex-shrink-0 w-[320px]">
                          <TestimonialCard testimonial={testimonial} />
                        </div>
                      )
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Second Scrolling Row (Left to Right) */}
              <div className="relative overflow-hidden w-full h-72">
                <div className="flex gap-3">
                  <motion.div
                    className="flex gap-3"
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{
                      ease: "linear",
                      duration: 40,
                      repeat: Infinity,
                    }}
                  >
                    {[...testimonialsData, ...testimonialsData].map(
                      (testimonial, index) => (
                        <div key={index} className="flex-shrink-0 w-[320px]">
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

/* Neon effect for hero section */

export default LandingPage;

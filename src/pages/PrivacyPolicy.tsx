import React, { useState, useEffect, useRef } from "react";

// Main Privacy Policy Component
const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>(
    "information-we-collect"
  );

  // Hero Section Component
  const HeroSection: React.FC = () => {
    return (
      <section className="mt-[-92px] w-full text-center pt-[230px] px-[470px] max-md:max-w-full max-md:pt-[100px] max-md:px-5">
        <div className="flex w-full max-w-[500px] flex-col items-stretch max-md:max-w-full">
          <div className="flex w-full flex-col items-center max-md:max-w-full">
            <div className="bg-black border flex items-center text-sm text-white font-medium leading-[1.6] justify-center px-[13px] py-[7px] rounded-[100px] border-[rgba(255,71,156,0.42)] border-solid">
              <div className="self-stretch flex flex-col items-center my-auto">
                <div>Updated on 28 Oct 2025</div>
              </div>
            </div>
            <h1 className="text-[rgba(255,71,156,1)] text-[64px] font-semibold leading-none tracking-[-2px] mt-4 max-md:max-w-full max-md:text-[32px] whitespace-nowrap text-ellipsis">
              Privacy Policy
            </h1>
          </div>
          <div className="self-center flex flex-col items-center text-base text-white font-normal leading-[26px] mt-[19px] px-0.5 max-md:max-w-full">
            <p className="max-md:max-w-full text-gray-400">
              Your privacy is important to us. This Privacy Policy explains
              how we collect, use, and protect your information when you use
              our website and services.
            </p>
          </div>
        </div>
      </section>
    );
  };

  // Table of Contents Component
  const TableOfContents: React.FC = () => {
    const sections = [
      { id: "information-we-collect", title: "Information We Collect" },
      { id: "how-we-use-information", title: "How We Use Your Information" },
      { id: "cookies-tracking", title: "Cookies & Tracking" },
      { id: "data-sharing", title: "Data Sharing & Disclosure" },
      { id: "data-security", title: "Data Security" },
      { id: "user-rights", title: "User Rights" },
      { id: "legal-requirements", title: "Legal Requirements" },
      { id: "children-privacy", title: "Children's Privacy" },
      { id: "changes-contact", title: "Changes & Contact" },
    ];

    const handleSectionClick = (sectionId: string) => {
      setActiveSection(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    };

    return (
      <aside className="bg-[rgba(15,15,15,1)] border w-full lg:w-[300px] max-w-xs text-gray-400 leading-[1.6] p-[33px] rounded-2xl border-[rgba(255,71,156,0.4)] border-solid max-md:px-5 sticky top-8 h-fit">
        <h2 className="text-xl font-medium">Table of content</h2>
        <nav className="w-full text-base font-normal mt-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex w-full gap-2.5 mt-4 cursor-pointer transition-colors items-center ${
                activeSection === section.id
                  ? "text-[rgba(255,71,156,1)] font-semibold"
                  : "hover:text-[rgba(255,71,156,1)]"
              }`}
              onClick={() => handleSectionClick(section.id)}
            >
              <span className="text-[1.5em] text-gray-400 mr-2 leading-none select-none">
                •
              </span>
              <div>
                <div>{section.title}</div>
              </div>
            </div>
          ))}
        </nav>
      </aside>
    );
  };

  // Privacy Content Component
  const PrivacyContent: React.FC = () => {
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    const sections = [
      {
        id: "information-we-collect",
        number: "1",
        title: "Information We Collect",
        content: [
          'This website is operated by Shingu. The terms "we", "us", and "our" refer to Shingu. The use of our website is subject to the following terms and conditions of use, as amended from time to time (the "Terms"). The Terms are to be read together by you with any terms, conditions or disclaimers provided in the pages of our website. Please review the Terms carefully. The Terms apply to all users of our website, including without limitation, users who are browsers, customers, merchants, vendors and/or contributors of content. If you access and use this website, you accept and agree to be bound by and comply with the Terms and our Privacy Policy. If you do not agree to the Terms or our Privacy Policy, you are not authorized to access our website, use any of our website\'s services or place an order on our website.',
          "The Terms apply to all users of our website, including without limitation, users who are browsers, customers, merchants, vendors and/or contributors of content. If you access and use this website, you accept and agree to be bound by and comply with the Terms and our Privacy Policy. If you do not agree to the Terms or our Privacy Policy, you are not authorized to access our website, use any of our website's services or place an order on our website.",
          "If you access and use this website, you accept and agree to be bound by and comply with the Terms and our Privacy Policy. If you do not agree to the Terms or our Privacy Policy, you are not authorized to access our website, use any of our website's services or place an order on our website.",
        ],
      },
      {
        id: "how-we-use-information",
        number: "2",
        title: "How We Use Your Information",
        content: [
          "You agree to use our website for legitimate purposes and not for any illegal or unauthorized purpose, including without limitation, in violation of any intellectual property or privacy law. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract. You agree to not use our website to conduct any activity that would constitute a civil or criminal offence or violate any law. You agree not to attempt to interfere with our website's network or security features or to gain unauthorized access to our systems. You agree to provide us with accurate personal information,",
          "Such as your email address, mailing address and other contact details in order to complete your order or contact you as needed. You agree to promptly update your account and information. You authorize us to collect and use this information to contact you in accordance with our Privacy Policy.",
        ],
      },
      {
        id: "cookies-tracking",
        number: "3",
        title: "Cookies & Tracking",
        content: [
          "We reserve the right to refuse service to anyone, at any time, for any reason. We reserve the right to make any modifications to the website, including terminating, changing, suspending or discontinuing any aspect of the website at any time, without notice. We may impose additional rules or limits on the use of our website. You agree to review the Terms regularly and your continued access or use of our website will mean that you agree to any changes.",
          "We reserve the right to refuse service to anyone, at any time, for any reason. We reserve the right to make any modifications to the website, including terminating, changing, suspending or discontinuing any aspect of the website at any time, without notice.",
        ],
      },
      {
        id: "data-sharing",
        number: "4",
        title: "Data Sharing & Disclosure",
        content: [
          "All purchases through our website are subject to product availability. We may, in our sole discretion, limit or cancel the quantities offered on our website or limit the sales of our products or services to any person, household, geographic region or jurisdiction. Prices for our products are subject to change, without notice. Unless otherwise indicated, prices displayed on our website are quoted in Canadian dollars.",
          "We reserve the right, in our sole discretion, to refuse orders, including without limitation, orders that appear to be placed by distributors or resellers. If we believe that you have made a false or fraudulent order, we will be entitled to cancel the order and inform the relevant authorities.",
          "We do not guarantee the accuracy of the colour or design of the products on our website. We have made efforts to ensure the colour and design of our products are displayed as accurately as possible on our website.",
        ],
      },
      {
        id: "data-security",
        number: "5",
        title: "Data Security",
        content: [
          "Links from or to websites outside our website are meant for convenience only. We do not review, endorse, approve or control, and are not responsible for any sites linked from or to our website, the content of those sites, the third parties named therein, or their products and services. Linking to any other site is at your sole risk and we will not be responsible or liable for any damages in connection with linking.",
          "Links to downloadable software sites are for convenience only and we are not responsible or liable for any difficulties or consequences associated with downloading the software. Use of any downloaded software is governed by the terms of the license agreement, if any, which accompanies or is provided with the software.",
        ],
      },
      {
        id: "user-rights",
        number: "6",
        title: "User Rights",
        content: [
          'You acknowledge that you are responsible for the information, profiles, opinions, messages, comments and any other content (collectively, the "Content") that you post, distribute or share on or through our website or services available in connection with our website. You further acknowledge that you have full responsibility for the Content, including but limited to, with respect to its legality, and its trademark, copyright and other intellectual property ownership. You agree that any Content submitted by you in response to a request by us for a specific submission may be edited, adapted, modified, recreated, published, or distributed by us. You further agree that we are under no obligation to maintain any Content in confidence, to pay compensation for any Content or to respond to any Content.',
          "You agree that you will not post, distribute or share any Content on our website that is protected by copyright, trademark, patent or any other proprietary right without the express consent of the owner of such proprietary right. You further agree that your Content will not be unlawful, abusive or obscene nor will it contain any malware or computer virus that could affect our website's operations. You will be solely liable for any Content that you make and its accuracy. We have no responsibility and assume no liability for any Content posted by you or any third-party.",
          "We reserve the right to terminate your ability to post on our website and to remove and/or delete any Content that we deem objectionable. You consent to such removal and/or deletion and waive any claim against us for the removal and/or deletion of your Content.",
        ],
      },
      {
        id: "legal-requirements",
        number: "7",
        title: "Legal Requirements",
        content: [
          "Please see our Privacy Policy to learn about how we collect, use, and share your personal information. We reserve the right to terminate your ability to post on our website and to remove and/or delete any Content that we deem objectionable. You consent to such removal and/or deletion and waive any claim against us for the removal and/or deletion of your Content.",
        ],
      },
      {
        id: "children-privacy",
        number: "8",
        title: "Children's Privacy",
        content: [
          "Please note that our website may contain typographical errors or inaccuracies and may not be complete or current. We reserve the right to correct any errors, inaccuracies or omissions and to change or update information at any time, without prior notice (including after an order has been submitted). Such errors, inaccuracies or omissions may relate to product description, pricing, promotion and availability and we reserve the right to cancel or refuse any order placed based on incorrect pricing or availability information, to the extent permitted by applicable law.",
          "We do not undertake to update, modify or clarify information on our website, except as required by law.",
        ],
      },
      {
        id: "changes-contact",
        number: "9",
        title: "Changes & Contact",
        content: [
          'You assume all responsibility and risk with respect to your use of our website, which is provided "as is" without warranties, representations or conditions of any kind, either express or implied, with regard to information accessed from or via our website, including without limitation, all content and materials, and functions and services provided on our website, all of which are provided without warranty of any kind, including but not limited to warranties concerning the availability, accuracy, completeness or usefulness of content or information, uninterrupted access, and any warranties of title, non-infringement, merchantability or fitness for a purpose.',
          "We do not warrant that our website or its functioning or the content and material of the services made available thereby will be timely, secure, uninterrupted or error-free, that defects will be corrected, or that our websites or the servers that make our website available are free of viruses or other harmful components. The use of our website is at your sole risk and you assume full responsibility for any costs associated with your use of our website.",
        ],
      },
    ];

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0.1,
        }
      );

      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => observer.disconnect();
    }, [setActiveSection]);

    return (
      <main className="min-w-60 w-[870px] max-w-[870px] max-md:max-w-full text-gray-300 pb-10">
        <article className="w-full max-md:max-w-full">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="w-full mt-8 max-md:max-w-full"
            >
              <div className="flex w-full gap-2.5 flex-row items-center max-md:max-w-full">
                <div
                  className={`border flex min-h-9 flex-col items-center text-lg font-normal whitespace-nowrap leading-none justify-center w-9 px-px py-2 rounded-[100px] border-solid ${
                    activeSection === section.id
                      ? "border-[rgba(255,71,156,1)] bg-[rgba(255,71,156,0.1)]"
                      : "border-[rgba(255,71,156,0.4)]"
                  }`}
                >
                  <div>
                    <div>{section.number}</div>
                  </div>
                </div>
                <h3 className="text-[rgba(255,71,156,1)] text-3xl font-medium leading-none tracking-[-1px]">
                  {section.title}
                </h3>
              </div>
              <div className="text-base text-gray-400 font-normal leading-[26px] mt-[15px]">
                {section.content.map((paragraph, index) => (
                  <div key={index} className={index > 0 ? "mt-[15px]" : ""}>
                    <p className="max-md:max-w-full">{paragraph}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection />

      <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8 py-8 max-w-7xl mx-auto pb-10">
        {/* Table of Contents - Left Side */}
        <div className="lg:w-[300px] w-full min-w-0 flex-shrink-0 flex items-start max-md:mx-auto max-md:ml-4">
          <div className="w-full mt-4">
            <TableOfContents />
          </div>
        </div>

        {/* Privacy Content - Right Side */}
        <div className="flex-1 min-w-0 flex items-start">
          <div className="w-full mt-[10px] lg:mt-0 lg:ml-6">
            <PrivacyContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

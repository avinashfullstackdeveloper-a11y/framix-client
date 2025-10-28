// Terms and Conditions Page (moved from instruction.md)
import React, { useState, useEffect } from "react";

// Hero Component
export const Hero: React.FC = () => {
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
            Terms & Condition
          </h1>
        </div>
        <div className="self-center flex flex-col items-center text-base text-white font-normal leading-[26px] mt-[19px] px-0.5 max-md:max-w-full">
          <p className="max-md:max-w-full text-gray-400">
            By accessing or using our website and services, you agree to the
            following Terms & Conditions. Please read them carefully before
            using Framix.
          </p>
        </div>
      </div>
    </section>
  );
};

// Terms Section Component
interface TermsSectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export const TermsSection: React.FC<TermsSectionProps> = ({
  id,
  number,
  title,
  children,
  isActive,
}) => {
  return (
    <section id={id} className="w-full mt-8 max-md:max-w-full">
      <div className="flex w-full gap-2.5 flex-row items-center max-md:max-w-full">
        <div
          className={`border flex min-h-9 flex-col items-center text-lg font-normal whitespace-nowrap leading-none justify-center w-9 px-px py-2 rounded-[100px] border-solid ${
            isActive
              ? "border-[rgba(255,71,156,1)] bg-[rgba(255,71,156,0.1)]"
              : "border-[rgba(255,71,156,0.4)]"
          }`}
        >
          <div>
            <div>{number}</div>
          </div>
        </div>
        <h3 className="text-[rgba(255,71,156,1)] text-3xl font-medium leading-none tracking-[-1px]">
          {title}
        </h3>
      </div>
      <div className="text-base text-gray-400 font-normal leading-[26px] mt-[15px]">
        {children}
      </div>
    </section>
  );
};

// Table of Contents Component
interface TableOfContentsProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeSection,
  onSectionClick,
}) => {
  const sections = [
    { id: "introduction", title: "Introduction", isBold: true },
    { id: "acceptance", title: "Acceptance of Terms", isBold: false },
    { id: "general", title: "General Conditions", isBold: true },
    { id: "platform", title: "Use of the Platform", isBold: true },
    {
      id: "third-party",
      title: "Links to Third-Party Websites",
      isBold: false,
    },
    {
      id: "submissions",
      title: "Use Comments, Feedback, and Other Submissions",
      isBold: false,
    },
    { id: "personal-info", title: "Your Personal Information", isBold: true },
    { id: "errors", title: "Errors and Omissions", isBold: true },
    { id: "integrations", title: "Third-Party Integrations", isBold: true },
  ];

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
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
            <div
              className={`${section.isBold ? "font-semibold" : "font-normal"} ${
                index === 0 ? "pr-[45px]" : ""
              }`}
            >
              <div>{section.title}</div>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

// Terms Content Component
interface TermsContentProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const TermsContent: React.FC<TermsContentProps> = ({
  activeSection,
  onSectionChange,
}) => {
  return (
    <main className="min-w-60 w-[870px] max-w-[870px] max-md:max-w-full text-gray-300 pb-10">
      <article className="w-full max-md:max-w-full">
        <TermsSection
          id="introduction"
          number="1"
          title="Introduction"
          isActive={activeSection === "introduction"}
        >
          <div className="pr-px max-md:max-w-full">
            <p className="max-md:max-w-full">
              This website is operated by Shingu. The terms "we", "us", and
              "our" refer to Shingu. The use of our website is
              <br />
              subject to the following terms and conditions of use, as amended
              from time to time (the "Terms"). The Terms are to
              <br />
              be read together by you with any terms, conditions or disclaimers
              provided in the pages of our website. Please
              <br />
              review the Terms carefully. The Terms apply to all users of our
              website, including without limitation, users who are
              <br />
              browsers, customers, merchants, vendors and/or contributors of
              content. If you access and use this website, you
              <br />
              accept and agree to be bound by and comply with the Terms and our
              Privacy Policy. If you do not agree to the
              <br />
              Terms or our Privacy Policy, you are not authorized to access our
              website, use any of our website's services or
              <br />
              place an order on our website.
            </p>
          </div>
          <div className="mt-[15px] pr-[3px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              The Terms apply to all users of our website, including without
              limitation, users who are browsers, customers,
              <br />
              merchants, vendors and/or contributors of content. If you access
              and use this website, you accept and agree to be
              <br />
              bound by and comply with the Terms and our Privacy Policy. If you
              do not agree to the Terms or our Privacy Policy,
              <br />
              you are not authorized to access our website, use any of our
              website's services or place an order on our website.
            </p>
          </div>
          <div className="mt-[15px] pr-px max-md:max-w-full">
            <p className="max-md:max-w-full">
              If you access and use this website, you accept and agree to be
              bound by and comply with the Terms and our
              <br />
              Privacy Policy. If you do not agree to the Terms or our Privacy
              Policy, you are not authorized to access our website,
              <br />
              use any of our website's services or place an order on our
              website.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="acceptance"
          number="2"
          title="Acceptance of Terms"
          isActive={activeSection === "acceptance"}
        >
          <div className="pr-[3px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              You agree to use our website for legitimate purposes and not for
              any illegal or unauthorized purpose, including
              <br />
              without limitation, in violation of any intellectual property or
              privacy law. By agreeing to the Terms, you represent
              <br />
              and warrant that you are at least the age of majority in your
              state or province of residence and are legally capable
              <br />
              of entering into a binding contract. You agree to not use our
              website to conduct any activity that would constitute a
              <br />
              civil or criminal offence or violate any law. You agree not to
              attempt to interfere with our website's network or
              <br />
              security features or to gain unauthorized access to our systems.
              You agree to provide us with accurate personal
              <br />
              information,
            </p>
          </div>
          <div className="mt-[15px] pr-5 max-md:max-w-full">
            <p className="max-md:max-w-full">
              Such as your email address, mailing address and other contact
              details in order to complete your order or contact
              <br />
              you as needed. You agree to promptly update your account and
              information. You authorize us to collect and use
              <br />
              this information to contact you in accordance with our Privacy
              Policy.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="general"
          number="3"
          title="General Conditions"
          isActive={activeSection === "general"}
        >
          <div className="mt-4 pr-[13px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              We reserve the right to refuse service to anyone, at any time, for
              any reason. We reserve the right to make any
              <br />
              modifications to the website, including terminating, changing,
              suspending or discontinuing any aspect of the
              <br />
              website at any time, without notice. We may impose additional
              rules or limits on the use of our website. You agree
              <br />
              to review the Terms regularly and your continued access or use of
              our website will mean that you agree to any
              <br />
              changes.
            </p>
          </div>
          <div className="mt-4 pr-[37px] max-md:max-w-full max-md:pr-5">
            <p className="max-md:max-w-full">
              We reserve the right to refuse service to anyone, at any time, for
              any reason. We reserve the right to make any
              <br />
              modifications to the website, including terminating, changing,
              suspending or discontinuing any aspect of the
              <br />
              website at any time, without notice.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="platform"
          number="4"
          title="Use of the Platform"
          isActive={activeSection === "platform"}
        >
          <div className="pr-2 max-md:max-w-full">
            <p className="max-md:max-w-full">
              All purchases through our website are subject to product
              availability. We may, in our sole discretion, limit or cancel
              <br />
              the quantities offered on our website or limit the sales of our
              products or services to any person, household,
              <br />
              geographic region or jurisdiction. Prices for our products are
              subject to change, without notice. Unless otherwise
              <br />
              indicated, prices displayed on our website are quoted in Canadian
              dollars.
            </p>
          </div>
          <div className="mt-[15px] pr-3.5 max-md:max-w-full">
            <p className="max-md:max-w-full">
              We reserve the right, in our sole discretion, to refuse orders,
              including without limitation, orders that appear to be
              <br />
              placed by distributors or resellers. If we believe that you have
              made a false or fraudulent order, we will be entitled
              <br />
              to cancel the order and inform the relevant authorities.
            </p>
          </div>
          <div className="mt-[15px] pr-[3px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              We do not guarantee the accuracy of the colour or design of the
              products on our website. We have made efforts to
              <br />
              ensure the colour and design of our products are displayed as
              accurately as possible on our website.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="third-party"
          number="5"
          title="User Accounts"
          isActive={activeSection === "third-party"}
        >
          <div className="pr-[3px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              Links from or to websites outside our website are meant for
              convenience only. We do not review, endorse, approve
              <br />
              or control, and are not responsible for any sites linked from or
              to our website, the content of those sites, the third
              <br />
              parties named therein, or their products and services. Linking to
              any other site is at your sole risk and we will not
              <br />
              be responsible or liable for any damages in connection with
              linking.
            </p>
          </div>
          <div className="mt-[15px] pr-[49px] max-md:max-w-full max-md:pr-5">
            <p className="max-md:max-w-full">
              Links to downloadable software sites are for convenience only and
              we are not responsible or liable for any
              <br />
              difficulties or consequences associated with downloading the
              software. Use of any downloaded software is
              <br />
              governed by the terms of the license agreement, if any, which
              accompanies or is provided with the software.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="submissions"
          number="6"
          title="Intellectual Property Rights"
          isActive={activeSection === "submissions"}
        >
          <div className="pr-[7px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              You acknowledge that you are responsible for the information,
              profiles, opinions, messages, comments and any
              <br />
              other content (collectively, the "Content") that you post,
              distribute or share on or through our website or services
              <br />
              available in connection with our website. You further acknowledge
              that you have full responsibility for the Content,
              <br />
              including but limited to, with respect to its legality, and its
              trademark, copyright and other intellectual property
              <br />
              ownership. You agree that any Content submitted by you in response
              to a request by us for a specific submission
              <br />
              may be edited, adapted, modified, recreated, published, or
              distributed by us. You further agree that we are under
              <br />
              no obligation to maintain any Content in confidence, to pay
              compensation for any Content or to respond to any
              <br />
              Content.
            </p>
          </div>
          <div className="mt-[15px] pr-px max-md:max-w-full">
            <p className="max-md:max-w-full">
              You agree that you will not post, distribute or share any Content
              on our website that is protected by copyright,
              <br />
              trademark, patent or any other proprietary right without the
              express consent of the owner of such proprietary right.
              <br />
              You further agree that your Content will not be unlawful, abusive
              or obscene nor will it contain any malware or
              <br />
              computer virus that could affect our website's operations. You
              will be solely liable for any Content that you make
              <br />
              and its accuracy. We have no responsibility and assume no
              liability for any Content posted by you or any third-
              <br />
              party.
            </p>
          </div>
          <div className="mt-[15px] pr-[13px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              We reserve the right to terminate your ability to post on our
              website and to remove and/or delete any Content that
              <br />
              we deem objectionable. You consent to such removal and/or deletion
              and waive any claim against us for the
              <br />
              removal and/or deletion of your Content.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="personal-info"
          number="7"
          title="Your Personal Information"
          isActive={activeSection === "personal-info"}
        >
          <div className="pr-[7px] max-md:max-w-full">
            <p className="max-md:max-w-full">
              Please see our Privacy Policy to learn about how we collect, use,
              and share your personal information. We reserve
              <br />
              the right to terminate your ability to post on our website and to
              remove and/or delete any Content that we deem
              <br />
              objectionable. You consent to such removal and/or deletion and
              waive any claim against us for the removal and/or
              <br />
              deletion of your Content.
            </p>
          </div>
        </TermsSection>

        <TermsSection
          id="errors"
          number="8"
          title="Errors and Omissions"
          isActive={activeSection === "errors"}
        >
          <div className="mt-4 max-md:max-w-full">
            <p className="max-md:max-w-full">
              Please note that our website may contain typographical errors or
              inaccuracies and may not be complete or current.
              <br />
              We reserve the right to correct any errors, inaccuracies or
              omissions and to change or update information at any
              <br />
              time, without prior notice (including after an order has been
              submitted). Such errors, inaccuracies or omissions
              <br />
              may relate to product description, pricing, promotion and
              availability and we reserve the right to cancel or refuse
              <br />
              any order placed based on incorrect pricing or availability
              information, to the extent permitted by applicable law.
            </p>
          </div>
          <div className="text-gray-400 text-base font-normal leading-[1.6] mt-4 max-md:max-w-full">
            We do not undertake to update, modify or clarify information on our
            website, except as required by law.
          </div>
        </TermsSection>

        <TermsSection
          id="integrations"
          number="9"
          title="Third-Party Integrations"
          isActive={activeSection === "integrations"}
        >
          <div className="max-md:max-w-full">
            <p className="max-md:max-w-full">
              You assume all responsibility and risk with respect to your use of
              our website, which is provided "as is" without
              <br />
              warranties, representations or conditions of any kind, either
              express or implied, with regard to information
              <br />
              accessed from or via our website, including without limitation,
              all content and materials, and functions and services
              <br />
              provided on our website, all of which are provided without
              warranty of any kind, including but not limited to
              <br />
              warranties concerning the availability, accuracy, completeness or
              usefulness of content or information,
              <br />
              uninterrupted access, and any warranties of title,
              non-infringement, merchantability or fitness for a purpose.
            </p>
          </div>
          <div className="mt-[15px] pr-0.5 max-md:max-w-full">
            <p className="max-md:max-w-full">
              We do not warrant that our website or its functioning or the
              content and material of the services made available
              <br />
              thereby will be timely, secure, uninterrupted or error-free, that
              defects will be corrected, or that our websites or the
              <br />
              servers that make our website available are free of viruses or
              other harmful components. The use of our website is
              <br />
              at your sole risk and you assume full responsibility for any costs
              associated with your use of our website.
            </p>
          </div>
        </TermsSection>
      </article>
    </main>
  );
};

// Main Component
const TermsAndConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "introduction",
        "acceptance",
        "general",
        "platform",
        "third-party",
        "submissions",
        "personal-info",
        "errors",
        "integrations",
      ];

      const currentSection = sections.find((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Hero />

      <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-8 py-8 max-w-7xl mx-auto pb-10">
        {/* Table of Contents - Left Side */}
        <div className="lg:w-[300px] w-full min-w-0 flex-shrink-0 flex items-start max-md:mx-auto max-md:ml-4">
          <div className="w-full mt-4">
            <TableOfContents
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>

        {/* Terms Content - Right Side */}
        <div className="flex-1 min-w-0 flex items-start">
          <div className="w-full mt-[10px] lg:mt-0 lg:ml-6">
            <TermsContent
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

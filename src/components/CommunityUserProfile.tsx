import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Avatar component (from Community.tsx)
const Avatar = ({
  initials,
  size = "lg",
  className = "",
  src,
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  src?: string;
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-24 h-24 text-2xl",
  };
  return src ? (
    <img
      src={src}
      alt={initials}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-gradient-primary rounded-full ${sizeClasses[size]} ${className}`}
    >
      <span className="text-primary-foreground font-medium">{initials}</span>
    </div>
  );
};

// Social links SVGs (from test.tsx)
const socialIcons = {
  github: (
    <span
      dangerouslySetInnerHTML={{
        __html:
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.90106 15.5442C4.65106 15.3776 4.43606 15.1651 4.18439 14.8642C4.05376 14.7044 3.92431 14.5435 3.79606 14.3817C3.41023 13.9026 3.16689 13.6817 2.91523 13.5909C2.70714 13.5162 2.53725 13.3619 2.44294 13.1619C2.34862 12.962 2.33761 12.7327 2.41231 12.5246C2.48701 12.3166 2.64132 12.1467 2.84128 12.0524C3.04124 11.958 3.27047 11.947 3.47856 12.0217C4.10523 12.2467 4.52939 12.6342 5.10106 13.3451C5.02273 13.2476 5.38439 13.7009 5.46189 13.7942C5.62023 13.9834 5.73689 14.0984 5.82856 14.1592C5.99856 14.2734 6.31773 14.3226 6.78689 14.2759C6.80606 13.9576 6.86523 13.6484 6.95523 13.3634C4.48189 12.7584 3.08189 11.1634 3.08189 8.03339C3.08189 7.00006 3.39023 6.07006 3.96356 5.29006C3.78189 4.54506 3.80939 3.64423 4.21523 2.63006C4.26128 2.51534 4.33229 2.4123 4.42309 2.32842C4.51389 2.24453 4.62222 2.1819 4.74023 2.14506C4.80773 2.12506 4.84606 2.11589 4.91356 2.10589C5.58273 2.00339 6.52773 2.24756 7.75939 3.01923C8.49339 2.84763 9.24477 2.7615 9.99856 2.76256C10.7586 2.76256 11.5136 2.84923 12.2352 3.01923C13.4661 2.24173 14.4127 1.99756 15.0869 2.10589C15.1577 2.11673 15.2177 2.13089 15.2686 2.14756C15.3842 2.18571 15.4902 2.24875 15.5789 2.33226C15.6676 2.41577 15.7369 2.51771 15.7819 2.63089C16.1877 3.64423 16.2152 4.54506 16.0336 5.28923C16.6094 6.06923 16.9152 6.99339 16.9152 8.03339C16.9152 11.1642 15.5202 12.7542 13.0469 13.3601C13.1511 13.7059 13.2052 14.0926 13.2052 14.5101C13.2053 15.2645 13.202 16.019 13.1952 16.7734C13.3824 16.8142 13.5497 16.9183 13.6692 17.068C13.7886 17.2178 13.8528 17.4041 13.8509 17.5957C13.8491 17.7872 13.7813 17.9723 13.659 18.1197C13.5367 18.2671 13.3673 18.3679 13.1794 18.4051C12.2302 18.5951 11.5269 17.9617 11.5269 17.1342L11.5286 16.7626L11.5327 16.1751C11.5369 15.5851 11.5386 15.0601 11.5386 14.5101C11.5386 13.9292 11.3861 13.5501 11.1844 13.3767C10.6336 12.9017 10.9127 11.9976 11.6344 11.9167C14.1069 11.6392 15.2486 10.6817 15.2486 8.03339C15.2486 7.23756 14.9886 6.58006 14.4877 6.03006C14.3822 5.91443 14.3114 5.77142 14.2834 5.6174C14.2554 5.46339 14.2713 5.3046 14.3294 5.15923C14.4677 4.81423 14.5269 4.36173 14.4094 3.81423L14.4011 3.81673C13.9919 3.93256 13.4761 4.18339 12.8527 4.60756C12.7522 4.67577 12.638 4.72119 12.5181 4.74062C12.3982 4.76005 12.2755 4.75304 12.1586 4.72006C11.4551 4.5253 10.7284 4.42745 9.99856 4.42923C9.25689 4.42923 8.52189 4.52839 7.83856 4.72089C7.72207 4.75361 7.59986 4.76056 7.48042 4.74128C7.36098 4.722 7.24716 4.67693 7.14689 4.60923C6.52023 4.18673 6.00189 3.93673 5.59023 3.82006C5.47023 4.36423 5.52939 4.81506 5.66689 5.15923C5.72507 5.30452 5.74114 5.46327 5.71329 5.61728C5.68544 5.77129 5.61477 5.91434 5.50939 6.03006C5.01189 6.57506 4.74856 7.24506 4.74856 8.03339C4.74856 10.6767 5.89106 11.6401 8.35023 11.9167C9.07106 11.9976 9.35106 12.8976 8.80356 13.3734C8.64356 13.5134 8.44606 13.9834 8.44606 14.5101V17.1351C8.44606 17.9567 7.75023 18.5726 6.81273 18.4084C6.62253 18.375 6.44984 18.2766 6.32416 18.13C6.19848 17.9834 6.12761 17.7977 6.12368 17.6046C6.11974 17.4115 6.18298 17.2231 6.30258 17.0715C6.42218 16.9199 6.59072 16.8145 6.77939 16.7734V15.9484C6.02106 15.9992 5.39439 15.8751 4.90106 15.5442Z" fill="#F2F2F2"></path></svg>',
      }}
    />
  ),
  twitter: (
    <span
      dangerouslySetInnerHTML={{
        __html:
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6009 0.768799H15.0542L9.69434 6.89505L16 15.2313H11.0626L7.19566 10.1753L2.77091 15.2313H0.315906L6.04887 8.67867L0 0.768799H5.06247L8.55797 5.39005L12.6009 0.768799ZM11.7398 13.7627H13.0993L4.32384 2.16027H2.86509L11.7398 13.7627Z" fill="#F2F2F2"></path></svg>',
      }}
    />
  ),
  website: (
    <span
      dangerouslySetInnerHTML={{
        __html:
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.3031 12.9465L14.1247 11.7665L15.3031 10.5882C15.6927 10.2019 16.0023 9.74245 16.214 9.2362C16.4256 8.72995 16.5352 8.18688 16.5364 7.63817C16.5376 7.08946 16.4304 6.54592 16.221 6.03875C16.0115 5.53158 15.704 5.07077 15.316 4.68277C14.928 4.29477 14.4672 3.98723 13.96 3.77781C13.4528 3.56838 12.9093 3.46119 12.3606 3.46239C11.8119 3.46359 11.2688 3.57316 10.7626 3.78481C10.2563 3.99645 9.79685 4.30601 9.41056 4.6957L8.23222 5.87487L7.05306 4.69653L8.23306 3.5182C9.32708 2.42418 10.8109 1.80957 12.3581 1.80957C13.9052 1.80957 15.389 2.42418 16.4831 3.5182C17.5771 4.61222 18.1917 6.09603 18.1917 7.6432C18.1917 9.19038 17.5771 10.6742 16.4831 11.7682L15.3031 12.9465ZM12.9464 15.3032L11.7672 16.4815C10.6732 17.5756 9.1894 18.1902 7.64222 18.1902C6.09505 18.1902 4.61124 17.5756 3.51722 16.4815C2.42321 15.3875 1.80859 13.9037 1.80859 12.3565C1.80859 10.8094 2.42321 9.32555 3.51722 8.23153L4.69639 7.0532L5.87472 8.2332L4.69639 9.41153C4.3067 9.79783 3.99714 10.2573 3.7855 10.7635C3.57385 11.2698 3.46428 11.8129 3.46308 12.3616C3.46188 12.9103 3.56907 13.4538 3.7785 13.961C3.98792 14.4682 4.29546 14.929 4.68346 15.317C5.07146 15.705 5.53227 16.0125 6.03944 16.2219C6.54661 16.4314 7.09015 16.5385 7.63886 16.5373C8.18757 16.5361 8.73064 16.4266 9.23689 16.2149C9.74314 16.0033 10.2026 15.6937 10.5889 15.304L11.7672 14.1257L12.9464 15.3032ZM12.3564 6.46403L13.5356 7.6432L7.64306 13.5349L6.46389 12.3565L12.3564 6.46403Z" fill="#F2F2F2"></path></svg>',
      }}
    />
  ),
};

// Stats icons
const statsIcons = {
  posts: "📝",
  views: (
    <span
      dangerouslySetInnerHTML={{
        __html:
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M19.3211 9.74688C19.2937 9.68516 18.632 8.21719 17.1609 6.74609C15.2008 4.78594 12.725 3.75 9.99999 3.75C7.27499 3.75 4.79921 4.78594 2.83905 6.74609C1.36796 8.21719 0.703118 9.6875 0.678899 9.74688C0.643362 9.82681 0.625 9.91331 0.625 10.0008C0.625 10.0883 0.643362 10.1748 0.678899 10.2547C0.706243 10.3164 1.36796 11.7836 2.83905 13.2547C4.79921 15.2141 7.27499 16.25 9.99999 16.25C12.725 16.25 15.2008 15.2141 17.1609 13.2547C18.632 11.7836 19.2937 10.3164 19.3211 10.2547C19.3566 10.1748 19.375 10.0883 19.375 10.0008C19.375 9.91331 19.3566 9.82681 19.3211 9.74688ZM9.99999 15C7.5953 15 5.49452 14.1258 3.75546 12.4023C3.0419 11.6927 2.43483 10.8836 1.95312 10C2.4347 9.11636 3.04179 8.30717 3.75546 7.59766C5.49452 5.87422 7.5953 5 9.99999 5C12.4047 5 14.5055 5.87422 16.2445 7.59766C16.9595 8.307 17.5679 9.11619 18.0508 10C17.4875 11.0516 15.0336 15 9.99999 15ZM9.99999 6.25C9.25831 6.25 8.53329 6.46993 7.9166 6.88199C7.29992 7.29404 6.81927 7.87971 6.53544 8.56494C6.25162 9.25016 6.17735 10.0042 6.32205 10.7316C6.46674 11.459 6.82389 12.1272 7.34834 12.6517C7.87279 13.1761 8.54097 13.5333 9.2684 13.6779C9.99583 13.8226 10.7498 13.7484 11.4351 13.4645C12.1203 13.1807 12.7059 12.7001 13.118 12.0834C13.5301 11.4667 13.75 10.7417 13.75 10C13.749 9.00576 13.3535 8.05253 12.6505 7.34949C11.9475 6.64645 10.9942 6.25103 9.99999 6.25ZM9.99999 12.5C9.50554 12.5 9.02219 12.3534 8.61107 12.0787C8.19994 11.804 7.87951 11.4135 7.69029 10.9567C7.50107 10.4999 7.45157 9.99723 7.54803 9.51227C7.64449 9.02732 7.88259 8.58186 8.23222 8.23223C8.58186 7.8826 9.02731 7.6445 9.51227 7.54804C9.99722 7.45157 10.4999 7.50108 10.9567 7.6903C11.4135 7.87952 11.804 8.19995 12.0787 8.61107C12.3534 9.0222 12.5 9.50555 12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 9.99999 12.5Z" fill="white"></path></svg>',
      }}
    />
  ),
  bookmarks: "🔖",
  likes: "❤️",
  comments: "💬",
};

// Stats grid
const StatsGrid = ({
  stats,
}: {
  stats: {
    posts: number;
    views: number;
    bookmarks: number;
    likes: number;
    comments: number;
  };
}) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 mb-8">
    {Object.entries(stats).map(([key, value]) => (
      <div
        key={key}
        className="flex flex-col items-center bg-secondary/40 rounded-xl py-3 px-2"
      >
        <div className="text-2xl mb-1">{statsIcons[key]}</div>
        <div className="text-lg font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground capitalize">{key}</div>
      </div>
    ))}
  </div>
);

// Card grid for shared components (from Community.tsx)
const SharedComponentsGrid = ({
  components,
}: {
  components: Array<{
    title: string;
    views: string;
    bookmarks: string;
    children: React.ReactNode;
    isPro?: boolean;
    isFree?: boolean;
    subtitle?: string;
    subtitleViews?: string;
  }>;
}) => (
  <section className="flex w-full items-start content-start gap-6 flex-wrap mt-2 px-0 py-0 max-md:justify-center max-sm:gap-4">
    {components.map((comp, idx) => (
      <Card
        key={idx}
        className="w-[411px] max-md:w-full max-md:max-w-[411px] max-sm:w-full bg-black border border-[#3A3A3A] rounded-[30px]"
      >
        <CardContent className="p-0">
          <div className="flex h-[187px] flex-col justify-center items-center self-stretch bg-black px-14 py-[121px] rounded-[30px]">
            {comp.children}
          </div>
          <div className="flex w-[359px] flex-col justify-center items-start h-[50px] max-sm:w-full px-4">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
              <div className="flex justify-between items-center self-stretch">
                <h3 className="flex-[1_0_0] text-white text-base font-semibold">
                  {comp.title}
                </h3>
                {comp.isPro && (
                  <div className="flex justify-center items-center rounded border bg-[rgba(255,71,156,0.60)] pt-[3px] pb-0.5 px-[15px] border-solid border-[#FF479C]">
                    <span className="text-white text-sm font-normal">Pro</span>
                  </div>
                )}
                {comp.isFree && (
                  <div className="flex justify-center items-center rounded opacity-70 bg-[#303030] pl-3 pr-[11px] pt-[3px] pb-0.5">
                    <span className="text-white text-sm font-normal">Free</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex w-[45px] items-center gap-1.5">
                <span className="text-white text-sm font-semibold">
                  {comp.views}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-300 text-sm font-semibold leading-5">
                  {comp.bookmarks}
                </span>
              </div>
            </div>
          </div>
          {comp.subtitle && (
            <div className="flex w-[359px] flex-col justify-center items-start h-11 mt-4 max-sm:w-full px-4">
              <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-center self-stretch">
                  <h4 className="flex-[1_0_0] text-white text-base font-semibold">
                    {comp.subtitle}
                  </h4>
                  {comp.isFree && (
                    <div className="flex justify-center items-center rounded opacity-70 bg-[#303030] pl-3 pr-[11px] pt-[3px] pb-0.5">
                      <span className="text-white text-sm font-normal">
                        Free
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex w-[45px] items-center gap-1.5">
                <span className="text-white text-[13px] font-light">
                  {comp.subtitleViews}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </section>
);

// Main profile card layout
export const CommunityUserProfile = ({
  user = {
    avatar: "",
    initials: "EM",
    name: "Eliana Moretti",
    username: "@elianam",
    social: {
      github: "#",
      twitter: "#",
      website: "#",
    },
    profilePicture:
      "https://api.builder.io/api/v1/image/assets/TEMP/0c1d6bd65b1ea1ffa811a1c7e3602bd5c3fea2ba?width=400",
    stats: {
      posts: 89,
      views: 1200000,
      bookmarks: 1300,
      likes: 5400,
      comments: 320,
    },
    sharedComponents: [
      {
        title: "Start Code HTML Button",
        views: "10k",
        bookmarks: "1.3K",
        children: (
          <button className="flex w-[121px] h-[50px] justify-center items-center shadow-[4px_8px_19px_-3px_rgba(0,0,0,0.27)] bg-[#E8E8E8] px-[25px] py-[15px] rounded-[15px] hover:bg-[#D8D8D8] transition-colors">
            <span className="text-[#212121] text-[17px] font-[1000]">
              Click me!
            </span>
          </button>
        ),
      },
      {
        title: "Blue Button",
        views: "80k",
        bookmarks: "1.3K",
        isFree: true,
        subtitle: "Blue Button",
        subtitleViews: "80k",
        children: (
          <button className="flex w-[184px] h-[49px] justify-center items-center shadow-[0_8px_0_0_#4836BB] bg-[#644DFF] pl-[50.67px] pr-[50.69px] pt-[13.5px] pb-[14.24px] rounded-xl border-2 border-solid border-[#4836BB] hover:bg-[#5A43E6] transition-colors">
            <span className="text-white text-lg font-black tracking-[2px]">
              BUTTON
            </span>
          </button>
        ),
      },
      {
        title: "3d box",
        views: "70k",
        bookmarks: "1.3K",
        isPro: true,
        children: (
          <div className="w-[94px] h-[136px] relative">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg width="85" height="52" viewBox="0 0 85 52" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-element" style="width: 94px; height: 136px; position: absolute; left: 0; top: 0"> <path d="M82.86 24.9299L44.6068 1.8746C43.3459 1.11466 41.3011 1.11466 40.0402 1.8746L1.78699 24.9299C0.526087 25.6909 0.526087 26.9228 1.78699 27.6837L40.0392 50.738C41.3011 51.499 43.3459 51.499 44.6068 50.738L82.86 27.6837C84.1209 26.9228 84.1209 25.6909 82.86 24.9299" stroke="#4B22B5" stroke-width="0.999926"></path> </svg>',
              }}
            />
          </div>
        ),
      },
    ],
  },
  goBackHandler,
}: {
  user?: {
    avatar?: string;
    initials: string;
    name: string;
    username: string;
    social: { github?: string; twitter?: string; website?: string };
    profilePicture?: string;
    stats: {
      posts: number;
      views: number;
      bookmarks: number;
      likes: number;
      comments: number;
    };
    sharedComponents: Array<{
      title: string;
      views: string;
      bookmarks: string;
      children: React.ReactNode;
      isPro?: boolean;
      isFree?: boolean;
      subtitle?: string;
      subtitleViews?: string;
    }>;
  };
  goBackHandler?: () => void;
}) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto bg-gradient-card rounded-3xl border border-border shadow-lg p-8 pt-20 pb-12 mt-12 mb-8">
      {/* Go back button */}
      <div className="absolute top-6 left-8">
        <button
          className="flex h-10 justify-center items-center gap-2 pt-[9.665px] pb-[10.335px] px-4 rounded-md hover:bg-gray-800 transition-colors"
          onClick={() => {
            if (goBackHandler) {
              goBackHandler();
            } else if (window && window.history) {
              window.history.pushState({}, '', '/community');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html:
                '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.88667 4.66504C4.48742 5.69958 3.22806 6.91099 2.14 8.26904C2.0496 8.38125 2.00021 8.52095 2 8.66504M2 8.66504C2.00021 8.80913 2.0496 8.94883 2.14 9.06104C3.22807 10.4191 4.48743 11.6305 5.88667 12.665M2 8.66504H14" stroke="#F2F2F2" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }}
          />
          <span className="text-[#F2F2F2] text-2xl font-medium leading-5 max-sm:text-lg">
            Go back
          </span>
        </button>
      </div>
      {/* Profile Picture */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <Avatar
            src={user.profilePicture}
            initials={user.initials}
            size="lg"
            className="border-4 border-primary shadow-lg"
          />
        </div>
        {/* Name, Username, Social */}
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-[#F2F2F2] text-4xl md:text-5xl font-semibold leading-9">
            {user.name}
          </h1>
          <div className="text-muted-foreground text-xl font-medium mb-2">
            {user.username}
          </div>
          <div className="flex items-center gap-2">
            {user.social.github && (
              <a
                href={user.social.github}
                className="flex h-9 min-w-9 justify-center items-center px-2 py-0 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="GitHub profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialIcons.github}
              </a>
            )}
            {user.social.twitter && (
              <a
                href={user.social.twitter}
                className="flex h-9 min-w-9 justify-center items-center px-2 py-0 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="Twitter profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialIcons.twitter}
              </a>
            )}
            {user.social.website && (
              <a
                href={user.social.website}
                className="flex h-9 min-w-9 justify-center items-center px-2 py-0 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="Website"
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialIcons.website}
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Stats */}
      <StatsGrid stats={user.stats} />
      {/* Shared Components Grid */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Shared Components</h2>
      <SharedComponentsGrid components={user.sharedComponents} />
    </div>
  );
};
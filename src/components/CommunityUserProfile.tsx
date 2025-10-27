import React from "react";
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Types for better TypeScript support
interface SocialLinks {
  github?: string;
  twitter?: string;
  website?: string;
}

interface UserStats {
  posts: number;
  views: number;
}

interface SharedComponent {
  id: string;
  title: string;
  type: string;
  language?: string;
  code?: string;
  badge?: "Free" | "Pro";
  stats?: string;
  htmlCode?: string;
  cssCode?: string;
  views: string;
  bookmarks: string;
  children: React.ReactNode;
  isPro?: boolean;
  isFree?: boolean;
  subtitle?: string;
  subtitleViews?: string;
  tags?: string[];
}

interface UserProfile {
  avatar?: string;
  initials: string;
  name: string;
  username: string;
  social: SocialLinks;
  website?: string;
  bio?: string;
  profilePicture?: string;
  stats: UserStats;
  sharedComponents: SharedComponent[];
}

interface CommunityUserProfileProps {
  userId?: string; // userId prop for dynamic fetching
  goBackHandler?: () => void;
}

// Avatar component

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
  return (
    <ShadAvatar className={`${sizeClasses[size]} border border-neutral-700 bg-white text-black ${className}`}>
      {typeof src === "string" && src ? (
        <AvatarImage key={src} src={src} alt={initials} crossOrigin="anonymous" referrerPolicy="no-referrer" />
      ) : null}
      <AvatarFallback className="text-black font-medium">{initials}</AvatarFallback>
    </ShadAvatar>
  );
};

// Social links SVGs
const socialIcons = {
  github: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4.90106 15.5442C4.65106 15.3776 4.43606 15.1651 4.18439 14.8642C4.05376 14.7044 3.92431 14.5435 3.79606 14.3817C3.41023 13.9026 3.16689 13.6817 2.91523 13.5909C2.70714 13.5162 2.53725 13.3619 2.44294 13.1619C2.34862 12.962 2.33761 12.7327 2.41231 12.5246C2.48701 12.3166 2.64132 12.1467 2.84128 12.0524C3.04124 11.958 3.27047 11.947 3.47856 12.0217C4.10523 12.2467 4.52939 12.6342 5.10106 13.3451C5.02273 13.2476 5.38439 13.7009 5.46189 13.7942C5.62023 13.9834 5.73689 14.0984 5.82856 14.1592C5.99856 14.2734 6.31773 14.3226 6.78689 14.2759C6.80606 13.9576 6.86523 13.6484 6.95523 13.3634C4.48189 12.7584 3.08189 11.1634 3.08189 8.03339C3.08189 7.00006 3.39023 6.07006 3.96356 5.29006C3.78189 4.54506 3.80939 3.64423 4.21523 2.63006C4.26128 2.51534 4.33229 2.4123 4.42309 2.32842C4.51389 2.24453 4.62222 2.1819 4.74023 2.14506C4.80773 2.12506 4.84606 2.11589 4.91356 2.10589C5.58273 2.00339 6.52773 2.24756 7.75939 3.01923C8.49339 2.84763 9.24477 2.7615 9.99856 2.76256C10.7586 2.76256 11.5136 2.84923 12.2352 3.01923C13.4661 2.24173 14.4127 1.99756 15.0869 2.10589C15.1577 2.11673 15.2177 2.13089 15.2686 2.14756C15.3842 2.18571 15.4902 2.24875 15.5789 2.33226C15.6676 2.41577 15.7369 2.51771 15.7819 2.63089C16.1877 3.64423 16.2152 4.54506 16.0336 5.28923C16.6094 6.06923 16.9152 6.99339 16.9152 8.03339C16.9152 11.1642 15.5202 12.7542 13.0469 13.3601C13.1511 13.7059 13.2052 14.0926 13.2052 14.5101C13.2053 15.2645 13.202 16.019 13.1952 16.7734C13.3824 16.8142 13.5497 16.9183 13.6692 17.068C13.7886 17.2178 13.8528 17.4041 13.8509 17.5957C13.8491 17.7872 13.7813 17.9723 13.659 18.1197C13.5367 18.2671 13.3673 18.3679 13.1794 18.4051C12.2302 18.5951 11.5269 17.9617 11.5269 17.1342L11.5286 16.7626L11.5327 16.1751C11.5369 15.5851 11.5386 15.0601 11.5386 14.5101C11.5386 13.9292 11.3861 13.5501 11.1844 13.3767C10.6336 12.9017 10.9127 11.9976 11.6344 11.9167C14.1069 11.6392 15.2486 10.6817 15.2486 8.03339C15.2486 7.23756 14.9886 6.58006 14.4877 6.03006C14.3822 5.91443 14.3114 5.77142 14.2834 5.6174C14.2554 5.46339 14.2713 5.3046 14.3294 5.15923C14.4677 4.81423 14.5269 4.36173 14.4094 3.81423L14.4011 3.81673C13.9919 3.93256 13.4761 4.18339 12.8527 4.60756C12.7522 4.67577 12.638 4.72119 12.5181 4.74062C12.3982 4.76005 12.2755 4.75304 12.1586 4.72006C11.4551 4.5253 10.7284 4.42745 9.99856 4.42923C9.25689 4.42923 8.52189 4.52839 7.83856 4.72089C7.72207 4.75361 7.59986 4.76056 7.48042 4.74128C7.36098 4.722 7.24716 4.67693 7.14689 4.60923C6.52023 4.18673 6.00189 3.93673 5.59023 3.82006C5.47023 4.36423 5.52939 4.81506 5.66689 5.15923C5.72507 5.30452 5.74114 5.46327 5.71329 5.61728C5.68544 5.77129 5.61477 5.91434 5.50939 6.03006C5.01189 6.57506 4.74856 7.24506 4.74856 8.03339C4.74856 10.6767 5.89106 11.6401 8.35023 11.9167C9.07106 11.9976 9.35106 12.8976 8.80356 13.3734C8.64356 13.5134 8.44606 13.9834 8.44606 14.5101V17.1351C8.44606 17.9567 7.75023 18.5726 6.81273 18.4084C6.62253 18.375 6.44984 18.2766 6.32416 18.13C6.19848 17.9834 6.12761 17.7977 6.12368 17.6046C6.11974 17.4115 6.18298 17.2231 6.30258 17.0715C6.42218 16.9199 6.59072 16.8145 6.77939 16.7734V15.9484C6.02106 15.9992 5.39439 15.8751 4.90106 15.5442Z"
        fill="#F2F2F2"
      />
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12.6009 0.768799H15.0542L9.69434 6.89505L16 15.2313H11.0626L7.19566 10.1753L2.77091 15.2313H0.315906L6.04887 8.67867L0 0.768799H5.06247L8.55797 5.39005L12.6009 0.768799ZM11.7398 13.7627H13.0993L4.32384 2.16027H2.86509L11.7398 13.7627Z"
        fill="#F2F2F2"
      />
    </svg>
  ),
  website: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M15.3031 12.9465L14.1247 11.7665L15.3031 10.5882C15.6927 10.2019 16.0023 9.74245 16.214 9.2362C16.4256 8.72995 16.5352 8.18688 16.5364 7.63817C16.5376 7.08946 16.4304 6.54592 16.221 6.03875C16.0115 5.53158 15.704 5.07077 15.316 4.68277C14.928 4.29477 14.4672 3.98723 13.96 3.77781C13.4528 3.56838 12.9093 3.46119 12.3606 3.46239C11.8119 3.46359 11.2688 3.57316 10.7626 3.78481C10.2563 3.99645 9.79685 4.30601 9.41056 4.6957L8.23222 5.87487L7.05306 4.69653L8.23306 3.5182C9.32708 2.42418 10.8109 1.80957 12.3581 1.80957C13.9052 1.80957 15.389 2.42418 16.4831 3.5182C17.5771 4.61222 18.1917 6.09603 18.1917 7.6432C18.1917 9.19038 17.5771 10.6742 16.4831 11.7682L15.3031 12.9465ZM12.9464 15.3032L11.7672 16.4815C10.6732 17.5756 9.1894 18.1902 7.64222 18.1902C6.09505 18.1902 4.61124 17.5756 3.51722 16.4815C2.42321 15.3875 1.80859 13.9037 1.80859 12.3565C1.80859 10.8094 2.42321 9.32555 3.51722 8.23153L4.69639 7.0532L5.87472 8.2332L4.69639 9.41153C4.3067 9.79783 3.99714 10.2573 3.7855 10.7635C3.57385 11.2698 3.46428 11.8129 3.46308 12.3616C3.46188 12.9103 3.56907 13.4538 3.7785 13.961C3.98792 14.4682 4.29546 14.929 4.68346 15.317C5.07146 15.705 5.53227 16.0125 6.03944 16.2219C6.54661 16.4314 7.09015 16.5385 7.63886 16.5373C8.18757 16.5361 8.73064 16.4266 9.23689 16.2149C9.74314 16.0033 10.2026 15.6937 10.5889 15.304L11.7672 14.1257L12.9464 15.3032ZM12.3564 6.46403L13.5356 7.6432L7.64306 13.5349L6.46389 12.3565L12.3564 6.46403Z"
        fill="#F2F2F2"
      />
    </svg>
  ),
};

// Stats icons
const statsIcons = {
  posts: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="2" fill="#F2F2F2" />
      <rect x="6" y="7" width="8" height="2" rx="1" fill="#282828" />
      <rect x="6" y="11" width="5" height="2" rx="1" fill="#282828" />
    </svg>
  ),
  views: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M19.3211 9.74688C19.2937 9.68516 18.632 8.21719 17.1609 6.74609C15.2008 4.78594 12.725 3.75 9.99999 3.75C7.27499 3.75 4.79921 4.78594 2.83905 6.74609C1.36796 8.21719 0.703118 9.6875 0.678899 9.74688C0.643362 9.82681 0.625 9.91331 0.625 10.0008C0.625 10.0883 0.643362 10.1748 0.678899 10.2547C0.706243 10.3164 1.36796 11.7836 2.83905 13.2547C4.79921 15.2141 7.27499 16.25 9.99999 16.25C12.725 16.25 15.2008 15.2141 17.1609 13.2547C18.632 11.7836 19.2937 10.3164 19.3211 10.2547C19.3566 10.1748 19.375 10.0883 19.375 10.0008C19.375 9.91331 19.3566 9.82681 19.3211 9.74688ZM9.99999 15C7.5953 15 5.49452 14.1258 3.75546 12.4023C3.0419 11.6927 2.43483 10.8836 1.95312 10C2.4347 9.11636 3.04179 8.30717 3.75546 7.59766C5.49452 5.87422 7.5953 5 9.99999 5C12.4047 5 14.5055 5.87422 16.2445 7.59766C16.9595 8.307 17.5679 9.11619 18.0508 10C17.4875 11.0516 15.0336 15 9.99999 15ZM9.99999 6.25C9.25831 6.25 8.53329 6.46993 7.9166 6.88199C7.29992 7.29404 6.81927 7.87971 6.53544 8.56494C6.25162 9.25016 6.17735 10.0042 6.32205 10.7316C6.46674 11.459 6.82389 12.1272 7.34834 12.6517C7.87279 13.1761 8.54097 13.5333 9.2684 13.6779C9.99583 13.8226 10.7498 13.7484 11.4351 13.4645C12.1203 13.1807 12.7059 12.7001 13.118 12.0834C13.5301 11.4667 13.75 10.7417 13.75 10C13.749 9.00576 13.3535 8.05253 12.6505 7.34949C11.9475 6.64645 10.9942 6.25103 9.99999 6.25ZM9.99999 12.5C9.50554 12.5 9.02219 12.3534 8.61107 12.0787C8.19994 11.804 7.87951 11.4135 7.69029 10.9567C7.50107 10.4999 7.45157 9.99723 7.54803 9.51227C7.64449 9.02732 7.88259 8.58186 8.23222 8.23223C8.58186 7.8826 9.02731 7.6445 9.51227 7.54804C9.99722 7.45157 10.4999 7.50108 10.9567 7.6903C11.4135 7.87952 11.804 8.19995 12.0787 8.61107C12.3534 9.0222 12.5 9.50555 12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 9.99999 12.5Z"
        fill="white"
      />
    </svg>
  ),
};

// Stats display component with simplified styling
const UserStats = ({ stats }: { stats: UserStats }) => (
  <div className="flex items-center gap-4 md:gap-8">
    <div className="flex items-center gap-3 bg-[#FF479C]/10 rounded-xl py-3 px-5 hover:scale-105 transition-all duration-300 border border-[#FF479C]/20">
      <div className="text-xl p-2 bg-white/10 rounded-lg">
        {statsIcons.posts}
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-bold text-white">{stats.posts}</div>
        <div className="text-xs text-muted-foreground font-medium">Posts</div>
      </div>
    </div>
    <div className="flex items-center gap-3 bg-[#FF479C]/10 rounded-xl py-3 px-5 hover:scale-105 transition-all duration-300 border border-[#FF479C]/20">
      <div className="text-xl w-5 h-5 flex items-center justify-center p-2 bg-white/10 rounded-lg">
        {statsIcons.views}
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-bold text-white">
          {stats.views >= 1000000
            ? `${(stats.views / 1000000).toFixed(1)}M`
            : stats.views >= 1000
            ? `${(stats.views / 1000).toFixed(1)}K`
            : stats.views}
        </div>
        <div className="text-xs text-muted-foreground font-medium">Views</div>
      </div>
    </div>
  </div>
);

// Card grid for shared components
import { useNavigate } from "react-router-dom";

const SharedComponentsGrid = ({
  components,
}: {
  components: SharedComponent[];
}) => {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {components.map((comp) => (
        <div
          key={comp.id}
          onClick={() => navigate(`/components/${comp.type}/${comp.id}`)}
          className="cursor-pointer w-full"
        >
          <div
            className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-end items-center gap-2 shrink-0 border relative overflow-hidden transition-all duration-[0.3s] ease-[ease] hover:border-[#FF479C] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] pt-2.5 pb-0 px-4 rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A] group"
            style={{ backgroundColor: "#2d3135" }}
          >
            {/* Views badge in top-left corner */}
            <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 bg-[rgba(0,0,0,0.45)] px-2 py-1 rounded-full">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5z"
                  stroke="white"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="white"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-white text-xs font-light">
                {comp.views || 0} views
              </span>
            </div>
            <div
              className="flex h-full flex-col justify-center items-center shrink-0 absolute w-full rounded-2xl sm:rounded-3xl left-0 top-0 group-hover:scale-105 transition-transform duration-[0.3s] ease-[ease] overflow-hidden"
              style={{ backgroundColor: "#2d3135" }}
            >
              {/* Preview based on code and language */}
              {comp.language &&
                comp.code &&
                (() => {
                  // Tailwind preview
                  if (
                    (comp.language &&
                      comp.language.toLowerCase() === "tailwind" &&
                      comp.code) ||
                    (comp.language &&
                      comp.language.toLowerCase() === "tailwindcss" &&
                      comp.code)
                  ) {
                    const tailwindHtml = comp.code || "";
                    const srcDoc = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script src="https://cdn.tailwindcss.com"></script>
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body, html {
                              width: 100%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: transparent;
                              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                              overflow: hidden;
                            }
                          </style>
                        </head>
                        <body>
                          ${tailwindHtml}
                        </body>
                      </html>
                    `;
                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <iframe
                          title="Preview"
                          srcDoc={srcDoc}
                          className="w-full h-full rounded-lg border-0"
                          style={{
                            margin: 0,
                            padding: 0,
                            background: "transparent",
                            width: "100%",
                            height: "100%",
                          }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    );
                  }
                  // Direct full HTML document preview
                  if (
                    typeof comp.code === "string" &&
                    comp.code.trim().startsWith("<!DOCTYPE html")
                  ) {
                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <iframe
                          title="Preview"
                          srcDoc={comp.code}
                          className="w-full h-full rounded-lg border-0"
                          style={{
                            margin: 0,
                            padding: 0,
                            background: "transparent",
                            width: "100%",
                            height: "100%",
                          }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    );
                  }
                  // React preview (iframe Babel)
                  if (comp.language.toLowerCase() === "react") {
                    const srcDoc = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body, html {
                              width: 100%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: transparent;
                              overflow: hidden;
                            }
                          </style>
                        </head>
                        <body>
                          <div id="root"></div>
                          <script type="text/babel">
                            try {
                              ${comp.code}
                              if (typeof Component !== "undefined") {
                                ReactDOM.createRoot(document.getElementById('root')).render(<Component />);
                              }
                            } catch (e) {
                              document.getElementById('root').innerHTML = '<pre style="color:red;">' + e.toString() + '</pre>';
                            }
                          </script>
                        </body>
                      </html>
                    `;
                    return (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <iframe
                          title="Preview"
                          srcDoc={srcDoc}
                          className="w-full h-full rounded-lg border-0"
                          style={{
                            margin: 0,
                            padding: 0,
                            background: "transparent",
                            width: "100%",
                            height: "100%",
                          }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    );
                  }
                  // Multi preview
                  if (comp.language.toLowerCase() === "multi") {
                    return (
                      <div
                        className="w-full h-full flex items-center justify-center overflow-hidden"
                        style={{
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <iframe
                          title="Preview"
                          srcDoc={comp.code}
                          className="border-0"
                          style={{
                            width: "100%",
                            height: "100%",
                            margin: 0,
                            padding: 0,
                            overflow: "hidden",
                            background: "transparent",
                          }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    );
                  }
                  // CSS + HTML combined preview
                  if (
                    comp.language.toLowerCase() === "css" &&
                    comp.htmlCode &&
                    comp.cssCode
                  ) {
                    const srcDoc = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body, html {
                              width: 100%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: transparent;
                              overflow: hidden;
                            }
                            ${comp.cssCode}
                          </style>
                        </head>
                        <body>
                          ${comp.htmlCode}
                        </body>
                      </html>
                    `;
                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          transform: "scale(0.6)",
                          transformOrigin: "center",
                        }}
                      >
                        <iframe
                          title="Preview"
                          srcDoc={srcDoc}
                          className="w-full h-full rounded-lg border-0"
                          style={{
                            margin: 0,
                            padding: 0,
                            background: "transparent",
                            width: "100%",
                            height: "100%",
                          }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    );
                  }
                  // Fallback: HTML/CSS/JS preview
                  return (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        transform: "scale(0.6)",
                        transformOrigin: "center",
                      }}
                    >
                      <iframe
                        title="Preview"
                        srcDoc={`<!DOCTYPE html>
                          <html>
                            <head>
                              <style>
                                * {
                                  margin: 0;
                                  padding: 0;
                                  box-sizing: border-box;
                                }
                                body, html {
                                  width: 100%;
                                  height: 100%;
                                  overflow: hidden;
                                  background: transparent;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                }
                                #preview-wrapper {
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  transform: scale(0.5);
                                  transform-origin: center;
                                }
                                ${
                                  comp.language.toLowerCase() === "css"
                                    ? comp.code
                                    : ""
                                }
                              </style>
                            </head>
                            <body>
                              <div id="preview-wrapper">
                                ${
                                  comp.language.toLowerCase() === "html"
                                    ? comp.code
                                    : ""
                                }
                              </div>
                              <script>${
                                comp.language.toLowerCase() === "javascript"
                                  ? comp.code
                                  : ""
                              }</script>
                            </body>
                          </html>`}
                        className="w-full h-full rounded-lg border-0"
                        style={{
                          margin: 0,
                          padding: 0,
                          background: "transparent",
                          width: "100%",
                          height: "100%",
                        }}
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  );
                })()}
            </div>
            <div className="flex w-[calc(100%-2rem)] flex-col justify-center items-start absolute h-10 sm:h-11 z-10 left-4 bottom-2">
              <div className="flex justify-between items-center self-stretch mb-1 sm:mb-2.5">
                <h3 className="flex-[1_0_0] text-white text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                  {/* Show cleaned type only, not title */}
                  <span className="block text-base sm:text-lg font-semibold">
                    {comp.type
                      ?.replace(/component/gi, "")
                      .trim()
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </h3>
                <div className="flex justify-center items-center rounded pl-2 sm:pl-3 pr-2 sm:pr-[11px] pt-[2px] sm:pt-[3px] pb-0.5 transition-all duration-300 ease-in-out opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                  <span
                    className={`text-xs sm:text-sm font-normal ${
                      comp.badge === "Pro" ? "text-[#FF479C]" : "text-white"
                    }`}
                  >
                    {comp.badge || "Free"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

// Filter component with enhanced styling and icons
const ComponentFilter = ({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) => {
  const filters = [
    {
      id: "all",
      label: "All Components",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "free",
      label: "Free",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: "pro",
      label: "Pro",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: "popular",
      label: "Most Popular",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      id: "recent",
      label: "Recent",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeFilter === filter.id
              ? "bg-[#FF479C] text-white scale-105"
              : "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60 hover:scale-105 border border-white/5"
          }`}
        >
          <span
            className={`transition-transform duration-300 ${
              activeFilter === filter.id ? "scale-110" : "group-hover:scale-110"
            }`}
          >
            {filter.icon}
          </span>
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// Main profile card layout
import { useParams } from "react-router-dom";

export const CommunityUserProfile = ({
  userId: propUserId,
  goBackHandler,
}: CommunityUserProfileProps) => {
  const params = useParams();
  console.log("[CommunityUserProfile] useParams() result:", params);
  const userId =
    propUserId ||
    params.userId ||
    params.userid ||
    params.id ||
    params.username ||
    Object.values(params)[0]; // fallback to first param if only one exists
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    console.log("[CommunityUserProfile] useEffect triggered. userId:", userId);

    if (!userId) {
      setUser(null);
      setLoading(false);
      console.warn("[CommunityUserProfile] No userId provided.");
      return;
    }

    setLoading(true);

    // Log before fetch
    console.log(
      "[CommunityUserProfile] Fetching user and components for userId:",
      userId
    );

    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`)
        .then((res) => {
          console.log(
            "[CommunityUserProfile] /api/users response status:",
            res.status
          );
          return res.json();
        })
        .catch((err) => {
          console.error(
            "[CommunityUserProfile] Error fetching user info:",
            err
          );
          return null;
        }),
      fetch(
        `${import.meta.env.VITE_API_URL}/api/components?createdBy=${userId}`
      )
        .then((res) => {
          console.log(
            "[CommunityUserProfile] /api/components response status:",
            res.status
          );
          return res.json();
        })
        .catch((err) => {
          console.error(
            "[CommunityUserProfile] Error fetching user components:",
            err
          );
          return [];
        }),
    ])
      .then(([userInfo, userComponents]) => {
        // Log the raw API responses
        console.log("[CommunityUserProfile] API userInfo:", userInfo);
        console.log(
          "[CommunityUserProfile] API userComponents:",
          userComponents
        );

        if (!isMounted) return;

        // Accept userInfo wrapped in { success: true, user: {...} }
        const userObj = userInfo && userInfo.user ? userInfo.user : userInfo;
        if (!userObj || userObj.error || !userObj._id) {
          console.warn(
            "[CommunityUserProfile] User not found or invalid userInfo:",
            userInfo
          );
          setUser(null);
          return;
        }

        // Only show components created by this user
        const filteredComponents = Array.isArray(userComponents)
          ? userComponents.filter(
              (comp) =>
                comp.createdBy &&
                (comp.createdBy._id === userObj._id ||
                  comp.createdBy === userObj._id)
            )
          : [];

        const finalUser = {
          initials:
            userObj?.name?.substring(0, 2).toUpperCase() ||
            userObj?.username?.substring(0, 2).toUpperCase() ||
            "U",
          name: userObj?.name || userObj?.username || "Anonymous",
          username: userObj?.username ? `@${userObj.username}` : "",
          social: {
            github: userObj?.github || "",
            twitter: userObj?.twitter || userObj?.socialMedia || "",
            website: userObj?.website || "",
          },
          website: userObj?.website || "",
          bio: userObj?.bio || "",
          profilePicture: userObj?.avatar || userObj?.profilePicture || "",
          stats: {
            posts: filteredComponents.length,
            views: filteredComponents.reduce((total, comp) => {
              const compViews =
                typeof comp.views === "number"
                  ? comp.views
                  : parseInt(comp.views) || 0;
              return total + compViews;
            }, 0),
          },
          sharedComponents: filteredComponents.map(
            (comp: {
              _id?: string;
              id?: string;
              title: string;
              type?: string;
              language?: string;
              code?: string;
              badge?: "Free" | "Pro";
              stats?: string;
              htmlCode?: string;
              cssCode?: string;
              views?: number | string;
              bookmarks?: number | string;
              tags?: string[];
              isPro?: boolean;
              isFree?: boolean;
              createdBy?: { _id?: string } | string;
            }) => ({
              id: comp._id || comp.id || "",
              title: comp.title,
              type: comp.type || "other",
              language: comp.language,
              code: comp.code,
              badge: comp.badge,
              stats: comp.stats,
              htmlCode: comp.htmlCode,
              cssCode: comp.cssCode,
              views: comp.views ? String(comp.views) : "0",
              bookmarks: comp.bookmarks ? String(comp.bookmarks) : "0",
              tags: comp.tags || [],
              isPro: comp.isPro,
              isFree: comp.isFree,
              children: (
                <div className="w-full flex items-center justify-center">
                  <span className="text-white">{comp.title}</span>
                </div>
              ),
            })
          ),
        };
        // Log the final user state before rendering
        console.log(
          "[CommunityUserProfile] Final user state for rendering:",
          finalUser
        );
        setUser(finalUser);
      })
      .catch((err) => {
        console.error("[CommunityUserProfile] Error in Promise.all:", err);
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleGoBack = () => {
    if (goBackHandler) {
      goBackHandler();
    } else if (typeof window !== "undefined" && window.history) {
      window.history.pushState({}, "", "/community");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 pt-20 pb-12 mt-12 mb-8">
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          {/* Animated spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#FF479C] animate-spin"></div>
          </div>
          {/* Skeleton loaders */}
          <div className="w-full max-w-2xl space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-700/50"></div>
              <div className="flex-1 space-y-2">
                <div className="h-8 bg-gray-700/50 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-700/50 rounded-lg w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="h-32 bg-gray-700/50 rounded-xl"></div>
              <div className="h-32 bg-gray-700/50 rounded-xl"></div>
              <div className="h-32 bg-gray-700/50 rounded-xl"></div>
            </div>
          </div>
          <p className="text-lg text-gray-400 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 pt-20 pb-12 mt-12 mb-8">
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          {/* Error icon */}
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-red-400">User Not Found</h2>
            <p className="text-gray-400">
              The profile you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <button
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF479C] text-white font-semibold hover:scale-105 transition-all duration-300"
            onClick={handleGoBack}
          >
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path
                d="M5.88667 4.66504C4.48742 5.69958 3.22806 6.91099 2.14 8.26904C2.0496 8.38125 2.00021 8.52095 2 8.66504M2 8.66504C2.00021 8.80913 2.0496 8.94883 2.14 9.06104C3.22807 10.4191 4.48743 11.6305 5.88667 12.665M2 8.66504H14"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 pt-20 pb-12 mt-12 mb-8 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF479C]/5 via-transparent to-purple-500/5 pointer-events-none"></div>

      {/* Go back button - Simplified */}
      <div className="absolute top-6 left-8 z-10">
        <button
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-all duration-300 text-white border border-white/5 hover:border-white/10 hover:scale-105"
          onClick={handleGoBack}
        >
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path
              d="M5.88667 4.66504C4.48742 5.69958 3.22806 6.91099 2.14 8.26904C2.0496 8.38125 2.00021 8.52095 2 8.66504M2 8.66504C2.00021 8.80913 2.0496 8.94883 2.14 9.06104C3.22807 10.4191 4.48743 11.6305 5.88667 12.665M2 8.66504H14"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-base font-semibold">Go back</span>
        </button>
      </div>

      {/* Profile Header with gradient background */}
      <div className="relative bg-gradient-to-r from-secondary/30 via-secondary/20 to-transparent backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/5 shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Profile Picture - Simplified */}
          <div className="flex-shrink-0 relative">
            <Avatar
              src={user.profilePicture}
              initials={user.initials}
              size="lg"
              className="border-4 border-[#FF479C]"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2 leading-tight">
                    {user.name}
                  </h1>
                  <div className="text-muted-foreground text-lg font-medium">
                    {user.username}
                  </div>
                </div>

                {/* Social Links - Enhanced */}
                <div className="flex items-center gap-2">
                  {user.social.github && (
                    <a
                      href={user.social.github}
                      className="p-3 rounded-xl bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/5"
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
                      className="p-3 rounded-xl bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/5"
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
                      className="p-3 rounded-xl bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/5"
                      aria-label="Website"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialIcons.website}
                    </a>
                  )}
                  {/* Show website as text if not in social */}
                  {!user.social.website && user.website && (
                    <a
                      href={user.website}
                      className="p-3 rounded-xl bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/5"
                      aria-label="Website"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialIcons.website}
                    </a>
                  )}
                </div>

                {/* Show bio if present */}
                {user.bio && (
                  <div className="text-neutral-300 text-base leading-relaxed bg-secondary/20 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                    {user.bio}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex-shrink-0">
                <UserStats stats={user.stats} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider with gradient */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#FF479C] px-6 py-2 rounded-full text-sm font-semibold text-white shadow-lg">
            Shared Components
          </span>
        </div>
      </div>

      {/* Components Section */}
      <div className="mt-8 relative">
        <ComponentFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {user.sharedComponents.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-secondary/20 backdrop-blur-sm rounded-2xl border border-white/5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF479C]/20 to-purple-500/20 flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF479C"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                No Components Yet
              </h3>
              <p className="text-gray-400 max-w-md">
                This user hasn't shared any components yet. Check back later to
                see their creations!
              </p>
            </div>
          </div>
        ) : (
          <SharedComponentsGrid components={user.sharedComponents} />
        )}
      </div>
    </div>
  );
};

export default CommunityUserProfile;

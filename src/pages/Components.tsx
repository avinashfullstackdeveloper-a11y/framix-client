import { useAuth } from "../context/AuthContext";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import AdCard from "../components/AdCard";
import ComponentShowcaseCard from "../components/ComponentShowcaseCard";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Components = () => {
  // Filter tabs should match the fields in ComponentSelectorPopup.tsx
  const filterTabs = [
    "All",
    "Button",
    "Toggle switch",
    "Checkbox",
    "Card",
    "Loader",
    "Input",
    "Form",
    "Pattern",
    "Radio buttons",
    "Tooltips",
  ];
  // Only lightweight fields are present in the list/grid
  type ComponentItem = {
    _id: string;
    title: string;
    type: string;
    language?: string;
    badge?: "Free" | "Pro";
    views?: number;
  };
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Always derive activeFilter from URL if present
  const getFilterFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    return filter && filterTabs.includes(filter) ? filter : filterTabs[0];
  };
  const [activeFilter, setActiveFilter] = useState(getFilterFromUrl());
  // Always derive currentPage from URL
  const getPageFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page") || "1", 10);
    return page > 0 ? page : 1;
  };
  const [currentPage, setCurrentPage] = useState(getPageFromUrl());
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [toastShown, setToastShown] = useState(false);

  // NOTE: Full component details (code, htmlCode, cssCode, etc.) are NOT fetched here.
  // Fetch full details in the detail page only.

  // Ref for scrolling to components grid on page change
  const componentsGridRef = useRef<HTMLDivElement>(null);

  // Server-side pagination state
  const [totalPages, setTotalPages] = useState(1);

  // Show welcome toast after OAuth login/registration
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Check for OAuth welcome back toast (sign in)
    if (
      localStorage.getItem("showWelcomeBackToast") === "1" &&
      user &&
      user.role &&
      !toastShown
    ) {
      toast({
        title: "Welcome back!",
        description: "You have signed in successfully.",
        variant: "default",
      });
      localStorage.removeItem("showWelcomeBackToast");
      setToastShown(true);
      return;
    }

    // Check for OAuth welcome toast (registration)
    if (
      localStorage.getItem("showWelcomeToast") === "1" &&
      user &&
      user.role &&
      !toastShown
    ) {
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      localStorage.removeItem("showWelcomeToast");
      setToastShown(true);
    }
  }, [user, authLoading, toast, toastShown]);

  // Fetch only lightweight metadata for components list/grid with server-side pagination
  // Utility to maximize type diversity in the array (for "All" filter)
  function interleaveByType<T extends { type: string }>(arr: T[]): T[] {
    if (arr.length <= 1) return arr;
    // Group by type
    const typeMap = new Map<string, T[]>();
    arr.forEach(item => {
      if (!typeMap.has(item.type)) typeMap.set(item.type, []);
      typeMap.get(item.type)!.push(item);
    });
    // Interleave
    const result: T[] = [];
    const typeKeys = Array.from(typeMap.keys());
    let added = true;
    while (added) {
      added = false;
      for (const type of typeKeys) {
        const group = typeMap.get(type)!;
        if (group.length) {
          result.push(group.shift()!);
          added = true;
        }
      }
    }
    return result;
  }

  const fetchComponents = useCallback((page: number, filter: string) => {
    setLoading(true);
    const typeParam = filter !== "All" ? `&type=${encodeURIComponent(filter)}` : "";

    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/components?publishSection=component&fields=_id,title,type,language,badge,views,code,htmlCode,cssCode,tailwind&page=${page}&limit=8${typeParam}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Handle new paginated response format
        if (data.components && data.pagination) {
          const items = filter === "All" ? interleaveByType(data.components) : data.components;
          if (filter === "All") {
            // TEMP LOG: print array of types shown in "All" tab
            console.log(
              '[Components.tsx] Types in "All" tab:',
              items.map((c) => c.type)
            );
          }
          setComponents(items);
          setTotalPages(data.pagination.totalPages);
        } else {
          // Fallback for old format (backward compatibility)
          const items = filter === "All" ? interleaveByType(data) : data;
          if (filter === "All") {
            // TEMP LOG: print array of types shown in "All" tab
            console.log(
              '[Components.tsx] Types in "All" tab:',
              items.map((c) => c.type)
            );
          }
          setComponents(items);
          // Calculate total pages from data length if using old format
          const calculatedPages = Math.ceil(data.length / 8);
          setTotalPages(calculatedPages);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!user || user.role !== "admin") return;
    if (!window.confirm("Are you sure you want to delete this component?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/components/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete component");
      setComponents((prev: ComponentItem[]) =>
        prev.filter((c) => c._id !== id)
      );
    } catch (err) {
      alert("Error deleting component");
    }
  };

  // Fetch components when page or filter changes
  useEffect(() => {
    fetchComponents(currentPage, activeFilter);
  }, [currentPage, activeFilter, fetchComponents]);

  // Sync currentPage and activeFilter with URL query param on mount and when URL changes
  useEffect(() => {
    const page = getPageFromUrl();
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    const filter = getFilterFromUrl();
    if (filter !== activeFilter) {
      setActiveFilter(filter);
    }
    // eslint-disable-next-line
  }, [window.location.search]);

  // OPTIMIZATION: Scroll to top of components grid when page changes
  useEffect(() => {
    if (currentPage > 1 && componentsGridRef.current) {
      componentsGridRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  // OPTIMIZATION: Memoize itemsWithAds array to prevent recalculation
  const itemsWithAds = useMemo(() => {
    const items: Array<
      | ComponentItem
      | { isAd: true; adIndex: number; adType: "300x250" | "160x300" }
    > = [];
    components.forEach((component, index) => {
      items.push(component);
      // Insert ad after every 6th component (index 5, 11, 17, etc.)
      if ((index + 1) % 6 === 0 && index < components.length - 1) {
        // Alternate ad types: odd positions get 300x250, even positions get 160x300
        const adCount = Math.floor(index / 6);
        const adType = adCount % 2 === 0 ? "300x250" : "160x300";
        items.push({
          isAd: true,
          adIndex: adCount + (currentPage - 1) * 2,
          adType,
        });
      }
    });
    return items;
  }, [components, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span>
            <span className="text-[#FF479C]">Components</span>
          </span>{" "}
          Showcase
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Explore polished, scalable components — from simple buttons to full
          dashboards — in both design and code.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center items-center mb-8 sm:mb-12">
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center items-center w-full max-w-4xl mx-auto px-2">
          {filterTabs.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set("page", "1");
                params.set("filter", filter);
                navigate({ search: params.toString() });
                setCurrentPage(1);
                setActiveFilter(filter);
              }}
              className={`flex w-auto min-w-20 sm:min-w-24 lg:w-28 h-8 sm:h-10 justify-center items-center border cursor-pointer transition-all duration-300 ease-in-out rounded-lg sm:rounded-[10px] border-solid ${
                activeFilter === filter
                  ? "bg-[#FF479C] border-[#FF479C] text-[#282828]"
                  : "bg-[rgba(0,0,0,0.80)] border-[#767676] text-white hover:border-[#FF479C]"
              }`}
            >
              <span className="text-xs sm:text-sm font-medium truncate px-2 sm:px-3">
                {filter}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div
        ref={componentsGridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 w-full mx-auto"
      >
        {loading ? (
          // Skeleton loader grid matching component card layout
          <>
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="w-full">
                <div
                  className="h-64 rounded-t-lg rounded-b-lg relative overflow-hidden"
                  style={{ backgroundColor: "#F4F5F6" }}
                >
                  <Skeleton className="h-full w-full" />
                  <div className="absolute top-3 right-3 z-10">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          itemsWithAds.map((item, index) => {
            // Check if this is an ad item
            if ("isAd" in item && item.isAd) {
              return (
                <AdCard
                  key={`ad-${item.adIndex}`}
                  adKey={`ad-${item.adIndex}`}
                  adType={item.adType}
                />
              );
            }

            // Regular component item
            const componentItem = item as ComponentItem;
            return (
              <ComponentShowcaseCard
                key={componentItem._id}
                componentItem={componentItem}
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("page", String(currentPage));
                  params.set("filter", activeFilter);
                  navigate(
                    `/components/${componentItem.type
                      ?.replace(/component/gi, "")
                      .trim()
                      .replace(/^[\w]/, (c) => c.toUpperCase())}/${
                      componentItem._id
                    }?${params.toString()}`
                  );
                }}
              />
            );
          })
        )}
      </div>

      {/* OPTIMIZATION: Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
          <button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1);
              const params = new URLSearchParams(window.location.search);
              params.set("page", newPage.toString());
              navigate({ search: params.toString() });
              setCurrentPage(newPage);
            }}
            disabled={currentPage === 1}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-[rgba(0,0,0,0.80)] text-[#767676] cursor-not-allowed opacity-50 border border-[#767676]"
                : "bg-[#FF479C] text-[#282828] hover:opacity-90"
            }`}
          >
            Previous
          </button>

          <span className="text-sm sm:text-base text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => {
              const newPage = Math.min(currentPage + 1, totalPages);
              const params = new URLSearchParams(window.location.search);
              params.set("page", newPage.toString());
              navigate({ search: params.toString() });
              setCurrentPage(newPage);
            }}
            disabled={currentPage === totalPages}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
              currentPage === totalPages
                ? "bg-[rgba(0,0,0,0.80)] text-[#767676] cursor-not-allowed opacity-50 border border-[#767676]"
                : "bg-[#FF479C] text-[#282828] hover:opacity-90"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Components;

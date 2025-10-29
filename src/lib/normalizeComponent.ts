// Utility to normalize component data from backend for both detail and card views
export interface NormalizedComponent {
  id: string;
  name: string;
  title?: string;
  type?: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  html?: string;
  htmlCode?: string;
  css?: string;
  cssCode?: string;
  js?: string;
  react?: string;
  tailwind?: string;
  tailwindCode?: string;
  preview?: string;
  technology?: string;
  createdBy?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    avatar?: string;
    profilePicture?: string;
    picture?: string;
    image?: string;
  };
  creatorStatus?: "original" | "found" | "modified";
  likeCount?: number;
  likedBy?: string[];
  commentCount?: number;
  comments?: Array<{ id: string; text: string }>;
  views?: number;
  /** True if this component is scraped/anonymous (not user-uploaded) */
  isScraped?: boolean;
  isAnonymous?: boolean;
}

type RawComponent = Record<string, any>;

/**
 * Normalize a raw backend component object to a consistent structure.
 * Handles legacy, scraped, and new formats.
 */
export function normalizeComponentData(raw: RawComponent): NormalizedComponent {
  // ID
  const id =
    String(
      raw._id ||
      raw.id ||
      (raw.component && (raw.component._id || raw.component.id)) ||
      ""
    );

  // Name/title
  const name = raw.name || raw.title || (raw.component && (raw.component.name || raw.component.title)) || "Untitled";
  const title = raw.title || raw.name || (raw.component && (raw.component.title || raw.component.name)) || "Untitled";
  const type = raw.type || (raw.component && raw.component.type) || "component";

  // Language/technology
  let language =
    raw.language ||
    raw.technology ||
    (raw.component && (raw.component.language || raw.component.technology)) ||
    "";

  // Code fields
  let code =
    raw.code ||
    raw.htmlCode ||
    raw.tailwindCode ||
    raw.cssCode ||
    (raw.component && (raw.component.code || raw.component.htmlCode || raw.component.tailwindCode || raw.component.cssCode)) ||
    "";

  // Fallbacks for language
  if (!language || language.trim() === "") {
    if (raw.tailwindCode || (raw.component && raw.component.tailwindCode)) {
      language = "tailwind";
    } else if (
      (raw.htmlCode && raw.cssCode) ||
      (raw.component && raw.component.htmlCode && raw.component.cssCode)
    ) {
      language = "css";
    } else if (raw.htmlCode || (raw.component && raw.component.htmlCode)) {
      language = "html";
    } else if (raw.cssCode || (raw.component && raw.component.cssCode)) {
      language = "css";
    }
  }

  // Fallbacks for code
  if ((!code || code.trim() === "") && (raw.htmlCode || (raw.component && raw.component.htmlCode))) {
    code = raw.htmlCode || (raw.component && raw.component.htmlCode) || "";
    if (!language) language = "html";
  }
  if ((!code || code.trim() === "") && (raw.tailwindCode || (raw.component && raw.component.tailwindCode))) {
    code = raw.tailwindCode || (raw.component && raw.component.tailwindCode) || "";
    if (!language) language = "tailwind";
  }
  if ((!code || code.trim() === "") && (raw.cssCode || (raw.component && raw.component.cssCode))) {
    code = raw.cssCode || (raw.component && raw.component.cssCode) || "";
    if (!language) language = "css";
  }

  // HTML/CSS/Tailwind fields (for detail view)
  const html =
    raw.html ||
    raw.htmlCode ||
    (raw.component && (raw.component.html || raw.component.htmlCode)) ||
    "";
  const htmlCode =
    raw.htmlCode ||
    raw.html ||
    (raw.component && (raw.component.htmlCode || raw.component.html)) ||
    "";
  const css =
    raw.css ||
    raw.cssCode ||
    (raw.component && (raw.component.css || raw.component.cssCode)) ||
    "";
  const cssCode =
    raw.cssCode ||
    raw.css ||
    (raw.component && (raw.component.cssCode || raw.component.css)) ||
    "";
  const tailwind =
    raw.tailwind ||
    raw.tailwindCode ||
    (raw.component && (raw.component.tailwind || raw.component.tailwindCode)) ||
    "";
  const tailwindCode =
    raw.tailwindCode ||
    raw.tailwind ||
    (raw.component && (raw.component.tailwindCode || raw.component.tailwind)) ||
    "";

  // Other fields
  const description =
    raw.description ||
    (raw.component && raw.component.description) ||
    "";
  const tags =
    raw.tags ||
    (raw.component && raw.component.tags) ||
    [];
  const preview =
    raw.preview ||
    (raw.component && raw.component.preview) ||
    "";
  const technology =
    raw.technology ||
    (raw.component && raw.component.technology) ||
    "";

  // createdBy normalization
  const createdByRaw = raw.createdBy || (raw.component && raw.component.createdBy) || {};
  const createdBy = createdByRaw
    ? {
        _id: createdByRaw._id || createdByRaw.id,
        id: createdByRaw.id || createdByRaw._id,
        name: createdByRaw.name,
        email: createdByRaw.email,
        username: createdByRaw.username,
        avatar:
          createdByRaw.profilePicture ||
          createdByRaw.avatar ||
          createdByRaw.picture ||
          createdByRaw.image ||
          "",
        profilePicture: createdByRaw.profilePicture,
        picture: createdByRaw.picture,
        image: createdByRaw.image,
      }
    : undefined;

  // Stats
  const likeCount =
    raw.likeCount ||
    (raw.component && raw.component.likeCount) ||
    0;
  const likedBy =
    raw.likedBy ||
    (raw.component && raw.component.likedBy) ||
    [];
  const commentCount =
    raw.commentCount ||
    (raw.component && raw.component.commentCount) ||
    0;
  const comments =
    raw.comments ||
    (raw.component && raw.component.comments) ||
    [];
  const views =
    raw.views ||
    (raw.component && raw.component.views) ||
    0;

  // Creator status
  const creatorStatus =
    raw.creatorStatus ||
    (raw.component && raw.component.creatorStatus);

  // JS/React fields (for completeness)
  const js =
    raw.js ||
    (raw.component && raw.component.js) ||
    "";
  const react =
    raw.react ||
    (raw.component && raw.component.react) ||
    "";

  // Determine if scraped/anonymous (not user-uploaded)
  const isScraped =
    (!createdBy || !createdBy._id) ||
    (typeof raw.isScraped === "boolean" ? raw.isScraped : false) ||
    (typeof raw.scraped === "boolean" ? raw.scraped : false) ||
    (typeof raw.isAnonymous === "boolean" ? raw.isAnonymous : false);

  const isAnonymous =
    isScraped ||
    (typeof raw.isAnonymous === "boolean" ? raw.isAnonymous : false);

  return {
    id,
    name,
    title,
    type,
    code,
    language,
    description,
    tags,
    html,
    htmlCode,
    css,
    cssCode,
    js,
    react,
    tailwind,
    tailwindCode,
    preview,
    technology,
    createdBy,
    creatorStatus,
    likeCount,
    likedBy,
    commentCount,
    comments,
    views,
    isScraped,
    isAnonymous,
  };
}
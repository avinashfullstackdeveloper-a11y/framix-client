// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";

// import { useNavigate } from "react-router-dom";

// const Templates = () => {
//   // Updated to include video paths
//   const featuredTemplates = [
//     {
//       title: "Orna Villas",
//       views: "55.5k",
//       video: "/assets/videos/a.mp4",
//       category: "Website",
//     },
//     {
//       title: "Aperture Labs",
//       views: "5.5k",
//       video: "/assets/videos/b.mp4",
//       category: "App",
//     },
//     {
//       title: "Chroma Gallery",
//       views: "12.5k",
//       video: "/assets/videos/c.mp4",
//       category: "Design",
//     },
//     {
//       title: "Zenith Motion",
//       views: "22.5k",
//       video: "/assets/videos/d.mp4",
//       category: "Portfolio",
//     },
//   ];

//   // Updated to include video paths
//   const allTemplates = [
//     {
//       title: "Financial Dashboard",
//       description: "Modern banking interface with real-time analytics",
//       video: "/assets/videos/p1.mp4",
//       category: "Dashboard",
//     },
//     {
//       title: "Minimalist Portfolio",
//       description: "Clean and elegant personal portfolio design",
//       video: "/assets/videos/p2.mp4",
//       category: "Portfolio",
//     },
//     {
//       title: "E-commerce Platform",
//       description: "Full-featured online store with modern UI",
//       video: "/assets/videos/p3.mp4",
//       category: "E-commerce",
//     },
//     {
//       title: "Social Media App",
//       description: "Interactive social platform with engaging features",
//       video: "/assets/videos/p4.mp4",
//       category: "Social",
//     },
//     {
//       title: "Design System",
//       description: "Comprehensive component library and guidelines",
//       video: "/assets/videos/p5.mp4",
//       category: "Design System",
//     },
//     {
//       title: "Analytics Dashboard",
//       description: "Data visualization and reporting platform",
//       video: "/assets/videos/p6.mp4",
//       category: "Analytics",
//     },
//   ];

//   const navigate = useNavigate();

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-16">
//         <h1 className="text-5xl font-bold mb-6">
//           Desigend by <span className="text-primary">Framix</span>, Made for{" "}
//           <br />
//           <div className="text-primary mt-4">Designers</div>
//         </h1>
//         <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//           Explore hand-crafted UI templates and motion kits built with
//           precision. Copy instantly or purchase full-featured designs made by
//           our in-house creators.
//         </p>
//         <div className="flex justify-center mt-6">
//           <button
//             className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-opacity flex items-center justify-center"
//             onClick={() => navigate("/upload-template")}
//           >
//             Upload Templates
//           </button>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="mb-16">
//         <h2 className="text-3xl font-bold mb-8">Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {featuredTemplates.map((template, index) => (
//             <Link to={`/templates/${template.title}`} key={index}>
//               <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
//                 <CardContent className="p-0">
//                   <div className="aspect-video rounded-t-lg relative overflow-hidden">
//                     <video
//                       src={template.video}
//                       autoPlay
//                       loop
//                       muted
//                       playsInline
//                       className="absolute inset-0 w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <div className="absolute bottom-4 left-4 right-4">
//                       <h3 className="font-semibold text-lg text-white">
//                         {template.title}
//                       </h3>
//                     </div>
//                   </div>
//                   <div className="px-4 pb-4 pt-4">
//                     <div className="flex items-center justify-between">
//                       <Badge variant="secondary" className="bg-secondary/50">
//                         {template.category}
//                       </Badge>
//                       <span className="text-sm text-muted-foreground flex items-center gap-1">
//                         👁 {template.views}
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* All Projects Section */}
//       <div>
//         <h2 className="text-3xl font-bold mb-8">Templates</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {allTemplates.map((template, index) => (
//             <Link to={`/templates/${template.title}`} key={index}>
//               <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 cursor-pointer group">
//                 <CardContent className="p-0">
//                   <div className="aspect-video rounded-t-lg relative overflow-hidden">
//                     <video
//                       src={template.video}
//                       autoPlay
//                       loop
//                       muted
//                       playsInline
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="p-6">
//                     <Badge variant="secondary" className="bg-secondary/50 mb-3">
//                       {template.category}
//                     </Badge>
//                     <h3 className="font-semibold text-xl mb-2">
//                       {template.title}
//                     </h3>
//                     <p className="text-muted-foreground text-sm">
//                       {template.description}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="text-center mt-20 py-16 bg-gradient-card rounded-2xl border border-border">
//         <h2 className="text-3xl font-bold mb-4">
//           Ready to build your next project?
//         </h2>
//         <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
//           Join thousands of developers and designers who use Framix to create
//           amazing products faster than ever before.
//         </p>
//         <div className="flex gap-4 justify-center">
//           <button className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-opacity">
//             Start Building
//           </button>
//           <button className="border border-border hover:bg-secondary px-8 py-3 rounded-lg font-medium transition-colors">
//             View Templates
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Templates;

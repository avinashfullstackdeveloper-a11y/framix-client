// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// const Pricing = () => {
//   return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold mb-6">
//             Choose your <span className="text-primary">Framix</span> Plan
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             Start free and upgrade as your team grows. All plans include our core component library.
//           </p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
//           {/* Free Plan */}
//           <Card className="bg-gradient-card border-border p-8 relative">
//             <CardContent className="p-0">
//               <div className="mb-6">
//                 <Badge variant="secondary" className="bg-secondary/50 mb-4">
//                   Free
//                 </Badge>
//                 <div className="flex items-baseline gap-2 mb-2">
//                   <span className="text-5xl font-bold">₹ 0</span>
//                 </div>
//                 <p className="text-muted-foreground text-sm">per person / per month</p>
//               </div>

//               <div className="space-y-4 mb-8">
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                   <span className="text-muted-foreground">Premium components</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                   <span className="text-muted-foreground">Exclusive Access</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                   <span className="text-muted-foreground">100+ basic components</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                   <span className="text-muted-foreground">Community support</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                   <span className="text-muted-foreground">3 UI kit downloads per month</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
//                   <span className="text-muted-foreground">100+ basic components</span>
//                 </div>
//               </div>

//               <Button 
//                 variant="outline" 
//                 className="w-full border-border hover:bg-secondary py-3"
//                 size="lg"
//               >
//                 Get Started for free
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Premium Plan */}
//           <Card className="bg-gradient-card border-border p-8 relative">
//             <CardContent className="p-0">
//               <div className="mb-6">
//                 <Badge className="bg-gradient-primary border-0 mb-4">
//                   PREMIUM ⚡
//                 </Badge>
//                 <div className="flex items-baseline gap-2 mb-2">
//                   <span className="text-5xl font-bold">₹ 99</span>
//                 </div>
//                 <p className="text-muted-foreground text-sm">per person / per month</p>
//               </div>

//               <div className="space-y-4 mb-8">
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <span>500+ Ready-to-Use Components</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <span>Extensive Component Library</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <span>Chrome extension</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <span>Theme customization</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <span>Lifetime access</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 rounded-full bg-primary"></div>
//                   <span>Custom domain</span>
//                 </div>
//               </div>

//               <Button 
//                 className="w-full bg-gradient-primary hover:opacity-90 border-0 py-3"
//                 size="lg"
//               >
//                 Upgrade to PRO
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Feature Comparison */}
//         <div className="mt-20">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Everything you need to build faster
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: "🎨",
//                 title: "Design Systems",
//                 description: "Comprehensive design tokens and component libraries that ensure consistency across all your projects."
//               },
//               {
//                 icon: "⚡",
//                 title: "Lightning Fast",
//                 description: "Pre-built components that are optimized for performance and ready to use in production."
//               },
//               {
//                 icon: "🔧",
//                 title: "Developer Friendly",
//                 description: "Clean code, TypeScript support, and excellent documentation to get you started quickly."
//               }
//             ].map((feature, index) => (
//               <Card key={index} className="bg-gradient-card border-border p-6 text-center">
//                 <CardContent className="p-0">
//                   <div className="text-4xl mb-4">{feature.icon}</div>
//                   <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
//                   <p className="text-muted-foreground">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="mt-20 text-center">
//           <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
//           <div className="max-w-3xl mx-auto space-y-6">
//             {[
//               {
//                 question: "What's included in the free plan?",
//                 answer: "The free plan includes access to 100+ basic components, community support, and 3 UI kit downloads per month."
//               },
//               {
//                 question: "Can I upgrade or downgrade anytime?",
//                 answer: "Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle."
//               },
//               {
//                 question: "Do you offer team discounts?",
//                 answer: "Yes, we offer special pricing for teams of 5 or more. Contact our sales team for custom pricing."
//               }
//             ].map((faq, index) => (
//               <Card key={index} className="bg-gradient-card border-border p-6 text-left">
//                 <CardContent className="p-0">
//                   <h3 className="font-semibold mb-2">{faq.question}</h3>
//                   <p className="text-muted-foreground">{faq.answer}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//   );
// };

// export default Pricing;
// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
// import { 
//   Bell, 
//   CheckCircle, 
//   AlertTriangle, 
//   Info, 
//   X, 
//   Trash2,
//   CheckCheck,
//   Settings,
//   Filter
// } from "lucide-react";

// type NotificationType = "success" | "warning" | "info" | "error";

// interface Notification {
//   _id: string;
//   title: string;
//   message: string;
//   type: NotificationType;
//   read: boolean;
//   createdAt: string;
//   actionUrl?: string;
// }

// const NotificationsPage: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<"all" | "unread">("all");
//   const { toast } = useToast();

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     const mockNotifications: Notification[] = [
//       {
//         _id: "1",
//         title: "New Component Uploaded",
//         message: "A new button component was successfully uploaded to the showcase.",
//         type: "success",
//         read: false,
//         createdAt: new Date().toISOString(),
//         actionUrl: "/admin/components"
//       },
//       {
//         _id: "2",
//         title: "User Registration",
//         message: "New user 'john_doe' has registered and is awaiting approval.",
//         type: "info",
//         read: false,
//         createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//         actionUrl: "/admin/user-queue"
//       },
//       {
//         _id: "3",
//         title: "System Warning",
//         message: "Storage usage is at 85% capacity. Consider cleaning up old files.",
//         type: "warning",
//         read: true,
//         createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         _id: "4",
//         title: "Payment Processed",
//         message: "Monthly subscription payment has been successfully processed.",
//         type: "success",
//         read: true,
//         createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         _id: "5",
//         title: "API Error",
//         message: "Failed to fetch user data from the server. Please check API connectivity.",
//         type: "error",
//         read: false,
//         createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
//       }
//     ];

//     setNotifications(mockNotifications);
//     setLoading(false);
//   }, []);

//   const getNotificationIcon = (type: NotificationType) => {
//     switch (type) {
//       case "success":
//         return <CheckCircle className="w-5 h-5 text-green-400" />;
//       case "warning":
//         return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
//       case "error":
//         return <X className="w-5 h-5 text-red-400" />;
//       case "info":
//         return <Info className="w-5 h-5 text-blue-400" />;
//       default:
//         return <Bell className="w-5 h-5 text-[#FF479C]" />;
//     }
//   };

//   const getTypeColor = (type: NotificationType) => {
//     switch (type) {
//       case "success":
//         return "bg-green-500/10 text-green-400 border-green-500/30";
//       case "warning":
//         return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
//       case "error":
//         return "bg-red-500/10 text-red-400 border-red-500/30";
//       case "info":
//         return "bg-blue-500/10 text-blue-400 border-blue-500/30";
//       default:
//         return "bg-[#3A3A3A] text-[#767676] border-[#3A3A3A]";
//     }
//   };

//   const markAsRead = (id: string) => {
//     setNotifications(prev =>
//       prev.map(notification =>
//         notification._id === id ? { ...notification, read: true } : notification
//       )
//     );
//     toast({
//       title: "Notification marked as read",
//       variant: "default",
//     });
//   };

//   const markAllAsRead = () => {
//     setNotifications(prev =>
//       prev.map(notification => ({ ...notification, read: true }))
//     );
//     toast({
//       title: "All notifications marked as read",
//       variant: "default",
//     });
//   };

//   const deleteNotification = (id: string) => {
//     setNotifications(prev => prev.filter(notification => notification._id !== id));
//     toast({
//       title: "Notification deleted",
//       variant: "default",
//     });
//   };

//   const clearAllNotifications = () => {
//     if (window.confirm("Are you sure you want to clear all notifications?")) {
//       setNotifications([]);
//       toast({
//         title: "All notifications cleared",
//         variant: "default",
//       });
//     }
//   };

//   const filteredNotifications = notifications.filter(notification =>
//     filter === "all" ? true : !notification.read
//   );

//   const unreadCount = notifications.filter(n => !n.read).length;

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//         <div className="text-center text-white">Loading notifications...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//       {/* Header */}
//       <div className="text-center mb-8 sm:mb-12">
//         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
//           <span className="text-[#FF479C]">Notifications</span> Center
//         </h1>
//         <p className="text-base sm:text-lg lg:text-xl text-[#767676] max-w-3xl mx-auto px-4">
//           Stay updated with system alerts, user activities, and important announcements.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300 group">
//           <div className="flex justify-center mb-3">
//             <Bell className="w-8 h-8 text-[#FF479C] group-hover:scale-110 transition-transform" />
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-1">{notifications.length}</h3>
//           <p className="text-sm text-[#767676]">Total Notifications</p>
//         </div>
        
//         <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300 group">
//           <div className="flex justify-center mb-3">
//             <AlertTriangle className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-1">{unreadCount}</h3>
//           <p className="text-sm text-[#767676]">Unread</p>
//         </div>
        
//         <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300 group">
//           <div className="flex justify-center mb-3">
//             <CheckCircle className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-1">
//             {notifications.filter(n => n.type === 'success').length}
//           </h3>
//           <p className="text-sm text-[#767676]">Success</p>
//         </div>
        
//         <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 text-center hover:border-[#FF479C] transition-all duration-300 group">
//           <div className="flex justify-center mb-3">
//             <Settings className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-1">
//             {notifications.filter(n => n.type === 'warning' || n.type === 'error').length}
//           </h3>
//           <p className="text-sm text-[#767676]">Alerts</p>
//         </div>
//       </div>

//       {/* Controls Bar */}
//       <div className="bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl p-6 mb-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div className="flex items-center gap-4">
//             <h2 className="text-xl font-bold text-white flex items-center gap-2">
//               <Filter className="w-5 h-5 text-[#FF479C]" />
//               Filter Notifications
//             </h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setFilter("all")}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
//                   filter === "all"
//                     ? "bg-[#FF479C] border-[#FF479C] text-[#282828]"
//                     : "bg-[#3A3A3A] border-[#3A3A3A] text-white hover:border-[#FF479C]"
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => setFilter("unread")}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
//                   filter === "unread"
//                     ? "bg-[#FF479C] border-[#FF479C] text-[#282828]"
//                     : "bg-[#3A3A3A] border-[#3A3A3A] text-white hover:border-[#FF479C]"
//                 }`}
//               >
//                 Unread
//               </button>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               onClick={markAllAsRead}
//               disabled={unreadCount === 0}
//               className="bg-[#3A3A3A] hover:bg-[#FF479C] hover:text-[#282828] text-white border border-[#3A3A3A] hover:border-[#FF479C] transition-all duration-300 flex items-center gap-2"
//             >
//               <CheckCheck className="w-4 h-4" />
//               Mark All Read
//             </Button>
//             <Button
//               onClick={clearAllNotifications}
//               disabled={notifications.length === 0}
//               className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 flex items-center gap-2"
//             >
//               <Trash2 className="w-4 h-4" />
//               Clear All
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Notifications List */}
//       <div className="space-y-4">
//         {filteredNotifications.length === 0 ? (
//           <div className="text-center py-16 bg-[rgba(0,0,0,0.80)] border border-[#3A3A3A] rounded-2xl">
//             <Bell className="w-16 h-16 text-[#767676] mx-auto mb-4" />
//             <p className="text-[#767676] text-lg">No notifications found</p>
//             <p className="text-[#767676] text-sm mt-1">
//               {filter === "unread" ? "You're all caught up!" : "No notifications to display"}
//             </p>
//           </div>
//         ) : (
//           filteredNotifications.map((notification) => (
//             <div
//               key={notification._id}
//               className={`bg-[rgba(0,0,0,0.80)] border rounded-2xl p-6 transition-all duration-300 group hover:border-[#FF479C] hover:shadow-[0_0_20px_rgba(255,154,201,0.3)] ${
//                 notification.read 
//                   ? "border-[#3A3A3A]" 
//                   : "border-[#FF479C] bg-[#1A1A1A]"
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-4 flex-1">
//                   <div className="mt-1">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className={`text-lg font-semibold ${
//                         notification.read ? "text-white" : "text-[#FF479C]"
//                       }`}>
//                         {notification.title}
//                       </h3>
//                       <Badge className={getTypeColor(notification.type)}>
//                         {notification.type}
//                       </Badge>
//                       {!notification.read && (
//                         <Badge className="bg-[#FF479C] text-[#282828]">
//                           New
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-[#767676] mb-3">
//                       {notification.message}
//                     </p>
//                     <div className="flex items-center gap-4 text-sm text-[#767676]">
//                       <span>
//                         {new Date(notification.createdAt).toLocaleDateString()} •{" "}
//                         {new Date(notification.createdAt).toLocaleTimeString()}
//                       </span>
//                       {notification.actionUrl && (
//                         <button className="text-[#FF479C] hover:text-white transition-colors">
//                           View Details →
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   {!notification.read && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => markAsRead(notification._id)}
//                       className="text-green-400 hover:text-green-300 hover:bg-green-500/10 p-2"
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                     </Button>
//                   )}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => deleteNotification(notification._id)}
//                     className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;
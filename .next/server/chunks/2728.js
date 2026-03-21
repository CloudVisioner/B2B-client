"use strict";exports.id=2728,exports.ids=[2728],exports.modules={5027:(e,t,a)=>{a.d(t,{Fc:()=>d,GF:()=>l,Io:()=>s,VZ:()=>i,g$:()=>n,lv:()=>o});var r=a(9114);let i=(0,r.gql)`
  query GetMyNotifications($input: NotificationInquiry!) {
    getMyNotifications(input: $input) {
      list {
        _id
        type
        message
        read
        relatedQuoteId
        senderUserId
        receiverUserId
        createdAt
        updatedAt
        senderUserData {
          _id
          userNick
          userEmail
        }
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetMyNotificationsSafe($input: NotificationInquiry!) {
    getMyNotifications(input: $input) {
      list {
        _id
        type
        message
        read
        relatedQuoteId
        senderUserId
        receiverUserId
        createdAt
        updatedAt
        senderUserData {
          _id
          userNick
          userEmail
        }
      }
      metaCounter {
        total
      }
    }
  }
`;let s=(0,r.gql)`
  query GetUnreadNotificationCount($input: NotificationInquiry) {
    getUnreadNotificationCount(input: $input)
  }
`,l=(0,r.gql)`
  mutation MarkNotificationAsRead($notificationId: String!) {
    markNotificationAsRead(notificationId: $notificationId) {
      _id
      type
      message
      read
      relatedQuoteId
      createdAt
      updatedAt
    }
  }
`,o=(0,r.gql)`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`,n=(0,r.gql)`
  mutation DeleteNotification($notificationId: String!) {
    deleteNotification(notificationId: $notificationId) {
      _id
    }
  }
`,d=(0,r.gql)`
  mutation DeleteAllNotifications {
    deleteAllNotifications
  }
`},2728:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{L:()=>x});var i=a(997),s=a(6689),l=a(1163),o=a(9114),n=a(5027),d=a(5e3),c=a(1067),u=e([c]);c=(u.then?(await u)():u)[0];let x=({userId:e,userRole:t})=>{let a=(0,l.useRouter)(),[r,u]=(0,s.useState)(!1),x=(0,s.useRef)(null),m=(0,s.useRef)(null),h=(()=>{if(e&&e.trim()&&24===e.length)return e;let t=(0,c.rS)();if(t)try{let e=(0,c.xp)(t),a=e?._id||e?.userId;if(a&&a.trim()&&24===a.length)return a}catch(e){}return null})(),{data:p}=(0,o.useQuery)(n.Io,{skip:!(0,c.jl)()||!h,variables:{input:{page:1,limit:1,search:{read:!1,type:null}}},fetchPolicy:"cache-and-network",pollInterval:3e4,context:{headers:(0,c.jl)()?(0,d.w)():{}},errorPolicy:"all"}),{data:f,loading:g,error:b,refetch:y}=(0,o.useQuery)(n.VZ,{skip:!(0,c.jl)()||!h,variables:{input:{page:1,limit:50,search:{read:null,type:null}}},fetchPolicy:"network-only",pollInterval:3e4,context:{headers:(0,c.jl)()?(0,d.w)():{}},errorPolicy:"all",notifyOnNetworkStatusChange:!0});(0,s.useEffect)(()=>{b&&console.warn("Notification query error (handled gracefully):",b)},[b]);let[v]=(0,o.useMutation)(n.GF,{context:{headers:(0,c.jl)()?(0,d.w)():{}},refetchQueries:[{query:n.VZ,variables:{input:{page:1,limit:50,search:{read:null,type:null}}}},{query:n.Io,variables:{input:{page:1,limit:1,search:{read:!1,type:null}}}}],awaitRefetchQueries:!0}),[k]=(0,o.useMutation)(n.lv,{context:{headers:(0,c.jl)()?(0,d.w)():{}},refetchQueries:[{query:n.VZ,variables:{input:{page:1,limit:50,search:{read:null,type:null}}}},{query:n.Io,variables:{input:{page:1,limit:1,search:{read:!1,type:null}}}}],awaitRefetchQueries:!0}),[N]=(0,o.useMutation)(n.g$,{context:{headers:(0,c.jl)()?(0,d.w)():{}},refetchQueries:[{query:n.VZ,variables:{input:{page:1,limit:50,search:{read:null,type:null}}}},{query:n.Io,variables:{input:{page:1,limit:1,search:{read:!1,type:null}}}}],awaitRefetchQueries:!0}),j=(0,s.useMemo)(()=>{if(!f)return[];let e=[];return f?.getMyNotifications?.list?e=f.getMyNotifications.list:Array.isArray(f)&&(e=f),e.filter(e=>e&&e._id).map(e=>({...e,type:e.type||"QUOTE_SENT",message:e.message||"Notification",read:e.read??!1,createdAt:e.createdAt||new Date().toISOString()}))},[f]),w=j.filter(e=>!e.read).length,E=p?.getUnreadNotificationCount??w;(0,s.useEffect)(()=>{let e=e=>{x.current&&!x.current.contains(e.target)&&m.current&&!m.current.contains(e.target)&&u(!1)};if(r)return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[r]);let I=async e=>{if(!e.read)try{await v({variables:{notificationId:e._id}})}catch(e){console.error("Failed to mark notification as read:",e)}e.relatedQuoteId&&("BUYER"===t||"buyer"===t?a.push(`/service-requests?quoteId=${e.relatedQuoteId}`):"PROVIDER"===t||"provider"===t?a.push(`/provider/jobs?quoteId=${e.relatedQuoteId}`):a.push(`/service-requests?quoteId=${e.relatedQuoteId}`)),u(!1)},q=async(e,t)=>{e.stopPropagation();try{await N({variables:{notificationId:t}})}catch(e){console.error("Failed to delete notification:",e)}},Q=async()=>{try{await k(),y&&await y()}catch(e){console.error("Failed to mark all as read:",e)}},_=j.filter(e=>!e.read).slice(0,5),C=E>0;return(0,i.jsxs)("div",{className:"relative",children:[(0,i.jsxs)("button",{ref:m,onClick:()=>{u(!r)},className:"relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl active:scale-95",children:[i.jsx("span",{className:`material-symbols-outlined text-xl transition-all duration-300 ${r?"rotate-12 scale-110":"hover:scale-110"}`,children:"notifications"}),C&&(0,i.jsxs)("span",{className:"absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-2 border-white dark:border-slate-900 shadow-lg",children:[i.jsx("span",{className:"absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-75"}),E>0&&E<=99&&i.jsx("span",{className:"absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900",children:E>9?"9+":E})]})]}),r&&(0,i.jsxs)(i.Fragment,{children:[i.jsx("div",{className:"fixed inset-0 z-[99998]",onClick:()=>u(!1)}),(0,i.jsxs)("div",{ref:x,className:"fixed right-4 top-20 w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-[99999] animate-in slide-in-from-top-3 fade-in duration-300",style:{boxShadow:"0 25px 80px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",fontFamily:"'Inter', sans-serif"},children:[(0,i.jsxs)("div",{className:"px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50",children:[(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[i.jsx("div",{className:"w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center",children:i.jsx("span",{className:"material-symbols-outlined text-white text-sm",children:"notifications"})}),i.jsx("h3",{className:"text-sm font-semibold text-slate-900 dark:text-white",children:"Notifications"}),E>0&&i.jsx("span",{className:"px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full",children:E})]}),C&&_.length>0&&(0,i.jsxs)("button",{onClick:e=>{e.stopPropagation(),Q()},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5",children:[i.jsx("span",{className:"material-symbols-outlined text-sm",children:"done_all"}),"Mark all as read"]})]}),i.jsx("div",{className:"max-h-[480px] overflow-y-auto custom-scrollbar",children:g?(0,i.jsxs)("div",{className:"px-5 py-8 text-center",children:[i.jsx("div",{className:"w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-3 flex items-center justify-center",children:i.jsx("span",{className:"material-symbols-outlined text-slate-400 text-lg animate-spin",children:"sync"})}),i.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400",children:"Loading..."})]}):b?(0,i.jsxs)("div",{className:"px-5 py-8 text-center",children:[i.jsx("div",{className:"w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-3 flex items-center justify-center",children:i.jsx("span",{className:"material-symbols-outlined text-red-500 text-lg",children:"error"})}),i.jsx("p",{className:"text-xs text-red-500 dark:text-red-400 font-medium",children:"Failed to load notifications"}),i.jsx("button",{onClick:()=>y(),className:"mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline",children:"Retry"})]}):0===_.length?(0,i.jsxs)("div",{className:"px-5 py-12 text-center",children:[i.jsx("div",{className:"w-16 h-16 mx-auto mb-3 opacity-20",children:i.jsx("svg",{viewBox:"0 0 24 24",fill:"none",className:"w-full h-full text-slate-400",children:i.jsx("path",{d:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}),i.jsx("p",{className:"text-sm font-medium text-slate-500 dark:text-slate-400",children:"You're all caught up"}),i.jsx("p",{className:"text-xs text-slate-400 dark:text-slate-500 mt-1",children:"No new notifications"})]}):i.jsx("div",{className:"divide-y divide-slate-200/50 dark:divide-slate-700/50",children:_.map(e=>i.jsx("div",{className:"group relative",children:(0,i.jsxs)("button",{onClick:()=>I(e),className:"w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-white dark:hover:from-slate-800/50 dark:hover:to-slate-900/50 transition-all relative",children:[!e.read&&i.jsx("div",{className:"absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r-full"}),(0,i.jsxs)("div",{className:"flex items-start gap-4",children:[i.jsx("div",{className:`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${"QUOTE_ACCEPTED"===e.type?"bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40":"QUOTE_REJECTED"===e.type?"bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40":"QUOTE_SENT"===e.type?"bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40":"bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900/40 dark:to-slate-800/40"}`,children:i.jsx("span",{className:`material-symbols-outlined text-base ${"QUOTE_ACCEPTED"===e.type?"text-emerald-600 dark:text-emerald-400":"QUOTE_REJECTED"===e.type?"text-red-600 dark:text-red-400":"QUOTE_SENT"===e.type?"text-amber-600 dark:text-amber-400":"text-slate-600 dark:text-slate-400"}`,children:"QUOTE_ACCEPTED"===e.type?"check_circle":"QUOTE_REJECTED"===e.type?"cancel":"QUOTE_SENT"===e.type?"request_quote":"notifications"})}),(0,i.jsxs)("div",{className:"flex-1 min-w-0",children:[i.jsx("p",{className:`text-sm leading-relaxed mb-1 ${e.read?"text-slate-600 dark:text-slate-400":"text-slate-900 dark:text-white font-semibold"}`,children:e.message}),(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[i.jsx("p",{className:"text-xs text-slate-400 dark:text-slate-500",children:new Date(e.createdAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}),i.jsx("span",{className:"text-slate-300 dark:text-slate-600",children:"•"}),i.jsx("p",{className:"text-xs text-slate-400 dark:text-slate-500",children:new Date(e.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})})]})]}),i.jsx("button",{onClick:t=>q(t,e._id),className:"flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300",title:"Delete notification",children:i.jsx("span",{className:"material-symbols-outlined text-base",children:"delete"})}),!e.read&&i.jsx("div",{className:"flex-shrink-0 w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mt-1.5 shadow-sm"})]})]})},e._id))})}),_.length>0&&i.jsx("div",{className:"px-6 py-3 border-t border-slate-100 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50",children:(0,i.jsxs)("button",{onClick:()=>{u(!1),a.push("/notifications")},className:"w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 group",children:["View all notifications",i.jsx("span",{className:"material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5",children:"arrow_forward"})]})})]})]})]})};r()}catch(e){r(e)}})}};
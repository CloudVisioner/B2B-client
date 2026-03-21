exports.id=6814,exports.ids=[6814],exports.modules={3562:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{let p;r.d(t,{U:()=>g,i:()=>c});var i=r(9114);r(7596),r(3761);var n=r(2024),o=r(4394),s=r(3706),u=r(5e3);r(9641);var d=r(1067),l=e([n,s,d]);[n,s,d]=l.then?(await l)():l;let m=(0,o.onError)(({graphQLErrors:e,networkError:t,operation:r,forward:a})=>{e&&e.forEach(({message:e,locations:t,path:r,extensions:a})=>{e&&e.includes("Expected Iterable")?console.warn(`[GraphQL warning]: Field ${r?.join(".")||"unknown"} returned non-iterable value. This will be normalized to an empty array.`):console.error(`[GraphQL error]: Message: ${e}, Location: ${t}, Path: ${r}`)}),t&&console.error(`[Network error]: ${t}`)}),h=new i.ApolloLink((e,t)=>(e.setContext(({headers:e={}})=>({headers:{...e,...(0,u.w)()}})),t(e))),q=(0,s.createUploadLink)({uri:"http://localhost:4001/graphql",credentials:"include"});function c(e=null){let t=p??new i.ApolloClient({link:i.ApolloLink.from([m,h,q]),cache:new i.InMemoryCache({typePolicies:{Query:{fields:{}},Organization:{fields:{orgSkills:{read:e=>e?Array.isArray(e)?e:"string"==typeof e?[e]:[]:[],merge:(e,t)=>t?Array.isArray(t)?t:"string"==typeof t?[t]:[]:[]},industries:{read:e=>e?Array.isArray(e)?e:"string"==typeof e?[e]:[]:[],merge:(e,t)=>t?Array.isArray(t)?t:"string"==typeof e?[t]:[]:[]}}}}}),defaultOptions:{watchQuery:{fetchPolicy:"cache-and-network"},query:{fetchPolicy:"network-only"}}});return e&&t.cache.restore(e),t}function g(e){return c(e)}a()}catch(e){a(e)}})},9641:(e,t,r)=>{"use strict";r.d(t,{E_:()=>i});var a=r(9114);let i=(0,a.makeVar)({});(0,a.makeVar)("light"),(0,a.makeVar)(void 0)},6049:(e,t,r)=>{"use strict";r.d(t,{Af:()=>s,Ch:()=>v,F2:()=>y,FU:()=>d,Mc:()=>m,Uz:()=>u,W0:()=>g,Ww:()=>o,bJ:()=>q,es:()=>h,jZ:()=>p,kp:()=>n,qX:()=>c,uJ:()=>x,wl:()=>b,xO:()=>f,ym:()=>i,zh:()=>l});var a=r(9114);let i=(0,a.gql)`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      userNick
      userEmail
      userRole
      userStatus
      userAuthType
      accessToken
      createdAt
    }
  }
`;(0,a.gql)`
  mutation GoogleLogin($token: String!) {
    googleLogIn(token: $token) {
      _id
      memberNick
      memberType
      memberStatus
      memberImage
      accessToken
    }
  }
`;let n=(0,a.gql)`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
      user {
        _id
        userNick
        userEmail
        userRole
        userStatus
        userAuthType
        createdAt
        userOrganization {
          _id
          organizationName
          organizationIndustry
          organizationLocation
          organizationDescription
          organizationWebsiteUrl
          organizationImage
        }
      }
    }
  }
`;(0,a.gql)`
  mutation RequestQuote($input: QuoteRequestInput!) {
    requestQuote(input: $input) {
      _id
      providerId
      buyerId
      status
      message
      createdAt
    }
  }
`,(0,a.gql)`
  mutation BookConsultation($input: ConsultationInput!) {
    bookConsultation(input: $input) {
      _id
      providerId
      buyerId
      scheduledAt
      status
    }
  }
`,(0,a.gql)`
  mutation SignupLegacy($input: MemberInput!) {
    signup(input: $input) {
      _id
      memberNick
      accessToken
    }
  }
`,(0,a.gql)`
  mutation UpdateMember($input: MemberInput!) {
    updateMember(input: $input) {
      _id
      memberNick
    }
  }
`,(0,a.gql)`
  mutation LikeTargetProperty($input: String!) {
    likeTargetProperty(input: $input) {
      _id
    }
  }
`,(0,a.gql)`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      _id
      propertyTitle
    }
  }
`,(0,a.gql)`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
      commentContent
    }
  }
`;let o=(0,a.gql)`
  mutation UpdateMyProfile($input: UserUpdate!) {
    updateUser(input: $input) {
      _id
      userNick
      userEmail
      userPhone
      userImage
      userDescription
      updatedAt
      accessToken
    }
  }
`,s=(0,a.gql)`
  mutation ChangeMyPassword($input: ChangePasswordInput!) {
    changeMyPassword(input: $input)
  }
`,u=(0,a.gql)`
  mutation UploadProfileImage($file: Upload!, $target: String!) {
    imageUploader(file: $file, target: $target)
  }
`,d=(0,a.gql)`
mutation CreateOrUpdateBuyerOrganization($input: BuyerOrganizationInput!) {
  createOrUpdateBuyerOrganization(input: $input) {
    _id
    organizationName
    organizationIndustry
    organizationLocation
    organizationDescription
    organizationImage
    budgetRange
    createdAt
    updatedAt
  }
}
`,l=(0,a.gql)`
 mutation UpdateOrganization($input: OrganizationUpdate!) {
  updateOrganization(input: $input) {
    _id
    organizationName
    organizationIndustry
    organizationLocation
    organizationDescription
    organizationImage
    budgetRange
    createdAt
    updatedAt
  }
}
`,c=(0,a.gql)`
  mutation CreateServiceRequest($input: ServiceRequestInput!) {
    createServiceRequest(input: $input) {
      _id
      reqTitle
      reqDescription
      reqBuyerOrgId
      reqCategory
      reqSubCategory
      reqBudgetRange
      reqDeadline
      reqUrgency
      reqSkillsNeeded
      reqStatus
      createdAt
      updatedAt
    }
  }
`;(0,a.gql)`
  query GetBuyerServiceRequests($input: ServiceRequestFilterInput) {
    getBuyerServiceRequests(input: $input) {
      list {
        _id
        title
        description
        category
        subCategory
        budgetMin
        budgetMax
        deadline
        urgency
        skills
        status
        quotesCount
        newQuotesCount
        organizationId
        buyerId
        providerId
        provider {
          _id
          orgName
          orgAverageRating
          reviewsCount
          avatar
        }
        phase
        createdAt
        updatedAt
      }
      metaCounter {
        total
        open
        inProgress
        closed
        draft
      }
    }
  }
`;let g=(0,a.gql)`
  mutation UpdateServiceRequest($input: ServiceRequestUpdate!) {
    updateServiceRequest(input: $input) {
      _id
      reqTitle
      reqDescription
      reqBuyerOrgId
      reqCategory
      reqSubCategory
      reqBudgetRange
      reqDeadline
      reqUrgency
      reqSkillsNeeded
      reqAttachments
      reqStatus
      reqTotalLikes
      reqTotalViews
      reqTotalQuotes
      reqNewQuotesCount
      reqCreatedByUserId
      createdAt
      updatedAt
    }
  }
`,p=(0,a.gql)`
  mutation UpdateServiceRequestStatus($requestId: String!, $status: ServiceRequestStatus!) {
    updateServiceRequestStatus(requestId: $requestId, status: $status) {
      _id
      reqStatus
      updatedAt
    }
  }
`,m=(0,a.gql)`
  mutation CreateQuote($orgId: String!, $input: QuoteInput!) {
    createQuote(orgId: $orgId, input: $input) {
      _id
      quoteProviderOrgId
      quoteServiceReqId
      quoteCreatedByUserId
      quoteMessage
      quoteAmount
      quoteValidUntil
      quoteStatus
      quoteTotalLikes
      createdAt
      updatedAt
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
      }
    }
  }
`,h=(0,a.gql)`
  mutation AcceptQuote($quoteId: String!) {
    acceptQuote(quoteId: $quoteId) {
      quote {
        _id
        quoteServiceReqId
        quoteProviderOrgId
        quoteMessage
        quoteAmount
        quoteStatus
        createdAt
      }
      serviceRequest {
        _id
        reqTitle
        reqStatus
        reqBuyerOrgId
        createdAt
      }
      order {
        _id
        orderBuyerOrgId
        orderProviderOrgId
        orderServiceReqId
        orderQuoteId
        orderAmount
        orderStatus
        createdAt
      }
    }
  }
`,q=(0,a.gql)`
  mutation RejectQuote($quoteId: String!) {
    rejectQuote(quoteId: $quoteId) {
      _id
      quoteServiceReqId
      quoteProviderOrgId
      quoteMessage
      quoteAmount
      quoteStatus
      createdAt
      updatedAt
    }
  }
`,x=(0,a.gql)`
  mutation UpdateQuote($input: QuoteUpdate!) {
    updateQuote(input: $input) {
      _id
      quoteProviderOrgId
      quoteServiceReqId
      quoteCreatedByUserId
      quoteMessage
      quoteAmount
      quoteValidUntil
      quoteStatus
      quoteTotalLikes
      createdAt
      updatedAt
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
      }
    }
  }
`,f=(0,a.gql)`
  mutation DeleteQuote($quoteId: String!) {
    deleteQuote(quoteId: $quoteId) {
      _id
      quoteStatus
    }
  }
`,y=(0,a.gql)`
  mutation CreateProviderOrgProf($input: ProviderOrganizationInput!) {
    createProviderOrgProf(input: $input) {
      _id
      organizationName
      organizationEmail
      organizationCountry
      organizationDescription
      categoryId
      subCategory
      organizationImage
      minProjectSize
      createdAt
      deletedAt
    }
  }
`,v=(0,a.gql)`
  mutation UpdateProviderOrgProf($input: UpdateProviderOrganizationInput!) {
    updateProviderOrgProf(input: $input) {
      _id
      organizationName
      organizationEmail
      organizationCountry
      organizationDescription
      categoryId
      subCategory
      organizationImage
      minProjectSize
      createdAt
      updatedAt
      deletedAt
    }
  }
`;(0,a.gql)`
  mutation UpdateProviderProfile($input: UpdateProviderProfileInput!) {
    updateProviderProfile(input: $input) {
      _id
      userNick
      userEmail
      userPhone
      userDescription
      userRole
      userStatus
      createdAt
      updatedAt
    }
  }
`,(0,a.gql)`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      _id
      providerOrgId
      buyerId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`,(0,a.gql)`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      _id
      providerOrgId
      buyerId
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;let b=(0,a.gql)`
  mutation RateOrganization($input: RateOrganizationInput!) {
    rateOrganization(input: $input) {
      _id
      orgAverageRating
      reviewsCount
      totalRatingValue
    }
  }
`},5e3:(e,t,r)=>{"use strict";function a(){return{}}r.d(t,{w:()=>a})},1067:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{K4:()=>h,LL:()=>g,VA:()=>c,Wh:()=>x,gS:()=>p,jl:()=>y,ni:()=>f,rS:()=>m,ts:()=>v,xp:()=>l});var i=r(5567),n=r.n(i),o=r(9641),s=r(3562),u=r(6049),d=e([s]);function l(e){try{return n()(e)}catch(e){return console.error("Error decoding JWT:",e),null}}function c(e){return e?e.toUpperCase().trim():""}function g(e){let t=c(e);return"BUYER"===t||"PROVIDER"===t}function p(e){let t=l(e);t&&(0,o.E_)({_id:t._id||t.userId,userRole:t.userRole,userStatus:t.userStatus,userAuthType:t.userAuthType,userEmail:t.userEmail,userPhone:t.userPhone,userNick:t.userNick,userImage:t.userImage,userOrganizationId:t.userOrganizationId,userDescription:t.userDescription,userLanguages:t.userLanguages,accessToken:e,...t})}function m(){return null}async function h(e,t){try{let{jwtToken:r,user:a}=await q({userNick:e,userPassword:t});r&&p(r)}catch(e){throw console.warn("login err",e),Error("Login failed. Please check your credentials.")}}async function q({userNick:e,userPassword:t}){let r=await (0,s.i)();try{let a=await r.mutate({mutation:u.ym,variables:{input:{userNick:e,userPassword:t}},fetchPolicy:"network-only"}),i=a?.data?.login;if(!i?.accessToken)throw Error("No access token received");return(0,o.E_)(i),{jwtToken:i.accessToken,user:i}}catch(t){let e=t?.graphQLErrors?.[0]?.message||t?.message||"Failed to authenticate";throw Error(e)}}async function x(e){try{let t=await (0,s.i)(),r=e.userNick||e.fullName||"",a=e.email||"";if(!r||!a||!e.password)throw Error("Please fill in all required fields");let i={userEmail:a.trim().toLowerCase(),userPassword:e.password,userNick:r.trim(),userRole:e.memberType.toUpperCase()};console.log("Sending signup request:",{input:{...i,userPassword:"***"}});let n=await t.mutate({mutation:u.kp,variables:{input:i},fetchPolicy:"network-only"}),d=n?.data?.signup;if(!d?.accessToken)throw Error("No access token received");let{accessToken:l,user:c}=d;(0,o.E_)({...c,accessToken:l,userOrganization:c?.userOrganization||null})}catch(t){console.error("Signup error details:",{graphQLErrors:t?.graphQLErrors,networkError:t?.networkError,message:t?.message,fullError:t});let e="Signup failed. Please try again.";if(t?.graphQLErrors&&t.graphQLErrors.length>0){let r=t.graphQLErrors[0];e=r.message||e,r.extensions?.exception?.message&&(e=r.extensions.exception.message),r.extensions?.validationErrors&&(e=r.extensions.validationErrors.map(e=>Object.values(e.constraints||{}).join(", ")).join("; ")||e)}else t?.networkError?e="Network error. Please check your connection.":t?.message&&(e=t.message);throw Error(e)}}async function f(){}function y(){return!1}function v(){let e=(0,o.E_)();return e?._id?e:null}s=(d.then?(await d)():d)[0],a()}catch(e){a(e)}})},4164:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{g:()=>s});var i=r(997);r(6689);var n=r(889),o=e([n]);n=(o.then?(await o)():o)[0];let s=()=>i.jsx(i.Fragment,{children:i.jsx(n.w,{})});a()}catch(e){a(e)}})},5758:(e,t,r)=>{"use strict";r.d(t,{Z:()=>i});var a=r(6689);let i=()=>((0,a.useEffect)(()=>{},[]),null)},889:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{w:()=>d});var i=r(997),n=r(6689),o=r(6197),s=r(1067),u=e([o,s]);[o,s]=u.then?(await u)():u;let d=()=>{let[e,t]=(0,n.useState)(!1),[r,a]=(0,n.useState)([]),[u,d]=(0,n.useState)(""),[l,c]=(0,n.useState)(!1),g=(0,n.useRef)(null),p=(0,n.useRef)(null),m=(0,n.useRef)(void 0),h=(0,n.useRef)(new Map),q=(0,n.useRef)(new Set);(0,s.ts)(),(0,s.rS)(),(0,n.useEffect)(()=>{},[]),(0,n.useEffect)(()=>{},[]),(0,n.useEffect)(()=>{},[]),(0,n.useEffect)(()=>{},[]),(0,n.useEffect)(()=>{e&&g.current?.scrollIntoView({behavior:"smooth"})},[r,e]);let x=()=>{if(!u.trim())return;let e=u.trim(),t=`user-${Date.now()}`,r={id:t,text:e,timestamp:new Date,sender:"user"};if(l&&m.current&&h.current.set(t,e),q.current.add(e.trim()),a(e=>[...e,r]),l&&m.current&&m.current.readyState===WebSocket.OPEN)try{m.current.send(JSON.stringify({event:"message",data:e,id:t}))}catch(e){console.error("Failed to send message:",e)}d(""),setTimeout(()=>{p.current?.focus()},50)};return i.jsx(i.Fragment,{children:e&&(0,i.jsxs)(o.motion.div,{initial:{x:420,opacity:0},animate:{x:0,opacity:1},exit:{x:420,opacity:0},transition:{type:"spring",damping:24,stiffness:260},className:"fixed bottom-24 right-6 z-[999999] w-[380px] h-[600px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-xl",children:[(0,i.jsxs)("div",{className:"px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",children:[i.jsx("div",{className:"flex items-center gap-3",children:(0,i.jsxs)("div",{children:[i.jsx("h2",{className:"font-bold text-slate-900 dark:text-white text-lg",children:"Online Message"}),i.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400",children:"Free chat room for everyone"})]})}),(0,i.jsxs)("div",{className:"flex items-center gap-3",children:[(0,i.jsxs)("div",{className:"flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full",children:[i.jsx("div",{className:`w-2 h-2 rounded-full ${l?"bg-green-500 animate-pulse":"bg-red-500"}`}),i.jsx("span",{className:"text-xs text-slate-600 dark:text-slate-400 font-medium",children:l?"Online":"Offline"})]}),i.jsx("button",{onClick:()=>{let r=!e;t(r)},className:"text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800","aria-label":"Close chat",children:i.jsx("span",{className:"material-symbols-outlined text-xl",children:"close"})})]})]}),i.jsx("div",{className:"flex-1 relative overflow-hidden bg-[#f6f6f8] dark:bg-slate-900",children:(0,i.jsxs)("div",{className:"h-full flex flex-col",children:[(0,i.jsxs)("div",{className:"flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar",children:[0===r.length?i.jsx("div",{className:"flex items-center justify-center h-full text-center",children:(0,i.jsxs)("div",{className:"animate-fade-in",children:[i.jsx("div",{className:"w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3",children:i.jsx("span",{className:"material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400",children:"chat_bubble_outline"})}),i.jsx("p",{className:"text-slate-500 dark:text-slate-400 text-sm font-medium",children:l?"Start a conversation!":"Connecting..."})]})}):r.map(e=>i.jsx("div",{className:`flex ${"user"===e.sender?"justify-end":"justify-start"} animate-fade-in`,children:(0,i.jsxs)("div",{className:`max-w-[80%] rounded-2xl px-4 py-2.5 transition-all duration-200 ${"user"===e.sender?"bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md":"system"===e.sender?"bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs italic":"bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700"}`,children:[i.jsx("p",{className:"text-sm leading-relaxed break-words",children:e.text}),"system"!==e.sender&&i.jsx("p",{className:`text-xs mt-1 ${"user"===e.sender?"text-white/70":"text-slate-500 dark:text-slate-400"}`,children:e.timestamp.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})},e.id)),i.jsx("div",{ref:g})]}),i.jsx("div",{className:"p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700",children:(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[i.jsx("input",{ref:p,type:"text",value:u,onChange:e=>d(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),x())},placeholder:l?"Type a message...":"You can type while we connect...",className:"flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm transition-all duration-200",autoFocus:!0}),i.jsx("button",{onClick:x,disabled:!l||!u.trim(),className:"w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed","aria-label":"Send message",children:i.jsx("span",{className:"material-symbols-outlined text-lg",children:"send"})})]})})]})})]})})};a()}catch(e){a(e)}})},7921:(e,t,r)=>{"use strict";r.d(t,{F:()=>s,f:()=>o});var a=r(997),i=r(6689);let n=(0,i.createContext)(void 0);function o({children:e}){let[t,r]=(0,i.useState)("light"),[o,s]=(0,i.useState)(!1);return a.jsx(n.Provider,{value:{theme:t,toggleTheme:()=>{}},children:e})}function s(){let e=(0,i.useContext)(n);if(void 0===e)throw Error("useTheme must be used within a ThemeProvider");return e}},6814:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{default:()=>g});var i=r(997),n=r(9114),o=r(3562),s=r(7921),u=r(4164),d=r(5758);r(6764),r(967);var l=r(8653),c=e([o,u]);function g({Component:e,pageProps:t}){let r=(0,o.U)(t.initialApolloState);return i.jsx(n.ApolloProvider,{client:r,children:(0,i.jsxs)(s.f,{children:[i.jsx(l.Z,{}),i.jsx(e,{...t}),i.jsx(d.Z,{}),i.jsx(u.g,{})]})})}[o,u]=c.then?(await c)():c,a()}catch(e){a(e)}})},967:()=>{},6764:()=>{}};
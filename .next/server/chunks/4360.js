"use strict";exports.id=4360,exports.ids=[4360],exports.modules={4745:(t,e,i)=>{i.d(e,{$T:()=>v,Gg:()=>q,J5:()=>g,JD:()=>m,K1:()=>b,MN:()=>d,PF:()=>x,Qv:()=>c,TR:()=>f,W:()=>p,Xr:()=>S,_x:()=>y,aN:()=>n,gD:()=>a,gg:()=>I,i8:()=>o,iW:()=>u,ll:()=>$,tt:()=>A,ui:()=>s,yY:()=>h,zh:()=>l});var r=i(9114);let a=(0,r.gql)`
  mutation SuspendUser($userId: String!) {
    suspendUser(userId: $userId) {
      _id
      userStatus
    }
  }
`,n=(0,r.gql)`
  mutation ActivateUser($userId: String!) {
    activateUser(userId: $userId) {
      _id
      userStatus
    }
  }
`,s=(0,r.gql)`
  mutation ResetUserPassword($userId: String!) {
    resetUserPassword(userId: $userId) {
      success
    }
  }
`,d=(0,r.gql)`
  mutation ApproveOrganization($organizationId: String!) {
    approveOrganization(organizationId: $organizationId) {
      _id
      organizationStatus
    }
  }
`,o=(0,r.gql)`
  mutation RejectOrganization($input: RejectOrganizationInput!) {
    rejectOrganization(input: $input) {
      _id
      organizationStatus
    }
  }
`,u=(0,r.gql)`
  mutation SuspendOrganization($organizationId: String!) {
    suspendOrganization(organizationId: $organizationId) {
      _id
      organizationStatus
    }
  }
`,l=(0,r.gql)`
  mutation UpdateOrganization($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      _id
      organizationName
      organizationDescription
      organizationWebsite
      organizationIndustry
    }
  }
`,g=(0,r.gql)`
  mutation CloseServiceRequest($requestId: String!) {
    closeServiceRequest(requestId: $requestId) {
      _id
      reqStatus
    }
  }
`,p=(0,r.gql)`
  mutation FlagServiceRequest($input: FlagServiceRequestInput!) {
    flagServiceRequest(input: $input) {
      _id
    }
  }
`,c=(0,r.gql)`
  mutation DeleteServiceRequest($requestId: String!) {
    deleteServiceRequest(requestId: $requestId) {
      success
    }
  }
`,m=(0,r.gql)`
  mutation FlagQuote($input: FlagQuoteInput!) {
    flagQuote(input: $input) {
      _id
    }
  }
`,q=(0,r.gql)`
  mutation HardDeleteQuote($quoteId: String!) {
    hardDeleteQuote(quoteId: $quoteId) {
      success
    }
  }
`,A=(0,r.gql)`
  mutation ChangeOrderStatus($input: ChangeOrderStatusInput!) {
    changeOrderStatus(input: $input) {
      _id
      orderStatus
      adminNotes
    }
  }
`,h=(0,r.gql)`
  mutation AddOrderAdminNotes($input: AddOrderAdminNotesInput!) {
    addOrderAdminNotes(input: $input) {
      _id
      adminNotes
    }
  }
`,I=(0,r.gql)`
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      _id
      title
      slug
      thumbnail
      articleCoverImage
      status
      createdAt
    }
  }
`,y=(0,r.gql)`
  mutation UpdateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
      _id
      title
      slug
      thumbnail
      articleCoverImage
      status
      updatedAt
    }
  }
`,x=(0,r.gql)`
  mutation PublishArticle($articleId: String!) {
    publishArticle(articleId: $articleId) {
      _id
      status
      publishedAt
    }
  }
`,S=(0,r.gql)`
  mutation UnpublishArticle($articleId: String!) {
    unpublishArticle(articleId: $articleId) {
      _id
      status
    }
  }
`,$=(0,r.gql)`
  mutation DeleteArticle($articleId: String!) {
    deleteArticle(articleId: $articleId) {
      success
    }
  }
`;(0,r.gql)`
  mutation UpdateCSCenterContent($input: UpdateCSCenterContentInput!) {
    updateCSCenterContent(input: $input) {
      _id
      heroTitle
      heroDescription
      heroImage
      quickAccessCards {
        title
        description
        icon
        link
        color
      }
      contactMethods {
        type
        label
        value
        availability
        icon
      }
      faqs {
        _id
        question
        answer
        category
        order
        createdAt
        updatedAt
      }
      updatedAt
      updatedBy
    }
  }
`;let b=(0,r.gql)`
  mutation CreateCSFAQ($input: CreateCSFAQInput!) {
    createCSFAQ(input: $input) {
      _id
      question
      answer
      category
      order
      createdAt
    }
  }
`,v=(0,r.gql)`
  mutation UpdateCSFAQ($input: UpdateCSFAQInput!) {
    updateCSFAQ(input: $input) {
      _id
      question
      answer
      category
      order
      updatedAt
    }
  }
`,f=(0,r.gql)`
  mutation DeleteCSFAQ($faqId: String!) {
    deleteCSFAQ(faqId: $faqId) {
      _id
    }
  }
`;(0,r.gql)`
  mutation ChangeDisputeStatus($input: ChangeDisputeStatusInput!) {
    changeDisputeStatus(input: $input) {
      _id
      disputeStatus
    }
  }
`,(0,r.gql)`
  mutation AddDisputeAdminNotes($input: AddDisputeAdminNotesInput!) {
    addDisputeAdminNotes(input: $input) {
      _id
      adminNotes
    }
  }
`,(0,r.gql)`
  mutation ResolveDispute($input: ResolveDisputeInput!) {
    resolveDispute(input: $input) {
      _id
      disputeStatus
      resolvedAt
    }
  }
`,(0,r.gql)`
  mutation InviteAdmin($input: InviteAdminInput!) {
    inviteAdmin(input: $input) {
      success
      invitationSent
      adminUserId
    }
  }
`,(0,r.gql)`
  mutation RemoveAdmin($adminUserId: String!) {
    removeAdmin(adminUserId: $adminUserId) {
      success
    }
  }
`,(0,r.gql)`
  mutation UpdatePlatformSettings($input: UpdatePlatformSettingsInput!) {
    updatePlatformSettings(input: $input) {
      _id
      siteName
      supportEmail
      quoteRulesText
      termsLink
      privacyLink
      updatedAt
    }
  }
`},3261:(t,e,i)=>{i.d(e,{$6:()=>s,A2:()=>a,FW:()=>l,Gb:()=>d,H:()=>p,Pg:()=>o,b1:()=>n,lg:()=>u,n$:()=>g,sc:()=>c});var r=i(9114);(0,r.gql)`
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      token
      user {
        _id
        userNick
        userEmail
        role
        status
        createdAt
      }
    }
  }
`,(0,r.gql)`
  mutation AdminSignup($input: AdminSignupInput!) {
    adminSignup(input: $input) {
      token
      user {
        _id
        userNick
        userEmail
        role
        status
        createdAt
      }
    }
  }
`;let a=(0,r.gql)`
  query GetAllUsers($input: GetAllUsersInput!) {
    getAllUsers(input: $input) {
      list {
        _id
        userNick
        userEmail
        userPhone
        userDescription
        userRole
        userStatus
        userImage
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      _id
      userNick
      userEmail
      userPhone
      userRole
      userStatus
      createdAt
      updatedAt
    }
  }
`;let n=(0,r.gql)`
  query GetAllOrganizations($input: GetAllOrganizationsInput!) {
    getAllOrganizations(input: $input) {
      list {
        _id
        organizationName
        organizationType
        organizationStatus
        organizationCountry
        organizationIndustry
        organizationDescription
        organizationImage
        organizationWebsite
        isFlagged
        createdAt
        updatedAt
        memberCount
        requestCount
        quoteCount
        orderCount
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetOrganizationById($organizationId: String!) {
    getOrganizationById(organizationId: $organizationId) {
      _id
      organizationName
      organizationType
      organizationStatus
      organizationCountry
      organizationIndustry
      organizationDescription
      organizationImage
      organizationWebsite
      createdAt
      updatedAt
      memberCount
      requestCount
      quoteCount
      orderCount
    }
  }
`;let s=(0,r.gql)`
  query GetAllServiceRequests($input: GetAllServiceRequestsInput!) {
    getAllServiceRequests(input: $input) {
      list {
        _id
        reqTitle
        reqDescription
        reqStatus
        reqBuyerOrgId
        reqTotalQuotes
        reqNewQuotesCount
        reqDeadline
        isFlagged
        createdAt
        updatedAt
        reqBuyerOrgData {
          _id
          organizationName
          organizationImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetServiceRequestById($requestId: String!) {
    getServiceRequestById(requestId: $requestId) {
      _id
      reqTitle
      reqDescription
      reqStatus
      reqBuyerOrgId
      reqTotalQuotes
      reqNewQuotesCount
      reqDeadline
      createdAt
      updatedAt
      reqBuyerOrgData {
        _id
        organizationName
        organizationImage
      }
    }
  }
`;let d=(0,r.gql)`
  query GetAllQuotes($input: GetAllQuotesInput!) {
    getAllQuotes(input: $input) {
      list {
        _id
        quoteServiceReqId
        quoteProviderOrgId
        quoteProviderOrgData {
          _id
          organizationName
          organizationImage
        }
        quoteAmount
        quoteMessage
        quoteStatus
        isFlagged
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetQuoteById($quoteId: String!) {
    getQuoteById(quoteId: $quoteId) {
      _id
      quoteServiceReqId
      quoteProviderOrgId
      quoteProviderOrgData {
        _id
        organizationName
        organizationImage
      }
      quoteAmount
      quoteMessage
      quoteStatus
      createdAt
      updatedAt
    }
  }
`;let o=(0,r.gql)`
  query GetAllOrders($input: GetAllOrdersInput!) {
    getAllOrders(input: $input) {
      list {
        _id
        orderQuoteId
        orderBuyerOrgId
        orderProviderOrgId
        orderBuyerOrgData {
          _id
          organizationName
        }
        orderProviderOrgData {
          _id
          organizationName
        }
        orderAmount
        orderStatus
        adminNotes
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetOrderById($orderId: String!) {
    getOrderById(orderId: $orderId) {
      _id
      orderQuoteId
      orderBuyerOrgId
      orderProviderOrgId
      orderBuyerOrgData {
        _id
        organizationName
      }
      orderProviderOrgData {
        _id
        organizationName
      }
      orderAmount
      orderStatus
      adminNotes
      createdAt
      updatedAt
    }
  }
`;let u=(0,r.gql)`
  query GetCSCenterContent {
    getCSCenterContent {
      _id
      heroTitle
      heroDescription
      heroImage
      quickAccessCards {
        title
        description
        icon
        link
        color
      }
      contactMethods {
        type
        label
        value
        availability
        icon
      }
      faqs {
        _id
        question
        answer
        category
        order
        createdAt
        updatedAt
      }
      updatedAt
      updatedBy
    }
  }
`,l=(0,r.gql)`
  query GetAllArticles($input: GetAllArticlesInput!) {
    getAllArticles(input: $input) {
      list {
        _id
        title
        slug
        shortDescription
        body
        thumbnail
        articleCoverImage
        tags
        status
        publishedAt
        createdAt
        updatedAt
        createdBy
        updatedBy
      }
      metaCounter {
        total
      }
    }
  }
`,g=(0,r.gql)`
  query GetPublishedArticles($input: GetAllArticlesInput!) {
    getPublishedArticles(input: $input) {
      list {
        _id
        title
        slug
        shortDescription
        body
        thumbnail
        articleCoverImage
        tags
        status
        publishedAt
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;(0,r.gql)`
  query GetArticleById($articleId: String!) {
    getArticleById(articleId: $articleId) {
      _id
      title
      slug
      shortDescription
      body
      thumbnail
      articleCoverImage
      tags
      status
      publishedAt
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }
`;let p=(0,r.gql)`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      _id
      title
      slug
      shortDescription
      body
      thumbnail
      articleCoverImage
      tags
      status
      publishedAt
      createdAt
      updatedAt
    }
  }
`;(0,r.gql)`
  query GetAllDisputes($input: GetAllDisputesInput!) {
    getAllDisputes(input: $input) {
      list {
        _id
        disputeType
        disputeStatus
        orderId
        userId
        requestId
        quoteId
        title
        description
        reason
        amount
        buyerOrg
        providerOrg
        userName
        userEmail
        adminNotes
        createdAt
        updatedAt
        resolvedAt
        resolvedBy
      }
      metaCounter {
        total
      }
    }
  }
`,(0,r.gql)`
  query GetDisputeById($disputeId: String!) {
    getDisputeById(disputeId: $disputeId) {
      _id
      disputeType
      disputeStatus
      orderId
      userId
      requestId
      quoteId
      title
      description
      reason
      amount
      buyerOrg
      providerOrg
      userName
      userEmail
      adminNotes
      createdAt
      updatedAt
      resolvedAt
      resolvedBy
    }
  }
`,(0,r.gql)`
  query GetAuditLogs($input: GetAuditLogsInput!) {
    getAuditLogs(input: $input) {
      list {
        _id
        timestamp
        adminUserId
        adminUser {
          _id
          userNick
          userEmail
        }
        action
        targetType
        targetId
        targetName
        details
        metadata
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`,(0,r.gql)`
  query GetAllAdmins($input: GetAllAdminsInput) {
    getAllAdmins(input: $input) {
      list {
        _id
        userNick
        userEmail
        role
        status
        createdAt
        lastLogin
      }
      metaCounter {
        total
      }
    }
  }
`;let c=(0,r.gql)`
  query GetDashboardStatistics {
    getDashboardStatistics {
      totalBuyers {
        current
        previous
        change
      }
      totalProviders {
        current
        previous
        change
      }
      activeRequests {
        current
        previous
        change
      }
      openQuotes {
        current
        previous
        change
      }
      activeOrders {
        current
        previous
        change
      }
      recentServiceRequests {
        _id
        reqTitle
        reqStatus
        createdAt
      }
      recentOrders {
        _id
        orderAmount
        orderStatus
        createdAt
      }
      recentArticles {
        _id
        title
        status
        createdAt
      }
    }
  }
`;(0,r.gql)`
  query GetPlatformSettings {
    getPlatformSettings {
      _id
      siteName
      supportEmail
      quoteRulesText
      termsLink
      privacyLink
      updatedAt
      updatedBy
    }
  }
`},5431:(t,e,i)=>{i.d(e,{P:()=>a});var r=i(997);i(6689);let a=({title:t,subtitle:e})=>(0,r.jsxs)("header",{className:"h-16 bg-white border-b border-slate-200 flex items-center px-8 flex-shrink-0",children:[(0,r.jsxs)("div",{className:"flex-1",children:[r.jsx("h1",{className:"text-2xl font-bold text-slate-900",children:t}),e&&r.jsx("p",{className:"text-sm text-slate-500 mt-0.5",children:e})]}),r.jsx("div",{className:"flex items-center gap-4",children:(0,r.jsxs)("div",{className:"flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg",children:[r.jsx("span",{className:"material-symbols-outlined text-indigo-600 text-lg",children:"admin_panel_settings"}),r.jsx("span",{className:"text-sm font-semibold text-indigo-600",children:"Admin Mode"})]})})]})},7919:(t,e,i)=>{i.a(t,async(t,r)=>{try{i.d(e,{g:()=>c});var a=i(997);i(6689);var n=i(1664),s=i.n(n),d=i(1163),o=i(9114),u=i(9641),l=i(1067),g=t([l]);l=(g.then?(await g)():g)[0];let p=[{icon:"dashboard",label:"Dashboard",href:"/admin"},{icon:"people",label:"Users",href:"/admin/users"},{icon:"corporate_fare",label:"Organizations",href:"/admin/organizations"},{icon:"description",label:"Service Requests",href:"/admin/service-requests"},{icon:"request_quote",label:"Quotes",href:"/admin/quotes"},{icon:"assignment",label:"Orders",href:"/admin/orders"},{icon:"article",label:"Articles",href:"/admin/articles"},{icon:"support_agent",label:"Customer Support",href:"/admin/customer-support"},{icon:"settings",label:"Settings",href:"/admin/settings"}],c=()=>{let t=(0,d.useRouter)(),e=(0,o.useReactiveVar)(u.E_),i=e?.userNick||"Admin",r=async()=>{await (0,l.ni)(),t.push("/admin/login")};return(0,a.jsxs)("aside",{className:"w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm",children:[a.jsx("div",{className:"h-16 flex items-center px-6 border-b border-slate-200 flex-shrink-0",children:(0,a.jsxs)(s(),{href:"/admin",className:"flex items-center gap-2",children:[a.jsx("div",{className:"w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center",children:a.jsx("span",{className:"material-symbols-outlined text-white text-lg",children:"admin_panel_settings"})}),(0,a.jsxs)("span",{className:"text-lg font-bold tracking-tight",children:[a.jsx("span",{className:"text-indigo-600",children:"Admin"}),a.jsx("span",{className:"text-slate-900",children:"Panel"})]})]})}),a.jsx("div",{className:"px-6 py-5 border-b border-slate-200",children:(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-slate-100",children:a.jsx("span",{className:"material-symbols-outlined text-white text-xl",children:"admin_panel_settings"})}),(0,a.jsxs)("div",{className:"flex flex-col",children:[a.jsx("span",{className:"text-sm font-bold text-slate-900",children:i}),a.jsx("span",{className:"text-xs font-medium text-slate-500 uppercase tracking-wider",children:"Administrator"})]})]})}),a.jsx("div",{className:"flex-1 px-4 py-4 space-y-1 overflow-y-auto",children:p.map(e=>{let i=t.pathname===e.href||t.pathname.startsWith(e.href+"/");return(0,a.jsxs)(s(),{href:e.href,className:`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${i?"bg-indigo-50 text-indigo-600 font-semibold":"text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"}`,children:[a.jsx("span",{className:"material-symbols-outlined text-[22px]",style:i?{fontVariationSettings:"'FILL' 1",color:"var(--primary)"}:void 0,children:e.icon}),a.jsx("span",{children:e.label})]},e.href)})}),a.jsx("div",{className:"p-4 border-t border-slate-200 space-y-2",children:(0,a.jsxs)("button",{onClick:r,className:"w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all rounded-lg text-sm font-medium",children:[a.jsx("span",{className:"material-symbols-outlined text-[22px]",children:"logout"}),a.jsx("span",{children:"Logout"})]})})]})};r()}catch(t){r(t)}})},7645:(t,e,i)=>{i.r(e),i.d(e,{default:()=>n});var r=i(997),a=i(6859);function n(){return(0,r.jsxs)(a.Html,{lang:"en",children:[(0,r.jsxs)(a.Head,{children:[r.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),r.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),r.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",rel:"stylesheet"}),r.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",rel:"stylesheet"}),r.jsx("script",{dangerouslySetInnerHTML:{__html:`
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="XjMt_yb-TzrAnD8ToERXq";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
            `}})]}),(0,r.jsxs)("body",{children:[r.jsx(a.Main,{}),r.jsx(a.NextScript,{})]})]})}}};
"use strict";exports.id=7979,exports.ids=[7979],exports.modules={3550:(e,t,r)=>{r.d(t,{B4:()=>c,L7:()=>p,Rd:()=>n,Uj:()=>a,Yb:()=>q,bX:()=>m,d9:()=>g,eS:()=>o,k$:()=>d,rV:()=>l,uq:()=>s,xI:()=>u});var i=r(9114);let a=(0,i.gql)`
  query GetProvidersByCategory($input: ProviderCategoryInput!) {
    getProvidersByCategory(input: $input) {
      list {
        _id
        organizationName
        organizationEmail
        organizationCountry
        organizationDescription
        categoryId
        subCategory
        organizationImage
        organizationHourlyRate
        orgAverageRating
        reviewsCount
        budgetRange
        createdAt
        deletedAt
      }
      metaCounter {
        total
      }
    }
  }
`,o=(0,i.gql)`
  query GetProviderDetail($orgId: String!) {
    getProviderDetail(orgId: $orgId) {
      _id
      organizationName
      organizationDescription
      organizationImage
      avatar
      organizationEmail
      organizationPhoneNumber
      organizationWebsiteUrl
      organizationCountry
      organizationLocation
      flag
      
      # Rating & Social Proof
      orgAverageRating
      reviewsCount
      myRating
      orgTotalLikes
      orgTotalViews
      orgTotalProjects
      orgVerified
      
      # Budget & Pricing
      budgetRange
      organizationHourlyRate
      minProjectSize
      
      # Services & Categorization
      categoryId
      subCategory
      serviceTitle
      organizationSpecialties
      industries
      orgSkills
      
      # Additional Profile Info
      bio
      organizationIndustry
      establishmentYear
      organizationTeamSize
      badges
      color
      
      # Social Links
      linkedIn
      twitter
      github
      
      # Owner Information
      orgOwnerUserId
      orgOwnerData {
        _id
        userNick
        userEmail
        userImage
      }
      
      # Metadata
      organizationType
      organizationStatus
      createdAt
      updatedAt
    }
  }
`,n=(0,i.gql)`
  query GetProviderDetailFallback($orgId: String!) {
    getProviderDetail(orgId: $orgId) {
      _id
      organizationName
      organizationDescription
      organizationImage
      avatar
      organizationEmail
      organizationPhoneNumber
      organizationWebsiteUrl
      organizationCountry
      organizationLocation
      flag
      
      # Rating & Social Proof (orgAverageRating omitted - will default to 0 in mapper)
      reviewsCount
      orgTotalLikes
      orgTotalViews
      orgTotalProjects
      orgVerified
      
      # Budget & Pricing
      budgetRange
      organizationHourlyRate
      minProjectSize
      
      # Services & Categorization
      categoryId
      subCategory
      serviceTitle
      organizationSpecialties
      industries
      orgSkills
      
      # Additional Profile Info
      bio
      organizationIndustry
      establishmentYear
      organizationTeamSize
      badges
      color
      
      # Social Links
      linkedIn
      twitter
      github
      
      # Owner Information
      orgOwnerUserId
      orgOwnerData {
        _id
        userNick
        userEmail
        userImage
      }
      
      # Metadata
      organizationType
      organizationStatus
      createdAt
      updatedAt
    }
  }
`;(0,i.gql)`
  query ProviderDetailWithOwner($orgId: String!) {
    getProviderDetail(orgId: $orgId) {
      _id
      organizationName
      organizationCountry
      organizationDescription
      organizationImage
      categoryId
      subCategory
      orgOwnerData {
        _id
        userNick
        userEmail
        userPhone
        userImage
        userRole
        userStatus
      }
      createdAt
      deletedAt
    }
  }
`;let g=(0,i.gql)`
  query GetProvidersSorted($input: ProviderSortInput!) {
    getProvidersSorted(input: $input) {
      list {
        _id
        organizationName
        organizationEmail
        organizationCountry
        organizationDescription
        categoryId
        subCategory
        organizationImage
        organizationHourlyRate
        orgAverageRating
        reviewsCount
        budgetRange
        createdAt
        deletedAt
      }
      metaCounter {
        total
      }
    }
  }
`;(0,i.gql)`
  query GetProviders($input: ProviderSearchInput!) {
    getProviders(input: $input) {
      _id
      categoryId
      subCategory
      serviceTitle
      name
      description
      bio
      avatar
      badges
      rating
      reviewsCount
      projectsCompleted
      responseTime
      startingRate
      location
      city
      flag
      expertise
      caseStudies {
        title
        metricLabel
        metricValue
        image
      }
      color
    }
  }
`,(0,i.gql)`
  query GetProvider($id: String!) {
    getProvider(id: $id) {
      _id
      categoryId
      subCategory
      serviceTitle
      name
      description
      bio
      avatar
      badges
      rating
      reviewsCount
      projectsCompleted
      responseTime
      startingRate
      location
      city
      flag
      expertise
      caseStudies {
        title
        metricLabel
        metricValue
        image
      }
      establishmentYear
      teamSize
      industries
      minProjectSize
      color
    }
  }
`,(0,i.gql)`
  query GetProviderPortfolio($providerId: String!) {
    getProviderPortfolio(providerId: $providerId) {
      _id
      title
      description
      images
      coverImage
      metrics {
        label
        value
      }
      tags
      clientName
      clientLogo
      industry
      projectUrl
      completedAt
      createdAt
    }
  }
`,(0,i.gql)`
  query GetProviderTestimonials($input: TestimonialInput!) {
    getProviderTestimonials(input: $input) {
      list {
        _id
        providerId
        text
        rating
        authorName
        authorRole
        authorCompany
        authorAvatar
        projectTitle
        isVerified
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`,(0,i.gql)`
  query GetLandingStatistics {
    getLandingStatistics {
      totalProviders
      totalProjectsCompleted
      totalIndustriesServed
      totalClientsServed
      totalCountriesReached
      averageSatisfactionRate
      totalActiveServiceRequests
      platformEstablishedYear
    }
  }
`,(0,i.gql)`
  query GetFeaturedPortfolios($limit: Int) {
    getFeaturedPortfolios(limit: $limit) {
      _id
      title
      description
      coverImage
      images
      metrics {
        label
        value
      }
      tags
      clientName
      clientLogo
      industry
      providerId
      providerName
      providerAvatar
      completedAt
      createdAt
    }
  }
`,(0,i.gql)`
  query GetProviderContact($providerId: String!) {
    getProviderContact(providerId: $providerId) {
      email
      phone
      website
      socialLinks {
        linkedin
        twitter
        github
      }
    }
  }
`,(0,i.gql)`
  query GetRecommendedProviders($providerId: String!, $categoryId: String!) {
    getRecommendedProviders(providerId: $providerId, categoryId: $categoryId) {
      _id
      organizationName
      serviceTitle
      orgAverageRating
      organizationHourlyRate
      avatar
      badges
      organizationLocation
      flag
      organizationDescription
      reviewsCount
      orgTotalProjects
      orgResponseTimeAvg
      subCategory
      color
    }
  }
`;let s=(0,i.gql)`
  query GetQuoteById($quoteId: String!) {
    getQuoteById(quoteId: $quoteId) {
      _id
      quoteServiceReqId
      quoteMessage
      quoteAmount
      quoteStatus
      quoteValidUntil
      createdAt
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
      }
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteCreatedByUserData {
        _id
        userNick
        userEmail
      }
    }
  }
`,d=(0,i.gql)`
  query QuotesByRequest($requestId: String!) {
    getQuotesByRequest(requestId: $requestId) {
      _id
      quoteMessage
      quoteAmount
      quoteStatus
      quoteValidUntil
      createdAt
      quoteProviderOrgData {
        _id
        organizationName
      }
      quoteCreatedByUserData {
        _id
        userNick
        userEmail
      }
    }
  }
`,u=(0,i.gql)`
  query QuotesByOrganization($orgId: String!) {
    getQuotesByOrganization(orgId: $orgId) {
      _id
      quoteMessage
      quoteAmount
      quoteStatus
      quoteValidUntil
      createdAt
      updatedAt
      quoteServiceReqData {
        _id
        reqTitle
        reqStatus
        reqCategory
        reqSubCategory
        reqBudgetRange
        reqDeadline
      }
      quoteProviderOrgData {
        _id
        organizationName
      }
    }
  }
`;(0,i.gql)`
  query GetAgents($input: AgentsInquiry!) {
    getAgents(input: $input) {
      list {
        _id
        memberNick
        memberImage
      }
      metaCounter {
        total
      }
    }
  }
`,(0,i.gql)`
  query GetProperties($input: PropertiesInquiry!) {
    getProperties(input: $input) {
      list {
        _id
        propertyTitle
      }
      metaCounter {
        total
      }
    }
  }
`,(0,i.gql)`
  query GetMember($input: String!) {
    getMember(input: $input) {
      _id
      memberNick
      memberImage
    }
  }
`;let l=(0,i.gql)`
  query GetMyProfile($userId: String!) {
    getUser(userId: $userId) {
      _id
      userNick
      userEmail
      userPhone
      userImage
      userDescription
      createdAt
      updatedAt
    }
  }
`,c=(0,i.gql)`
  query GetBuyerOrganization {
    getBuyerOrganization {
      _id
      organizationType
      organizationStatus
      orgOwnerUserId
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
`,q=(0,i.gql)`
  query GetProviderOrganization {
    getProviderOrganization {
      _id
      organizationType
      organizationStatus
      organizationName
      organizationDescription
      organizationContactEmail
      organizationCountry
      organizationImage
      categoryId
      subCategory
      orgOwnerUserId
      budgetRange
      organizationHourlyRate
      minProjectSize
      orgAverageRating
      reviewsCount
      totalRatingValue
      createdAt
      updatedAt
    }
  }
`,p=(0,i.gql)`
  query GetBuyerServiceRequests($input: BuyerServiceRequestFilterInput) {
    getBuyerServiceRequests(input: $input) {
      list {
        _id
        reqTitle
        reqDescription
        reqStatus
        reqBudgetRange
        reqDeadline
        reqUrgency
        reqTotalQuotes
        reqNewQuotesCount
        reqCategory
        reqSubCategory
        reqSkillsNeeded
        reqBuyerOrgId
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
`,m=(0,i.gql)`
  query GetServiceRequests($input: ServiceRequestInquiry!) {
    getServiceRequests(input: $input) {
      list {
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
        reqBuyerOrgData {
          _id
          organizationName
          organizationIndustry
          organizationLocation
          organizationDescription
          organizationImage
          organizationContactEmail
          organizationType
          organizationStatus
        }
        reqCreatedByUserData {
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
`;(0,i.gql)`
  query GetServiceRequest($requestId: String!) {
    getServiceRequest(requestId: $requestId) {
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
      reqBuyerOrgData {
        _id
        organizationName
        organizationIndustry
        organizationLocation
        organizationDescription
        organizationImage
        organizationContactEmail
        organizationType
        organizationStatus
      }
      reqCreatedByUserData {
        _id
        userNick
        userEmail
        userPhone
      }
      quotes {
        _id
        quotePrice
        quoteDescription
        quoteStatus
        createdAt
      }
    }
  }
`,(0,i.gql)`
  query GetReviewsByProvider($input: ReviewFilterInput!) {
    getReviewsByProvider(input: $input) {
      list {
        _id
        providerOrgId
        buyerId
        rating
        comment
        buyerData {
          _id
          userNick
          userEmail
          userImage
        }
        createdAt
        updatedAt
      }
      metaCounter {
        total
        averageRating
      }
    }
  }
`,(0,i.gql)`
  query GetMyReviews($input: ReviewFilterInput) {
    getMyReviews(input: $input) {
      list {
        _id
        providerOrgId
        buyerId
        rating
        comment
        providerOrgData {
          _id
          organizationName
          organizationImage
        }
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`},7645:(e,t,r)=>{r.r(t),r.d(t,{default:()=>o});var i=r(997),a=r(6859);function o(){return(0,i.jsxs)(a.Html,{lang:"en",children:[(0,i.jsxs)(a.Head,{children:[i.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),i.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),i.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",rel:"stylesheet"}),i.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",rel:"stylesheet"}),i.jsx("script",{dangerouslySetInnerHTML:{__html:`
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="XjMt_yb-TzrAnD8ToERXq";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
            `}})]}),(0,i.jsxs)("body",{children:[i.jsx(a.Main,{}),i.jsx(a.NextScript,{})]})]})}}};
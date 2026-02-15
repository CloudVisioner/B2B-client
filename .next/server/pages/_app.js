/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./apollo/client.ts":
/*!**************************!*\
  !*** ./apollo/client.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeApollo: () => (/* binding */ initializeApollo),\n/* harmony export */   useApollo: () => (/* binding */ useApollo)\n/* harmony export */ });\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client/utilities */ \"@apollo/client/utilities\");\n/* harmony import */ var _apollo_client_utilities__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_utilities__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _apollo_client_link_subscriptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @apollo/client/link/subscriptions */ \"@apollo/client/link/subscriptions\");\n/* harmony import */ var _apollo_client_link_subscriptions__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_subscriptions__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var graphql_ws__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! graphql-ws */ \"graphql-ws\");\n/* harmony import */ var _apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @apollo/client/link/error */ \"@apollo/client/link/error\");\n/* harmony import */ var _apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apollo-upload-client */ \"apollo-upload-client\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ \"./apollo/utils.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([graphql_ws__WEBPACK_IMPORTED_MODULE_3__, apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__]);\n([graphql_ws__WEBPACK_IMPORTED_MODULE_3__, apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nlet apolloClient;\n// Error Link\nconst errorLink = (0,_apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4__.onError)(({ graphQLErrors, networkError, operation, forward })=>{\n    if (graphQLErrors) {\n        graphQLErrors.forEach(({ message, locations, path })=>{\n            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);\n        });\n    }\n    if (networkError) {\n        console.error(`[Network error]: ${networkError}`);\n    }\n});\n// Auth Link - Adds JWT token to requests\nconst authLink = new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloLink((operation, forward)=>{\n    operation.setContext(({ headers = {} })=>({\n            headers: {\n                ...headers,\n                ...(0,_utils__WEBPACK_IMPORTED_MODULE_6__.getHeaders)()\n            }\n        }));\n    return forward(operation);\n});\n// HTTP Link for queries/mutations\nconst httpLink = (0,apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__.createUploadLink)({\n    uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || \"http://localhost:3010/graphql\",\n    credentials: \"include\"\n});\n// WebSocket Link for subscriptions\nconst wsLink =  false ? 0 : null;\n// Split Link - Routes subscriptions to WebSocket, others to HTTP\nconst splitLink =  false ? 0 : httpLink;\n// Create Apollo Client\nfunction createApolloClient() {\n    return new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloClient({\n        link: _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloLink.from([\n            errorLink,\n            authLink,\n            splitLink\n        ]),\n        cache: new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.InMemoryCache({\n            typePolicies: {\n                Query: {\n                    fields: {\n                    }\n                }\n            }\n        }),\n        defaultOptions: {\n            watchQuery: {\n                fetchPolicy: \"cache-and-network\"\n            },\n            query: {\n                fetchPolicy: \"network-only\"\n            }\n        }\n    });\n}\n// Initialize Apollo Client (singleton pattern)\nfunction initializeApollo(initialState = null) {\n    const _apolloClient = apolloClient ?? createApolloClient();\n    // If your page has Next.js data fetching methods that use Apollo Client,\n    // the initial state gets hydrated here\n    if (initialState) {\n        _apolloClient.cache.restore(initialState);\n    }\n    // For SSG and SSR always create a new Apollo Client\n    if (true) return _apolloClient;\n    // Create the Apollo Client once in the client\n    if (!apolloClient) apolloClient = _apolloClient;\n    return _apolloClient;\n}\nfunction useApollo(initialState) {\n    return initializeApollo(initialState);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcG9sbG8vY2xpZW50LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZ0Y7QUFDbkI7QUFDSztBQUN4QjtBQUNVO0FBQ0k7QUFDbkI7QUFFckMsSUFBSVU7QUFFSixhQUFhO0FBQ2IsTUFBTUMsWUFBWUosa0VBQU9BLENBQUMsQ0FBQyxFQUFFSyxhQUFhLEVBQUVDLFlBQVksRUFBRUMsU0FBUyxFQUFFQyxPQUFPLEVBQUU7SUFDNUUsSUFBSUgsZUFBZTtRQUNqQkEsY0FBY0ksT0FBTyxDQUFDLENBQUMsRUFBRUMsT0FBTyxFQUFFQyxTQUFTLEVBQUVDLElBQUksRUFBRTtZQUNqREMsUUFBUUMsS0FBSyxDQUNYLENBQUMsMEJBQTBCLEVBQUVKLFFBQVEsWUFBWSxFQUFFQyxVQUFVLFFBQVEsRUFBRUMsS0FBSyxDQUFDO1FBRWpGO0lBQ0Y7SUFFQSxJQUFJTixjQUFjO1FBQ2hCTyxRQUFRQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsRUFBRVIsYUFBYSxDQUFDO0lBQ2xEO0FBQ0Y7QUFFQSx5Q0FBeUM7QUFDekMsTUFBTVMsV0FBVyxJQUFJcEIsc0RBQVVBLENBQUMsQ0FBQ1ksV0FBV0M7SUFDMUNELFVBQVVTLFVBQVUsQ0FBQyxDQUFDLEVBQUVDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsR0FBTTtZQUMxQ0EsU0FBUztnQkFDUCxHQUFHQSxPQUFPO2dCQUNWLEdBQUdmLGtEQUFVQSxFQUFFO1lBQ2pCO1FBQ0Y7SUFDQSxPQUFPTSxRQUFRRDtBQUNqQjtBQUVBLGtDQUFrQztBQUNsQyxNQUFNVyxXQUFXakIsc0VBQWdCQSxDQUFDO0lBQ2hDa0IsS0FBS0MsUUFBUUMsR0FBRyxDQUFDQywyQkFBMkIsSUFBSUYsUUFBUUMsR0FBRyxDQUFDRSx5QkFBeUIsSUFBSTtJQUN6RkMsYUFBYTtBQUNmO0FBRUEsbUNBQW1DO0FBQ25DLE1BQU1DLFNBQVMsTUFBa0IsR0FDN0IsQ0FNRSxHQUVGO0FBRUosaUVBQWlFO0FBQ2pFLE1BQU1LLFlBQVksTUFBdUNMLEdBQ3JEN0IsQ0FTRXNCLEdBRUZBO0FBRUosdUJBQXVCO0FBQ3ZCLFNBQVNnQjtJQUNQLE9BQU8sSUFBSXpDLHdEQUFZQSxDQUFDO1FBQ3RCMEMsTUFBTXhDLHNEQUFVQSxDQUFDeUMsSUFBSSxDQUFDO1lBQUNoQztZQUFXVztZQUFVZTtTQUFVO1FBQ3RETyxPQUFPLElBQUkzQyx5REFBYUEsQ0FBQztZQUN2QjRDLGNBQWM7Z0JBQ1pDLE9BQU87b0JBQ0xDLFFBQVE7b0JBRVI7Z0JBQ0Y7WUFDRjtRQUNGO1FBQ0FDLGdCQUFnQjtZQUNkQyxZQUFZO2dCQUNWQyxhQUFhO1lBQ2Y7WUFDQVosT0FBTztnQkFDTFksYUFBYTtZQUNmO1FBQ0Y7SUFDRjtBQUNGO0FBRUEsK0NBQStDO0FBQ3hDLFNBQVNDLGlCQUFpQkMsZUFBZSxJQUFJO0lBQ2xELE1BQU1DLGdCQUFnQjNDLGdCQUFnQitCO0lBRXRDLHlFQUF5RTtJQUN6RSx1Q0FBdUM7SUFDdkMsSUFBSVcsY0FBYztRQUNoQkMsY0FBY1QsS0FBSyxDQUFDVSxPQUFPLENBQUNGO0lBQzlCO0lBRUEsb0RBQW9EO0lBQ3BELElBQUksSUFBa0IsRUFBYSxPQUFPQztJQUUxQyw4Q0FBOEM7SUFDOUMsSUFBSSxDQUFDM0MsY0FBY0EsZUFBZTJDO0lBRWxDLE9BQU9BO0FBQ1Q7QUFFTyxTQUFTRSxVQUFVSCxZQUFpQjtJQUN6QyxPQUFPRCxpQkFBaUJDO0FBQzFCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9hcG9sbG8vY2xpZW50LnRzPzI5NTQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBvbGxvQ2xpZW50LCBJbk1lbW9yeUNhY2hlLCBBcG9sbG9MaW5rLCBzcGxpdCB9IGZyb20gJ0BhcG9sbG8vY2xpZW50JztcbmltcG9ydCB7IGdldE1haW5EZWZpbml0aW9uIH0gZnJvbSAnQGFwb2xsby9jbGllbnQvdXRpbGl0aWVzJztcbmltcG9ydCB7IEdyYXBoUUxXc0xpbmsgfSBmcm9tICdAYXBvbGxvL2NsaWVudC9saW5rL3N1YnNjcmlwdGlvbnMnO1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnZ3JhcGhxbC13cyc7XG5pbXBvcnQgeyBvbkVycm9yIH0gZnJvbSAnQGFwb2xsby9jbGllbnQvbGluay9lcnJvcic7XG5pbXBvcnQgeyBjcmVhdGVVcGxvYWRMaW5rIH0gZnJvbSAnYXBvbGxvLXVwbG9hZC1jbGllbnQnO1xuaW1wb3J0IHsgZ2V0SGVhZGVycyB9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgYXBvbGxvQ2xpZW50OiBBcG9sbG9DbGllbnQ8YW55PjtcblxuLy8gRXJyb3IgTGlua1xuY29uc3QgZXJyb3JMaW5rID0gb25FcnJvcigoeyBncmFwaFFMRXJyb3JzLCBuZXR3b3JrRXJyb3IsIG9wZXJhdGlvbiwgZm9yd2FyZCB9KSA9PiB7XG4gIGlmIChncmFwaFFMRXJyb3JzKSB7XG4gICAgZ3JhcGhRTEVycm9ycy5mb3JFYWNoKCh7IG1lc3NhZ2UsIGxvY2F0aW9ucywgcGF0aCB9KSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICBgW0dyYXBoUUwgZXJyb3JdOiBNZXNzYWdlOiAke21lc3NhZ2V9LCBMb2NhdGlvbjogJHtsb2NhdGlvbnN9LCBQYXRoOiAke3BhdGh9YFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChuZXR3b3JrRXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbTmV0d29yayBlcnJvcl06ICR7bmV0d29ya0Vycm9yfWApO1xuICB9XG59KTtcblxuLy8gQXV0aCBMaW5rIC0gQWRkcyBKV1QgdG9rZW4gdG8gcmVxdWVzdHNcbmNvbnN0IGF1dGhMaW5rID0gbmV3IEFwb2xsb0xpbmsoKG9wZXJhdGlvbiwgZm9yd2FyZCkgPT4ge1xuICBvcGVyYXRpb24uc2V0Q29udGV4dCgoeyBoZWFkZXJzID0ge30gfSkgPT4gKHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAuLi5oZWFkZXJzLFxuICAgICAgLi4uZ2V0SGVhZGVycygpLFxuICAgIH0sXG4gIH0pKTtcbiAgcmV0dXJuIGZvcndhcmQob3BlcmF0aW9uKTtcbn0pO1xuXG4vLyBIVFRQIExpbmsgZm9yIHF1ZXJpZXMvbXV0YXRpb25zXG5jb25zdCBodHRwTGluayA9IGNyZWF0ZVVwbG9hZExpbmsoe1xuICB1cmk6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9HUkFQSFFMX1VSTCB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfQVBJX0dSQVBIUUxfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMTAvZ3JhcGhxbCcsXG4gIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG59KTtcblxuLy8gV2ViU29ja2V0IExpbmsgZm9yIHN1YnNjcmlwdGlvbnNcbmNvbnN0IHdzTGluayA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gID8gbmV3IEdyYXBoUUxXc0xpbmsoXG4gICAgICBjcmVhdGVDbGllbnQoe1xuICAgICAgICB1cmw6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9XUyB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfQVBJX1dTIHx8ICd3czovL2xvY2FsaG9zdDozMDEwL2dyYXBocWwnLFxuICAgICAgICBjb25uZWN0aW9uUGFyYW1zOiAoKSA9PiAoe1xuICAgICAgICAgIC4uLmdldEhlYWRlcnMoKSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgIClcbiAgOiBudWxsO1xuXG4vLyBTcGxpdCBMaW5rIC0gUm91dGVzIHN1YnNjcmlwdGlvbnMgdG8gV2ViU29ja2V0LCBvdGhlcnMgdG8gSFRUUFxuY29uc3Qgc3BsaXRMaW5rID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd3NMaW5rXG4gID8gc3BsaXQoXG4gICAgICAoeyBxdWVyeSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmluaXRpb24gPSBnZXRNYWluRGVmaW5pdGlvbihxdWVyeSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgZGVmaW5pdGlvbi5raW5kID09PSAnT3BlcmF0aW9uRGVmaW5pdGlvbicgJiZcbiAgICAgICAgICBkZWZpbml0aW9uLm9wZXJhdGlvbiA9PT0gJ3N1YnNjcmlwdGlvbidcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICB3c0xpbmssXG4gICAgICBodHRwTGlua1xuICAgIClcbiAgOiBodHRwTGluaztcblxuLy8gQ3JlYXRlIEFwb2xsbyBDbGllbnRcbmZ1bmN0aW9uIGNyZWF0ZUFwb2xsb0NsaWVudCgpIHtcbiAgcmV0dXJuIG5ldyBBcG9sbG9DbGllbnQoe1xuICAgIGxpbms6IEFwb2xsb0xpbmsuZnJvbShbZXJyb3JMaW5rLCBhdXRoTGluaywgc3BsaXRMaW5rXSksXG4gICAgY2FjaGU6IG5ldyBJbk1lbW9yeUNhY2hlKHtcbiAgICAgIHR5cGVQb2xpY2llczoge1xuICAgICAgICBRdWVyeToge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgLy8gQWRkIGNhY2hlIHBvbGljaWVzIGhlcmUgaWYgbmVlZGVkXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICAgIHdhdGNoUXVlcnk6IHtcbiAgICAgICAgZmV0Y2hQb2xpY3k6ICdjYWNoZS1hbmQtbmV0d29yaycsXG4gICAgICB9LFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgZmV0Y2hQb2xpY3k6ICduZXR3b3JrLW9ubHknLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBBcG9sbG8gQ2xpZW50IChzaW5nbGV0b24gcGF0dGVybilcbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQXBvbGxvKGluaXRpYWxTdGF0ZSA9IG51bGwpIHtcbiAgY29uc3QgX2Fwb2xsb0NsaWVudCA9IGFwb2xsb0NsaWVudCA/PyBjcmVhdGVBcG9sbG9DbGllbnQoKTtcblxuICAvLyBJZiB5b3VyIHBhZ2UgaGFzIE5leHQuanMgZGF0YSBmZXRjaGluZyBtZXRob2RzIHRoYXQgdXNlIEFwb2xsbyBDbGllbnQsXG4gIC8vIHRoZSBpbml0aWFsIHN0YXRlIGdldHMgaHlkcmF0ZWQgaGVyZVxuICBpZiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgX2Fwb2xsb0NsaWVudC5jYWNoZS5yZXN0b3JlKGluaXRpYWxTdGF0ZSk7XG4gIH1cblxuICAvLyBGb3IgU1NHIGFuZCBTU1IgYWx3YXlzIGNyZWF0ZSBhIG5ldyBBcG9sbG8gQ2xpZW50XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIF9hcG9sbG9DbGllbnQ7XG5cbiAgLy8gQ3JlYXRlIHRoZSBBcG9sbG8gQ2xpZW50IG9uY2UgaW4gdGhlIGNsaWVudFxuICBpZiAoIWFwb2xsb0NsaWVudCkgYXBvbGxvQ2xpZW50ID0gX2Fwb2xsb0NsaWVudDtcblxuICByZXR1cm4gX2Fwb2xsb0NsaWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwb2xsbyhpbml0aWFsU3RhdGU6IGFueSkge1xuICByZXR1cm4gaW5pdGlhbGl6ZUFwb2xsbyhpbml0aWFsU3RhdGUpO1xufVxuIl0sIm5hbWVzIjpbIkFwb2xsb0NsaWVudCIsIkluTWVtb3J5Q2FjaGUiLCJBcG9sbG9MaW5rIiwic3BsaXQiLCJnZXRNYWluRGVmaW5pdGlvbiIsIkdyYXBoUUxXc0xpbmsiLCJjcmVhdGVDbGllbnQiLCJvbkVycm9yIiwiY3JlYXRlVXBsb2FkTGluayIsImdldEhlYWRlcnMiLCJhcG9sbG9DbGllbnQiLCJlcnJvckxpbmsiLCJncmFwaFFMRXJyb3JzIiwibmV0d29ya0Vycm9yIiwib3BlcmF0aW9uIiwiZm9yd2FyZCIsImZvckVhY2giLCJtZXNzYWdlIiwibG9jYXRpb25zIiwicGF0aCIsImNvbnNvbGUiLCJlcnJvciIsImF1dGhMaW5rIiwic2V0Q29udGV4dCIsImhlYWRlcnMiLCJodHRwTGluayIsInVyaSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19BUElfR1JBUEhRTF9VUkwiLCJSRUFDVF9BUFBfQVBJX0dSQVBIUUxfVVJMIiwiY3JlZGVudGlhbHMiLCJ3c0xpbmsiLCJ1cmwiLCJORVhUX1BVQkxJQ19BUElfV1MiLCJSRUFDVF9BUFBfQVBJX1dTIiwiY29ubmVjdGlvblBhcmFtcyIsInNwbGl0TGluayIsInF1ZXJ5IiwiZGVmaW5pdGlvbiIsImtpbmQiLCJjcmVhdGVBcG9sbG9DbGllbnQiLCJsaW5rIiwiZnJvbSIsImNhY2hlIiwidHlwZVBvbGljaWVzIiwiUXVlcnkiLCJmaWVsZHMiLCJkZWZhdWx0T3B0aW9ucyIsIndhdGNoUXVlcnkiLCJmZXRjaFBvbGljeSIsImluaXRpYWxpemVBcG9sbG8iLCJpbml0aWFsU3RhdGUiLCJfYXBvbGxvQ2xpZW50IiwicmVzdG9yZSIsInVzZUFwb2xsbyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./apollo/client.ts\n");

/***/ }),

/***/ "./apollo/utils.ts":
/*!*************************!*\
  !*** ./apollo/utils.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getHeaders: () => (/* binding */ getHeaders)\n/* harmony export */ });\n/**\n * Get headers for GraphQL requests\n * Adds JWT token from localStorage\n */ function getHeaders() {\n    const headers = {};\n    if (false) {}\n    return headers;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcG9sbG8vdXRpbHMudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Q0FHQyxHQUNNLFNBQVNBO0lBQ2QsTUFBTUMsVUFBa0MsQ0FBQztJQUV6QyxJQUFJLEtBQWtCLEVBQWEsRUFLbEM7SUFFRCxPQUFPQTtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9hcG9sbG8vdXRpbHMudHM/N2VjNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdldCBoZWFkZXJzIGZvciBHcmFwaFFMIHJlcXVlc3RzXG4gKiBBZGRzIEpXVCB0b2tlbiBmcm9tIGxvY2FsU3RvcmFnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgaGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY2Vzc1Rva2VuJyk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaGVhZGVycztcbn1cbiJdLCJuYW1lcyI6WyJnZXRIZWFkZXJzIiwiaGVhZGVycyIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./apollo/utils.ts\n");

/***/ }),

/***/ "./libs/contexts/ThemeContext.tsx":
/*!****************************************!*\
  !*** ./libs/contexts/ThemeContext.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction ThemeProvider({ children }) {\n    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"light\");\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n        // Check localStorage for saved theme preference\n        const savedTheme = localStorage.getItem(\"theme\");\n        if (savedTheme) {\n            setTheme(savedTheme);\n        } else if (window.matchMedia(\"(prefers-color-scheme: dark)\").matches) {\n            setTheme(\"dark\");\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (mounted) {\n            localStorage.setItem(\"theme\", theme);\n            if (theme === \"dark\") {\n                document.documentElement.classList.add(\"dark\");\n            } else {\n                document.documentElement.classList.remove(\"dark\");\n            }\n        }\n    }, [\n        theme,\n        mounted\n    ]);\n    const toggleTheme = ()=>{\n        setTheme((prev)=>prev === \"light\" ? \"dark\" : \"light\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/libs/contexts/ThemeContext.tsx\",\n        lineNumber: 43,\n        columnNumber: 5\n    }, this);\n}\nfunction useTheme() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (context === undefined) {\n        throw new Error(\"useTheme must be used within a ThemeProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWJzL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4RTtBQVM5RSxNQUFNSyw2QkFBZUosb0RBQWFBLENBQStCSztBQUUxRCxTQUFTQyxjQUFjLEVBQUVDLFFBQVEsRUFBaUM7SUFDdkUsTUFBTSxDQUFDQyxPQUFPQyxTQUFTLEdBQUdOLCtDQUFRQSxDQUFRO0lBQzFDLE1BQU0sQ0FBQ08sU0FBU0MsV0FBVyxHQUFHUiwrQ0FBUUEsQ0FBQztJQUV2Q0QsZ0RBQVNBLENBQUM7UUFDUlMsV0FBVztRQUNYLGdEQUFnRDtRQUNoRCxNQUFNQyxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFDeEMsSUFBSUYsWUFBWTtZQUNkSCxTQUFTRztRQUNYLE9BQU8sSUFBSUcsT0FBT0MsVUFBVSxDQUFDLGdDQUFnQ0MsT0FBTyxFQUFFO1lBQ3BFUixTQUFTO1FBQ1g7SUFDRixHQUFHLEVBQUU7SUFFTFAsZ0RBQVNBLENBQUM7UUFDUixJQUFJUSxTQUFTO1lBQ1hHLGFBQWFLLE9BQU8sQ0FBQyxTQUFTVjtZQUM5QixJQUFJQSxVQUFVLFFBQVE7Z0JBQ3BCVyxTQUFTQyxlQUFlLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDO1lBQ3pDLE9BQU87Z0JBQ0xILFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDRSxNQUFNLENBQUM7WUFDNUM7UUFDRjtJQUNGLEdBQUc7UUFBQ2Y7UUFBT0U7S0FBUTtJQUVuQixNQUFNYyxjQUFjO1FBQ2xCZixTQUFTZ0IsQ0FBQUEsT0FBUUEsU0FBUyxVQUFVLFNBQVM7SUFDL0M7SUFFQSxxQkFDRSw4REFBQ3JCLGFBQWFzQixRQUFRO1FBQUNDLE9BQU87WUFBRW5CO1lBQU9nQjtRQUFZO2tCQUNoRGpCOzs7Ozs7QUFHUDtBQUVPLFNBQVNxQjtJQUNkLE1BQU1DLFVBQVU1QixpREFBVUEsQ0FBQ0c7SUFDM0IsSUFBSXlCLFlBQVl4QixXQUFXO1FBQ3pCLE1BQU0sSUFBSXlCLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9saWJzL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3g/ODBjYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxudHlwZSBUaGVtZSA9ICdsaWdodCcgfCAnZGFyayc7XG5cbmludGVyZmFjZSBUaGVtZUNvbnRleHRUeXBlIHtcbiAgdGhlbWU6IFRoZW1lO1xuICB0b2dnbGVUaGVtZTogKCkgPT4gdm9pZDtcbn1cblxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxUaGVtZUNvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gIGNvbnN0IFt0aGVtZSwgc2V0VGhlbWVdID0gdXNlU3RhdGU8VGhlbWU+KCdsaWdodCcpO1xuICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRNb3VudGVkKHRydWUpO1xuICAgIC8vIENoZWNrIGxvY2FsU3RvcmFnZSBmb3Igc2F2ZWQgdGhlbWUgcHJlZmVyZW5jZVxuICAgIGNvbnN0IHNhdmVkVGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSBhcyBUaGVtZTtcbiAgICBpZiAoc2F2ZWRUaGVtZSkge1xuICAgICAgc2V0VGhlbWUoc2F2ZWRUaGVtZSk7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpIHtcbiAgICAgIHNldFRoZW1lKCdkYXJrJyk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobW91bnRlZCkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgdGhlbWUpO1xuICAgICAgaWYgKHRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RhcmsnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCBbdGhlbWUsIG1vdW50ZWRdKTtcblxuICBjb25zdCB0b2dnbGVUaGVtZSA9ICgpID0+IHtcbiAgICBzZXRUaGVtZShwcmV2ID0+IHByZXYgPT09ICdsaWdodCcgPyAnZGFyaycgOiAnbGlnaHQnKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdGhlbWUsIHRvZ2dsZVRoZW1lIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvVGhlbWVDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlVGhlbWUoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XG4gIGlmIChjb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBUaGVtZVByb3ZpZGVyJyk7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiVGhlbWVDb250ZXh0IiwidW5kZWZpbmVkIiwiVGhlbWVQcm92aWRlciIsImNoaWxkcmVuIiwidGhlbWUiLCJzZXRUaGVtZSIsIm1vdW50ZWQiLCJzZXRNb3VudGVkIiwic2F2ZWRUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInNldEl0ZW0iLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInRvZ2dsZVRoZW1lIiwicHJldiIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VUaGVtZSIsImNvbnRleHQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./libs/contexts/ThemeContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../apollo/client */ \"./apollo/client.ts\");\n/* harmony import */ var _libs_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/contexts/ThemeContext */ \"./libs/contexts/ThemeContext.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../scss/app.scss */ \"./scss/app.scss\");\n/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_scss_app_scss__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_apollo_client__WEBPACK_IMPORTED_MODULE_2__]);\n_apollo_client__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    const apolloClient = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_2__.useApollo)(pageProps.initialApolloState);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_apollo_client__WEBPACK_IMPORTED_MODULE_1__.ApolloProvider, {\n        client: apolloClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_libs_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_3__.ThemeProvider, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n                lineNumber: 14,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n            lineNumber: 13,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n        lineNumber: 12,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDZ0Q7QUFDSDtBQUNpQjtBQUMvQjtBQUNMO0FBRVgsU0FBU0csSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxNQUFNQyxlQUFlTCx5REFBU0EsQ0FBQ0ksVUFBVUUsa0JBQWtCO0lBRTNELHFCQUNFLDhEQUFDUCwwREFBY0E7UUFBQ1EsUUFBUUY7a0JBQ3RCLDRFQUFDSixzRUFBYUE7c0JBQ1osNEVBQUNFO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zbWVjb25uZWN0LWxhbmRpbmctcGFnZS8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcbmltcG9ydCB7IEFwb2xsb1Byb3ZpZGVyIH0gZnJvbSAnQGFwb2xsby9jbGllbnQnO1xuaW1wb3J0IHsgdXNlQXBvbGxvIH0gZnJvbSAnLi4vYXBvbGxvL2NsaWVudCc7XG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi4vbGlicy9jb250ZXh0cy9UaGVtZUNvbnRleHQnO1xuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xuaW1wb3J0ICcuLi9zY3NzL2FwcC5zY3NzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgY29uc3QgYXBvbGxvQ2xpZW50ID0gdXNlQXBvbGxvKHBhZ2VQcm9wcy5pbml0aWFsQXBvbGxvU3RhdGUpO1xuXG4gIHJldHVybiAoXG4gICAgPEFwb2xsb1Byb3ZpZGVyIGNsaWVudD17YXBvbGxvQ2xpZW50fT5cbiAgICAgIDxUaGVtZVByb3ZpZGVyPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgPC9BcG9sbG9Qcm92aWRlcj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJBcG9sbG9Qcm92aWRlciIsInVzZUFwb2xsbyIsIlRoZW1lUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJhcG9sbG9DbGllbnQiLCJpbml0aWFsQXBvbGxvU3RhdGUiLCJjbGllbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./scss/app.scss":
/*!***********************!*\
  !*** ./scss/app.scss ***!
  \***********************/
/***/ (() => {



/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@apollo/client":
/*!*********************************!*\
  !*** external "@apollo/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client");

/***/ }),

/***/ "@apollo/client/link/error":
/*!********************************************!*\
  !*** external "@apollo/client/link/error" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/link/error");

/***/ }),

/***/ "@apollo/client/link/subscriptions":
/*!****************************************************!*\
  !*** external "@apollo/client/link/subscriptions" ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/link/subscriptions");

/***/ }),

/***/ "@apollo/client/utilities":
/*!*******************************************!*\
  !*** external "@apollo/client/utilities" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/utilities");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "apollo-upload-client":
/*!***************************************!*\
  !*** external "apollo-upload-client" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = import("apollo-upload-client");;

/***/ }),

/***/ "graphql-ws":
/*!*****************************!*\
  !*** external "graphql-ws" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = import("graphql-ws");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();
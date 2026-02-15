# 🔧 Environment Variables Setup

## 📋 Backend Configuration

Your backend is configured with:
- **API Port**: `3010`
- **Batch Port**: `3008`
- **MongoDB**: Connected to ServiceMarketplace database
- **JWT Secret**: Configured

## 🎯 Frontend Configuration

### **Environment Files**

1. **`.env.local`** (Gitignored - Your local config)
   - Contains your actual API URLs
   - DO NOT commit this file

2. **`.env.example`** (Template - Can be committed)
   - Template for other developers
   - Shows required variables

### **Required Variables**

```bash
# GraphQL API Endpoint
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3010/graphql

# WebSocket URL for Subscriptions
NEXT_PUBLIC_API_WS=ws://localhost:3010/graphql

# Environment Mode
NODE_ENV=development
```

### **Default Values**

The Apollo Client is configured with defaults:
- **GraphQL URL**: `http://localhost:3010/graphql`
- **WebSocket URL**: `ws://localhost:3010/graphql`

These match your backend port `3010`.

---

## 🚀 Setup Instructions

### **1. Create `.env.local` File**

The `.env.local` file has been created with default values pointing to:
- `http://localhost:3010/graphql` (GraphQL endpoint)
- `ws://localhost:3010/graphql` (WebSocket endpoint)

### **2. Update for Production**

When deploying, update `.env.local` with production URLs:

```bash
NEXT_PUBLIC_API_GRAPHQL_URL=https://your-api-domain.com/graphql
NEXT_PUBLIC_API_WS=wss://your-api-domain.com/graphql
NODE_ENV=production
```

### **3. Verify Connection**

1. Start your backend server on port `3010`
2. Start Next.js dev server: `npm run dev`
3. Check browser console for GraphQL connection
4. Test a query to verify API connection

---

## 🔒 Security Notes

- ✅ `.env.local` is gitignored (won't be committed)
- ✅ `.env.example` is safe to commit (no secrets)
- ✅ Backend credentials stay in backend `.env` only
- ✅ Frontend only needs API URLs, not database credentials

---

## 📝 Backend Connection

Your backend should expose:
- **GraphQL Endpoint**: `http://localhost:3010/graphql`
- **WebSocket Endpoint**: `ws://localhost:3010/graphql`

Make sure your backend:
1. Is running on port `3010`
2. Has CORS enabled for `http://localhost:3001` (Next.js dev port)
3. Accepts GraphQL queries/mutations
4. Supports WebSocket subscriptions

---

## 🧪 Testing Connection

After setup, test the connection:

```typescript
// In any component
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS } from '../../apollo/user/query';

const { data, loading, error } = useQuery(GET_PROVIDERS, {
  variables: { input: {} },
});

console.log('API Connection:', { data, loading, error });
```

If you see errors, check:
- Backend is running on port `3010`
- GraphQL endpoint is accessible
- CORS is configured correctly

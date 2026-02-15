# 📁 Environment Files Guide

## 🎯 Environment File Priority in Next.js

Next.js loads environment files in this order (later files override earlier ones):

1. `.env` - Default variables (can be committed)
2. `.env.development` - Development variables (can be committed)
3. `.env.production` - Production variables (can be committed)
4. `.env.local` - Local overrides (gitignored, highest priority)

---

## 📝 What Goes in Each File

### **`.env.development`** ✅ (You just created this)

```bash
# Development Environment Variables
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3010/graphql
NEXT_PUBLIC_API_WS=ws://localhost:3010/graphql
NODE_ENV=development
```

**Purpose**: Development environment configuration
**Can commit?**: ✅ Yes (no secrets, only URLs)
**When used**: When running `npm run dev` or `NODE_ENV=development`

---

### **`.env.production`** (For production builds)

```bash
# Production Environment Variables
NEXT_PUBLIC_API_GRAPHQL_URL=https://your-api-domain.com/graphql
NEXT_PUBLIC_API_WS=wss://your-api-domain.com/graphql
NODE_ENV=production
```

**Purpose**: Production environment configuration
**Can commit?**: ✅ Yes (no secrets, only URLs)
**When used**: When running `npm run build` or `NODE_ENV=production`

---

### **`.env.local`** (Optional - for personal overrides)

```bash
# Local overrides (highest priority)
# Use this if you need different URLs than .env.development
NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:3010/graphql
NEXT_PUBLIC_API_WS=ws://localhost:3010/graphql
```

**Purpose**: Personal/local machine overrides
**Can commit?**: ❌ No (gitignored)
**When used**: Always (highest priority, overrides all other files)

---

## 🔑 Key Points

### **What You Put in `.env.development`:**

✅ **DO Include:**
- `NEXT_PUBLIC_API_GRAPHQL_URL` - Your backend GraphQL endpoint
- `NEXT_PUBLIC_API_WS` - Your backend WebSocket endpoint
- `NODE_ENV=development` - Environment mode

❌ **DON'T Include:**
- Database credentials (those stay in backend `.env`)
- JWT secrets (those stay in backend `.env`)
- API keys or tokens
- Any sensitive information

### **Why `NEXT_PUBLIC_` Prefix?**

Variables prefixed with `NEXT_PUBLIC_` are:
- Exposed to the browser (client-side accessible)
- Available in both server and client components
- Required for Apollo Client to work

Variables without `NEXT_PUBLIC_` are:
- Only available on the server
- Not accessible in browser/client code

---

## 🚀 Usage Examples

### **Development (Current Setup)**

```bash
# .env.development is automatically loaded
npm run dev
```

### **Production Build**

```bash
# .env.production is automatically loaded
npm run build
npm start
```

### **Custom Override**

```bash
# Create .env.local to override .env.development
# This is useful if team members have different local setups
```

---

## 📋 Your Current Setup

✅ **`.env.development`** - Created with:
- GraphQL URL: `http://localhost:3010/graphql`
- WebSocket URL: `ws://localhost:3010/graphql`
- Environment: `development`

✅ **Apollo Client** - Configured to use these URLs

✅ **Backend** - Running on port `3010`

---

## 🔒 Security Checklist

- ✅ `.env.local` is gitignored (won't be committed)
- ✅ `.env.development` can be committed (no secrets)
- ✅ Backend credentials stay in backend `.env` only
- ✅ Frontend only has API URLs, not database info
- ✅ All sensitive data stays on backend

---

## 🧪 Testing

After setting up `.env.development`:

1. **Start backend**: Make sure it's running on port `3010`
2. **Start frontend**: `npm run dev`
3. **Check connection**: Open browser console, look for GraphQL requests
4. **Test query**: Try loading a page that uses `GET_PROVIDERS` query

If you see connection errors:
- Check backend is running on port `3010`
- Verify GraphQL endpoint is accessible: `http://localhost:3010/graphql`
- Check CORS is enabled in backend for `http://localhost:3001`

---

## 📚 Reference

- Next.js Environment Variables: https://nextjs.org/docs/basic-features/environment-variables
- Apollo Client Config: `apollo/client.ts`
- Setup Guide: `ENV_SETUP.md`

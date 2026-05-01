# Dockerfile Information

## Current Dockerfile Contents

The Dockerfile is now **correctly set up as a file** (not a directory) with the following configuration:

### Build Process

1. **Build Stage** (Node.js Alpine)
   - Uses Node.js 20 Alpine image
   - Installs pnpm globally
   - Copies package files and installs dependencies
   - Copies source code
   - Runs `pnpm run build` to create production bundle

2. **Production Stage** (Nginx Alpine)
   - Uses lightweight Nginx Alpine image
   - Copies built assets from builder to nginx html directory
   - Configures nginx for SPA routing
   - Sets up health checks
   - Runs as non-root user for security

## About main.tsx

**This project does NOT use a traditional `main.tsx` file.**

### Figma Make Architecture

This is a Figma Make project that uses a custom build system:

- **Entry Point**: `__figma__entrypoint__.ts` (auto-generated)
- **Main Component**: `src/app/App.tsx`
- **Router**: React Router configured in `src/app/routes.tsx`

### Standard Vite vs Figma Make

**Standard Vite Project:**
```
src/
  main.tsx          ← Entry point that renders React app
  App.tsx
index.html          ← HTML template
```

**Figma Make Project (Current):**
```
__figma__entrypoint__.ts  ← Custom entry point
src/
  app/
    App.tsx              ← Main component
    routes.tsx           ← Router configuration
```

## Do You Need main.tsx?

**NO** - The current setup works with Figma Make's build system.

**IF** you want to convert to a standard Vite project for Docker deployment, you would need:

1. Create `index.html` in project root
2. Create `src/main.tsx` as the entry point
3. Update `vite.config.ts` to use standard entry point

## Current Status

✅ **Dockerfile is correctly configured as a file**
✅ **Build system uses Figma Make's custom entrypoint**
✅ **No main.tsx needed for current setup**

## Next Steps

The project is ready to build with Docker as-is:

```bash
docker-compose up -d --build
```

If the build fails, we may need to convert to a standard Vite setup.

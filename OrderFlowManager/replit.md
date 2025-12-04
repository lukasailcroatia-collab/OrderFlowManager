# VendorFlow - Purchase Order & Inventory Management System

## Overview

VendorFlow is an internal business application designed for managing vending machine inventory, purchase orders, suppliers, and products. The system emphasizes a clean, modern UI with inline editing capabilities, particularly focused on streamlining the purchase order workflow. Built as a full-stack application with React frontend and Express backend, it follows a system-based design approach inspired by modern SaaS tools like Linear, Notion, and Stripe Dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and component-based architecture
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing
- TanStack React Query for server state management and API request handling

**UI Component System**
- Shadcn/ui component library using Radix UI primitives for accessible, headless components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants
- Custom design system based on "New York" style with neutral color palette

**Design Philosophy**
- System-based approach prioritizing information hierarchy and data clarity
- Inline editing excellence, especially for the Purchase Order creation flow
- Scannable tables with dense information presented cleanly
- Consistent spacing using Tailwind units (2, 4, 6, 8, 12, 16)
- Inter or System UI font stack via Google Fonts
- Light/dark theme support with theme toggle

**State Management Strategy**
- React Query for server state (API data, caching, synchronization)
- Local React state for UI-specific concerns (forms, modals, filters)
- No global state management library required due to focused use cases

**Key Pages & Features**
- Dashboard: Overview metrics and recent activity
- Products: CRUD operations with inline editing
- Suppliers: Contact and relationship management
- Purchase Orders: List view with filtering and status tracking
- Purchase Order Detail (New/Edit): Hero feature with inline line-item editing
- Inventory: Stock level management with location tracking
- Receive Purchase Order: Fulfillment workflow
- Refill Jobs: Placeholder for future development

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript throughout for type consistency between client and server
- Modular route registration pattern via `registerRoutes` function
- HTTP server creation using Node's native `http` module

**API Design Pattern**
- RESTful API structure with `/api` prefix for all endpoints
- JSON request/response format
- Request logging middleware tracking method, path, status, and duration
- Raw body capture for webhook verification scenarios

**Data Access Layer**
- Storage interface abstraction (`IStorage`) for flexible backend implementation
- Currently using in-memory storage (`MemStorage`) with Map-based data structures
- Designed to support database migration without changing application code
- CRUD methods for entities (users, products, suppliers, purchase orders, etc.)

**Database Schema (Drizzle ORM)**
- PostgreSQL as the target database (via `@neondatabase/serverless` for serverless Postgres)
- Drizzle ORM for type-safe database queries and migrations
- Schema definition in TypeScript with automatic TypeScript type inference
- Zod integration via `drizzle-zod` for runtime validation
- Migration files generated in `/migrations` directory

**Current Schema Entities**
- Users table with UUID primary keys, username/password authentication
- Schema extensible for products, suppliers, purchase orders, inventory, line items

**Development vs. Production**
- Development: Vite middleware integration for HMR and asset serving
- Production: Static file serving from `dist/public` directory
- Build process bundles server code with allowlisted dependencies to reduce cold start times

### External Dependencies

**Database & ORM**
- PostgreSQL (via Neon serverless driver)
- Drizzle ORM for schema management and type-safe queries
- Drizzle Kit for schema migrations (`db:push` command)

**UI Component Libraries**
- Radix UI primitives (20+ component primitives for accessibility)
- Lucide React for icon system
- React Hook Form with Zod resolvers for form validation
- Date-fns for date manipulation and formatting
- Embla Carousel for carousel/slider components
- CMDK for command palette interfaces

**Build & Development Tools**
- ESBuild for server bundling in production
- Vite for client bundling and development server
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner

**Session Management**
- Express session middleware with connect-pg-simple for PostgreSQL session storage
- Support for in-memory session storage via memorystore (development fallback)

**Styling & Theming**
- Tailwind CSS with custom configuration
- PostCSS with Autoprefixer
- CSS variables for theme customization (light/dark modes)
- Custom border radius, color palette, and spacing scale

**TypeScript Configuration**
- Strict mode enabled for maximum type safety
- Path aliases configured: `@/*` for client, `@shared/*` for shared code
- ESNext module system with bundler resolution
- Incremental compilation for faster rebuilds
# Design Guidelines: Purchase Order & Inventory Management System

## Design Approach
**System-Based Approach** drawing from modern SaaS productivity tools (Linear, Notion, Stripe Dashboard). This is a utility-focused business application requiring clarity, efficiency, and consistency over visual flair.

## Core Design Principles
1. **Information Hierarchy**: Data clarity above all - users should instantly understand PO statuses, inventory levels, and supplier relationships
2. **Inline Editing Excellence**: The New Purchase Order page is the hero feature - optimize for speed and zero friction
3. **Scannable Tables**: Dense information presented cleanly with consistent row heights and clear column headers
4. **Action Accessibility**: Primary actions (Save Draft, Submit PO, Add Line Item) always visible and contextually placed

## Typography System
**Font Family**: Inter or System UI Stack via Google Fonts
- Page Headers: 24px, semibold (600)
- Section Headers: 18px, semibold (600)
- Table Headers: 14px, medium (500), uppercase tracking
- Body/Table Content: 14px, regular (400)
- Labels: 12px, medium (500)
- Buttons: 14px, medium (500)

## Layout & Spacing
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Page padding: p-8
- Section gaps: gap-8
- Card/Container padding: p-6
- Form field spacing: gap-4
- Table cell padding: px-4 py-3
- Button padding: px-4 py-2

**Layout Structure**:
- Sidebar Navigation: 240px fixed width, full height
- Main Content Area: max-w-7xl centered with px-8
- Two-column layouts where needed: 60/40 split (table/form on Products/Suppliers pages)

## Navigation & Header
**Sidebar Navigation** (sticky, full height):
- Logo/App name at top (mb-8)
- Navigation links stacked vertically (gap-2)
- Active state: subtle background treatment
- Icons from Heroicons (outline style, 20px)

**Page Header Pattern**:
- Breadcrumb navigation (text-sm)
- Page title (text-2xl, font-semibold, mb-2)
- Action buttons aligned right at header level

## Component Library

### Tables (Core Component)
**Standard Table Pattern**:
- Sticky header row
- Alternating row hover states
- Row height: 52px minimum
- Column alignment: Left for text, right for numbers
- Action columns: Fixed right with subtle icons
- Empty states: Centered with helpful messaging

**Filters Section** (above table):
- Horizontal layout with gap-4
- Dropdowns and search inputs inline
- "Clear Filters" link at end

### Forms & Inputs
**Input Fields**:
- Height: h-10
- Border: 1px, rounded corners (rounded-md)
- Focus state: ring treatment
- Labels above inputs (mb-2)

**Dropdowns/Select**:
- Consistent with input height
- Chevron indicator
- Searchable for long lists (especially Product dropdown in PO)

**Inline Editable Inputs** (Purchase Order line items):
- Minimal chrome - blend with table when not focused
- Clear focus states
- Number inputs right-aligned

### Buttons
**Primary Actions**: Solid fill, medium size (px-4 py-2)
**Secondary Actions**: Bordered outline style
**Danger Actions**: Visually distinct (Delete row)
**Add Actions**: "Add Line Item" - secondary style with plus icon

### Cards & Containers
**Container Pattern**:
- Background: subtle panel treatment
- Border: 1px
- Rounded: rounded-lg
- Shadow: minimal, only on hover for interactive elements
- Padding: p-6

### Purchase Order Line Items Table (Critical Feature)
**Special Treatment**:
- Each row fully editable inline
- Product dropdown: 40% width
- Quantity input: 15% width, number type
- Unit Price: 20% width, currency format
- Total: 15% width, read-only, right-aligned, medium weight
- Delete button: 10% width, icon only
- Add Line Item button below table (secondary style)
- Running totals section: Right-aligned, distinguished with border-top, pt-4

**Bottom Totals Display**:
- Subtotal row
- Tax row (if applicable)
- **Total row**: Larger text, semibold

### Status Badges
**PO Status Indicators**:
- Draft: Neutral treatment
- Awaiting Delivery: Info/blue treatment
- Partially Received: Warning treatment
- Complete: Success treatment
- Pill shape, text-xs, px-3 py-1

### Dashboard Cards
**Metric Cards** (4-column grid on desktop, stack on mobile):
- Large number display (text-3xl, font-bold)
- Label below (text-sm)
- Icon top-right (24px)
- Minimal padding (p-6)

## Responsive Behavior
- Desktop (lg): Full multi-column layouts, sidebar always visible
- Tablet (md): Sidebar collapses to icon-only or hamburger
- Mobile (base): Stack all columns, tables scroll horizontally, forms full-width

## Page-Specific Guidelines

### New Purchase Order Page (Priority Design)
- Top section: 3-column grid (Supplier dropdown, Expected Date, Status badge)
- Generous spacing around line items table (mt-8)
- Sticky action buttons at bottom or top-right
- Auto-save indicator if implementing drafts

### Receive Purchase Order Page
- PO header info in read-only card at top
- Line items table with "Quantity Received" column highlighted
- Side-by-side: Ordered vs Received columns
- Large "Receive Items" button bottom-right

### Products & Suppliers Pages
- Table on left (65%), form panel on right (35%)
- Form sticky while scrolling table
- Clear "Cancel" action to close form

### Inventory Page
- Filters prominent at top
- Stock level indicators (visual bars or badges)
- "Adjust Stock" button per row or bulk selection

## Images
No hero images required - this is an internal business tool. Use only functional icons from Heroicons throughout the interface.
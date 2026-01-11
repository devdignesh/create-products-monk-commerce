# Product list manager

A React app to pick products, select variants, apply discounts and reorder everything using drag & drop. Built with React, Typescript, TailwindCSS, dnd-kit (drag & drop) and host on [Netlify](https://create-products-monk-commerce.netlify.app/).

#### Demo Video (Loom)
Loom walkthrough: https://www.loom.com/share/629ce0b1d3ff493996bdcbe6e807ea0b

---
## Tech stack

* React + TypeScript
* Vite
* dnd-kit (drag & drop)
* Context API (state management)
* Tailwind CSS

---

## Features

* Product picker modal with variants
* Select product or individual variants
* Merge variants when the same product is added multiple times
* Drag & drop for products and variants (dnd-kit)
* Discount per product
* Prevent duplicate variant selection
* Clean, understandable UI

---

## Getting started

```bash
npm install
npm run dev
```
---

## Environment variables

Create a `.env` file at the root:

```env
VITE_API_URL=https://stageapi.monkcommerce.app/task/products/search
VITE_API_KEY=<API_KEY>

```

---

## Approach

* **Product is the source of truth** – variants always belong to a product
* **Selections are additive** – selecting new variants never removes existing ones
* **Local state kept minimal** – heavy logic stays close to where it’s used
* **IDs over indexes** – safer reordering and updates

---

## Optimization notes

* Avoid unnecessary re-renders by:

  * Memoizing list items where needed
  * Keeping modal selection state separate from main list state
* No deep cloning of large objects
* Drag events only update state on `onDragEnd`

---

## Notes

* Stock / availability is derived from `inventory_quantity` on variants
* Variants with zero quantity are treated as unavailable

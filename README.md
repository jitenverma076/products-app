## Product Dashboard

A clean, responsive product dashboard powered by DummyJSON. It includes a table with pagination, search, category filter, and full CRUD with React Query. The UI is minimal, fast, and mobile-friendly.

### Quick start

1) Install deps

```bash
npm i
```

2) Start the dev server

```bash
npm run dev
```

Open the printed local URL in your browser.

### Features

- Responsive layout: sidebar, floating header, grid hero, table/cards.
- Products list with pagination, search, and category filter.
- Add / Edit / Delete using DummyJSON endpoints with optimistic updates.
- Loading skeletons, error states, and empty states handled gracefully.

### Tech stack

- React
- TailwindCSS
- TanStack React Query (data fetching, cache, mutations)
- Shad cn ui

### API endpoints (DummyJSON)

- List: `GET https://dummyjson.com/products?limit=10&skip=0`
- Search: `GET https://dummyjson.com/products/search?q=...&limit=10&skip=0`
- By category: `GET https://dummyjson.com/products/category/{category}?limit=10&skip=0`
- Add: `POST https://dummyjson.com/products/add`
- Edit: `PUT https://dummyjson.com/products/{id}`
- Delete: `DELETE https://dummyjson.com/products/{id}`

### Project structure

```
src/
  components/ui/    # button, card, dialog, table, input, skeleton, badge
  features/products/ # api.js and ProductsView.jsx
  App.jsx
  main.jsx
  index.css
```

### Customization tips

- Edit `src/components/ui/*` to tweak UI tokens (radius, shadow, colors).
- Adjust header text in `src/App.jsx`.
- Modify page size or delay in `src/features/products/api.js`.

### Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
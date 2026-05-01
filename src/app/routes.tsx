import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { EntriesList } from "./pages/EntriesList";
import { EntryDetail } from "./pages/EntryDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/entries",
    Component: EntriesList,
  },
  {
    path: "/entry/new",
    Component: EntryDetail,
  },
  {
    path: "/entry/:id",
    Component: EntryDetail,
  },
]);

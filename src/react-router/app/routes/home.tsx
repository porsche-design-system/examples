import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { PWordmark } from "@porsche-design-system/components-react/ssr";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <div className="grid justify-items-center gap-fluid-md m-static-lg p-fluid-lg bg-surface rounded-lg">
        <PWordmark />
        <h1 className="prose-display-md">Porsche Design System</h1>
      </div>
      <Welcome />
    </>
  );
}

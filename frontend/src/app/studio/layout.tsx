import { ReactNode } from "react";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background">
      {children}
    </div>
  );
}

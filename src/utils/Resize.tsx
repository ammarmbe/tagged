"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/Sidebar";
import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function Resize({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [minSize, setMinSize] = useState(20);
  const [collapsedSize, setCollapsedSize] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  useLayoutEffect(() => {
    function setSize() {
      if (window.innerWidth < 640) {
        setDirection("vertical");
        setMinSize((64 / window.innerHeight) * 100);
        setCollapsedSize((64 / window.innerHeight) * 100);
      } else {
        setDirection("horizontal");
        if (pathname.startsWith("/settings")) {
          setMinSize((61 / window.innerWidth) * 100);
          setCollapsedSize((61 / window.innerWidth) * 100);
        } else {
          setMinSize((270 / window.innerWidth) * 100);
          setCollapsedSize((61 / window.innerWidth) * 100);
        }
      }
    }

    setSize();

    window.addEventListener("resize", setSize);

    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, [pathname]);

  return (
    <PanelGroup
      direction={direction}
      id="main"
      autoSaveId="main"
      className="fixed top-0 flex h-screen !flex-col-reverse sm:flex-row"
    >
      <Panel
        collapsible={direction === "horizontal"}
        collapsedSize={collapsedSize}
        minSize={minSize}
        maxSize={minSize}
        defaultSize={minSize}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
        className="sticky top-0 h-screen"
      >
        <Sidebar collapsed={collapsed} direction={direction} />
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={80} className="!overflow-y-auto !overflow-x-hidden">
        {children}
      </Panel>
    </PanelGroup>
  );
}

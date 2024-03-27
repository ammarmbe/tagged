"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "@/components/Sidebar";
import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function Resize({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [minSize, setMinSize] = useState(20);
  const [maxSize, setMaxSize] = useState(30);
  const [defaultSize, setDefaultSize] = useState(20);
  const [collapsedSize, setCollapsedSize] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useLayoutEffect(() => {
    function setSize() {
      if (pathname.startsWith("/settings")) {
        setMinSize((61 / window.innerWidth) * 100);
        setDefaultSize((61 / window.innerWidth) * 100);
        setMaxSize((61 / window.innerWidth) * 100);
        setCollapsedSize((61 / window.innerWidth) * 100);
        return;
      }

      setMinSize((270 / window.innerWidth) * 100);
      setDefaultSize((270 / window.innerWidth) * 100);
      setMaxSize((400 / window.innerWidth) * 100);
      setCollapsedSize((61 / window.innerWidth) * 100);
    }

    setSize();

    window.addEventListener("resize", setSize);

    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, [pathname]);

  return (
    <PanelGroup
      direction="horizontal"
      id="main"
      autoSaveId="main"
      className="fixed top-0 flex h-screen"
    >
      <Panel
        collapsible
        collapsedSize={collapsedSize}
        minSize={minSize}
        maxSize={Math.min(maxSize, 40)}
        defaultSize={defaultSize}
        onCollapse={() => setCollapsed(true)}
        onExpand={() => setCollapsed(false)}
        className="sticky top-0 hidden h-screen sm:block"
      >
        <Sidebar collapsed={collapsed} />
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={80} className="!overflow-y-auto !overflow-x-hidden">
        {children}
      </Panel>
    </PanelGroup>
  );
}

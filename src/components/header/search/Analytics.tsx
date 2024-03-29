import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo } from "react";
import { RiArrowRightSLine } from "react-icons/ri";

const analytics = [
  { name: "Revenue overview", link: "/#revenue-overview" },
  { name: "Potential revenue", link: "/#revenue-overview" },
  { name: "Revenue by category", link: "/#revenue-by-category" },
  { name: "Views overview", link: "/#views-overview" },
  {
    name: "Views by category",
    link: "/#views-by-category",
  },
  {
    name: "Most viewed item",
    link: "/#views-overview",
  },
  { name: "Most viewed category", link: "/#views-overview" },
  { name: "Best selling items", link: "/#best-sellers" },
];

export default function Analytics({ searchTerm }: { searchTerm: string }) {
  const fuse = useMemo(
    () =>
      new Fuse(analytics, {
        keys: ["name"],
        shouldSort: true,
        threshold: 0.3,
      }),
    [],
  );

  const results = useMemo(() => {
    return fuse.search(searchTerm, { limit: 3 });
  }, [fuse, searchTerm]);

  if (!searchTerm) {
    return (
      <div className="border-t p-4">
        <p className="label-small text-text-500">Analytics</p>
        <div className="mt-2">
          {analytics.slice(0, 3).map((result, index) => (
            <Link
              key={index}
              href={result.link}
              className="group flex items-center rounded-lg border-bg-200 p-2 pl-3 hover:bg-bg-100"
            >
              <p className="paragraph-small flex-grow">{result.name}</p>
              <span className="rounded-full bg-white text-text-500 opacity-0 shadow-sm group-hover:opacity-100">
                <RiArrowRightSLine size={20} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return results.length ? (
    <div className="border-t p-4">
      <p className="label-small text-text-500">Analytics</p>
      <div className="mt-2">
        {results.map((result, index) => (
          <Link
            key={index}
            href={result.item.link}
            className="group flex items-center rounded-lg border-bg-200 p-2 pl-3 hover:bg-bg-100"
          >
            <p className="paragraph-small flex-grow">{result.item.name}</p>
            <span className="rounded-full bg-white text-text-500 opacity-0 shadow-sm group-hover:opacity-100">
              <RiArrowRightSLine size={20} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  ) : null;
}

import Link from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";
import Fuse from "fuse.js";
import { useMemo } from "react";

const settings = [
  { name: "Change store name", link: "/settings/profile#name" },
  { name: "Change store email address", link: "/settings/profile#email" },
  { name: "Change shipping price", link: "/settings/shipping#price" },
  {
    name: "Change exchange policy",
    link: "/settings/shipping#exchange_policy",
  },
  {
    name: "Change return policy",
    link: "/settings/shipping#return_policy",
  },
  { name: "Change password", link: "/settings/privacy#password" },
];

export default function Settings({ searchTerm }: { searchTerm: string }) {
  const fuse = useMemo(
    () =>
      new Fuse(settings, {
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
        <p className="label-small text-text-600">Settings</p>
        <div className="mt-2">
          {settings.slice(0, 3).map((result, index) => (
            <Link
              key={index}
              href={result.link}
              className="border-bg-300 hover:bg-bg-50 group flex items-center rounded-lg p-2 pl-3"
            >
              <p className="paragraph-small flex-grow">{result.name}</p>
              <span className="bg-bg-0 text-text-600 rounded-full opacity-0 shadow-sm group-hover:opacity-100">
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
      <p className="label-small text-text-600">Settings</p>
      <div className="mt-2">
        {results.map((result, index) => (
          <Link
            key={index}
            href={result.item.link}
            className="border-bg-300 hover:bg-bg-50 group flex items-center rounded-lg p-2 pl-3"
          >
            <p className="paragraph-small flex-grow">{result.item.name}</p>
            <span className="bg-bg-0 text-text-600 rounded-full opacity-0 shadow-sm group-hover:opacity-100">
              <RiArrowRightSLine size={20} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  ) : null;
}

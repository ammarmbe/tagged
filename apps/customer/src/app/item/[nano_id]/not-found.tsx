import { Search } from "lucide-react";

export default function notFound() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="gap-3 overflow-hidden rounded-xl border p-10 text-center">
        <div className="relative -my-40 mx-auto w-fit">
          <svg
            width="566"
            height="566"
            viewBox="0 0 566 566"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Cart button</title>
            <mask
              id="mask0_4_24"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="566"
              height="566"
            >
              <rect width="566" height="566" fill="url(#paint0_radial_4_24)" />
            </mask>
            <g mask="url(#mask0_4_24)">
              <circle cx="283" cy="283" r="56.1" stroke="#EAECF0" />
              <circle cx="283" cy="283" r="282.5" stroke="#EAECF0" />
              <circle cx="283" cy="283" r="244.767" stroke="#EAECF0" />
              <circle cx="283" cy="283" r="207.033" stroke="#EAECF0" />
              <circle cx="283" cy="283" r="93.8333" stroke="#EAECF0" />
              <circle cx="283" cy="283" r="130.387" stroke="#EAECF0" />
              <circle cx="283" cy="283" r="169.3" stroke="#EAECF0" />
            </g>
            <defs>
              <radialGradient
                id="paint0_radial_4_24"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(283 283) rotate(90) scale(283)"
              >
                <stop />
                <stop offset="1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          <div
            style={{
              boxShadow: "0 1px 2px 0 #1018280D",
            }}
            className="text-secondary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-3.5"
          >
            <Search size={28} />
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Item not found...</h1>
          <p className="mt-4 text-lg">
            Sorry, the item you are looking for doesn&apos;t exist. Try
            searching our site:
          </p>
          <div className="mt-12 flex justify-center gap-3">
            <div className="relative">
              <input
                type="text"
                className="input !w-fit"
                placeholder="Search our site"
              />
              <button
                type="button"
                className="text-quaternary absolute right-[calc((2.5rem+2px)/2)] top-[calc((2.5rem+2px)/2)] -translate-y-1/2 translate-x-1/2 p-2"
              >
                <Search size={18} />
              </button>
            </div>
            <button className="button main">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}

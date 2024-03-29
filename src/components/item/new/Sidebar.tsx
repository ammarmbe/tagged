import { RiArrowRightSLine, RiCheckFill } from "react-icons/ri";

const levels = [
  {
    number: 1,
    title: "Item Details",
  },
  {
    number: 2,
    title: "Colors & Sizes",
  },
  {
    number: 3,
    title: "Quantities",
  },
  {
    number: 4,
    title: "Item Summary",
  },
];

export default function Sidebar({ current_level }: { current_level: number }) {
  return (
    <aside className="flex-none bg-bg-100 p-3 sm:m-2 sm:rounded-2xl sm:p-4">
      <div className="flex flex-grow flex-col gap-3">
        <p className="subheading-xsmall hidden p-1 text-text-400 sm:block">
          New Item
        </p>
        <nav className="grid grid-cols-4 flex-col gap-2 sm:flex">
          {levels.map((level) => (
            <div
              key={level.number}
              className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-[10px] p-2 transition-all ${
                level.number === current_level
                  ? "bg-white shadow-[0px_2px_4px_0px_#1B1C1D0A]"
                  : "text-text-500"
              }`}
            >
              {current_level > level.number ? (
                <div className="label-xsmall flex size-6 items-center justify-center rounded-full bg-success p-1 text-center !font-semibold text-white shadow-[0px_2px_4px_0px_#1B1C1D0A] transition-all">
                  <RiCheckFill size={16} />
                </div>
              ) : (
                <div
                  className={`label-xsmall flex size-6 items-center justify-center rounded-full p-1 text-center !font-semibold shadow-[0px_2px_4px_0px_#1B1C1D0A] transition-all ${
                    level.number === current_level
                      ? "bg-bg-700 text-white"
                      : "bg-white text-text-500"
                  }`}
                >
                  {level.number}
                </div>
              )}
              <p className="label-small hidden flex-grow pr-8 sm:block">
                {level.title}
              </p>
              <div
                className={
                  level.number === current_level
                    ? "hidden text-icon-500 transition-all sm:block"
                    : "hidden opacity-0 transition-all sm:block"
                }
              >
                <RiArrowRightSLine size={20} />
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

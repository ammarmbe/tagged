import Spinner from "./Spinner";

export default function Loading({
  isFetching,
  size = 40,
}: {
  isFetching: boolean;
  size?: number;
}) {
  return isFetching ? (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
      <Spinner size={size} fill="fill-main-base" />
    </div>
  ) : null;
}

import Spinner from "./Spinner";

export default function Loading({
  isFetching = true,
  size = 40,
}: {
  isFetching?: boolean;
  size?: number;
}) {
  return isFetching ? (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-0/40 backdrop-blur-[2px]">
      <Spinner size={size} fill="fill-main-base" />
    </div>
  ) : null;
}

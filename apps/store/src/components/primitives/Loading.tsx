import Spinner from "./Spinner";

export default function Loading({
  isLoading = true,
  size = 40,
}: {
  isLoading?: boolean;
  size?: number;
}) {
  return isLoading ? (
    <div className="bg-bg-0/40 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]">
      <Spinner size={size} fill="fill-main-base" />
    </div>
  ) : null;
}

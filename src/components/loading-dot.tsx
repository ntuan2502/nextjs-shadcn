import Loading from "@/components/loading";

export default function LoadingDot() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loading variant="dots" size="lg" />
    </div>
  );
}

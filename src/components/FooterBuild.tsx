export default function FooterBuild() {
  return (
    <div className="text-[11px] opacity-70 mt-6">
      Engine: <b>{process.env.NEXT_PUBLIC_ENGINE_VERSION || "dev"}</b>
      {" · "}Commit: <b>{process.env.NEXT_PUBLIC_COMMIT?.slice(0,7) || "local"}</b>
    </div>
  );
}

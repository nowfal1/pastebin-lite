export const runtime = "nodejs";
import { getPasteRaw } from "@/lib/getPasteRaw";

export default async function PastePage({ params }) {
  const { id } = await params;

  const paste = await getPasteRaw(id);

  if (!paste) {
    return <h1>404 – Paste Not Found</h1>;
  }

  const now = Date.now();

  if (paste.expires_at && now > paste.expires_at) {
    return <h1>404 – Paste Expired</h1>;
  }

  if (paste.remaining_views !== null && paste.remaining_views <= 0) {
    return <h1>404 – No Views Left</h1>;
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
      {paste.content}
    </pre>
  );
}

export default async function PastePage({ params }) {
  const { id } = await params;

  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <h1>404 – Paste Not Found</h1>;
  }

  const data = await res.json();

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
      {data.content}
    </pre>
  );
}

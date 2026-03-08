export default function OGPImage({
  title,
  siteName,
}: {
  title: string;
  siteName: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "1200px",
        height: "630px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "60px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 300,
          color: "rgba(255, 255, 255, 0.8)",
          marginBottom: 20,
        }}
      >
        {siteName}
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
    </div>
  );
}

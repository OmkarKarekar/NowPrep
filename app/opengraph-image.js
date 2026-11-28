import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NowPrep: free ServiceNow practice exams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#001f30", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "#62d84e", color: "#032d42", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800 }}>N</div>
          <div style={{ marginLeft: 20, fontSize: 44, fontWeight: 700, display: "flex" }}>
            Now<span style={{ color: "#62d84e" }}>Prep</span>
          </div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>Free ServiceNow practice exams</div>
        <div style={{ fontSize: 32, color: "#b9c7cf", marginTop: 28, display: "flex" }}>CSA · CAD · CIS-DF · CIS-ITSM · CIS-CSM</div>
      </div>
    ),
    size
  );
}

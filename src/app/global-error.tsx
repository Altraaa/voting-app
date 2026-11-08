"use client";

import { useEffect } from "react";

// Fallback terakhir bila root layout ikut crash. Menggantikan seluruh <html>,
// jadi tidak bergantung pada CSS/komponen aplikasi (pakai inline style).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="id" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <title>Terjadi Kesalahan</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "32px 24px",
          }}
        >
          <h1 style={{ fontSize: "20px", margin: "0 0 8px" }}>
            Terjadi Kesalahan
          </h1>
          <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 24px" }}>
            Maaf, halaman gagal dimuat. Silakan muat ulang halaman. Jika
            masalah berlanjut, matikan fitur terjemahan otomatis di browser
            Anda.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Muat Ulang
            </button>
            {/* <a> biasa (bukan <Link>) supaya terjadi full reload:
                root layout sedang crash, jadi navigasi client tidak bisa diandalkan. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                color: "#0f172a",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Ke Beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

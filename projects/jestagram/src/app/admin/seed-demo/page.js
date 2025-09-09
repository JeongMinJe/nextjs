// app/admin/seed-demo/page.js
"use client";

import { useState } from "react";

export default function SeedDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeedData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/seed-demo", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            데모 데이터 생성
          </h1>
          <button
            onClick={handleSeedData}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "생성 중..." : "데모 데이터 생성"}
          </button>
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

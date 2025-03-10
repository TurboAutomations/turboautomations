import { ConnectionTest } from "@/components/connection-test"

export default function ConnectionTestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Connection Test</h1>
      <ConnectionTest />
    </div>
  )
}


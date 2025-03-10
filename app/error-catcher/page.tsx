import { SupabaseErrorCatcher } from "@/components/supabase-error-catcher"

export default function ErrorCatcherPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Supabase Error Catcher</h1>
      <SupabaseErrorCatcher />
    </div>
  )
}


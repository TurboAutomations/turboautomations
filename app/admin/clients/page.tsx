import { supabaseAdmin } from "@/lib/supabase-admin"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users } from "lucide-react"
import { revalidatePath } from "next/cache"

// This is a server component
export default async function AdminClientsPage() {
  // Use supabaseAdmin to fetch all clients
  const { data: clients, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Force revalidation of this page
  revalidatePath("/admin/clients")

  return (
    <div className="container space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Clients</h1>
          <p className="text-lg text-muted-foreground">Create and manage client accounts</p>
        </div>
        <Link href="/admin/clients/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-800 dark:text-red-300">Error loading clients: {error.message}</p>
        </div>
      ) : clients && clients.length > 0 ? (
        <div className="grid gap-6">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{client.company_name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{client.contact_name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/clients/${client.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/clients/${client.id}/automations`}>
                    <Button variant="outline" size="sm">
                      Manage Automations
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Contact Email</p>
                    <p className="text-sm text-muted-foreground">{client.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{client.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">{new Date(client.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No clients yet</h3>
          <p className="text-muted-foreground mb-4">Add your first client to get started</p>
          <Link href="/admin/clients/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}


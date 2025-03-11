"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import { PlusCircle, Users } from "lucide-react"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true)

        // Fetch clients from profiles table where role is 'client'
        const { data, error } = await supabase.from("profiles").select("*").eq("role", "client")

        if (error) throw error

        setClients(data || [])
      } catch (error) {
        console.error("Error fetching clients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Function to generate initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "CL"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => router.push("/admin/clients/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">Loading clients...</div>
      ) : clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No clients yet</h3>
            <p className="text-gray-500 mb-4 text-center">
              You haven't added any clients yet. Add your first client to get started.
            </p>
            <Button onClick={() => router.push("/admin/clients/new")}>Add Your First Client</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-medium">
                      {getInitials(client.company_name || client.contact_name)}
                    </span>
                  </div>
                  <div>
                    <CardTitle>{client.company_name}</CardTitle>
                    <CardDescription>
                      {client.contact_name} • {client.contact_email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  <p>Created: {new Date(client.created_at).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/clients/${client.id}`)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


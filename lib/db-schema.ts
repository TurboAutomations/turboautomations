// This is a TypeScript schema definition for your database
// You would implement this with your preferred database (Prisma, Drizzle, etc.)

export type Client = {
    id: string
    name: string
    logo: string
    primaryColor: string
    secondaryColor: string
    createdAt: Date
    updatedAt: Date
  }
  
  export type ClientUser = {
    id: string
    clientId: string
    email: string
    name: string
    role: "admin" | "user"
    createdAt: Date
    updatedAt: Date
  }
  
  export type Automation = {
    id: string
    name: string
    description: string
    type: string
    schedule: string
    scriptContent: string
    createdAt: Date
    updatedAt: Date
  }
  
  export type ClientAutomation = {
    id: string
    clientId: string
    automationId: string
    status: "active" | "inactive" | "error"
    lastRun?: Date
    nextRun?: Date
    createdAt: Date
    updatedAt: Date
  }
  
  export type AutomationRun = {
    id: string
    clientAutomationId: string
    status: "success" | "failure" | "running"
    startedAt: Date
    completedAt?: Date
    logs: string
    result?: string
  }
  
  
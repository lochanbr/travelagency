'use client'

import { useState } from 'react'
import { TripForm } from '@/components/trip-form'
import { TripResults } from '@/components/trip-results'
import { ThemeToggle } from '@/components/theme-toggle'
import type { TripPlan, TripFormData } from '@/lib/types'
import { Plane, Sparkles } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TripFormData) => {
    setIsLoading(true)
    setError(null)
    setCurrency(data.currency)

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate trip plan')
      }

      const result = await response.json()
      setTripPlan(result.tripPlan)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setTripPlan(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Plane className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Smart Travel Planner
            </h1>
          </div>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-powered trip planning for your perfect adventure
            <Sparkles className="h-5 w-5 text-primary" />
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!tripPlan ? (
          <div className="max-w-xl mx-auto">
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl shadow-primary/5">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary/10">
                  <Plane className="h-4 w-4 text-primary" />
                </span>
                Plan Your Trip
              </h2>
              <TripForm onSubmit={handleSubmit} isLoading={isLoading} />
              {error && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <TripResults
              tripPlan={tripPlan}
              currency={currency}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Powered by AI • Built with Next.js
          </p>
        </div>
      </footer>
    </main>
  )
}

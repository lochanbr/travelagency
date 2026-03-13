'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CURRENCIES, INTERESTS, type TripFormData } from '@/lib/types'
import { Plane } from 'lucide-react'

interface TripFormProps {
  onSubmit: (data: TripFormData) => void
  isLoading: boolean
}

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [mounted, setMounted] = useState(false)
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState<number | ''>('')
  const [budget, setBudget] = useState<number | ''>('')
  const [currency, setCurrency] = useState('USD')
  const [interests, setInterests] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleInterest = (interestId: string) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((i) => i !== interestId)
        : [...prev, interestId]
    )
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!destination.trim()) {
      newErrors.destination = 'Please enter a destination'
    }
    if (!days || days < 1) {
      newErrors.days = 'Please enter at least 1 day'
    }
    if (days && days > 30) {
      newErrors.days = 'Maximum 30 days allowed'
    }
    if (!budget || budget < 1) {
      newErrors.budget = 'Please enter a valid budget'
    }
    if (interests.length === 0) {
      newErrors.interests = 'Please select at least one interest'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        destination,
        days: days as number,
        budget: budget as number,
        currency,
        interests,
      })
    }
  }

  // Prevent hydration mismatch from browser extensions
  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-secondary rounded" />
          <div className="h-10 bg-secondary rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-secondary rounded" />
          <div className="h-10 bg-secondary rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-secondary rounded" />
            <div className="h-10 bg-secondary rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-secondary rounded" />
            <div className="h-10 bg-secondary rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-20 bg-secondary rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 w-24 bg-secondary rounded-full" />
            ))}
          </div>
        </div>
        <div className="h-14 bg-secondary rounded" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destination" className="text-foreground">
          Destination
        </Label>
        <Input
          id="destination"
          placeholder="e.g., Tokyo, Japan"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value)
            if (errors.destination) {
              setErrors((prev) => ({ ...prev, destination: '' }))
            }
          }}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        {errors.destination && (
          <p className="text-sm text-red-400">{errors.destination}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="days" className="text-foreground">
          Number of Days
        </Label>
        <Input
          id="days"
          type="number"
          min={1}
          max={30}
          placeholder="e.g., 7"
          value={days}
          onChange={(e) => {
            setDays(e.target.value ? parseInt(e.target.value) : '')
            if (errors.days) {
              setErrors((prev) => ({ ...prev, days: '' }))
            }
          }}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        {errors.days && <p className="text-sm text-red-400">{errors.days}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-foreground">
            Budget
          </Label>
          <Input
            id="budget"
            type="number"
            min={1}
            placeholder="e.g., 3000"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value ? parseInt(e.target.value) : '')
              if (errors.budget) {
                setErrors((prev) => ({ ...prev, budget: '' }))
              }
            }}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          {errors.budget && (
            <p className="text-sm text-red-400">{errors.budget}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-foreground">
            Currency
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-foreground">Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                interests.includes(interest.id)
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {interest.emoji} {interest.label}
            </button>
          ))}
        </div>
        {errors.interests && (
          <p className="text-sm text-red-400">{errors.interests}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            AI is crafting your perfect trip...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Generate My Trip <Plane className="h-5 w-5" />
          </span>
        )}
      </Button>
    </form>
  )
}

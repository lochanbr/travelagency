'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { TripPlan } from '@/lib/types'
import {
  Calendar,
  DollarSign,
  Utensils,
  MapPin,
  Backpack,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Clock,
  Lightbulb,
  RefreshCw,
} from 'lucide-react'

interface TripResultsProps {
  tripPlan: TripPlan
  currency: string
  onReset: () => void
}

const CHART_COLORS = [
  '#00b4ff',
  '#00d4aa',
  '#a855f7',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
]

export function TripResults({ tripPlan, currency, onReset }: TripResultsProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }))
  }

  const budgetData = [
    { name: 'Flights', value: tripPlan.budgetBreakdown.flights },
    { name: 'Accommodation', value: tripPlan.budgetBreakdown.accommodation },
    { name: 'Food', value: tripPlan.budgetBreakdown.food },
    { name: 'Activities', value: tripPlan.budgetBreakdown.activities },
    { name: 'Transport', value: tripPlan.budgetBreakdown.transport },
    { name: 'Contingency', value: tripPlan.budgetBreakdown.contingency },
  ]

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      AUD: 'A$',
      JPY: '¥',
    }
    return `${symbols[currency] || currency}${amount.toLocaleString()}`
  }

  const totalBudget = Object.values(tripPlan.budgetBreakdown).reduce(
    (a, b) => a + b,
    0
  )

  const getPriceIndicator = (priceRange: string) => {
    const count = (priceRange.match(/\$/g) || []).length || 1
    return (
      <span className="text-primary font-semibold">
        {'$'.repeat(count)}
        <span className="text-muted-foreground">{'$'.repeat(4 - count)}</span>
      </span>
    )
  }

  const getMealBadgeColor = (type: string) => {
    const lower = type.toLowerCase()
    if (lower.includes('breakfast'))
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    if (lower.includes('lunch'))
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    if (lower.includes('dinner'))
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    return 'bg-primary/20 text-primary border-primary/30'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Overview Card */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Trip Overview
            </CardTitle>
            <Button
              variant="outline"
              onClick={onReset}
              className="border-border text-foreground hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Plan Another Trip
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {tripPlan.overview}
          </p>
        </CardContent>
      </Card>

      {/* Quick Tips - Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {tripPlan.quickTips.map((tip, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-foreground flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="whitespace-nowrap">{tip}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary/50 p-1">
          <TabsTrigger
            value="itinerary"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
            Itinerary
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <DollarSign className="h-4 w-4 mr-2 hidden sm:inline" />
            Budget
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Utensils className="h-4 w-4 mr-2 hidden sm:inline" />
            Food
          </TabsTrigger>
          <TabsTrigger
            value="attractions"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MapPin className="h-4 w-4 mr-2 hidden sm:inline" />
            Attractions
          </TabsTrigger>
          <TabsTrigger
            value="packing"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Backpack className="h-4 w-4 mr-2 hidden sm:inline" />
            Packing
          </TabsTrigger>
        </TabsList>

        {/* Itinerary Tab */}
        <TabsContent value="itinerary" className="mt-6 space-y-4">
          {tripPlan.itinerary.map((day) => (
            <Card
              key={day.day}
              className="bg-card/50 backdrop-blur border-border/50 overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
                <CardTitle className="text-lg text-foreground flex items-center justify-between">
                  <span>Day {day.day}</span>
                  <Badge
                    variant="outline"
                    className="border-primary/50 text-primary"
                  >
                    {day.theme}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Sun className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Morning
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.morning}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Sunset className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Afternoon
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.afternoon}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Moon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Evening
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.evening}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Highlight: {day.highlight}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="mt-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Budget Breakdown
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {formatCurrency(totalBudget)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {budgetData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(240 10% 15%)',
                        border: '1px solid hsl(240 10% 28%)',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend
                      formatter={(value) => (
                        <span className="text-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {budgetData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Food Tab */}
        <TabsContent value="food" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {tripPlan.foodRecommendations.map((food, index) => (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur border-border/50"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">
                      {food.name}
                    </h3>
                    {getPriceIndicator(food.priceRange)}
                  </div>
                  <Badge
                    variant="outline"
                    className={`mb-3 ${getMealBadgeColor(food.type)}`}
                  >
                    {food.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {food.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Attractions Tab */}
        <TabsContent value="attractions" className="mt-6 space-y-4">
          {tripPlan.topAttractions.map((attraction, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border/50"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">
                    {attraction.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-primary/50 text-primary"
                  >
                    {attraction.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {attraction.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4 text-primary" />
                  Best time: {attraction.bestTime}
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-foreground flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{attraction.tip}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Packing Tab */}
        <TabsContent value="packing" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(tripPlan.packingList).map(([category, items]) => (
              <Card
                key={category}
                className="bg-card/50 backdrop-blur border-border/50"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-foreground capitalize">
                    {category === 'healthSafety'
                      ? 'Health & Safety'
                      : category === 'activitySpecific'
                        ? 'Activity Specific'
                        : category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.map((item, index) => {
                    const itemKey = `${category}-${index}`
                    return (
                      <label
                        key={itemKey}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={checkedItems[itemKey] || false}
                          onCheckedChange={() => toggleItem(itemKey)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span
                          className={`text-sm ${
                            checkedItems[itemKey]
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {item}
                        </span>
                      </label>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

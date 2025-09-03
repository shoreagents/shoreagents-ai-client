"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MedalIcon, 
  AwardIcon,
  StarIcon,
  CrownIcon
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface LeaderboardEntry {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email: string
  profile_picture: string | null
  department_name: string | null
  productivity_score: number
  total_active_seconds: number
  total_inactive_seconds: number
  total_seconds: number
  active_percentage: number
  rank: number
}

interface ActivityRankingsProps {
  leaderboardData: LeaderboardEntry[] // Expected to be pre-limited to top 3 from API
  className?: string
  title?: string
  description?: string
  maxRows?: number
  scrollable?: boolean
  visibleRows?: number
}

export function ActivityRankings({ 
  leaderboardData, 
  className, 
  title = "Leaderboards", 
  description = "Top 3 team members based on activity points for this month.", 
  maxRows,
  scrollable = false,
  visibleRows = 3,
}: ActivityRankingsProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push('/leaderboard')
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="h-4 w-4 text-yellow-500" />
      case 2:
        return <MedalIcon className="h-4 w-4 text-gray-500" />
      case 3:
        return <AwardIcon className="h-4 w-4 text-amber-600" />
      case 4:
        return <StarIcon className="h-4 w-4 text-blue-500" />
      case 5:
        return <StarIcon className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const formatActiveTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatPoints = (seconds: number) => {
    return seconds.toLocaleString()
  }

  const rows = leaderboardData // Data is already limited to top 3 from API

  // Enforce fixed heights so we can precisely cap visible rows
  const rowHeightPx = 56 // h-14
  const headerHeightPx = 48 // h-12
  const capRows = visibleRows ?? 3
  // Subtract a few pixels to avoid any peek of the 4th row due to borders/padding
  const maxHeight = scrollable ? headerHeightPx + rowHeightPx * capRows - 4 : undefined

  return (
    <Card 
      className={`${className} bg-gradient-to-br from-white/60 via-white/10 to-violet-500/30 dark:from-black/70 dark:via-black/20 dark:to-violet-400/40 cursor-pointer transition-all duration-200 group`} 
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex gap-1">
          {/* First Column - Trophy Image */}
          <div className="w-[35%] flex items-end justify-start">
            <img 
              src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/trophy-leaderboard.png"
              alt="Trophy Leaderboard"
              className="w-full h-auto max-w-[200px] object-contain opacity-70 dark:opacity-50 transition-opacity duration-600 group-hover:opacity-90 dark:group-hover:opacity-80"
            />
          </div>
          
          {/* Second Column - Item Containers */}
          <div className={`w-[65%] pr-4 pb-4 ${scrollable ? "overflow-y-auto" : ""}`} style={scrollable ? { maxHeight: maxHeight } : {}}>
            <div className="space-y-3">
              {rows.length > 0 ? (
                rows.map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.profile_picture || undefined} alt={`${entry.first_name} ${entry.last_name}`} />
                        <AvatarFallback>
                          {entry.first_name?.[0]}{entry.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.first_name} {entry.last_name}</span>
                        <div className="flex items-center gap-1">
                          {getRankIcon(index + 1)}
                          <span className={`text-sm font-bold ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-500' :
                            index === 2 ? 'text-amber-600' :
                            'text-muted-foreground'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-medium">{formatPoints(entry.total_active_seconds)}</span>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                  </div>
                ))
              ) : (
                // Skeleton loading states
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/30 animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-white/30 animate-pulse rounded"></div>
                        <div className="flex items-center gap-1">
                          <div className="h-4 w-4 bg-white/30 animate-pulse rounded"></div>
                          <div className="h-4 w-4 bg-white/30 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 bg-white/30 animate-pulse rounded mb-1"></div>
                      <div className="h-3 w-12 bg-white/30 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

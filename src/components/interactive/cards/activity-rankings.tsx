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
  exp_points: number
  rank: number
}

interface ActivityRankingsProps {
  leaderboardData: LeaderboardEntry[]
  className?: string
  title?: string
  description?: string
  maxRows?: number
}

export function ActivityRankings({ leaderboardData, className, title = "Activity Rankings", description = "Complete leaderboard showing all team members and their activity metrics for this month.", maxRows }: ActivityRankingsProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="h-4 w-4 text-yellow-500" />
      case 2:
        return <MedalIcon className="h-4 w-4 text-gray-500" />
      case 3:
        return <AwardIcon className="h-4 w-4 text-amber-600" />
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
    return Math.floor(seconds / 60).toLocaleString()
  }

  const rows = maxRows ? leaderboardData.slice(0, maxRows) : leaderboardData

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Team Member</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead className="text-center">Active Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((entry, index) => (
              <TableRow key={entry.id} className={index < 3 ? "bg-muted/50" : ""}>
                <TableCell className="font-medium">
                  <span className={`text-sm font-medium ${
                    entry.rank === 1 ? 'text-yellow-500' :
                    entry.rank === 2 ? 'text-gray-500' :
                    entry.rank === 3 ? 'text-amber-600' :
                    entry.rank === 4 ? 'text-blue-500' :
                    entry.rank === 5 ? 'text-purple-500' :
                    'text-muted-foreground'
                  }`}>#{entry.rank}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.profile_picture || undefined} alt={`${entry.first_name} ${entry.last_name}`} />
                      <AvatarFallback>
                        {entry.first_name?.[0]}{entry.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {entry.first_name} {entry.last_name}
                        {getRankIcon(entry.rank)}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-mono text-sm">{formatPoints(entry.total_active_seconds)}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-mono text-sm">{formatActiveTime(entry.total_active_seconds)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

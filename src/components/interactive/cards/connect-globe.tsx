"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface GrowthRateCardProps {
  className?: string
}

interface MemberInfo {
  country: string
}

export function GrowthRateCard({ className }: GrowthRateCardProps) {
  const { user } = useAuth()
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemberInfo = async () => {
      if (!user?.memberId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/members?memberId=${user.memberId}`)
        if (response.ok) {
          const data = await response.json()
          setMemberInfo(data)
        }
      } catch (error) {
        console.error('Failed to fetch member info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberInfo()
  }, [user?.memberId])

  return (
    <Card className={`@container/card relative overflow-hidden ${className}`}>
      <CardHeader className="relative">
        <CardDescription>Connect</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
        </CardTitle>
      </CardHeader>
      <CardContent className="relative h-64 w-full grid place-items-center">
        <Image
          src="https://sanljwkkoawwdpaxrper.supabase.co/storage/v1/object/public/designs/global.png"
          alt="Growth Globe"
          width={350}
          height={350}
          className="col-start-1 row-start-1 object-contain h-full w-auto"
        />
        <div className="col-start-1 row-start-1">
          <Badge variant="outline" className="rounded-full text-sm px-3 py-1 bg-white/80 backdrop-blur-sm border-border text-black">
            {loading ? "Loading..." : (memberInfo?.country || "Unknown")}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
      </CardFooter>
    </Card>
  )
}

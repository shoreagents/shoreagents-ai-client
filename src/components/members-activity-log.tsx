'use client'

import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '@/contexts/auth-context'
import { Comment } from '@/components/ui/comment'
import { useRealtimeActivityLogs, createMembersConfig } from '@/hooks/use-realtime-activity-logs'

interface ActivityLogEntry {
  id: string
  type: 'activity'
  action: string
  fieldName: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
  userName: string | null
  userId: number | null
}

interface CommentEntry {
  id: string
  type: 'comment'
  comment: string
  createdAt: string
  userName: string | null
  userId: number | null
}

type ActivityLogItem = ActivityLogEntry | CommentEntry

interface ActivityLogProps {
  memberId: number
  companyName: string
  onRefresh?: () => void
}

export function MembersActivityLog({ memberId, companyName, onRefresh }: ActivityLogProps) {
  const { user: currentUser, loading: authLoading } = useAuth()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [allLoadedEntries, setAllLoadedEntries] = useState<ActivityLogItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isAutoLoading, setIsAutoLoading] = useState(false)
  
  // Use realtime hook for real-time updates
  const {
    allEntries: realtimeEntries,
    loading: realtimeLoading,
    error: realtimeError,
    isConnected,
    addComment,
    deleteComment,
    refreshData
  } = useRealtimeActivityLogs(createMembersConfig(memberId))
  
  // Fetch activities and comments with pagination
  const fetchActivitiesAndComments = useCallback(async (page: number = 1, append: boolean = false) => {
    console.log('🔄 fetchActivitiesAndComments called:', { page, append, isLoadingMore })
    
    if (isLoadingMore) return
    
    try {
      setIsLoadingMore(true)
      
      const response = await fetch(`/api/members/${memberId}/activity?page=${page}&limit=20`)
      
      if (response.ok) {
        const data = await response.json()
        const newEntries = data.entries || []
        
        // Transform entries to match our interface
        const transformedEntries: ActivityLogItem[] = newEntries.map((entry: any) => {
          if (entry.type === 'comment') {
            return {
              id: entry.id,
              type: 'comment' as const,
              comment: entry.comment,
              createdAt: entry.createdAt,
              userName: entry.userName || 'Unknown User',
              userId: entry.userId
            }
          } else {
            return {
              id: entry.id,
              type: 'activity' as const,
              action: entry.action,
              fieldName: entry.fieldName,
              oldValue: entry.oldValue,
              newValue: entry.newValue,
              createdAt: entry.createdAt,
              userName: entry.userName || 'Unknown User',
              userId: entry.userId
            }
          }
        })
        
        if (append) {
          setAllLoadedEntries(prev => [...prev, ...transformedEntries])
        } else {
          setAllLoadedEntries(transformedEntries)
        }
        
        setTotalCount(data.pagination?.totalCount || 0)
        setCurrentPage(page)
        setHasMore(page < (data.pagination?.totalPages || 1))
        
        console.log('✅ Pagination data loaded:', {
          page,
          totalCount: data.pagination?.totalCount,
          entriesInResponse: newEntries.length,
          hasMore: page < (data.pagination?.totalPages || 1)
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch activities and comments:', response.status, errorData)
        if (!append) {
          setAllLoadedEntries([])
        }
      }
    } catch (error) {
      console.error('Error fetching activities and comments:', error)
      if (!append) {
        setAllLoadedEntries([])
      }
    } finally {
      setIsLoadingMore(false)
    }
  }, [memberId, isLoadingMore])
  
  // Load more activities when scrolling
  const loadMoreActivities = useCallback(() => {
    console.log('loadMoreActivities called:', { 
      hasMore, 
      isLoadingMore, 
      currentPage,
      totalCount
    })
    if (hasMore && !isLoadingMore) {
      console.log('✅ Fetching next page:', currentPage + 1)
      fetchActivitiesAndComments(currentPage + 1, true)
    } else {
      console.log('❌ Cannot load more:', { 
        hasMore, 
        isLoadingMore, 
        reason: !hasMore ? 'hasMore is false' : 'isLoadingMore is true' 
      })
    }
  }, [hasMore, isLoadingMore, currentPage, totalCount, fetchActivitiesAndComments])
  
  // Initial load
  useEffect(() => {
    console.log('🚀 Initial load useEffect triggered for memberId:', memberId)
    
    // Only load on initial mount, not when fetchActivitiesAndComments changes
    const loadInitialData = async () => {
      if (isLoadingMore) return
      
      try {
        setIsLoadingMore(true)
        
        const response = await fetch(`/api/members/${memberId}/activity?page=1&limit=20`)
        
        if (response.ok) {
          const data = await response.json()
          const newEntries = data.entries || []
          
          // Transform entries to match our interface
          const transformedEntries: ActivityLogItem[] = newEntries.map((entry: any) => {
            if (entry.type === 'comment') {
              return {
                id: entry.id,
                type: 'comment' as const,
                comment: entry.comment,
                createdAt: entry.createdAt,
                userName: entry.userName || 'Unknown User',
                userId: entry.userId
              }
            } else {
              return {
                id: entry.id,
                type: 'activity' as const,
                action: entry.action,
                fieldName: entry.fieldName,
                oldValue: entry.oldValue,
                newValue: entry.newValue,
                createdAt: entry.createdAt,
                userName: entry.userName || 'Unknown User',
                userId: entry.userId
              }
            }
          })
          
          setAllLoadedEntries(transformedEntries)
          setTotalCount(data.pagination?.totalCount || 0)
          setCurrentPage(1)
          setHasMore(1 < (data.pagination?.totalPages || 1))
          
          console.log('✅ Initial load completed:', {
            page: 1,
            totalCount: data.pagination?.totalCount,
            entriesInResponse: newEntries.length,
            hasMore: 1 < (data.pagination?.totalPages || 1),
            message: `Loaded ${newEntries.length} items initially. ${data.pagination?.totalCount - newEntries.length} more items available. Scroll to see more.`
          })
          
          // Auto-load more pages if content height is too short for scrolling
          // REMOVED: This was causing all items to load automatically without scrolling
          // Users should scroll to see more content
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to fetch activities and comments:', response.status, errorData)
          setAllLoadedEntries([])
        }
      } catch (error) {
        console.error('Error fetching activities and comments:', error)
        setAllLoadedEntries([])
      } finally {
        setIsLoadingMore(false)
      }
    }
    
    loadInitialData()
  }, [memberId]) // Only depend on memberId, not on fetchActivitiesAndComments
  
  // Initial load and refresh handling
  useEffect(() => {
    if (onRefresh) {
      onRefresh()
    }
  }, [onRefresh])
  
  // Auto-refresh when realtime connection is established
  useEffect(() => {
    if (isConnected && onRefresh) {
      onRefresh()
    }
  }, [isConnected, onRefresh])
  
  // Debug: Log auth context state
  console.log('🔍 Auth context state:', {
    currentUser: currentUser,
    currentUserId: currentUser?.id,
    currentUserType: typeof currentUser?.id
  });

  // Debug: Monitor auth context changes
  useEffect(() => {
    console.log('🔍 Auth context changed:', {
      currentUser: currentUser,
      currentUserId: currentUser?.id,
      currentUserType: typeof currentUser?.id
    });
  }, [currentUser]);

  // Scroll to bottom when new entries are added (for chronological order)
  useEffect(() => {
    if (allLoadedEntries.length > 0) {
      const container = document.querySelector('[data-activity-list]') as HTMLElement
      if (container) {
        // Scroll to bottom to show latest entries
        container.scrollTop = container.scrollHeight
        
        // Debug container dimensions
        console.log('📏 Container dimensions:', {
          scrollHeight: container.scrollHeight,
          clientHeight: container.clientHeight,
          scrollTop: container.scrollTop,
          isScrollable: container.scrollHeight > container.clientHeight,
          entriesCount: allLoadedEntries.length,
          hasMore,
          currentPage,
          totalCount
        })
        
        // Test if we can manually trigger load more
        if (hasMore && allLoadedEntries.length < totalCount) {
          console.log('🧪 Testing manual load more...')
          setTimeout(() => {
            console.log('🧪 Executing manual load more...')
            loadMoreActivities()
          }, 1000)
        }
      }
    }
  }, [allLoadedEntries.length, hasMore, currentPage, totalCount, loadMoreActivities])

  const formatDate = (dateString: string | null | undefined) => {
    // Debug the incoming date string
    console.log('🔍 formatDate called with:', {
      dateString,
      type: typeof dateString,
      isValid: dateString ? !isNaN(new Date(dateString).getTime()) : false
    })
    
    if (!dateString) {
      console.warn('⚠️ formatDate received null/undefined dateString')
      return 'Invalid Date • Invalid Date'
    }
    
    try {
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('⚠️ formatDate received invalid date string:', dateString)
        return 'Invalid Date • Invalid Date'
      }
      
      // Convert to Manila timezone (Asia/Manila)
      const manilaDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Manila"}))
      
      const datePart = manilaDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
      const timePart = manilaDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Manila'
      })
      return `${datePart} • ${timePart}`
    } catch (error) {
      console.error('❌ Error in formatDate:', error, 'for dateString:', dateString)
      return 'Invalid Date • Invalid Date'
    }
  }

  const renderActivityText = (activity: ActivityLogEntry) => {
    const fieldDisplayName = getFieldDisplayName(activity.fieldName);
    
    // Helper function to format values
    const formatValue = (value: string | null, fieldName: string) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) return '-';
      
      // Special formatting for service field
      if (fieldName === 'service') {
        return formatServiceValue(value);
      }
      
      return value;
    };
    
    // Check if current user performed this action
    const isCurrentUser = currentUser && activity.userId && currentUser.id === activity.userId.toString();
    const userName = isCurrentUser ? 'You' : (activity.userName || 'Unknown User');
    
    // Debug logging
    console.log('🔍 Activity user check:', {
      currentUserId: currentUser?.id,
      currentUserIdType: typeof currentUser?.id,
      activityUserId: activity.userId,
      activityUserIdType: typeof activity.userId,
      comparison: currentUser?.id === activity.userId?.toString(),
      isCurrentUser,
      finalUserName: userName,
      hasCurrentUser: !!currentUser,
      hasActivityUserId: !!activity.userId
    });
    
    if (activity.action === 'created') {
      return `${userName} created ${activity.newValue || '-'}`;
    } else if (activity.action === 'set') {
      return `${userName} set ${fieldDisplayName} to ${formatValue(activity.newValue, activity.fieldName)}`;
    } else if (activity.action === 'updated') {
      return `${userName} changed ${fieldDisplayName} from ${formatValue(activity.oldValue, activity.fieldName)} to ${formatValue(activity.newValue, activity.fieldName)}`;
    } else if (activity.action === 'removed') {
      return `${userName} removed ${fieldDisplayName} from ${formatValue(activity.oldValue, activity.fieldName)}`;
    } else if (activity.action === 'selected') {
      return `${userName} added ${formatValue(activity.newValue, activity.fieldName)} to ${fieldDisplayName}`;
    } else if (activity.action === 'deselected') {
      return `${userName} removed ${formatValue(activity.oldValue, activity.fieldName)} from ${fieldDisplayName}`;
    }
    
    return 'Unknown action';
  };

  const getFieldDisplayName = (fieldName: string) => {
    const fieldNames: Record<string, string> = {
      'company': 'Name',
      'Company Name': 'Name',
      'address': 'Address',
      'Address': 'Address',
      'phone': 'Phone',
      'Phone': 'Phone',
      'country': 'Country',
      'Country': 'Country',
      'service': 'Service',
      'Service': 'Service',
      'website': 'Website',
      'Website': 'Website',
      'logo': 'Logo',
      'Logo': 'Logo',
      'badge_color': 'Badge Color',
      'Badge Color': 'Badge Color',
      'status': 'Status',
      'Status': 'Status',
      'Agent Assignments': 'Agent Assignments',
      'Client Assignments': 'Client Assignments'
    }
    return fieldNames[fieldName] || fieldName
  }

  // Helper function to format service values in title case
  const formatServiceValue = (value: string | null) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) return '-'
    
    // Convert service values to title case
    const serviceMap: Record<string, string> = {
      'one agent': 'One Agent',
      'team': 'Team',
      'workforce': 'Workforce'
    }
    
    return serviceMap[value.toLowerCase()] || value
  }

  // Show loading state while auth is loading or entries are loading
  if (authLoading || (realtimeLoading && allLoadedEntries.length === 0)) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-4 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    )
  }

  if (realtimeError) {
    return (
      <div className="text-red-600 dark:text-red-400 text-sm">
        {realtimeError}
      </div>
    )
  }

  if (allLoadedEntries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No Activities Found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Activity Log Container */}
      <div 
        data-activity-list
        className="space-y-3 flex-1 overflow-y-auto min-h-0"
        onScroll={(e) => {
          console.log('📜 Scroll event fired!') // Simple test to see if scroll events work
          
          const target = e.target as HTMLDivElement
          const { scrollTop, scrollHeight, clientHeight } = target
          
          // Debug scroll values
          console.log('📜 Activity Scroll Debug:', {
            scrollTop,
            scrollHeight,
            clientHeight,
            threshold: scrollHeight * 0.8,
            shouldLoad: scrollTop + clientHeight >= scrollHeight * 0.8,
            hasMore,
            isLoadingMore,
            currentPage,
            totalCount,
            entriesCount: allLoadedEntries.length
          })
          
          // Load more when scrolling to bottom (80% threshold)
          if (scrollTop + clientHeight >= scrollHeight * 0.8 && hasMore && !isLoadingMore) {
            console.log('📜 Scroll detected - loading more items...')
            loadMoreActivities()
          }
        }}
      >
        {/* Entries List */}
        {allLoadedEntries.map((entry) => {
          // Debug each entry being rendered
          console.log('🔍 Rendering entry:', {
            id: entry.id,
            type: entry.type,
            createdAt: entry.createdAt,
            createdAtType: typeof entry.createdAt,
            hasCreatedAt: !!entry.createdAt
          })
          
          if (entry.type === 'activity') {
            const activity = entry as ActivityLogEntry
            return (
              <div key={entry.id} className="flex items-center gap-3">
                {/* Bullet point */}
                <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></div>
                
                {/* Activity text and timestamp */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {renderActivityText(activity)}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )
          } else {
            const comment = entry as CommentEntry
            return (
              <div className="overflow-hidden">
                <Comment
                  key={entry.id}
                  comment={{
                    id: comment.id,
                    comment: comment.comment,
                    created_at: comment.createdAt,
                    user_name: (currentUser && comment.userId && currentUser.id === comment.userId.toString()) ? 'You' : (comment.userName || 'Unknown User'),
                    avatar_name: comment.userName || 'Unknown User'
                  }}
                  showDeleteButton={true}
                  onDelete={(commentId) => {
                    // Handle comment deletion here
                    console.log('Delete comment:', commentId)
                    // You can add the actual deletion logic here
                  }}
                  className="border border-border p-2"
                />
              </div>
            )
          }
        })}
        
        {/* Loading indicator for pagination */}
        {isLoadingMore && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse" style={{ animationDelay: '0s' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/80 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

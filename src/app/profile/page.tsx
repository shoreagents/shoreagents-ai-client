"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Calendar, Building, Globe, Edit, Save, X } from "lucide-react"
import { motion } from "framer-motion"

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface ProfileData {
  id: string
  email: string
  userType: string
  firstName: string
  lastName: string
  profilePicture?: string
  memberId?: number
  departmentId?: number
  companyUuid?: string
  // Additional fields from personal_info
  middleName?: string
  nickname?: string
  phone?: string
  birthday?: string
  city?: string
  address?: string
  gender?: string
  // Company info
  company?: string
  website?: string[]
  country?: string
  service?: string
  status?: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editData, setEditData] = useState<Partial<ProfileData>>({})
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch(`/api/profile?userId=${user.id}`)
        
        if (response.ok) {
          const data = await response.json()
          setProfileData(data.profile)
          setEditData(data.profile)
        } else {
          console.error('Failed to fetch profile data')
          toast.error('Failed to load profile data')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Error loading profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  const handleEdit = () => {
    setEditing(true)
    setEditData(profileData || {})
  }

  const handleCancel = () => {
    setEditing(false)
    setEditData(profileData || {})
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...editData
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData(data.profile)
        setEditing(false)
        toast.success('Profile updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  if (loading) {
    return (
      <>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <div className="flex flex-col items-center space-y-4">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="text-center space-y-2">
                              <Skeleton className="h-6 w-32" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                    
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </>
    )
  }

  return (
    <>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <p className="text-sm text-muted-foreground">Manage your personal information and preferences.</p>
                  </div>
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSave}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                              <AvatarImage 
                                src={profileData?.profilePicture} 
                                alt={`${profileData?.firstName} ${profileData?.lastName}`} 
                              />
                              <AvatarFallback className="text-2xl">
                                {getInitials(profileData?.firstName, profileData?.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center space-y-2">
                              <h3 className="text-xl font-semibold">
                                {profileData?.firstName} {profileData?.lastName}
                              </h3>
                              <Badge variant="secondary" className="capitalize">
                                {profileData?.userType}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{profileData?.email}</span>
                            </div>
                            {profileData?.phone && (
                              <div className="flex items-center space-x-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{profileData.phone}</span>
                              </div>
                            )}
                            {profileData?.city && (
                              <div className="flex items-center space-x-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{profileData.city}</span>
                              </div>
                            )}
                            {profileData?.company && (
                              <div className="flex items-center space-x-3 text-sm">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{profileData.company}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Personal Information
                          </CardTitle>
                          <CardDescription>
                            Your personal details and contact information
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              {editing ? (
                                <Input
                                  id="firstName"
                                  value={editData.firstName || ''}
                                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                                />
                              ) : (
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  {profileData?.firstName || 'Not provided'}
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              {editing ? (
                                <Input
                                  id="lastName"
                                  value={editData.lastName || ''}
                                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                                />
                              ) : (
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  {profileData?.lastName || 'Not provided'}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="middleName">Middle Name</Label>
                              {editing ? (
                                <Input
                                  id="middleName"
                                  value={editData.middleName || ''}
                                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                                />
                              ) : (
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  {profileData?.middleName || 'Not provided'}
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="nickname">Nickname</Label>
                              {editing ? (
                                <Input
                                  id="nickname"
                                  value={editData.nickname || ''}
                                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                                />
                              ) : (
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  {profileData?.nickname || 'Not provided'}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="p-2 text-sm bg-muted rounded-md flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              {profileData?.email}
                            </div>
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              {editing ? (
                                <Input
                                  id="phone"
                                  value={editData.phone || ''}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                              ) : (
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  {profileData?.phone || 'Not provided'}
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="birthday">Birthday</Label>
                              {editing ? (
                                <Input
                                  id="birthday"
                                  type="date"
                                  value={editData.birthday || ''}
                                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                                />
                              ) : (
                                <div className="p-2 text-sm bg-muted rounded-md flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {formatDate(profileData?.birthday)}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            {editing ? (
                              <Select
                                value={editData.gender || ''}
                                onValueChange={(value) => handleInputChange('gender', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="p-2 text-sm bg-muted rounded-md">
                                {profileData?.gender || 'Not provided'}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            {editing ? (
                              <Input
                                id="city"
                                value={editData.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                              />
                            ) : (
                              <div className="p-2 text-sm bg-muted rounded-md flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                {profileData?.city || 'Not provided'}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            {editing ? (
                              <Textarea
                                id="address"
                                value={editData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                rows={3}
                              />
                            ) : (
                              <div className="p-2 text-sm bg-muted rounded-md">
                                {profileData?.address || 'Not provided'}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Company Information */}
                    {(profileData?.company || profileData?.website || profileData?.country) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Building className="h-5 w-5 mr-2" />
                              Company Information
                            </CardTitle>
                            <CardDescription>
                              Your company details and business information
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {profileData?.company && (
                              <div className="space-y-2">
                                <Label>Company Name</Label>
                                <div className="p-2 text-sm bg-muted rounded-md flex items-center">
                                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {profileData.company}
                                </div>
                              </div>
                            )}

                            {profileData?.website && profileData.website.length > 0 && (
                              <div className="space-y-2">
                                <Label>Website</Label>
                                <div className="p-2 text-sm bg-muted rounded-md flex items-center">
                                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {profileData.website.join(', ')}
                                </div>
                              </div>
                            )}

                            {profileData?.country && (
                              <div className="space-y-2">
                                <Label>Country</Label>
                                <div className="p-2 text-sm bg-muted rounded-md flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {profileData.country}
                                </div>
                              </div>
                            )}

                            {profileData?.service && (
                              <div className="space-y-2">
                                <Label>Service Type</Label>
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  {profileData.service}
                                </div>
                              </div>
                            )}

                            {profileData?.status && (
                              <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="p-2 text-sm bg-muted rounded-md">
                                  <Badge variant={profileData.status === 'Current Client' ? 'default' : 'secondary'}>
                                    {profileData.status}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}

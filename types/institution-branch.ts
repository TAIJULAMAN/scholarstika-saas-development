export interface InstitutionBranch {
  id: string
  name: string
  type: string
  students: number
  teachers: number
  attendance: number
  earnings: number
  location: string
  contact: string
  annualPriceUsd?: number
  isOverridden?: boolean
  overrideReason?: string | null
  pricingRuleVersion?: string | null
}

export interface InstitutionBranchStats {
  totalStudents: number
  totalTeachers: number
  averageAttendance: number
  totalEarnings: number
  studentChange: string
  teacherChange: string
  attendanceChange: string
  earningsChange: string
}

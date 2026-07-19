export interface BranchAdmin {
  id: string
  fullName: string
  phoneNumber: string
  emailAddress: string
  role: string
  status: string
  joinDate: string
  assignBranch: string
  subscriptionId?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface BranchAdminFormData {
  fullName: string
  phoneNumber: string
  emailAddress: string
  password: string
  confirmPassword?: string
  joinDate: string
  assignBranch: string
  subscriptionId: string
}

export interface BranchOption {
  id: string
  name?: string
  branchName?: string
  schoolName?: string
  subscriptionId?: string | null
  hasAssignedAdmin?: boolean
  assignedAdminId?: string | null
}

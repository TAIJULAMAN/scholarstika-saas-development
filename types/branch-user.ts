export type BranchStudent = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  branchName: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  photo?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BranchTeacher = {
  id: string;
  teacherId: string;
  teacherName: string;
  email: string;
  phoneNumber: string;
  branchName: string;
  subject: string[];
  assignClass: string[];
  address: string;
  photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BranchStaffRole = "parent" | "bursar" | "nurse";

export type BranchStaff = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  generateId: string;
  role: BranchStaffRole;
  studentId?: string | null;
  status?: string;
  photo?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
  uiRole?: string;
  backendRole?: string;
  schoolName?: string;
  country?: string;
  city?: string;
  state?: string;
  branches?: number;
  subscriptionId?: string;
  avatar?: string;
};

export const getFrontendRole = (user: AuthUser) => {
  if (user.uiRole) {
    return user.uiRole;
  }

  switch (user.role || user.backendRole) {
    case "INSTITUTIONAL_OWNER":
      return "institution_manager";
    case "ADMIN":
      return "branch_manager";
    case "BRANCH_ADMIN":
      return "branch_admin";
    default:
      return String(user.role || user.backendRole || "").toLowerCase();
  }
};

export const normalizeFrontendUser = (user: AuthUser) => ({
  ...user,
  backendRole: user.backendRole || user.role,
  role: getFrontendRole(user),
});

export const getDashboardRouteForRole = (role?: string) => {
  switch (role) {
    case "institution_manager":
      return "/institution/dashboard";
    case "branch_manager":
    case "branch_admin":
      return "/branch/dashboard";
    case "student":
      return "/student/dashboard";
    case "teacher":
      return "/teacher/dashboard";
    case "parent":
      return "/parent/dashboard";
    case "bursar":
      return "/bursar/dashboard";
    case "nurse":
      return "/nurse";
    case "super_admin":
      return "/";
    default:
      return "/";
  }
};

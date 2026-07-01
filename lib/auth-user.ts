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

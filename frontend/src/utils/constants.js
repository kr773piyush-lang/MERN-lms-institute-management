export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  INSTITUTE_ADMIN: "INSTITUTE_ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
};

export const ROLE_HOME_ROUTE = {
  [ROLES.SUPER_ADMIN]: "/super-admin",
  [ROLES.INSTITUTE_ADMIN]: "/institute-admin",
  [ROLES.TEACHER]: "/teacher",
  [ROLES.STUDENT]: "/student",
};

export const getPrimaryRole = (user) => {
  if (!user) return null;
  if (user.role) return user.role;
  if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles[0];
  return null;
};

export function hasPermission<T extends string>(
  role: string,
  permission: T,
  permissionsMap: Record<string, T[]>,
): boolean {
  return permissionsMap[role]?.includes(permission) ?? false;
}

// ✅ Хелпер для нескольких permissions (OR)
export function hasAnyPermission<T extends string>(
  role: string,
  permissions: T[],
  permissionsMap: Record<string, T[]>,
): boolean {
  return permissions.some((p) => hasPermission(role, p, permissionsMap));
}

// ✅ Хелпер для нескольких permissions (AND)
export function hasAllPermissions<T extends string>(
  role: string,
  permissions: T[],
  permissionsMap: Record<string, T[]>,
): boolean {
  return permissions.every((p) => hasPermission(role, p, permissionsMap));
}

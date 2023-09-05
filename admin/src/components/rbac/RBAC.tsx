import { useAuthContext } from "context";
import { UserRoleEnum } from "enums";
import { useMemo } from "react";

interface RBACProps {
  allowedRoles: UserRoleEnum[];
  children: JSX.Element;
}

export const RBAC = (props: RBACProps) => {
  const { allowedRoles, children } = props;
  const { getUser } = useAuthContext();
  const user = useMemo(() => {
    return getUser();
  }, [getUser]);

  if (!user) {
    return null;
  }

  return allowedRoles.includes(user?.role) ? children : null;
};

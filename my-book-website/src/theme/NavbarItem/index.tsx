import AuthStatusNavbarItem from '../../components/AuthStatusNavbarItem'; // Adjust path if necessary

import React, {type ReactNode} from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import type NavbarItemType from '@theme/NavbarItem';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof NavbarItemType>;

export default function NavbarItemWrapper(props: Props): ReactNode {
  // Check if the current NavbarItem type is our custom one
  if (props.type === 'custom-auth-status') {
    return <AuthStatusNavbarItem {...props} />;
  }
  // Otherwise, render the original NavbarItem
  return (
    <>
      <NavbarItem {...props} />
    </>
  );
}

import { ModalBody } from './Body/ModalBody';
import { ModalContent } from './Content/ModalContent';
import { ModalFooter } from './Footer/ModalFooter';
import { ModalHeader } from './Header/ModalHeader';
import { Modal as BaseModal } from './Modal';

export { ModalBody } from './Body/ModalBody';
export type { ModalBodyProps } from './Body/types';
export { ModalContent } from './Content/ModalContent';
export type { ModalContentProps } from './Content/types';
export { ModalFooter } from './Footer/ModalFooter';
export type { ModalFooterProps } from './Footer/types';
export { ModalHeader } from './Header/ModalHeader';
export type { ModalHeaderProps } from './Header/types';
export type { ModalProps } from './types';

export const Modal = Object.assign(BaseModal, {
  Header: ModalHeader,
  Body: ModalBody,
  Content: ModalContent,
  Footer: ModalFooter,
});

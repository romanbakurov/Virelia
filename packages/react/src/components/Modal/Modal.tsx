import { ModalBody } from './Body';
import { ModalClose } from './Close';
import { ModalContent } from './Content';
import { ModalFooter } from './Footer';
import { ModalDescription, ModalHeader, ModalTitle } from './Header';
import { ModalOverlay } from './Overlay';
import { ModalRoot } from './Root';
import { ModalTrigger } from './Trigger';

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});

Modal.displayName = 'Modal';

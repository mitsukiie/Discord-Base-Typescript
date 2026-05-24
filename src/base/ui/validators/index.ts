import {
  validateAttachmentUrl,
  validateColor,
  validateComponents,
  validateGallery,
  validateRow,
  validateSection,
  validateText,
  validateUrl,
} from './container';
import { validateButton } from './button';
import { validateSelect } from './select';

/** Aggregated validation helpers used by the public UI builders. */
export const validate = {
  components: validateComponents,
  text: validateText,
  url: validateUrl,
  attachmentUrl: validateAttachmentUrl,
  button: validateButton,
  row: validateRow,
  select: validateSelect,
  section: validateSection,
  color: validateColor,
  gallery: validateGallery,
};

export {
  validateAttachmentUrl,
  validateButton,
  validateColor,
  validateComponents,
  validateGallery,
  validateRow,
  validateSection,
  validateSelect,
  validateText,
  validateUrl,
};

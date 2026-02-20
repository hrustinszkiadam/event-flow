import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';

export const { useAppForm: useEventForm, withForm } = createFormHook({
	fieldComponents: {},
	formComponents: {},
	fieldContext,
	formContext,
});

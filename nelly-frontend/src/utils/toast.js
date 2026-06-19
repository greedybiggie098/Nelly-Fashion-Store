// Custom lightweight toast utility
// Import: import toast from '../utils/toast';
// Usage: toast.success('Message'), toast.error('Message'), etc.

let toastFunction = null;

export const setToastFunction = (fn) => {
  toastFunction = fn;
};

const toast = {
  success: (message) => {
    if (toastFunction) {
      toastFunction.success(message);
    } else {
      console.log('✅', message);
    }
  },

  error: (message) => {
    if (toastFunction) {
      toastFunction.error(message);
    } else {
      console.error('❌', message);
    }
  },

  info: (message) => {
    if (toastFunction) {
      toastFunction.info(message);
    } else {
      console.info('ℹ️', message);
    }
  },

  warning: (message) => {
    if (toastFunction) {
      toastFunction.warning(message);
    } else {
      console.warn('⚠️', message);
    }
  },
};

export default toast;

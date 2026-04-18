/**
 * Form validation utilities
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!re.test(email)) return "Invalid email address";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validateDisplayName = (name) => {
  if (!name) return "Display name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateSessionForm = (data) => {
  const errors = {};

  if (!data.activity || data.activity.trim().length === 0) {
    errors.activity = "Activity name is required";
  } else if (data.activity.trim().length > 100) {
    errors.activity = "Activity name is too long";
  }

  if (!data.category) {
    errors.category = "Please select a category";
  }

  const duration = Number(data.duration);
  if (!data.duration || isNaN(duration)) {
    errors.duration = "Duration is required";
  } else if (duration < 1) {
    errors.duration = "Duration must be at least 1 minute";
  } else if (duration > 720) {
    errors.duration = "Duration cannot exceed 720 minutes (12 hours)";
  }

  const focus = Number(data.focusLevel);
  if (!data.focusLevel || isNaN(focus)) {
    errors.focusLevel = "Focus level is required";
  } else if (focus < 1 || focus > 5) {
    errors.focusLevel = "Focus level must be between 1 and 5";
  }

  const outcome = Number(data.outcomeScore);
  if (!data.outcomeScore || isNaN(outcome)) {
    errors.outcomeScore = "Outcome score is required";
  } else if (outcome < 1 || outcome > 5) {
    errors.outcomeScore = "Outcome score must be between 1 and 5";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

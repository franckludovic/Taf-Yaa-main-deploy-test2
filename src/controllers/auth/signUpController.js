import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandler';

export async function handleSignUp(formData, navigate, onError, setLoading) {
  try {
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!formData.termsAccepted) {
      throw new Error('You must accept the terms of use and privacy policy.');
    }

    // Call auth service
  await authService.register(formData.email, formData.password, formData.displayName, {
      language: formData.language,
    });

    // Navigate to email verification
    navigate('/verify-email');

  } catch (err) {
    const userFriendlyMessage = getErrorMessage(err);
    onError(userFriendlyMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}

export async function handleGoogleSignUp(navigate, onError, setLoading) {
  try {
    setLoading(true);

    // Call auth service for Google sign up
  await authService.loginWithGoogle();

    // Navigate on success
    navigate('/my-trees');

  } catch (err) {
    const userFriendlyMessage = getErrorMessage(err);
    onError(userFriendlyMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { API_URL } from '../config';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const { setProfile } = useProfile();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRandomTestProfile = () => {
    const testEmails = [
      'alex.thompson@example.com',
      'sarah.chen@example.com',
      'marcus.johnson@example.com'
    ];
    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)];
    setFormData({
      email: randomEmail,
      password: 'test123',
      confirmPassword: ''
    });
    setIsNewAccount(false);
    setEmailVerified(true);
    toast({
      title: 'Test Profile Loaded',
      description: `Loaded profile for ${randomEmail.split('@')[0].replace('.', ' ')}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.status === 404) {
        // Email doesn't exist, prompt to create account
        setIsNewAccount(true);
        setEmailVerified(true);
        toast({
          title: 'Account Not Found',
          description: 'Would you like to create a new account?',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else if (response.ok) {
        // Email exists, proceed with sign in
        setEmailVerified(true);
      } else {
        throw new Error('Failed to verify email');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify email. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Failed to sign in');
      }

      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
      }

      setProfile(data);
      localStorage.setItem('profile', JSON.stringify(data));
      
      if (isNewAccount) {
        navigate('/profile');
      } else {
        navigate('/waiting');
      }

      toast({
        title: 'Success!',
        description: isNewAccount ? 'Account created successfully!' : 'Signed in successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setEmailVerified(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={6}>
        <Heading>{isNewAccount ? 'Create Account' : 'Sign In'}</Heading>
        
        {!emailVerified ? (
          <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </FormControl>
              <Button 
                type="submit" 
                colorScheme="blue" 
                width="100%"
                isLoading={isLoading}
                loadingText="Verifying..."
              >
                Continue
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={loadRandomTestProfile}
                width="100%"
                isDisabled={isLoading}
              >
                Load Test Profile
              </Button>
            </VStack>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <HStack width="100%" justify="space-between" align="center">
                <Text>Email: {formData.email}</Text>
                <IconButton
                  aria-label="Edit email"
                  icon="✏️"
                  variant="ghost"
                  onClick={handleBackToEmail}
                  size="sm"
                />
              </HStack>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </FormControl>
              {isNewAccount && (
                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                </FormControl>
              )}
              <Button 
                type="submit" 
                colorScheme="blue" 
                width="100%"
                isLoading={isLoading}
                loadingText={isNewAccount ? 'Creating Account...' : 'Signing in...'}
              >
                {isNewAccount ? 'Create Account' : 'Sign In'}
              </Button>
            </VStack>
          </form>
        )}
      </VStack>
    </Box>
  );
};

export default SignIn; 
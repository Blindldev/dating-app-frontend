import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
  VStack,
  useToast,
  useColorMode,
  Box,
  FormErrorMessage,
} from '@chakra-ui/react';
import { API_URL } from '../config';

const ProfileForm = ({ isOpen, onClose, initialData = null, onProfileUpdate }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    location: '',
    lookingFor: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age || '',
        gender: initialData.gender || '',
        bio: initialData.bio || '',
        location: initialData.location || '',
        lookingFor: initialData.lookingFor || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || isNaN(formData.age) || formData.age < 18) newErrors.age = 'Valid age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.lookingFor) newErrors.lookingFor = 'Looking for is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = initialData 
        ? `${API_URL}/api/profiles/${initialData.id}`
        : `${API_URL}/api/profiles`;
      
      const method = initialData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();
      onProfileUpdate(data);
      onClose();
      
      toast({
        title: 'Success!',
        description: `Profile ${initialData ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <ModalHeader color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>
          {initialData ? 'Edit Profile' : 'Create Profile'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.age}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Age</FormLabel>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.age}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.gender}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Gender</FormLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Select gender"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                <FormErrorMessage>{errors.gender}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.bio}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Bio</FormLabel>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.bio}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.location}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Location</FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Your location"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                />
                <FormErrorMessage>{errors.location}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lookingFor}>
                <FormLabel color={colorMode === 'light' ? 'gray.700' : 'gray.200'}>Looking For</FormLabel>
                <Select
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  placeholder="What are you looking for?"
                  bg={colorMode === 'light' ? 'white' : 'gray.700'}
                >
                  <option value="friendship">Friendship</option>
                  <option value="dating">Dating</option>
                  <option value="relationship">Relationship</option>
                </Select>
                <FormErrorMessage>{errors.lookingFor}</FormErrorMessage>
              </FormControl>

              <Box w="full" pt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText={initialData ? 'Updating...' : 'Creating...'}
                  width="full"
                >
                  {initialData ? 'Update Profile' : 'Create Profile'}
                </Button>
              </Box>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileForm; 
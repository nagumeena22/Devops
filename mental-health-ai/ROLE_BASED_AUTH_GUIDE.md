# Role-Based Authentication System - Implementation Guide

## Overview
The MindGuard AI platform now includes a comprehensive role-based authentication system with three distinct user roles: **User**, **Therapist**, and **Admin**.

## Three User Roles

### 1. **User (👤)**
- Regular mental health support seekers
- Can log in and access personalized support features
- Profile includes:
  - Age
  - Gender
  - Mental health concerns
  - Personalized welcome message

### 2. **Therapist (👨‍⚕️)**
- Licensed mental health professionals
- Can provide support and guidance
- Requires professional verification
- Profile includes:
  - License number
  - Specialization (CBT, Psychodynamic, Humanistic, Family, Couples, Trauma, Addiction, Other)
  - Years of experience
  - Verification document details
  - Professional welcome message

### 3. **Admin (👨‍💼)**
- System administrators with full platform control
- Requires admin verification code
- Profile includes:
  - Department
  - Admin access information
  - System administrator welcome message

## Features Implemented

### 1. **Enhanced Login Page**
- Role selection before login (User, Therapist, Admin)
- Visual role indicators with icons
- Email and password authentication
- Role-specific login validation

### 2. **Advanced Sign-Up Pages**
- Initial role selection (visual cards with icons)
- Common fields for all roles (Name, Email, Password, Confirm Password)
- **Role-specific fields:**

#### For Users:
- Age (13-120)
- Gender (Male, Female, Non-binary, Prefer not to say)
- Mental health concerns (optional text area)

#### For Therapists:
- License number (required)
- Specialization (required dropdown)
- Years of experience (optional)
- Verification document (optional)

#### For Admins:
- Admin verification code (required)
- Department (optional)

### 3. **Personalized Profile Page**
- **Welcome Section** with role-specific messages:
  - "Welcome, [Name]!" for Users
  - "Welcome, Dr. [Name]!" for Therapists
  - "Welcome, Admin [Name]!" for Admins
- **Role Badge** displaying user type
- **Role-specific information sections** showing relevant details
- Dynamic content based on user role
- Member since date
- Professional information for therapists
- Admin status for administrators

## Data Storage

### LocalStorage Keys:
- `mindguard_currentUser`: Complete user object with all role-specific data
- `mindguard_userRole`: Current user's role

### User Object Structure:
```javascript
{
  id: "unique_id",
  name: "John Doe",
  email: "user@example.com",
  role: "user|therapist|admin",
  
  // User-specific fields
  age: 25,
  gender: "male",
  mentalHealthConcerns: "anxiety, stress",
  
  // Therapist-specific fields
  license: "LIC-2024-001",
  specialization: "cognitive-behavioral",
  yearsOfExperience: 8,
  verificationDocument: "verified",
  
  // Admin-specific fields
  department: "IT Support",
  
  // Common fields
  createdAt: "2024-05-01T10:30:00Z"
}
```

## AuthContext Hook

A new `AuthContext` provides authentication state management across the app:

```javascript
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { 
    user,           // Current user object
    role,           // Current user's role
    isAuthenticated, // Boolean - is user logged in
    isAdmin,        // Boolean - is user admin
    isTherapist,    // Boolean - is user therapist
    isUser,         // Boolean - is user regular user
    login,          // Function - login user
    logout,         // Function - logout user
    updateUser      // Function - update user data
  } = useAuth()
  
  return <div>{user?.name}</div>
}
```

## File Changes

### Modified Files:
1. **Login.jsx** - Added role selection before login
2. **SignUp.jsx** - Complete redesign with role-specific forms
3. **Profile.jsx** - Enhanced with role-specific welcome and information
4. **Auth.css** - New styles for role selector, role-specific sections, responsive design
5. **Profile.css** - New styles for welcome section, role badges, role-specific info boxes

### New Files:
1. **AuthContext.jsx** - Authentication state management

## Usage Examples

### Login Flow:
1. User selects their role (User, Therapist, or Admin)
2. Enters email and password
3. System validates credentials and role
4. Redirects to profile page with role-specific welcome

### Sign-Up Flow:
1. User selects their role from visual cards
2. Fills common fields (Name, Email, Password)
3. Fills role-specific required fields
4. System validates all data
5. Account created with role-specific information
6. Redirects to profile page

### Profile Page Flow:
1. User logs in successfully
2. Directed to profile page
3. Sees personalized welcome message based on role
4. Displays role-specific information
5. Can view account details
6. Option to logout or return home

## Styling Features

- **Purple gradient theme** (667eea to 764ba2) throughout
- **Responsive design** for mobile and desktop
- **Visual role indicators** with icons and names
- **Role badges** to highlight user type
- **Color-coded sections** for role-specific information
- **Smooth transitions** and hover effects
- **Accessibility features** with proper contrast and labels

## Backend Integration

The system expects the following API endpoints:

### POST `/api/auth/login`
Request:
```javascript
{
  email: "user@example.com",
  password: "password",
  role: "user|therapist|admin"
}
```

Response:
```javascript
{
  user: { /* user object */ },
  token: "jwt_token"
}
```

### POST `/api/auth/register`
Request:
```javascript
{
  name: "John Doe",
  email: "user@example.com",
  password: "password",
  role: "user|therapist|admin",
  // Role-specific fields...
}
```

Response:
```javascript
{
  user: { /* user object */ },
  token: "jwt_token"
}
```

## Validation Rules

### Password:
- Minimum 6 characters
- Must match confirmation password

### Role-specific:
- **Therapists**: License and Specialization are required
- **Admins**: Admin verification code is required
- **Users**: Age and Gender are optional, but recommended

## Future Enhancements

- Email verification for new accounts
- Admin dashboard for user management
- Therapist discovery/booking system
- Role-specific dashboards
- Two-factor authentication
- Password reset functionality
- Profile picture uploads

## Testing

To test the system:

1. **Sign up as User:**
   - Role: User
   - Add age and gender
   - Add mental health concerns (optional)

2. **Sign up as Therapist:**
   - Role: Therapist
   - Add valid license number
   - Select specialization
   - Add years of experience (optional)

3. **Sign up as Admin:**
   - Role: Admin
   - Enter admin verification code
   - Add department (optional)

4. **Login:**
   - Select appropriate role
   - Use registered credentials
   - Verify profile shows role-specific welcome and information

## Troubleshooting

### User data not persisting:
- Check browser's localStorage is enabled
- Verify data is being saved in the login/sign-up response

### Role not displaying correctly:
- Clear localStorage and re-login
- Check that role is stored in the user object

### Styles not appearing:
- Clear browser cache
- Ensure Auth.css and Profile.css are imported correctly

---

**Last Updated:** May 1, 2026
**Version:** 1.0

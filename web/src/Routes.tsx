// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Private, Set } from '@redwoodjs/router'

import AppLayout from 'src/layouts/AppLayout/AppLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={AppLayout}>
        <Private unauthenticated="home">
          <Route path="/inform-new-problem" page={InformNewProblemPage} name="informNewProblem" />
          <Route path="/my-reports" page={UserReportsPage} name="userReports" />
        </Private>
        <Private unauthenticated="home" roles={['ADMIN', 'ANALYST']}>
          <Route path="/profile" page={ProfilePage} name="profile" />
        </Private>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/ui-examples" page={UIExamplesPage} name="uiExamples" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

// fixtures/testData.ts
// Central test data store — no hardcoding in test files

export const generateEmail = () =>
  `testuser_${Date.now()}@mailtest.com`;

export const newUser = {
  name: 'Playwright User',
  email: generateEmail(),
  password: 'Test@1234',
  title: 'Mr',
  birthDay: '10',
  birthMonth: '5',
  birthYear: '1998',
  firstName: 'Playwright',
  lastName: 'Tester',
  company: 'AutoTest Inc',
  address1: '123 Test Street',
  address2: 'Apt 4B',
  country: 'India',
  state: 'Uttar Pradesh',
  city: 'Bareilly',
  zipcode: '243001',
  mobileNumber: '9876543210',
};

export const paymentDetails = {
  nameOnCard: 'Playwright Tester',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2027',
};

export const contactForm = {
  name: 'Test Contact',
  email: 'contact@test.com',
  subject: 'Automation Test Subject',
  message: 'This is an automated test message for contact form validation.',
};

export const searchTerms = {
  product: 'top',
  brand: 'Polo',
};

export const reviewData = {
  name: 'Reviewer Bot',
  email: 'review@test.com',
  review: 'Excellent product! This review was submitted via automation.',
};

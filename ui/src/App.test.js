import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {AppProvider} from './AppContext'

test('renders logo', () => {
  render(<AppProvider><App /></AppProvider>);
  const logo = screen.getByText("InvenMag");
  expect(logo).toBeInTheDocument();
});

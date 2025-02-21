import { render, screen } from '@testing-library/react';
import App from './App';

test('renders country comparison component', () => {
  render(<App />);

  // Check for the header
  const headerElement = screen.getByText(/GDP Growth Comparison/i);
  expect(headerElement).toBeInTheDocument();

  // Check for the first select (Country A)
  const countryASelect = screen.getAllByRole('combobox')[0];
  expect(countryASelect).toHaveValue('Mexico');

  // Check for the second select (Country B)
  const countryBSelect = screen.getAllByRole('combobox')[1];
  expect(countryBSelect).toHaveValue('Sweden');

  // Check for the compare button
  const compareButton = screen.getByRole('button', { name: /Compare/i });
  expect(compareButton).toBeInTheDocument();

  // Check for the VS text
  const vsText = screen.getByText(/VS/i);
  expect(vsText).toBeInTheDocument();
});

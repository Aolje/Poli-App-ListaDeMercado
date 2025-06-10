import { render, screen } from '@testing-library/react';
import App from './App';

// Se ha actualizado la prueba para que busque el título "Mercapp"
// en lugar del texto "learn react" que ya no existe.
test('renders main app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Mercapp/i);
  expect(titleElement).toBeInTheDocument();
});

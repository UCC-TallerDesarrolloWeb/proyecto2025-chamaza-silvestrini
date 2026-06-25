import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button', () => {
  test('renderiza el texto de sus hijos correctamente', () => {
    render(<Button>Publicar reseña</Button>);
    expect(screen.getByRole('button', { name: 'Publicar reseña' })).toBeInTheDocument();
  });

  test('aplica la clase base btn', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn');
  });

  test('variante secondary agrega la clase secondary', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  test('botón deshabilitado no puede ser accionado', () => {
    render(<Button disabled>Bloqueado</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('llama al onClick al hacer clic', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Continuar</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

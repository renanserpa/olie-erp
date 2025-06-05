import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Mock para o useNavigate do react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginPage', () => {
  test('deve renderizar o formulário de login corretamente', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Verifica se os elementos principais estão presentes
    expect(screen.getByText('Olie ERP')).toBeInTheDocument();
    expect(screen.getByText('Ateliê Artesanal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Esqueci minha senha')).toBeInTheDocument();
  });
  
  test('deve mostrar erro quando o email for inválido', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Preenche o formulário com email inválido
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'email-invalido' },
    });
    
    // Preenche a senha
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: 'senha123' },
    });
    
    // Clica no botão de entrar
    fireEvent.click(screen.getByText('Entrar'));
    
    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
  
  test('deve mostrar erro quando os campos estiverem vazios', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Clica no botão de entrar sem preencher os campos
    fireEvent.click(screen.getByText('Entrar'));
    
    // Verifica se as mensagens de erro aparecem
    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
  
  test('deve alternar a visibilidade da senha', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Verifica se o campo de senha está inicialmente com type="password"
    const senhaInput = screen.getByLabelText(/Senha/i);
    expect(senhaInput).toHaveAttribute('type', 'password');
    
    // Clica no botão de mostrar senha
    const toggleButton = senhaInput.nextElementSibling as HTMLElement;
    fireEvent.click(toggleButton);
    
    // Verifica se o campo de senha mudou para type="text"
    expect(senhaInput).toHaveAttribute('type', 'text');
    
    // Clica novamente para esconder a senha
    fireEvent.click(toggleButton);
    
    // Verifica se o campo de senha voltou para type="password"
    expect(senhaInput).toHaveAttribute('type', 'password');
  });
});

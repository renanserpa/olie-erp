import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FornecedorFormPage from '../pages/FornecedorFormPage';

// Mock do hook de navegação
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock do Supabase
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation(callback => callback({ data: null, error: null })),
  },
}));

describe('FornecedorFormPage', () => {
  test('renderiza o formulário corretamente', () => {
    render(
      <BrowserRouter>
        <FornecedorFormPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Cadastro de Fornecedor')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CNPJ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
  });

  test('valida campos obrigatórios', async () => {
    render(
      <BrowserRouter>
        <FornecedorFormPage />
      </BrowserRouter>
    );
    
    // Tenta enviar o formulário sem preencher campos obrigatórios
    fireEvent.click(screen.getByText('Salvar'));
    
    // Verifica se as mensagens de erro aparecem
    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/CNPJ é obrigatório/i)).toBeInTheDocument();
    });
  });

  test('preenche e envia o formulário com sucesso', async () => {
    render(
      <BrowserRouter>
        <FornecedorFormPage />
      </BrowserRouter>
    );
    
    // Preenche os campos do formulário
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Fornecedor Teste' } });
    fireEvent.change(screen.getByLabelText(/CNPJ/i), { target: { value: '12.345.678/0001-90' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'fornecedor@teste.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '(11) 98765-4321' } });
    
    // Envia o formulário
    fireEvent.click(screen.getByText('Salvar'));
    
    // Verifica se o formulário foi enviado com sucesso
    await waitFor(() => {
      expect(screen.getByText(/Fornecedor cadastrado com sucesso/i)).toBeInTheDocument();
    });
  });
});

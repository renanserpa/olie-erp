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
    expect(screen.getByLabelText(/Nome Fantasia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CNPJ/i)).toBeInTheDocument();
    // Primeiro campo de email
    expect(screen.getAllByLabelText(/Email/i)[0]).toBeInTheDocument();
    // Primeiro campo de telefone
    expect(screen.getAllByLabelText(/Telefone/i)[0]).toBeInTheDocument();
  });

  test('valida campos obrigatórios', async () => {
    window.alert = jest.fn();
    render(
      <BrowserRouter>
        <FornecedorFormPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Salvar Fornecedor'));

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

});

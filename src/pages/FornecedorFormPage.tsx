import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/Input';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import { FormSection, MaskedInput } from '../components/FormComponents';
import Sidebar from '../components/Sidebar';

// Schema de validação para o formulário de fornecedor
const fornecedorSchema = z.object({
  nome_fantasia: z.string().min(1, 'Nome fantasia é obrigatório'),
  razao_social: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  inscricao_estadual: z.string().optional(),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  site: z.string().optional(),
  cep: z.string().min(8, 'CEP inválido'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  contato_nome: z.string().min(1, 'Nome do contato é obrigatório'),
  contato_telefone: z.string().min(10, 'Telefone do contato inválido'),
  contato_email: z.string().email('Email do contato inválido'),
  categoria_id: z.string().min(1, 'Categoria é obrigatória'),
  prazo_entrega: z.string().min(1, 'Prazo de entrega é obrigatório'),
  condicao_pagamento_id: z.string().min(1, 'Condição de pagamento é obrigatória'),
  ativo: z.boolean()
});

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

// Dados simulados para os selects
const categorias = [
  { value: '1', label: 'Tecidos' },
  { value: '2', label: 'Aviamentos' },
  { value: '3', label: 'Embalagens' },
  { value: '4', label: 'Máquinas e Equipamentos' },
  { value: '5', label: 'Serviços' }
];

const condicoesPagamento = [
  { value: '1', label: 'À vista' },
  { value: '2', label: '30 dias' },
  { value: '3', label: '30/60 dias' },
  { value: '4', label: '30/60/90 dias' }
];

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const FornecedorFormPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [cnpjValue, setCnpjValue] = React.useState('');
  const [telefoneValue, setTelefoneValue] = React.useState('');
  const [cepValue, setCepValue] = React.useState('');
  const [contatoTelefoneValue, setContatoTelefoneValue] = React.useState('');
  const [ativoValue, setAtivoValue] = React.useState(true);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      ativo: true
    }
  });
  
  const onSubmit = (data: FornecedorFormData) => {
    console.log(data);
    // Simulação de cadastro bem-sucedido
    alert('Fornecedor cadastrado com sucesso!');
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-text mb-6">Cadastro de Fornecedor</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="Dados Gerais">
              <Input
                label="Nome Fantasia"
                {...register('nome_fantasia')}
                error={errors.nome_fantasia?.message}
                required
              />
              
              <Input
                label="Razão Social"
                {...register('razao_social')}
                error={errors.razao_social?.message}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={cnpjValue}
                  onChange={(e) => setCnpjValue(e.target.value)}
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.cnpj ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                  placeholder="00.000.000/0000-00"
                  {...register('cnpj')}
                />
                {errors.cnpj && (
                  <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
                )}
              </div>
              
              <Input
                label="Inscrição Estadual"
                {...register('inscricao_estadual')}
              />
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={telefoneValue}
                  onChange={(e) => setTelefoneValue(e.target.value)}
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.telefone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                  placeholder="(00) 00000-0000"
                  {...register('telefone')}
                />
                {errors.telefone && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
                )}
              </div>
              
              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                required
              />
              
              <Input
                label="Site"
                {...register('site')}
              />
              
              <Select
                label="Categoria"
                options={categorias}
                {...register('categoria_id')}
                error={errors.categoria_id?.message}
                searchable
                required
              />
              
              <Input
                label="Prazo de Entrega (dias)"
                type="number"
                {...register('prazo_entrega')}
                error={errors.prazo_entrega?.message}
                required
              />
              
              <Select
                label="Condição de Pagamento"
                options={condicoesPagamento}
                {...register('condicao_pagamento_id')}
                error={errors.condicao_pagamento_id?.message}
                required
              />
              
              <div>
                <Toggle
                  label="Fornecedor Ativo"
                  checked={ativoValue}
                  onChange={(checked) => setAtivoValue(checked)}
                />
              </div>
            </FormSection>
            
            <FormSection title="Endereço">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  CEP <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="99999-999"
                  value={cepValue}
                  onChange={(e) => setCepValue(e.target.value)}
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.cep ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                  placeholder="00000-000"
                  {...register('cep')}
                />
                {errors.cep && (
                  <p className="mt-1 text-sm text-red-600">{errors.cep.message}</p>
                )}
              </div>
              
              <Input
                label="Endereço"
                {...register('endereco')}
                error={errors.endereco?.message}
                required
              />
              
              <Input
                label="Número"
                {...register('numero')}
                error={errors.numero?.message}
                required
              />
              
              <Input
                label="Complemento"
                {...register('complemento')}
              />
              
              <Input
                label="Bairro"
                {...register('bairro')}
                error={errors.bairro?.message}
                required
              />
              
              <Input
                label="Cidade"
                {...register('cidade')}
                error={errors.cidade?.message}
                required
              />
              
              <Select
                label="Estado"
                options={estados}
                {...register('estado')}
                error={errors.estado?.message}
                required
              />
            </FormSection>
            
            <FormSection title="Contato Principal">
              <Input
                label="Nome"
                {...register('contato_nome')}
                error={errors.contato_nome?.message}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={contatoTelefoneValue}
                  onChange={(e) => setContatoTelefoneValue(e.target.value)}
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.contato_telefone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
                  placeholder="(00) 00000-0000"
                  {...register('contato_telefone')}
                />
                {errors.contato_telefone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contato_telefone.message}</p>
                )}
              </div>
              
              <Input
                label="Email"
                type="email"
                {...register('contato_email')}
                error={errors.contato_email?.message}
                required
              />
            </FormSection>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Fornecedor
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FornecedorFormPage;

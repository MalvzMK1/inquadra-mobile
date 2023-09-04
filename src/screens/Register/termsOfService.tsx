import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Provider as PaperProvider } from 'react-native-paper';
export default function TermsOfService() {
    const navigation = useNavigation()
    return (
        <View className='h-full w-full bg-white'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>
                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.goBack()}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View className='flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white text-center'>Termos e condições</Text>
                </View>
                <View className='h-12 w-4  flex justify-center items-center'>
                    <View className='h-12 W-12 '>
                    </View>
                </View>
            </View>
            <ScrollView className='h-max w-max pl-5 pt-5 pr-5'>
                <Text className='text-xl font-black text-center'>
                    TERMOS E CONDIÇÕES GERAIS DE USO E POLÍTICA DE PRIVACIDADE INQUADRA
                </Text>
                <Text className='text-sm font-semibold text-left pt-2'>
                    INQUADRA TECNOLOGIA LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob nº 49.824.221/0001-73, prestadora de serviços de locação de quadras esportivas, realizados entre promitentes contratantes (“Contratante”) e promitentes Prestadores de Serviço (“Prestadores”), por meio do aplicativo Inquadra (“Plataforma”).
                </Text>

                <Text className='text-sm font-semibold text-left pt-3'>
                    1. Estes Termos referem-se às Condições Gerais de Uso e Políticas de Privacidade do aplicativo “InQuadra” e descrevem as regras e regulamentos que orientam o uso do aplicativo. Todas as informações coletadas dos Usuários (ora Contratantes e Prestadores) serão administradas de acordo com estes Termos.  Ao navegar neste aplicativo e usar os serviços você declara que LEU, COMPREENDEU e CONCORDA com nossos Termos e Condições de Uso e Política de Privacidade.
                </Text>

                <Text className='text-xl font-black text-center pt-4'>
                    TERMOS E CONDIÇÕES GERAIS DE USO DA PLATAFORMA
                </Text>

                <Text className='text-xl font-black text-left pt-2'>
                    1.OBJETO
                </Text>

                <Text className='text-sm font-semibold text-left pt-1'>
                    a)Os serviços objeto dos presentes Termos e Condições Gerais de Uso da plataforma consistem em permitir aos Contratantes a locação de quadras cadastrada pelos Prestadores, razão pela qual a Plataforma é mera intermediadora, limitando a responsabilidade dos serviços prestados.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    b) InQuadra não intervém no contato entre Contratantes e Prestadores de Serviço, apenas viabiliza o contato direto entre os mesmos, por meio da divulgação das informações de reserva e contato de uma parte à outra.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    c) Não há qualquer estabelecimento de valores de reservas dos Prestadores de Serviços por parte da Inquadra, de forma que a responsabilidade de prestar o serviço no horário contratado pelos Contratantes é de única e exclusiva responsabilidade do Prestador de Serviços.
                </Text>

                <Text className='text-xl font-black text-left pt-3'>
                    2.CADASTRO
                </Text>

                <Text className='text-sm font-semibold text-left pt-1'>
                    a) Para contratação e prestação de serviços, é necessário o cadastro de Prestadores de Serviços e Contratantes.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    b) Para acessar e navegar pela Plataforma, não há a necessidade de cadastro de Usuário.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    c) É vedada a criação de mais de um cadastro por Usuário, ficando permitido somente um cadastro por CPF.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    d) InQuadra poderá excluir o cadastro de Usuário se notar a incidência de má conduta, ficando, desde já, os Usuários advertidos das sanções legais cominadas pelo Código Civil.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    e) Após o cadastro do Prestador de Serviços, a Plataforma realizará uma curadoria sobre todos os dados informados e fica adstrita a aceitar ou não o pedido de cadastro.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    f) InQuadra poderá coletar os dados informados no item 1 da Política de Privacidade do presente Termos.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    g) Reserva-se o direito da Plataforma solicitar aos Usuários todos os dados e documentos que julgar pertinente, para o fim de conferir os dados informados, bem como de utilizar-se dos meios válidos e legais para identificá-los.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    h) InQuadra não se responsabiliza pela informação de dados inverídicos, incorretos ou incompletos fornecidos pelos Usuários.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    i) Havendo a exclusão de cadastros por tratar-se de má conduta do Usuário, este terá vedado o seu direito de realizar novo cadastro na Plataforma.
                </Text>
                <Text className='text-xl font-black text-left pt-3'>
                    3.RESERVA
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    a) Uma vez que a Plataforma é mera intermediadora, esta não estabelece os valores de reserva das quadras dos Prestadores de Serviços, sendo o valor de livre escolha do Prestador.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    b) InQuadra não se responsabiliza pela não prestação de serviços por quaisquer motivos, estes oriundos tanto dos Contratantes, quanto dos Prestadores de Serviços.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    c) A responsabilidade de estar aberto e prestar o serviço no horário contratado é do Prestador de Serviços, conquanto a de cumprir o horário reservado é do Contratante.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    d) O pagamento do sinal, valor este estipulado ou não pelo Prestador de Serviços, é requisito obrigatório para assegurar o horário desejado e não haverá estorno desse valor em caso de cancelamento, atraso ou não comparecimento pelo Contratante.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    e) Para contribuição de pagamento, não é necessário realizar o cadastro na Plataforma, sendo este necessário somente para o responsável pela reserva.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    f) Os pagamentos poderão ser completados até uma hora antes do horário reservado.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    g) Após o pagamento completo da reserva, a Plataforma irá gerar um código de ativação que deve ser repassado ao Prestador de Serviços no horário agendado.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    h) Para liberar os valores da reserva, faz-se necessário o Prestador de Serviços inserir o código de ativação informado ao Contratante no seu acesso.
                </Text>
                <Text className='text-xl font-black text-left pt-3'>
                    4.PAGAMENTO
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    a) O pedido de repasse dos valores dos Prestadores de Serviços deverá ser feito no momento de validação do código, de maneira que: i) os pagamentos via pix serão debitados dentro de 24 horas; ii) os pagamentos via cartão de crédito serão debitados em 30 dias.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    b) Os valores já debitados ficam vinculados à conta do Contratante, podendo este a qualquer momento retirá-los.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    c) Os Prestadores de Serviços ficam responsáveis pelo pagamento das taxas do meio de pagamento, que variam de acordo com o método de pagamento escolhido por cada Contratante.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    d) Mediante o requerimento por parte do Contratante, é de responsabilidade e obrigação do Prestador de Serviços fornecer a nota fiscal no valor total da reserva, inclusive das taxas oriundas de serviço da Plataforma.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    e) InQuadra irá gerar uma nota fiscal referente a taxa de serviço, que será repassada ao Prestador de Serviços para fins de abate.
                </Text>
                <Text className='text-xl font-black text-left pt-3'>
                    5.POLÍTICA DE CANCELAMENTO
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    a) Não havendo o pagamento integral dos valores até uma hora antes do horário da reserva ou havendo a solicitação do cancelamento por parte do Contratante, esta será cancelada e os valores já pagos, com exceção do sinal, serão estornados.
                </Text>
                <Text className='text-sm font-semibold text-left'>
                    b) O Prestador de Serviços poderá a qualquer tempo e modo cancelar uma reserva e todos os valores serão estornados, inclusive o pagamento do sinal.
                </Text>
                <Text className='text-xl font-black text-center pt-5'>
                    POLÍTICA DE PRIVACIDADE
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    1. InQuadra coleta os seguintes dados e informações pessoais de seus Usuários:
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    a)	Nome completo;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    b)	E-mail;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    c)	Número de celular;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    d)	CPF;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    e)	Cartão de Crédito (quando informado);
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    f)	Localização (quando informado).
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    3. Todas as informações e dados acima expostos são armazenados em servidores de alta segurança e serão armazenados pelo tempo que perdurar o cadastro do Usuário. Portanto, havendo a exclusão da conta do Usuário, automaticamente seus dados serão deletados.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    4. As informações acima coletadas, inseridas pelos Usuários da plataforma, será utilizada para finalidade única e exclusiva de cadastro e controle de reservas.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    5. Não há a obrigatoriedade de informação de dados bancários como Cartão de Crédito e Conta Bancária dos Contratantes, somente dos Prestadores de Serviços.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    6. O Usuário declara ser verdadeiro todas as informações prestadas, sendo de sua responsabilidade a veracidade das mesmas, sob pena da Plataforma excluir o cadastro se notar que houve má conduta. No que tange aos dados informados pelos Prestadores de Serviços, a Plataforma conduzirá uma curadoria sobre todos os dados cadastrados, podendo ou não aceitar o pedido do cadastro.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    7. Inquadra não se responsabiliza por prejuízo derivado da violação por parte de terceiros que utilizem de meios fraudulentos ou ilegais para acessar as informações armazenadas nos servidores utilizados, visto que todas as medidas cabíveis e necessárias serão utilizadas para manter a segurança e confidencialidade dos dados de seus Usuários.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    8. Poderão ter acessos aos dados informados pelos Usuários:
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    a)	Plataforma: dados do Contratante e do Prestador de Serviços;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    b)	Contratante: nome, endereço e telefone do Prestador de Serviços;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    c)	Prestador de Serviços: nome do contratante.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    9. Inquadra não se responsabiliza por danos ou prejuízos decorrentes pelo compartilhamento de informações como login e senha do Usuário, visto que toma todas as cautelas pertinentes para a segurança dos dados informados.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    10. InQuadra prestará todas as informações requisitadas por órgãos públicos, desde que devidamente justificadas e compatíveis com a lei em vigor.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    11. Havendo efetiva violação ou mera suspeita dos dados pessoais dos Usuários, InQuadra se compromete a notificar os Usuários Afetados.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    12. InQuadra poderá realizar mudanças ou alterações no presente Termos e Condições de Uso e Política de Privacidade a qualquer tempo e modo, comprometendo-se a notificar seus Usuários por meio da Plataforma. O prazo para contestar as modificações do presente é de 5 (cinco) dias a partir da publicação das modificações, não havendo manifestação no prazo estipulado, considerar-se-á que o Usuário aceitou tacitamente os novos Termos.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    13. InQuadra não endossa quaisquer sites ou aplicativos de terceiros, não sendo responsável pelos anúncios advindos das preferências dos Usuários.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    14. InQuadra reversa-se ao direito de ceder, transferir e subcontratar seus direitos e obrigações sob este Acordo sem qualquer notificação ou consentimento prévio necessário de seus Usuários. Ademais, aqueles que não consideram-se Usuários, ou seja, são meros visitantes da Plataforma, não terão o direito de fazer cumprir qualquer disposição nela contida.
                </Text>
                <Text className='text-sm font-semibold text-left pt-1'>
                    15. Nos termos do Artigo 18 da Lei Geral de Proteção de Dados - Lei nº 13.709/18, o Usuário, a seu tempo e modo, poderá requerer:
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    a)	confirmação da existência de tratamento;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    b)	acesso aos dados;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    c)	correção de dados incompletos, inexatos ou desatualizados;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    d)	anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com o disposto na referida lei;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    e)	portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa, de acordo com a regulamentação da autoridade nacional, observados os segredos comercial e industrial;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    f)	eliminação dos dados pessoais tratados com o consentimento do titular;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    g)	informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    h)	informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;
                </Text>
                <Text className='text-xs font-semibold text-left pl-3'>
                    i)	revogação do consentimento, nos termos do § 5º do art. 8º da referida lei.
                </Text>
                <Text className='text-sm font-semibold text-left pt-2'>
                    Você poderá solicitar informações, alterações, esclarecimentos ou exclusão de seus dados por meio do e-mail contato@inquadra.com.br. Nós nos comprometemos em realizar os melhores esforços para atender os pedidos concernentes à Legislação de Proteção de Danos bem como de melhorias do presente Termos e Condições de Uso e Política de Privacidade.
                </Text>
                <View className='h-3'></View>
                <TouchableOpacity
                    className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center'
                    onPress={() => navigation.goBack()}>
                    <Text className='text-gray-50'>Concluir</Text>
                </TouchableOpacity>
                <View className='h-10'></View>
            </ScrollView>
        </View>
    )
}